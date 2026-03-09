"use client";

import { useState, useEffect, useRef } from "react";
import { useOrganization } from "@clerk/nextjs";
import { ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Engine {
  orgId: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  industry: string;
  isCurrent: boolean;
}

// The agency engine URL that hosts the /api/engine-switcher endpoint
const AGENCY_ENGINE_URL = "https://nustack-agency-engine.vercel.app";

export function EngineSwitcher() {
  const { organization } = useOrganization();
  const [engines, setEngines] = useState<Engine[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch engines when dropdown opens (lazy — only if not already fetched)
  async function handleOpen() {
    setOpen((prev) => !prev);
    if (fetched) return;
    setLoading(true);
    try {
      const res = await fetch(`${AGENCY_ENGINE_URL}/api/engine-switcher`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setEngines(data.engines || []);
      }
    } catch {
      // silently fail — just show nothing
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }

  // Only show if user has multiple engines (or always show for NuStack team)
  const hasMultiple = engines.length > 1;
  const currentEngine = engines.find((e) => e.isCurrent);
  const displayName = currentEngine?.name ?? organization?.name ?? "Dashboard";
  const displayIcon = currentEngine?.icon ?? "🔧";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/60 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-white transition-colors"
      >
        <span className="text-base leading-none">{displayIcon}</span>
        <span className="max-w-[140px] truncate text-xs font-semibold">{displayName}</span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 text-slate-400 transition-transform duration-150",
          open && "rotate-180"
        )} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Your Dashboards
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          ) : engines.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-slate-400">No other dashboards found</p>
            </div>
          ) : (
            <ul className="py-1">
              {engines.map((engine) => (
                <li key={engine.orgId}>
                  {engine.isCurrent ? (
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50">
                      <span className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm",
                        engine.color
                      )}>
                        {engine.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{engine.name}</p>
                        <p className="text-[10px] text-slate-400">{engine.industry} · Current</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    </div>
                  ) : (
                    <a
                      href={engine.url}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <span className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm opacity-80 group-hover:opacity-100 transition-opacity",
                        engine.color
                      )}>
                        {engine.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 truncate transition-colors">{engine.name}</p>
                        <p className="text-[10px] text-slate-400">{engine.industry}</p>
                      </div>
                      <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-slate-400 shrink-0" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-slate-100 px-3 py-2">
            <p className="text-[9px] text-slate-300 text-center">Powered by NuStack Platform</p>
          </div>
        </div>
      )}
    </div>
  );
}
