import {
  StatCardSkeleton,
  ChartSkeleton,
  CardSectionSkeleton,
} from "@/components/dashboard/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="space-y-1">
        <div className="h-8 w-64 rounded-lg bg-slate-200/60 animate-pulse" />
        <div className="h-4 w-96 rounded bg-slate-200/40 animate-pulse" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartSkeleton height="h-64" />
        <ChartSkeleton height="h-64" />
      </div>

      {/* Table / card section */}
      <CardSectionSkeleton rows={5} />
    </div>
  );
}
