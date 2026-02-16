import { Skeleton } from "@/components/dashboard/skeleton";

export default function ComplianceLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="space-y-1">
        <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse" />
        <div className="h-4 w-80 rounded bg-white/5 animate-pulse" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-12 bg-white/10" />
                <Skeleton className="h-3 w-24 bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-1 border-b border-white/10 pb-0">
        {[100, 120, 110].map((w, i) => (
          <Skeleton key={i} className="h-10 rounded-t-lg bg-white/10" style={{ width: w }} />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-white/5 px-4 py-3">
          <div className="flex items-center gap-12">
            {[80, 48, 56, 64, 32, 56].map((w, i) => (
              <Skeleton key={i} className="h-3 bg-white/10" style={{ width: w }} />
            ))}
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-12 border-t border-white/5 px-4 py-3">
            {[80, 48, 56, 64, 32, 56].map((w, j) => (
              <Skeleton key={j} className="h-4 bg-white/10" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
