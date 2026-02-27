"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";

type ViewMode = "day" | "week";

function getMonday(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function CalendarView() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState<ViewMode>("day");

  const weekStart = getMonday(selectedDate);

  function handlePrev() {
    setSelectedDate(addDays(selectedDate, viewMode === "day" ? -1 : -7));
  }

  function handleNext() {
    setSelectedDate(addDays(selectedDate, viewMode === "day" ? 1 : 7));
  }

  const dateObj = new Date(selectedDate);
  const dateLabel =
    viewMode === "day"
      ? dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
      : `Week of ${new Date(weekStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrev}>←</Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(today)}>Today</Button>
          <Button variant="outline" size="sm" onClick={handleNext}>→</Button>
          <span className="text-sm font-medium ml-2 text-slate-700">{dateLabel}</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
          <button
            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${viewMode === "day" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${viewMode === "week" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
        </div>
      </div>

      {viewMode === "day" ? (
        <DayView date={selectedDate} />
      ) : (
        <WeekView startDate={weekStart} />
      )}
    </div>
  );
}
