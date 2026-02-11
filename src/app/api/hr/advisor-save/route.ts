import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { employee_id, messages, title } = body;

  if (!employee_id || !messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "employee_id and messages are required" },
      { status: 400 }
    );
  }

  // Format messages into readable content
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const transcript = messages
    .map((m: { role: string; content: string }) =>
      m.role === "user"
        ? `Q: ${m.content}`
        : `A: ${m.content}`
    )
    .join("\n\n---\n\n");

  const content = `Business Advisor Consultation\nDate: ${dateStr}\n\n---\n\n${transcript}`;

  const docTitle =
    title || `Advisor Consultation — ${new Date().toLocaleDateString("en-US")}`;

  const { data, error } = await supabase
    .from("oe_hr_documents")
    .insert({
      employee_id,
      type: "advisor_conversation",
      title: docTitle,
      content,
      severity: null,
      status: "draft",
      created_by: "Dr. Alexandru Chireu",
      metadata: { messages },
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
