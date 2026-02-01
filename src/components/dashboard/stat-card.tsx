"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  iconColor = "text-cyan-600 bg-cyan-50",
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={cn("rounded-lg p-2", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(change || description) && (
        <div className="mt-3 flex items-center gap-1">
          {change && (
            <>
              {trend === "up" && <ArrowUpRight className="h-4 w-4 text-emerald-500" />}
              {trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-500" />}
              {trend === "neutral" && <Minus className="h-4 w-4 text-slate-400" />}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend === "up" && "text-emerald-600",
                  trend === "down" && "text-red-600",
                  trend === "neutral" && "text-slate-500"
                )}
              >
                {change}
              </span>
            </>
          )}
          {description && (
            <span className="text-sm text-slate-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
