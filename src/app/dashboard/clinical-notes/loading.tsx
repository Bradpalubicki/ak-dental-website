import {
  StatCardSkeleton,
  Skeleton,
} from "@/components/dashboard/skeleton";

export default function ClinicalNotesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="h-8 w-44 rounded-lg bg-slate-200/60 animate-pulse" />
          <div className="h-4 w-72 rounded bg-slate-200/40 animate-pulse" />
        </div>
        <div className="h-10 w-28 rounded-lg bg-slate-200/60 animate-pulse" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Search bar skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-10 flex-1 min-w-[200px] rounded-lg bg-slate-200/60 animate-pulse" />
        <div className="h-10 w-24 rounded-lg bg-slate-200/60 animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
          <div className="flex items-center gap-8">
            {[48, 80, 64, 56, 120, 56, 48].map((w, i) => (
              <Skeleton key={i} className="h-3" style={{ width: w }} />
            ))}
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-8 border-b border-slate-100 px-5 py-3.5">
            {[48, 80, 64, 56, 120, 56, 48].map((w, j) => (
              <Skeleton key={j} className="h-4" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
