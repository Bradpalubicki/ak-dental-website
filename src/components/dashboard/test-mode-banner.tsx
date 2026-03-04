"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export function TestModeBanner() {
  const [testMode, setTestMode] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/settings/test-mode")
      .then((r) => r.json())
      .then((d) => setTestMode(d.enabled))
      .catch(() => {});
  }, []);

  if (!testMode || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-400 text-amber-950 px-4 py-2 flex items-center justify-between text-sm font-medium shadow-md">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>⚠ TEST MODE ACTIVE — messages are not reaching patients. All sends go to test contacts only.</span>
      </div>
      <button onClick={() => setDismissed(true)} className="ml-4 hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
