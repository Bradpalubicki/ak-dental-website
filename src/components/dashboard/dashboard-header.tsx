"use client";

import { Search, Command, Zap, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { NotificationBell } from "./notification-bell";
import { useMobileSidebar } from "./sidebar";
import { EngineSwitcher } from "./engine-switcher";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type SearchResult = {
  type: "patient" | "lead" | "appointment";
  label: string;
  sub: string;
  href: string;
};

export function DashboardHeader() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const greeting = getGreeting();
  const dateStr = getFormattedDate();
  const { user, isLoaded } = useUser();
  const { setOpen: setMobileOpen } = useMobileSidebar();

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) setResults(await res.json());
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelect(href: string) {
    setShowSearch(false);
    setQuery("");
    setResults([]);
    router.push(href);
  }

  function handleClose() {
    setShowSearch(false);
    setQuery("");
    setResults([]);
  }

  // Only prefix title (e.g. "Dr.") for users who have it set in Clerk metadata
  const title = (user?.publicMetadata?.title as string) || "";
  const displayName = user?.firstName
    ? `${title ? title + " " : ""}${user.firstName}`
    : "there";

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 lg:px-6">
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Greeting */}
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-slate-900">{greeting}, {displayName}</p>
          <p className="text-[11px] text-slate-400">{dateStr}</p>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-8 w-px bg-slate-200" />

        {/* Search */}
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => setTimeout(handleClose, 150)}
              onKeyDown={(e) => e.key === "Escape" && handleClose()}
              placeholder="Search patients, leads, appointments..."
              className="w-80 rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
            {/* Results dropdown */}
            {(results.length > 0 || searching) && (
              <div className="absolute top-full left-0 mt-1 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                {searching && (
                  <div className="px-4 py-3 text-xs text-slate-400">Searching...</div>
                )}
                {!searching && results.map((r, i) => (
                  <button
                    key={i}
                    onMouseDown={() => handleSelect(r.href)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
                  >
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize shrink-0 ${
                      r.type === "patient" ? "bg-blue-100 text-blue-700" :
                      r.type === "lead" ? "bg-amber-100 text-amber-700" :
                      "bg-cyan-100 text-cyan-700"
                    }`}>{r.type}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate">{r.label}</p>
                      <p className="text-[10px] text-slate-400 truncate">{r.sub}</p>
                    </div>
                  </button>
                ))}
                {!searching && query.length >= 2 && results.length === 0 && (
                  <div className="px-4 py-3 text-xs text-slate-400">No results for &quot;{query}&quot;</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-1.5 text-sm text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Search...</span>
            <kbd className="ml-6 flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Engine Switcher */}
        <EngineSwitcher />

        {/* AI Engine Status */}
        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/50 px-3 py-1">
          <div className="relative">
            <Zap className="h-3.5 w-3.5 text-cyan-600" />
            <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <span className="text-[11px] font-semibold text-cyan-700">AI Active</span>
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* Clerk User Button / Avatar */}
        {isLoaded && user ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 rounded-lg ring-2 ring-white shadow-sm",
              },
            }}
            afterSignOutUrl="/"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-[11px] font-bold text-white ring-2 ring-white shadow-sm">
            AK
          </div>
        )}
      </div>
    </header>
  );
}
