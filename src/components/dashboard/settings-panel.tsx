"use client";

import { useState } from "react";
import {
  X,
  RotateCcw,
  LayoutGrid,
  Stethoscope,
  Activity,
  TrendingUp,
  Check,
} from "lucide-react";
import {
  WIDGET_REGISTRY,
  LAYOUT_PRESETS,
  type LayoutPreset,
} from "./dashboard-types";
import type { LucideIcon } from "lucide-react";

const presetIcons: Record<string, LucideIcon> = {
  default: LayoutGrid,
  clinical: Stethoscope,
  operations: Activity,
  executive: TrendingUp,
};

export function SettingsPanel({
  visible,
  columnCount,
  onToggle,
  onReset,
  onApplyPreset,
  onClose,
}: {
  visible: string[];
  columnCount: number;
  onToggle: (id: string) => void;
  onReset: () => void;
  onApplyPreset: (preset: LayoutPreset) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"widgets" | "presets">("widgets");

  // Detect which preset is active
  const activePreset = LAYOUT_PRESETS.find(
    (p) =>
      p.columnCount === columnCount &&
      p.widgetIds.length === visible.length &&
      p.widgetIds.every((id) => visible.includes(id))
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-80 bg-white shadow-xl border-l border-slate-200 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">
            Customize Dashboard
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setTab("widgets")}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              tab === "widgets"
                ? "border-b-2 border-cyan-500 text-cyan-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Widgets
          </button>
          <button
            onClick={() => setTab("presets")}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              tab === "presets"
                ? "border-b-2 border-cyan-500 text-cyan-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Presets
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "widgets" ? (
            <div className="space-y-1">
              {WIDGET_REGISTRY.map((widget) => {
                const isOn = visible.includes(widget.id);
                const Icon = widget.icon;
                return (
                  <button
                    key={widget.id}
                    onClick={() => onToggle(widget.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isOn
                        ? "bg-cyan-50/50 hover:bg-cyan-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isOn ? "bg-cyan-100" : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isOn ? "text-cyan-600" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium flex-1 text-left ${
                        isOn ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {widget.label}
                    </span>
                    {widget.demo && (
                      <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-600">
                        Demo
                      </span>
                    )}
                    <div
                      className={`h-5 w-9 rounded-full transition-colors ${
                        isOn ? "bg-cyan-500" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          isOn ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {LAYOUT_PRESETS.map((preset) => {
                const Icon = presetIcons[preset.id] || LayoutGrid;
                const isActive = activePreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onApplyPreset(preset)}
                    className={`flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                      isActive
                        ? "border-cyan-500 bg-cyan-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isActive ? "bg-cyan-100" : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 ${
                          isActive ? "text-cyan-600" : "text-slate-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            isActive ? "text-cyan-700" : "text-slate-900"
                          }`}
                        >
                          {preset.name}
                        </p>
                        {isActive && (
                          <Check className="h-3.5 w-3.5 text-cyan-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {preset.description}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {preset.columnCount}-col &middot;{" "}
                        {preset.widgetIds.length} widgets
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4">
          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
