"use client";

import { Map } from "lucide-react";

interface TourTriggerProps {
  onClick: () => void;
  tourDismissed: boolean;
}

export function TourTrigger({ onClick, tourDismissed }: TourTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:shadow-xl transition-all group"
      title="Take a dashboard tour"
    >
      <div className="relative">
        <Map className="h-4 w-4 text-cyan-500" />
        {!tourDismissed && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
        )}
      </div>
      <span>Dashboard Tour</span>
    </button>
  );
}
