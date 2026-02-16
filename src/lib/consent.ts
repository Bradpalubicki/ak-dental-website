import { createServiceSupabase } from "@/lib/supabase/server";

export type ConsentType =
  | "sms_marketing"
  | "sms_transactional"
  | "email_marketing"
  | "email_transactional"
  | "voice_automated"
  | "voice_ai"
  | "hipaa_treatment"
  | "hipaa_payment"
  | "hipaa_operations";

export type ConsentStatus = "granted" | "denied" | "revoked" | "pending";

export type ConsentMethod =
  | "web_form"
  | "sms_keyword"
  | "verbal"
  | "written"
  | "paper"
  | "portal"
  | "import"
  | "system";

interface ConsentRecord {
  patient_id: string;
  consent_type: ConsentType;
  status: ConsentStatus;
  method?: ConsentMethod;
  granted_at?: string;
  revoked_at?: string;
  document_url?: string;
  ip_address?: string;
  notes?: string;
}

/**
 * Check if a patient has active consent for a specific type.
 * Returns true only if consent is explicitly granted and not expired.
 */
export async function hasConsent(
  patientId: string,
  consentType: ConsentType
): Promise<boolean> {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_patient_consents")
    .select("status, expires_at")
    .eq("patient_id", patientId)
    .eq("consent_type", consentType)
    .single();

  if (!data || data.status !== "granted") return false;

  // Check expiration
  if (data.expires_at && new Date(data.expires_at) < new Date()) return false;

  return true;
}

/**
 * Check if a phone number or email has opted out of a channel.
 */
export async function isOptedOut(
  identifier: string,
  channel: "sms" | "email" | "voice"
): Promise<boolean> {
  const supabase = createServiceSupabase();
  const isEmail = identifier.includes("@");

  let query = supabase
    .from("oe_opt_outs")
    .select("id")
    .limit(1);

  if (isEmail) {
    query = query.eq("email", identifier);
  } else {
    query = query.eq("phone", identifier);
  }

  // Check for specific channel opt-out or "all" opt-out
  query = query.in("channel", [channel, "all"]);

  const { data } = await query;
  return (data?.length ?? 0) > 0;
}

/**
 * Record patient consent (upsert).
 */
export async function recordConsent(record: ConsentRecord) {
  const supabase = createServiceSupabase();

  const { error } = await supabase
    .from("oe_patient_consents")
    .upsert(
      {
        patient_id: record.patient_id,
        consent_type: record.consent_type,
        status: record.status,
        method: record.method || null,
        granted_at: record.status === "granted" ? new Date().toISOString() : record.granted_at || null,
        revoked_at: record.status === "revoked" ? new Date().toISOString() : null,
        document_url: record.document_url || null,
        ip_address: record.ip_address || null,
        notes: record.notes || null,
      },
      { onConflict: "patient_id,consent_type" }
    );

  if (error) {
    console.error("[Consent] Failed to record:", error.message);
  }
  return !error;
}

/**
 * Record an opt-out from any channel.
 */
export async function recordOptOut(params: {
  phone?: string;
  email?: string;
  patientId?: string;
  channel: "sms" | "email" | "voice" | "all";
  method: "sms_reply" | "email_link" | "phone" | "portal" | "verbal" | "manual";
}) {
  const supabase = createServiceSupabase();

  await supabase.from("oe_opt_outs").insert({
    phone: params.phone || null,
    email: params.email || null,
    patient_id: params.patientId || null,
    channel: params.channel,
    opt_out_method: params.method,
    processed_at: new Date().toISOString(),
    processed_within_days: 0,
  });

  // Also update consent record if patient is known
  if (params.patientId) {
    const consentTypes: ConsentType[] = [];
    if (params.channel === "sms" || params.channel === "all") {
      consentTypes.push("sms_marketing", "sms_transactional");
    }
    if (params.channel === "email" || params.channel === "all") {
      consentTypes.push("email_marketing", "email_transactional");
    }
    if (params.channel === "voice" || params.channel === "all") {
      consentTypes.push("voice_automated", "voice_ai");
    }

    for (const type of consentTypes) {
      await recordConsent({
        patient_id: params.patientId,
        consent_type: type,
        status: "revoked",
      });
    }
  }
}

/**
 * Get all consent statuses for a patient.
 */
export async function getConsentStatus(patientId: string) {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_patient_consents")
    .select("*")
    .eq("patient_id", patientId)
    .order("consent_type");

  return data || [];
}

/**
 * Check if we can send a message to a patient on a given channel.
 * Combines consent check + opt-out check.
 */
export async function canContact(
  patientId: string,
  channel: "sms" | "email" | "voice",
  messageType: "marketing" | "transactional"
): Promise<{ allowed: boolean; reason?: string }> {
  // Map channel + type to consent type
  const consentMap: Record<string, ConsentType> = {
    "sms_marketing": "sms_marketing",
    "sms_transactional": "sms_transactional",
    "email_marketing": "email_marketing",
    "email_transactional": "email_transactional",
    "voice_marketing": "voice_automated",
    "voice_transactional": "voice_automated",
  };

  const consentType = consentMap[`${channel}_${messageType}`];
  if (!consentType) {
    return { allowed: false, reason: "Unknown channel/type combination" };
  }

  // Check consent
  const consented = await hasConsent(patientId, consentType);
  if (!consented) {
    return { allowed: false, reason: `No ${consentType} consent on file` };
  }

  // Get patient contact info for opt-out check
  const supabase = createServiceSupabase();
  const { data: patient } = await supabase
    .from("oe_patients")
    .select("phone, email")
    .eq("id", patientId)
    .single();

  if (!patient) {
    return { allowed: false, reason: "Patient not found" };
  }

  // Check opt-out
  const identifier = channel === "email" ? patient.email : patient.phone;
  if (identifier) {
    const optedOut = await isOptedOut(identifier, channel);
    if (optedOut) {
      return { allowed: false, reason: `${channel} opt-out on file` };
    }
  }

  return { allowed: true };
}
