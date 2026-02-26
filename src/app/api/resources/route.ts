import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// GET /api/resources - List resources (rooms, equipment, etc.)
export async function GET() {
  try {
    const supabase = createServiceSupabase();

    const { data, error } = await supabase
      .from("oe_resources")
      .select("*")
      .order("name");

    if (error) throw error;

    return NextResponse.json({ resources: data });
  } catch (error) {
    console.error("[API] GET /api/resources error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a resource
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceSupabase();

    const { name, type, description, capacity, color, active } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "name and type are required" },
        { status: 400 }
      );
    }

    const validTypes = ["room", "operatory", "equipment", "virtual"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("oe_resources")
      .insert({
        name,
        type,
        description: description || null,
        capacity: capacity ?? 1,
        color: color || "#6b7280",
        active: active ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ resource: data }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/resources error:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
