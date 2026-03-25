import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  let db = false;
  let auth = false;
  let payments = false;
  let lastCron: string | null = null;

  // DB check
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { error } = await supabase.from('appointments').select('id').limit(1);
    db = !error;
  } catch {
    db = false;
  }

  // Auth check
  auth = !!(process.env.CLERK_SECRET_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  // Payments — Square key present
  payments = !!(process.env.SQUARE_ACCESS_TOKEN);

  const status = !db ? 'degraded' : 'ok';

  return NextResponse.json({
    status,
    db,
    auth,
    payments,
    lastCron,
    version: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    service: 'ak-dental',
  });
}
