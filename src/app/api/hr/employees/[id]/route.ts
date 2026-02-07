import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const [employeeRes, documentsRes] = await Promise.all([
    supabase.from("oe_employees").select("*").eq("id", id).single(),
    supabase
      .from("oe_hr_documents")
      .select("*, acknowledgments:oe_document_acknowledgments(*)")
      .eq("employee_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (employeeRes.error) {
    return NextResponse.json(
      { error: employeeRes.error.message },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...employeeRes.data,
    documents: documentsRes.data || [],
  });
}
