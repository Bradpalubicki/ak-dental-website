import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q || q.length < 2) return NextResponse.json([]);

  const supabase = createServiceSupabase();
  const like = `%${q}%`;

  const [patientsRes, leadsRes] = await Promise.all([
    supabase
      .from("oe_patients")
      .select("id, first_name, last_name, email, phone, status")
      .is("deleted_at", null)
      .or(`first_name.ilike.${like},last_name.ilike.${like},email.ilike.${like},phone.ilike.${like}`)
      .limit(5),
    supabase
      .from("oe_leads")
      .select("id, first_name, last_name, email, phone, status")
      .or(`first_name.ilike.${like},last_name.ilike.${like},email.ilike.${like},phone.ilike.${like}`)
      .limit(3),
  ]);

  const results = [
    ...(patientsRes.data || []).map((p) => ({
      type: "patient" as const,
      label: `${p.first_name} ${p.last_name}`,
      sub: p.email || p.phone || p.status,
      href: `/dashboard/patients`,
    })),
    ...(leadsRes.data || []).map((l) => ({
      type: "lead" as const,
      label: `${l.first_name} ${l.last_name}`,
      sub: l.email || l.phone || "New lead",
      href: `/dashboard/leads`,
    })),
  ];

  return NextResponse.json(results);
}
