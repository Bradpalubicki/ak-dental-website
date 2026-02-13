"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  X,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AlertItem {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  countdown?: string;
  dismissible?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Severity Config                                                    */
/* ------------------------------------------------------------------ */

const severityConfig = {
  critical: {
    icon: ShieldAlert,
    bg: "bg-red-50 border-red-200",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleColor: "text-red-900",
    descColor: "text-red-700",
    badge: "bg-red-600 text-white",
    actionBg: "bg-red-600 hover:bg-red-700 text-white",
    pulse: true,
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
    descColor: "text-amber-700",
    badge: "bg-amber-500 text-white",
    actionBg: "bg-amber-600 hover:bg-amber-700 text-white",
    pulse: false,
  },
  info: {
    icon: Info,
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
    descColor: "text-blue-700",
    badge: "bg-blue-500 text-white",
    actionBg: "bg-blue-600 hover:bg-blue-700 text-white",
    pulse: false,
  },
};

/* ------------------------------------------------------------------ */
/*  Alert Banner Component                                             */
/* ------------------------------------------------------------------ */

interface AlertBannerProps {
  alerts: AlertItem[];
  maxVisible?: number;
}

export function AlertBanner({ alerts, maxVisible = 3 }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id));
  const sortedAlerts = [...visibleAlerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  if (sortedAlerts.length === 0) return null;

  const displayAlerts = expanded
    ? sortedAlerts
    : sortedAlerts.slice(0, maxVisible);
  const hiddenCount = sortedAlerts.length - maxVisible;

  return (
    <div className="space-y-2">
      {displayAlerts.map((alert) => {
        const config = severityConfig[alert.severity];
        const Icon = config.icon;

        return (
          <div
            key={alert.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-200",
              config.bg
            )}
          >
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.iconBg)}>
              {config.pulse ? (
                <div className="relative">
                  <Icon className={cn("h-4 w-4", config.iconColor)} />
                  <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                </div>
              ) : (
                <Icon className={cn("h-4 w-4", config.iconColor)} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-semibold", config.titleColor)}>
                {alert.title}
              </p>
              {alert.description && (
                <p className={cn("text-xs mt-0.5", config.descColor)}>
                  {alert.description}
                </p>
              )}
            </div>

            {alert.countdown && (
              <div className="flex items-center gap-1 shrink-0">
                <Clock className={cn("h-3.5 w-3.5", config.iconColor)} />
                <span className={cn("text-xs font-medium", config.titleColor)}>
                  {alert.countdown}
                </span>
              </div>
            )}

            {alert.action && (
              alert.action.href ? (
                <a
                  href={alert.action.href}
                  className={cn(
                    "shrink-0 flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    config.actionBg
                  )}
                >
                  {alert.action.label}
                  <ChevronRight className="h-3 w-3" />
                </a>
              ) : (
                <button
                  onClick={alert.action.onClick}
                  className={cn(
                    "shrink-0 flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    config.actionBg
                  )}
                >
                  {alert.action.label}
                  <ChevronRight className="h-3 w-3" />
                </button>
              )
            )}

            {alert.dismissible !== false && (
              <button
                onClick={() => setDismissed((prev) => new Set([...prev, alert.id]))}
                className={cn("shrink-0 rounded-md p-1 transition-colors hover:bg-black/5", config.iconColor)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}

      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          Show {hiddenCount} more alert{hiddenCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
