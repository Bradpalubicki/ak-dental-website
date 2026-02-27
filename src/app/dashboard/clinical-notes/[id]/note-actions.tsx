"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PenLine,
  Sparkles,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Code2,
  Lightbulb,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestions {
  coding_suggestions?: { code: string; description: string; rationale: string }[];
  treatment_recommendations?: string[];
  risk_flags?: string[];
  documentation_tips?: string[];
  raw_response?: string;
}

interface NoteActionsProps {
  noteId: string;
  isSigned: boolean;
  providerName: string;
  initialAiSummary: string | null;
  initialAiSuggestions: AISuggestions | null;
}

export function NoteActions({
  noteId,
  isSigned,
  providerName,
  initialAiSummary,
  initialAiSuggestions,
}: NoteActionsProps) {
  const router = useRouter();
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(initialAiSummary);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(initialAiSuggestions);
  const [aiExpanded, setAiExpanded] = useState(!!initialAiSummary);

  async function handleSign() {
    if (!confirm(`Sign this note as ${providerName}? This cannot be undone.`)) return;
    setSigning(true);
    setSignError(null);
    try {
      const res = await fetch(`/api/clinical-notes/${noteId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signer_name: providerName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to sign note");
      }
      router.refresh();
    } catch (e) {
      setSignError(e instanceof Error ? e.message : "Sign failed");
    } finally {
      setSigning(false);
    }
  }

  async function handleAiAssist() {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch(`/api/clinical-notes/${noteId}/ai-assist`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "AI assist failed");
      }
      const data = await res.json();
      setAiSummary(data.ai_summary || null);
      setAiSuggestions(data.ai_suggestions || null);
      setAiExpanded(true);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "AI assist failed");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {!isSigned && (
          <button
            onClick={handleSign}
            disabled={signing}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-sm hover:shadow-md"
            )}
          >
            {signing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PenLine className="h-4 w-4" />
            )}
            {signing ? "Signing…" : "Sign Note"}
          </button>
        )}

        <button
          onClick={handleAiAssist}
          disabled={aiLoading}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-sm hover:shadow-md"
          )}
        >
          {aiLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {aiLoading ? "Analyzing…" : aiSummary ? "Refresh AI" : "AI Assist"}
        </button>
      </div>

      {/* Errors */}
      {signError && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {signError}
        </p>
      )}
      {aiError && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {aiError}
        </p>
      )}

      {/* AI Results panel */}
      {aiSummary && (
        <div className="rounded-xl border border-violet-200 bg-violet-50/50 overflow-hidden">
          <button
            onClick={() => setAiExpanded((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-800">AI Clinical Analysis</span>
            </div>
            {aiExpanded ? (
              <ChevronUp className="h-4 w-4 text-violet-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-violet-500" />
            )}
          </button>

          {aiExpanded && (
            <div className="border-t border-violet-200 px-4 py-4 space-y-4">
              {/* Summary */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">
                  Clinical Summary
                </p>
                <p className="text-sm text-slate-700">{aiSummary}</p>
              </div>

              {/* Coding suggestions */}
              {aiSuggestions?.coding_suggestions && aiSuggestions.coding_suggestions.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Code2 className="h-3.5 w-3.5 text-violet-600" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                      CDT Code Suggestions
                    </p>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestions.coding_suggestions.map((s, i) => (
                      <div key={i} className="rounded-lg bg-white border border-violet-100 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-violet-700 bg-violet-100 rounded px-1.5 py-0.5">
                            {s.code}
                          </span>
                          <span className="text-sm font-medium text-slate-700">{s.description}</span>
                        </div>
                        {s.rationale && (
                          <p className="mt-1 text-xs text-slate-500">{s.rationale}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatment recommendations */}
              {aiSuggestions?.treatment_recommendations && aiSuggestions.treatment_recommendations.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="h-3.5 w-3.5 text-violet-600" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                      Treatment Recommendations
                    </p>
                  </div>
                  <ul className="space-y-1">
                    {aiSuggestions.treatment_recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk flags */}
              {aiSuggestions?.risk_flags && aiSuggestions.risk_flags.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                      Risk Flags
                    </p>
                  </div>
                  <ul className="space-y-1">
                    {aiSuggestions.risk_flags.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documentation tips */}
              {aiSuggestions?.documentation_tips && aiSuggestions.documentation_tips.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Documentation Tips
                    </p>
                  </div>
                  <ul className="space-y-1">
                    {aiSuggestions.documentation_tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
