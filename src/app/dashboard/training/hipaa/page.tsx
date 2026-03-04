"use client";

import { useState } from "react";
import { Shield, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const QUESTIONS = [
  {
    id: 1,
    question: "A patient asks you via text message to confirm their next appointment. Can you reply with the date and time?",
    options: [
      "Yes, they texted first",
      "Only if they've signed a HIPAA authorization for texting",
      "Yes, always",
      "No, never respond to texts",
    ],
    correct: 1,
    explanation: "Texting PHI requires explicit written authorization from the patient, even if they initiated the contact.",
  },
  {
    id: 2,
    question: "You finish treating a patient and their spouse is in the waiting room. Can you tell the spouse what was done?",
    options: [
      "Yes, they're family",
      "Yes, if the patient is present",
      "No — only with the patient's explicit written authorization",
      "Yes, for routine procedures",
    ],
    correct: 2,
    explanation: "Even for family members, sharing PHI requires explicit written authorization from the patient.",
  },
  {
    id: 3,
    question: "A patient's employer calls asking if the patient was seen today for a dental emergency. What do you say?",
    options: [
      "Confirm they were seen",
      "Say they had a dental emergency",
      "\"I can neither confirm nor deny whether this person is a patient\"",
      "Tell them to call back tomorrow",
    ],
    correct: 2,
    explanation: "Even confirming someone is a patient is a HIPAA violation unless they've authorized it.",
  },
  {
    id: 4,
    question: "How must you dispose of a printed patient record you no longer need?",
    options: [
      "Regular trash",
      "Recycling bin",
      "Shred it (cross-cut shredding required)",
      "Delete it digitally and trash the paper",
    ],
    correct: 2,
    explanation: "Paper PHI must be cross-cut shredded. Recycling or regular trash exposes patient data.",
  },
  {
    id: 5,
    question: "Under HIPAA, who owns the patient's medical records?",
    options: [
      "The patient",
      "The practice — but patients have the right to access and receive copies",
      "The insurance company",
      "Both the practice and patient equally",
    ],
    correct: 1,
    explanation: "The practice owns the records, but patients have a federally protected right to access and receive copies.",
  },
];

const PASS_SCORE = 4;

export default function HipaaQuizPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [certified, setCertified] = useState(false);

  const score = submitted
    ? QUESTIONS.filter((q) => answers[q.id] === q.correct).length
    : 0;
  const passed = score >= PASS_SCORE;

  async function handleSubmit() {
    if (Object.keys(answers).length < QUESTIONS.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
    const s = QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
    const p = s >= PASS_SCORE;

    if (p) {
      setSaving(true);
      try {
        await fetch("/api/training/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: "hipaa", score: s, passed: true }),
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
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <Award className="h-10 w-10 text-emerald-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">HIPAA Certified!</h1>
        <p className="text-slate-500">You scored {score}/{QUESTIONS.length}. Your completion has been recorded.</p>
        <a href="/dashboard/training" className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-700">
          Back to Training <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-cyan-600" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">HIPAA Training Quiz</h1>
          <p className="text-sm text-slate-500">Pass 4 out of 5 questions to receive your certificate.</p>
        </div>
      </div>

      {submitted && (
        <div className={cn(
          "rounded-lg border px-4 py-3 flex items-center justify-between",
          passed ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
        )}>
          <div className="flex items-center gap-2 text-sm font-medium">
            {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {passed ? `Passed! Score: ${score}/${QUESTIONS.length}` : `Failed — Score: ${score}/${QUESTIONS.length}. Need ${PASS_SCORE} to pass.`}
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
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm"
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
