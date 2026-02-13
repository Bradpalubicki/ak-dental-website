import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

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

    const body = await request.json();
    const { name, type, steps, trigger_conditions } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "name and type are required" }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_outreach_workflows")
      .insert({
        name,
        type,
        status: "draft",
        steps: steps || [],
        trigger_conditions: trigger_conditions || {},
        enrolled_count: 0,
        completed_count: 0,
      })
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

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Only allow updating specific fields
    const allowedFields: Record<string, unknown> = {};
    if (updates.status !== undefined) allowedFields.status = updates.status;
    if (updates.name !== undefined) allowedFields.name = updates.name;
    if (updates.type !== undefined) allowedFields.type = updates.type;
    if (updates.steps !== undefined) allowedFields.steps = updates.steps;
    if (updates.trigger_conditions !== undefined) allowedFields.trigger_conditions = updates.trigger_conditions;

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

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    // Soft delete
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
