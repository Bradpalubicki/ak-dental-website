"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Sparkline } from "./chart-components";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  sparkData?: number[];
  sparkColor?: string;
  href?: string;
  accentColor?: string;
  pulse?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  iconColor = "text-cyan-600 bg-cyan-50",
  description,
  sparkData,
  sparkColor,
  href,
  accentColor,
  pulse,
}: StatCardProps) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group relative rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-300",
        "hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/80 hover:-translate-y-0.5",
        href && "cursor-pointer"
      )}
    >
      {/* Gradient top accent */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: accentColor
            ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
            : "linear-gradient(90deg, transparent, #94a3b8, transparent)",
        }}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-500 transition-colors">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
            iconColor
          )}
        >
          <Icon className="h-5 w-5" />
          {pulse && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          )}
        </div>
      </div>

      {/* Sparkline */}
      {sparkData && sparkData.length > 0 && (
        <div className="mt-2 -mx-1">
          <Sparkline data={sparkData} color={sparkColor} height={28} />
        </div>
      )}

      {(change || description) && (
        <div
          className={cn(
            "flex items-center gap-1.5 pt-3 border-t border-slate-100",
            sparkData ? "mt-1" : "mt-3"
          )}
        >
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
    </Wrapper>
  );
}
