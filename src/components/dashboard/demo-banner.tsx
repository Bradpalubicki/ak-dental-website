import { AlertTriangle } from "lucide-react";

export function DemoBanner({ module }: { module: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
      <p className="text-xs text-amber-800">
        <span className="font-semibold">Demo Data</span> — {module} is showing sample data. Connect integrations in{" "}
        <a href="/dashboard/settings" className="underline hover:text-amber-900">Settings</a>{" "}
        to see real data.
      </p>
    </div>
  );
}
