import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().min(1).max(100),
  steps: z.array(z.unknown()).default([]),
  trigger_conditions: z.record(z.string(), z.unknown()).default({}),
});

const UpdateWorkflowSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["active", "paused", "draft"]).optional(),
  name: z.string().min(1).max(200).optional(),
  type: z.string().min(1).max(100).optional(),
  steps: z.array(z.unknown()).optional(),
  trigger_conditions: z.record(z.string(), z.unknown()).optional(),
});

export async function GET() {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_outreach_workflows")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Failed to load workflows" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const parsed = CreateWorkflowSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_outreach_workflows")
      .insert({ ...parsed.data, status: "draft", enrolled_count: 0, completed_count: 0 })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create workflow";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const parsed = UpdateWorkflowSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { id, ...updates } = parsed.data;
    const allowedFields = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("oe_outreach_workflows")
      .update(allowedFields)
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update workflow";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("oe_outreach_workflows")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete workflow";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
