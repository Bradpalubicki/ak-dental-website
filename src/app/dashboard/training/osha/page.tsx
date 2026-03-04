"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const QUESTIONS = [
  {
    id: 1,
    question: "After a needlestick injury, your first action should be:",
    options: [
      "Wash the area with soap and water, report immediately to supervisor",
      "Apply a bandage and continue working",
      "Wait to see if symptoms develop",
      "Report at end of shift",
    ],
    correct: 0,
    explanation: "Immediate washing and reporting is critical for post-exposure prophylaxis to be effective.",
  },
  {
    id: 2,
    question: "Dental masks must be changed:",
    options: [
      "Once per day",
      "Between patients or when visibly soiled/wet",
      "Once per week",
      "Only when treating high-risk patients",
    ],
    correct: 1,
    explanation: "Masks lose effectiveness when wet or after extended use. Change between every patient.",
  },
  {
    id: 3,
    question: "Bloodborne pathogens training is required:",
    options: [
      "Once ever",
      "Every 3 years",
      "Annually",
      "Only for new employees",
    ],
    correct: 2,
    explanation: "OSHA requires annual bloodborne pathogens training for all at-risk employees.",
  },
  {
    id: 4,
    question: "Used sharps (needles, scalpels) must be disposed of in:",
    options: [
      "A puncture-resistant sharps container",
      "A biohazard bag",
      "Regular trash",
      "A sealed plastic bag",
    ],
    correct: 0,
    explanation: "Only puncture-resistant sharps containers prevent needlestick injuries during disposal.",
  },
  {
    id: 5,
    question: "The written Exposure Control Plan must be reviewed:",
    options: [
      "Every 5 years",
      "Only after an incident",
      "At least annually and when procedures change",
      "Only when a new employee is hired",
    ],
    correct: 2,
    explanation: "OSHA requires annual review of the Exposure Control Plan, plus review whenever procedures change.",
  },
];

const PASS_SCORE = 5; // Must get all 5 correct

export default function OshaQuizPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [certified, setCertified] = useState(false);

  const score = submitted
    ? QUESTIONS.filter((q) => answers[q.id] === q.correct).length
    : 0;
  const passed = score === PASS_SCORE;

  async function handleSubmit() {
    if (Object.keys(answers).length < QUESTIONS.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
    const s = QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
    const p = s === PASS_SCORE;

    if (p) {
      setSaving(true);
      try {
        await fetch("/api/training/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: "osha", score: s, passed: true }),
        });
        setCertified(true);
      } catch {
        toast.error("Failed to save completion — please try again.");
      } finally {
        setSaving(false);
      }
    }
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setCertified(false);
  }

  if (certified) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center space-y-4 p-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center">
            <Award className="h-10 w-10 text-orange-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">OSHA Certified!</h1>
        <p className="text-slate-500">Perfect score: {score}/{QUESTIONS.length}. Your completion has been recorded.</p>
        <a href="/dashboard/training" className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-700">
          Back to Training <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-orange-500" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">OSHA Safety Training Quiz</h1>
          <p className="text-sm text-slate-500">Required for clinical staff. Must score 5/5 — no margin for error.</p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-800 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>This quiz requires a perfect score (5/5). Safety standards have no exceptions.</span>
      </div>

      {submitted && (
        <div className={cn(
          "rounded-lg border px-4 py-3 flex items-center justify-between",
          passed ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
        )}>
          <div className="flex items-center gap-2 text-sm font-medium">
            {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {passed ? `Perfect score! ${score}/${QUESTIONS.length}` : `Failed — Score: ${score}/${QUESTIONS.length}. All 5 required.`}
          </div>
          {!passed && (
            <button onClick={handleRetry} className="flex items-center gap-1 text-xs font-medium hover:underline">
              <RotateCcw className="h-3.5 w-3.5" /> Retry
            </button>
          )}
        </div>
      )}

      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => {
          const chosen = answers[q.id];
          const isCorrect = submitted && chosen === q.correct;
          const isWrong = submitted && chosen !== undefined && chosen !== q.correct;
          return (
            <div key={q.id} className={cn("border rounded-xl p-5 space-y-3", submitted && isCorrect ? "border-emerald-200 bg-emerald-50/30" : submitted && isWrong ? "border-red-200 bg-red-50/30" : "border-slate-200")}>
              <p className="text-sm font-medium text-slate-900">{idx + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === i;
                  const showCorrect = submitted && i === q.correct;
                  const showWrong = submitted && selected && i !== q.correct;
                  return (
                    <button
                      key={i}
                      disabled={submitted}
                      onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                      className={cn(
                        "w-full text-left text-sm px-4 py-2.5 rounded-lg border transition-colors",
                        showCorrect ? "border-emerald-500 bg-emerald-100 text-emerald-800 font-medium" :
                        showWrong ? "border-red-400 bg-red-100 text-red-800" :
                        selected ? "border-cyan-500 bg-cyan-50 text-cyan-800" :
                        "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="text-xs text-slate-500 italic">{q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < QUESTIONS.length}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm"
        >
          Submit Quiz ({Object.keys(answers).length}/{QUESTIONS.length} answered)
        </button>
      )}

      {submitted && passed && !saving && (
        <button
          onClick={() => setCertified(true)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <Award className="h-4 w-4" /> Get Certificate
        </button>
      )}
    </div>
  );
}
