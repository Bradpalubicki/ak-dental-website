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
    <div className="group relative rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/80">
      {/* Subtle top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-t-xl" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
          iconColor
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(change || description) && (
        <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-slate-100">
          {change && (
            <>
              {trend === "up" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                  <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                </div>
              )}
              {trend === "down" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50">
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                </div>
              )}
              {trend === "neutral" && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                  <Minus className="h-3 w-3 text-slate-400" />
                </div>
              )}
              <span
                className={cn(
                  "text-xs font-medium",
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
            <span className="text-xs text-slate-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
