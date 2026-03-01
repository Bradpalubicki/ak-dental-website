import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { verifyAgencySecret } from "@/lib/agency-auth";
import { createServiceSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const PracticeInfoSchema = z.object({
  name: z.string().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  hours: z.array(z.string()).optional(),
  googleMapsUrl: z.string().nullable().optional(),
  googlePlaceId: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
});

const ContactInfoSchema = z.object({
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});

const ProviderSchema = z.object({
  npi: z.string(),
  name: z.string(),
  credential: z.string().nullable().optional(),
  taxonomy: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  address: z
    .object({
      address_1: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal_code: z.string().optional(),
    })
    .nullable()
    .optional(),
  phone: z.string().nullable().optional(),
});

const PrefillSourceSchema = z.object({
  nppes: z.boolean(),
  googlePlaces: z.boolean(),
  firecrawl: z.boolean(),
});

const PrefillPayloadSchema = z.object({
  practiceInfo: PracticeInfoSchema,
  contactInfo: ContactInfoSchema.optional(),
  providers: z.array(ProviderSchema).optional(),
  insurance: z.array(z.string()).optional(),
  staffNames: z.array(z.string()).optional(),
  prefillSource: PrefillSourceSchema.optional(),
  prefillAt: z.string().optional(),
});

type PrefillPayload = z.infer<typeof PrefillPayloadSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse "Dr. Alex Chireau DDS" → { firstName: "Alex", lastName: "Chireau", title: "DDS" } */
function parseProviderName(fullName: string): {
  firstName: string;
  lastName: string;
  title: string | null;
} {
  const titleMatch = fullName.match(/\b(DDS|DMD|RDH|DA|NP|PA|MD|DO)\b/i);
  const title = titleMatch ? titleMatch[1]!.toUpperCase() : null;
  const stripped = fullName
    .replace(/\b(Dr\.?|DDS|DMD|RDH|DA|NP|PA|MD|DO)\b/gi, "")
    .trim();
  const parts = stripped.split(/\s+/);
  const firstName = parts[0] ?? "Unknown";
  const lastName = parts.slice(1).join(" ") || "Provider";
  return { firstName, lastName, title };
}

/** Build practice_info JSON for oe_practice_settings upsert */
function buildPracticeInfoValue(
  payload: PrefillPayload,
  existing: Record<string, unknown>,
): Record<string, unknown> {
  const pi = payload.practiceInfo;
  return {
    ...(typeof existing === "object" && existing !== null ? existing : {}),
    ...(pi.name && { name: pi.name }),
    ...(pi.phone && { phone: pi.phone }),
    ...(pi.address && { address: pi.address }),
    ...(pi.website && { website: pi.website }),
    ...(pi.hours && pi.hours.length > 0 && { hours: pi.hours }),
    ...(pi.googleMapsUrl && { google_maps_url: pi.googleMapsUrl }),
    ...(pi.googlePlaceId && { google_place_id: pi.googlePlaceId }),
    ...(pi.rating && { google_rating: pi.rating }),
    prefill_at: payload.prefillAt ?? new Date().toISOString(),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Verify agency secret
  const auth = verifyAgencySecret(req);
  if (!auth.valid) return auth.response!;

  // Parse + validate body
  let payload: PrefillPayload;
  try {
    const raw = await req.json();
    payload = PrefillPayloadSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError ? JSON.stringify(err.issues) : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const summary: Record<string, unknown> = {};

  // ─── 1. Write prefilled_data to onboarding_state ─────────────────────────────

  const { data: existingState, error: stateReadErr } = await supabase
    .from("onboarding_state")
    .select("id, prefilled_data")
    .eq("engine_key", "ak-dental")
    .limit(1)
    .maybeSingle();

  if (stateReadErr) {
    // Table might not have prefilled_data column yet (migration pending)
    summary.onboardingState = {
      success: false,
      error: stateReadErr.message,
      note: "Run migration 035_prefill_data.sql in Supabase",
    };
  } else if (existingState) {
    const { error: updateErr } = await supabase
      .from("onboarding_state")
      .update({
        prefilled_data: payload,
        prefill_received_at: new Date().toISOString(),
      })
      .eq("id", existingState.id);

    summary.onboardingState = {
      success: !updateErr,
      action: "updated",
      error: updateErr?.message,
    };
  } else {
    // No existing row — create a placeholder (wizard will populate the rest)
    const { error: insertErr } = await supabase.from("onboarding_state").insert({
      clerk_user_id: "prefill_pending",
      engine_key: "ak-dental",
      wizard_completed: false,
      prefilled_data: payload,
      prefill_received_at: new Date().toISOString(),
      setup_steps: [],
    });

    summary.onboardingState = {
      success: !insertErr,
      action: "created_placeholder",
      error: insertErr?.message,
    };
  }

  // ─── 2. Upsert oe_practice_settings.practice_info ───────────────────────────

  const { data: existingSettings } = await supabase
    .from("oe_practice_settings")
    .select("value")
    .eq("key", "practice_info")
    .maybeSingle();

  const existingPracticeInfo =
    (existingSettings?.value as Record<string, unknown>) ?? {};
  const newPracticeInfo = buildPracticeInfoValue(payload, existingPracticeInfo);

  const { error: settingsErr } = await supabase
    .from("oe_practice_settings")
    .upsert(
      { key: "practice_info", value: newPracticeInfo, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

  summary.practiceSettings = {
    success: !settingsErr,
    fieldsWritten: Object.keys(newPracticeInfo).length,
    error: settingsErr?.message,
  };

  // ─── 3. Upsert business_hours from Google Places ────────────────────────────

  if (payload.practiceInfo.hours && payload.practiceInfo.hours.length > 0) {
    const hoursMap: Record<string, string> = {};
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (const line of payload.practiceInfo.hours) {
      const lower = line.toLowerCase();
      for (const day of dayNames) {
        if (lower.startsWith(day)) {
          const parts = line.split(/:\s+(.+)/);
          hoursMap[day] = parts[1]?.trim() ?? "Closed";
        }
      }
    }

    if (Object.keys(hoursMap).length > 0) {
      await supabase.from("oe_practice_settings").upsert(
        { key: "business_hours", value: hoursMap, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );
      summary.businessHours = { success: true, daysWritten: Object.keys(hoursMap).length };
    }
  }

  // ─── 4. Upsert providers from NPPES data ────────────────────────────────────

  let providersUpserted = 0;
  const providers = payload.providers ?? [];

  for (const provider of providers) {
    const { firstName, lastName, title } = parseProviderName(provider.name);

    const { error: provErr } = await supabase.from("oe_providers").upsert(
      {
        first_name: firstName,
        last_name: lastName,
        title: title ?? provider.credential ?? null,
        specialty: provider.taxonomy ?? "General Dentistry",
        npi_number: provider.npi,
        license_number: provider.license ?? null,
        license_state: provider.address?.state ?? "NV",
        phone: provider.phone ?? null,
        is_active: true,
        accepting_new_patients: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "npi_number", ignoreDuplicates: false },
    );

    if (!provErr) providersUpserted++;
  }

  summary.providers = {
    received: providers.length,
    upserted: providersUpserted,
  };

  // ─── 5. Upsert insurance carriers ───────────────────────────────────────────

  let carriersUpserted = 0;
  const insuranceList = payload.insurance ?? [];

  for (const carrierName of insuranceList) {
    const clean = carrierName.replace(/accept[s]?|we|insurance|plans?/gi, "").trim();
    if (!clean || clean.length < 4) continue;

    const { error: carrierErr } = await supabase.from("oe_insurance_carriers").upsert(
      {
        name: clean,
        source: "prefill",
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "name", ignoreDuplicates: false },
    );

    if (!carrierErr) carriersUpserted++;
  }

  summary.insuranceCarriers = {
    received: insuranceList.length,
    upserted: carriersUpserted,
    note:
      carriersUpserted === 0 && insuranceList.length > 0
        ? "Run migration 035_prefill_data.sql to create oe_insurance_carriers table"
        : undefined,
  };

  // ─── Done ─────────────────────────────────────────────────────────────────────

  return NextResponse.json({
    success: true,
    summary,
    receivedAt: new Date().toISOString(),
  });
}
