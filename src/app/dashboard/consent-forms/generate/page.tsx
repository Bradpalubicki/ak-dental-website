"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileSignature,
  Loader2,
  Copy,
  Download,
  Send,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// -----------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------

const TREATMENTS = [
  "Dental Implant Procedure",
  "Root Canal Treatment",
  "Tooth Extraction",
  "Dental Crown Placement",
  "Teeth Whitening",
  "Dental Veneers",
  "Orthodontic Treatment (Invisalign)",
  "Dental Bonding",
  "Gum Disease Treatment (Scaling & Root Planing)",
  "Dental Sedation / Anesthesia",
  "Wisdom Tooth Removal",
  "Dental Bridge Procedure",
  "Dental Filling (Composite/Amalgam)",
  "Dental Sealants",
  "Bone Grafting",
  "Sinus Lift Procedure",
  "TMJ Treatment",
  "Sleep Apnea / Night Guard",
  "Tooth Whitening (In-Office)",
  "Full Mouth Reconstruction",
] as const;

const STATES = [
  { value: "WI", label: "Wisconsin" },
  { value: "IL", label: "Illinois" },
  { value: "NV", label: "Nevada" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "CA", label: "California" },
] as const;

const CONSENT_ENGINE_URL =
  "https://consent-engine-nustack-digital-ventures-llc.vercel.app";

// -----------------------------------------------------------------------
// Zod schema
// -----------------------------------------------------------------------

const generateSchema = z.object({
  treatment: z.string().min(1, "Select a treatment"),
  state: z.string().min(1, "Select a state"),
  patientName: z.string().min(2, "Enter patient name"),
  clinicName: z.string().min(1, "Clinic name is required"),
});

const sendSchema = z.object({
  patientEmail: z.string().email("Enter a valid email address"),
});

type GenerateForm = z.infer<typeof generateSchema>;
type SendForm = z.infer<typeof sendSchema>;

// -----------------------------------------------------------------------
// Page component
// -----------------------------------------------------------------------

