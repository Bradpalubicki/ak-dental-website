import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabase/server';
import { verifyAgencySecret } from '@/lib/agency-auth';

export const dynamic = 'force-dynamic';

// Agency snapshot endpoint — called by NuStack Agency Engine to pull live AK Dental metrics.
// Auth: Bearer token matching AGENCY_SNAPSHOT_SECRET env var.
export async function POST(req: NextRequest) {
  const auth = verifyAgencySecret(req);
  if (!auth.valid) return auth.response!;

  try {
    const supabase = createServiceSupabase();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]!;
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [apptsToday, patientsTotal, proposalsPending, newPatients30d, lastMetrics] = await Promise.all([
      supabase
        .from('oe_appointments')
        .select('id', { count: 'exact', head: true })
        .eq('appointment_date', todayStr),
      supabase
        .from('oe_patients')
        .select('id', { count: 'exact', head: true })
        .is('deleted_at', null),
      supabase
        .from('oe_ai_actions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending_approval'),
      supabase
        .from('oe_patients')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo)
        .is('deleted_at', null),
      supabase
        .from('oe_daily_metrics')
        .select('date')
        .order('date', { ascending: false })
        .limit(1),
    ]);

    const lastMetricsDate = (lastMetrics.data as { date: string }[])?.[0]?.date;
    const lastCronRun = lastMetricsDate ? `${lastMetricsDate}T14:00:00.000Z` : null;
    const cronHealthy = lastMetricsDate
      ? (Date.now() - new Date(lastMetricsDate).getTime()) < 48 * 60 * 60 * 1000
      : false;

    return NextResponse.json({
      timestamp: now.toISOString(),
      site_up: true,
      appointments_today: apptsToday.count ?? 0,
      patients_total: patientsTotal.count ?? 0,
      treatment_proposals_pending: proposalsPending.count ?? 0,
      patients_new_30d: newPatients30d.count ?? 0,
      cron_healthy: cronHealthy,
      last_cron_run: lastCronRun,
      engine_type: 'dental',
      engine_version: '1.0.0',
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Snapshot failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
