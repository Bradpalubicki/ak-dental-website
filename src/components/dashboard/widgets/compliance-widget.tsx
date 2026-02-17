"use client";

import { ArrowRight } from "lucide-react";

interface ComplianceItem {
  label: string;
  holder: string;
  category: "provider" | "facility" | "team";
  days: number;
  status: "expired" | "warning" | "ok";
}

const items: ComplianceItem[] = [
  { label: "DEA Registration", holder: "Dr. Alexandru", category: "provider", days: 49, status: "warning" },
  { label: "Radiation Safety Cert", holder: "Dr. Alexandru", category: "provider", days: -3, status: "expired" },
  { label: "Business License", holder: "Practice", category: "facility", days: 143, status: "ok" },
  { label: "CPR/BLS (All Staff)", holder: "Team", category: "team", days: 220, status: "ok" },
];

const categoryLabels: Record<string, string> = {
  provider: "Provider Credentials",
  facility: "Facility",
  team: "Team",
};

export function ComplianceWidget() {
  const grouped = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, ComplianceItem[]>
  );

  const categoryOrder = ["provider", "facility", "team"];

  return (
    <div className="space-y-3">
      {categoryOrder.map((cat) => {
        const catItems = grouped[cat];
        if (!catItems?.length) return null;
        return (
          <div key={cat}>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
              {categoryLabels[cat]}
            </p>
            <div className="space-y-1.5">
              {catItems.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${
                    item.status === "expired"
                      ? "bg-red-50/80 border border-red-100"
                      : item.status === "warning"
                        ? "bg-amber-50/60 border border-amber-100"
                        : "bg-slate-50/80 border border-transparent"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      item.status === "expired"
                        ? "bg-red-500"
                        : item.status === "warning"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.holder}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold shrink-0 ${
                      item.days < 0
                        ? "text-red-600"
                        : item.days < 90
                          ? "text-amber-600"
                          : "text-slate-400"
                    }`}
                  >
                    {item.days < 0
                      ? `${Math.abs(item.days)}d overdue`
                      : `${item.days}d`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <a
        href="/dashboard/licensing"
        className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
      >
        All licenses <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}