export default function GenerateConsentPage() {
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string>("");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastGeneratedValues, setLastGeneratedValues] =
    useState<GenerateForm | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // ---- Generate form ----
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      treatment: "",
      state: "WI",
      patientName: "",
      clinicName: "AK Ultimate Dental",
    },
  });

  // ---- Send form ----
  const {
    register: registerSend,
    handleSubmit: handleSubmitSend,
    formState: { errors: sendErrors },
    reset: resetSend,
  } = useForm<SendForm>({
    resolver: zodResolver(sendSchema),
    defaultValues: { patientEmail: "" },
  });

  const watchedValues = watch();

  // ---- Open/close dialog ----
  const openDialog = useCallback(() => {
    setShowSendDialog(true);
    setTimeout(() => {
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    }, 0);
  }, []);

  const closeDialog = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setShowSendDialog(false);
    resetSend();
  }, [resetSend]);

  // ---- Generate ----
  async function onGenerate(data: GenerateForm) {
    setIsGenerating(true);
    setGenerateError("");
    setGeneratedContent("");

    try {
      const res = await fetch(`${CONSENT_ENGINE_URL}/api/consent/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatment: data.treatment,
          state: data.state,
          patientName: data.patientName,
          clinicName: data.clinicName,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Generation failed");
      }

      const result = await res.json();
      const content: string =
        result.content ?? result.text ?? result.markdown ?? JSON.stringify(result, null, 2);
      setGeneratedContent(content);
      setLastGeneratedValues(data);
      toast.success("Consent form generated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setGenerateError(msg);
      toast.error("Failed to generate form");
    } finally {
      setIsGenerating(false);
    }
  }

  // ---- Copy ----
  function handleCopy() {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent).then(() => {
      toast.success("Copied to clipboard");
    });
  }

  // ---- Download DOCX ----
  async function handleDownload() {
    if (!generatedContent || !lastGeneratedValues) return;
    try {
      const res = await fetch(`${CONSENT_ENGINE_URL}/api/consent/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedContent,
          treatment: lastGeneratedValues.treatment,
          patientName: lastGeneratedValues.patientName,
          clinicName: lastGeneratedValues.clinicName,
        }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `consent-${lastGeneratedValues.patientName.replace(/\s+/g, "-").toLowerCase()}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      toast.error("Export failed — please try again");
    }
  }

  // ---- Send for Signature ----
  async function onSend(data: SendForm) {
    if (!lastGeneratedValues || !generatedContent) return;
    setIsSending(true);

    try {
      const res = await fetch(`${CONSENT_ENGINE_URL}/api/consent/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientEmail: data.patientEmail,
          patientName: lastGeneratedValues.patientName,
          senderName: lastGeneratedValues.clinicName,
          treatment: lastGeneratedValues.treatment,
          content: generatedContent,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Send failed");
      }

      toast.success(`Signing link sent to ${data.patientEmail}`);
      closeDialog();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send";
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  }

  const hasContent = generatedContent.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/consent-forms"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <FileSignature className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Generate Consent Form
            </h1>
            <p className="text-sm text-slate-500">
              AI-generated · State-compliant · E-signature ready
            </p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">
              Form Details
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Select the treatment and patient info to generate a state-specific
              consent form.
            </p>
          </div>

          <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
            {/* Treatment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Treatment / Procedure
              </label>
              <select
                {...register("treatment")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              >
                <option value="">Select a treatment...</option>
                {TREATMENTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.treatment && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.treatment.message}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                State
              </label>
              <select
                {...register("state")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              >
                {STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label} ({s.value})
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Patient Name
              </label>
              <input
                type="text"
                {...register("patientName")}
                placeholder="e.g. Sarah Mitchell"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
              {errors.patientName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.patientName.message}
                </p>
              )}
            </div>

            {/* Clinic Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Clinic Name
              </label>
              <input
                type="text"
                {...register("clinicName")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
              {errors.clinicName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.clinicName.message}
                </p>
              )}
            </div>

            {/* Generate button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileSignature className="h-4 w-4" />
                    Generate Consent Form
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Summary of what will be generated */}
          {(watchedValues.treatment || watchedValues.patientName) && (
            <div className="rounded-lg border border-cyan-100 bg-cyan-50/50 p-3 space-y-1">
              <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wide">
                Will Generate
              </p>
              {watchedValues.treatment && (
                <p className="text-sm text-slate-700">
                  <span className="text-slate-400">Procedure:</span>{" "}
                  {watchedValues.treatment}
                </p>
              )}
              {watchedValues.patientName && (
                <p className="text-sm text-slate-700">
                  <span className="text-slate-400">Patient:</span>{" "}
                  {watchedValues.patientName}
                </p>
              )}
              {watchedValues.state && (
                <p className="text-sm text-slate-700">
                  <span className="text-slate-400">State:</span>{" "}
                  {watchedValues.state}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden">
          {/* Preview header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Form Preview
              </h2>
              <p className="text-xs text-slate-400">
                {hasContent
                  ? "Edit the form before sending"
                  : "Generated form will appear here"}
              </p>
            </div>
            {hasContent && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Generated
              </span>
            )}
          </div>

          {/* Content area */}
          <div className="flex-1 p-6">
            {isGenerating ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                <p className="text-sm">Generating state-compliant form...</p>
                <p className="text-xs text-slate-300">
                  This usually takes 10–20 seconds
                </p>
              </div>
            ) : generateError ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Generation failed
                </p>
                <p className="text-xs text-slate-400 text-center max-w-xs">
                  {generateError}
                </p>
                <button
                  onClick={() => setGenerateError("")}
                  className="text-xs text-cyan-600 underline"
                >
                  Dismiss
                </button>
              </div>
            ) : hasContent ? (
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[480px] w-full resize-y rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 font-mono text-xs text-slate-700 leading-relaxed focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            ) : (
              <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-slate-300">
                <FileSignature className="h-12 w-12" />
                <p className="text-sm text-slate-400">
                  Fill in the form and click Generate
                </p>
              </div>
            )}
          </div>

          {/* Action row — shown after generation */}
          {hasContent && (
            <div className="flex items-center gap-2 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download DOCX
              </button>
              <button
                onClick={openDialog}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 transition-all shadow-sm"
              >
                <Send className="h-4 w-4" />
                Send for Signature
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Send for Signature Dialog */}
      {showSendDialog && (
        <dialog
          ref={dialogRef}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeDialog();
          }}
          className="fixed inset-0 z-[100] m-auto w-full max-w-md rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-black/50"
        >
          <div className="p-6">
            {/* Dialog header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                  <Send className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Send for Signature
                  </h3>
                  <p className="text-sm text-slate-500">
                    Patient will receive a secure signing link
                  </p>
                </div>
              </div>
              <button
                onClick={closeDialog}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSend(onSend)} className="space-y-4">
              {/* Sender info (read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Sender
                </label>
                <input
                  type="text"
                  value={lastGeneratedValues?.clinicName ?? "AK Ultimate Dental"}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Patient name (read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Patient
                </label>
                <input
                  type="text"
                  value={lastGeneratedValues?.patientName ?? ""}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Patient email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Patient Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...registerSend("patientEmail")}
                  placeholder="patient@email.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
                {sendErrors.patientEmail && (
                  <p className="mt-1 text-xs text-red-500">
                    {sendErrors.patientEmail.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Signing Link
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}
