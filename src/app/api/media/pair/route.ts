import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const PairSchema = z.object({
  beforeId: z.string().uuid(),
  afterId: z.string().uuid(),
});

const UnpairSchema = z.object({
  assetId: z.string().uuid(),
});

// POST /api/media/pair — link two photos as a before/after pair
export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const body = PairSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const { beforeId, afterId } = body.data;
  const groupId = crypto.randomUUID();
  const supabase = createServiceSupabase();

  await supabase.from("media_assets").update({ pair_group_id: groupId, before_or_after: "before" }).eq("id", beforeId);
  await supabase.from("media_assets").update({ pair_group_id: groupId, before_or_after: "after" }).eq("id", afterId);

  return NextResponse.json({ success: true, pair_group_id: groupId });
}

// DELETE /api/media/pair — unlink a photo from its pair
export async function DELETE(req: NextRequest) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const body = UnpairSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const { assetId } = body.data;
  const supabase = createServiceSupabase();

  // Get the pair group, then unlink both photos in the group
  const { data: asset } = await supabase.from("media_assets").select("pair_group_id").eq("id", assetId).single();
  if (asset?.pair_group_id) {
    await supabase.from("media_assets").update({ pair_group_id: null }).eq("pair_group_id", asset.pair_group_id);
  }

  return NextResponse.json({ success: true });
}
