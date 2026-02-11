"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Command,
  ArrowRight,
  FileText,
  BarChart3,
  Navigation,
  BookOpen,
} from "lucide-react";

const QUICK_PROMPTS = [
  { label: "Today's schedule", prompt: "What's on the schedule today?", icon: FileText },
  { label: "Production report", prompt: "How is our production looking this month?", icon: BarChart3 },
  { label: "Navigate to a page", prompt: "Where can I find ", icon: Navigation },
  { label: "How do I...", prompt: "How do I ", icon: BookOpen },
];

export function AiCommandBar() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setInput("");
      setResponse("");
    }
  }, [open]);

  async function handleSubmit(query?: string) {
    const q = query || input;
    if (!q.trim() || loading) return;

    setInput(q);
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      setResponse(data.content || "No response received.");
    } catch {
      setResponse("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all hover:scale-105"
        title="AI Assistant (Ctrl+K)"
      >
        <Sparkles className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command palette */}
      <div className="relative w-full max-w-xl mx-4 rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask One Engine anything..."
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
          />
          <div className="flex items-center gap-2">
            {input.trim() && (
              <button
                onClick={() => handleSubmit()}
                disabled={loading}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-40 transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 items-center gap-1 rounded-md border border-slate-200 px-2 text-[10px] font-medium text-slate-400 hover:bg-slate-50"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Response area */}
        {(loading || response) && (
          <div className="max-h-[50vh] overflow-y-auto border-b border-slate-100 px-5 py-4">
            {loading && !response && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
                <span>Thinking...</span>
              </div>
            )}
            {response && (
              <div className="prose prose-sm prose-slate max-w-none text-sm leading-relaxed whitespace-pre-line">
                {response}
              </div>
            )}
          </div>
        )}

        {/* Quick prompts (shown when no response) */}
        {!response && !loading && (
          <div className="px-3 py-3">
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Actions
            </p>
            {QUICK_PROMPTS.map((qp) => {
              const Icon = qp.icon;
              return (
                <button
                  key={qp.label}
                  onClick={() => {
                    if (qp.prompt.endsWith(" ")) {
                      setInput(qp.prompt);
                      inputRef.current?.focus();
                    } else {
                      handleSubmit(qp.prompt);
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50 group"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 group-hover:bg-cyan-50 transition-colors">
                    <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                  </div>
                  <span className="flex-1 text-xs font-medium text-slate-600 group-hover:text-slate-900">
                    {qp.label}
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Sparkles className="h-3 w-3 text-cyan-500" />
            One Engine AI
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Command className="h-3 w-3" />
            <span>K to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
