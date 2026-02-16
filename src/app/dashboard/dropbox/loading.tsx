import {
  StatCardSkeleton,
  CardSectionSkeleton,
} from "@/components/dashboard/skeleton";

export default function DropboxLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-8 w-52 rounded-lg bg-slate-200/60 animate-pulse" />
          <div className="h-4 w-80 rounded bg-slate-200/40 animate-pulse" />
        </div>
        <div className="h-10 w-24 rounded-lg bg-slate-200/60 animate-pulse" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Upload zone skeleton */}
      <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 animate-pulse" />

      {/* Filters skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-10 flex-1 max-w-md rounded-lg bg-slate-200/60 animate-pulse" />
        <div className="h-10 w-36 rounded-lg bg-slate-200/60 animate-pulse" />
        <div className="h-10 w-28 rounded-lg bg-slate-200/60 animate-pulse" />
      </div>

      {/* Document list skeleton */}
      <CardSectionSkeleton rows={5} />
    </div>
  );
}
