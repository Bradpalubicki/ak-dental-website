import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyPortalApiAuth } from "@/lib/portal-auth";

const UpdateProfileSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(50).optional().nullable(),
  zip: z.string().max(10).optional().nullable(),
  insurance_provider: z.string().max(200).optional().nullable(),
  insurance_member_id: z.string().max(100).optional().nullable(),
  insurance_group_number: z.string().max(100).optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export async function PUT(request: NextRequest) {
  try {
    const { patient, error: authError } = await verifyPortalApiAuth();
    if (authError || !patient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = UpdateProfileSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const updates = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("oe_patients")
      .update(updates)
      .eq("id", patient.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
