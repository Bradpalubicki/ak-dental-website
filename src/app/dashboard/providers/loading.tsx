import {
  StatCardSkeleton,
  CardSectionSkeleton,
  Skeleton,
} from "@/components/dashboard/skeleton";

export default function ProvidersLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="h-8 w-56 rounded-lg bg-slate-200/60 animate-pulse" />
          <div className="h-4 w-80 rounded bg-slate-200/40 animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-slate-200/60 animate-pulse" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 border-b border-slate-200">
        {[120, 140, 130].map((w, i) => (
          <Skeleton key={i} className="h-10 rounded-t-lg" style={{ width: w }} />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 flex-1 max-w-md rounded-lg bg-slate-200/60 animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-slate-200/60 animate-pulse" />
      </div>

      <CardSectionSkeleton rows={5} />
    </div>
  );
}
