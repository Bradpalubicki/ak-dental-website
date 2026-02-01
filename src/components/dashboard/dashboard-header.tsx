"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";

export function DashboardHeader() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500 hover:text-slate-700">
          <Menu className="h-5 w-5" />
        </button>
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              onBlur={() => setShowSearch(false)}
              type="text"
              placeholder="Search patients, leads, appointments..."
              className="w-80 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 hover:border-slate-300"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-8 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
              /
            </kbd>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* AI Status */}
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-700">AI Active</span>
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            4
          </span>
        </button>
      </div>
    </header>
  );
}
