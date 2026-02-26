import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// GET /api/appointment-types - List appointment types
export async function GET() {
  try {
    const supabase = createServiceSupabase();

    const { data, error } = await supabase
      .from("oe_appointment_types")
      .select("*")
      .order("sort_order")
      .order("name");

    if (error) throw error;

    return NextResponse.json({ appointment_types: data });
  } catch (error) {
    console.error("[API] GET /api/appointment-types error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment types" },
      { status: 500 }
    );
  }
}

// POST /api/appointment-types - Create appointment type
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceSupabase();

    const {
      name,
      code,
      description,
      category,
      duration_minutes,
      buffer_after_minutes,
      default_fee,
      color,
      online_bookable,
      requires_provider,
      requires_resource,
      max_per_day_per_provider,
      provider_restrictions,
      active,
      sort_order,
    } = body;

    if (!name || !duration_minutes) {
      return NextResponse.json(
        { error: "name and duration_minutes are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("oe_appointment_types")
      .insert({
        name,
        code: code || null,
        description: description || null,
        category: category || null,
        duration_minutes,
        buffer_after_minutes: buffer_after_minutes ?? 0,
        default_fee: default_fee ?? 0,
        color: color || "#3b82f6",
        online_bookable: online_bookable ?? true,
        requires_provider: requires_provider ?? true,
        requires_resource: requires_resource ?? false,
        max_per_day_per_provider: max_per_day_per_provider || null,
        provider_restrictions: provider_restrictions || null,
        active: active ?? true,
        sort_order: sort_order ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ appointment_type: data }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/appointment-types error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment type" },
      { status: 500 }
    );
  }
}
