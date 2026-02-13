"use client";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Base Skeleton                                                      */
/* ------------------------------------------------------------------ */

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/60",
        className
      )}
      style={style}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card Skeleton                                                 */
/* ------------------------------------------------------------------ */

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart Skeleton                                                     */
/* ------------------------------------------------------------------ */

export function ChartSkeleton({ height = "h-48" }: { height?: string }) {
  return (
    <div className={cn("rounded-xl border border-slate-200/80 bg-white p-5", height)}>
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-end gap-1 h-full pb-8">
        {[40, 65, 45, 80, 55, 70, 60, 75, 50, 85, 65, 45].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Table Row Skeleton                                                 */
/* ------------------------------------------------------------------ */

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <Skeleton className={cn("h-4", i === 0 ? "w-32" : "w-16")} />
        </td>
      ))}
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Card Section Skeleton                                              */
/* ------------------------------------------------------------------ */

export function CardSectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
