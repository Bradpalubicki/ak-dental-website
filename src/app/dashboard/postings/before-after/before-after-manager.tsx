"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera, CheckCircle, Clock, XCircle, Globe, Trash2,
  Loader2, Pencil, X, ChevronRight, AlertTriangle, Upload,
  Link2, Link2Off, SplitSquareHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Asset {
  id: string;
  blob_url: string;
  pending_blob_url: string | null;
  status: "pending" | "approved" | "rejected" | "published" | "archived";
  photo_type: string | null;
  service_category: string | null;
  before_or_after: string | null;
  pair_group_id: string | null;
  caption: string | null;
  case_notes: string | null;
  placement: string | null;
  ai_category: string | null;
  story_headline: string | null;
  story_treatment_summary: string | null;
  created_at: string;
  rejection_reason: string | null;
}

interface Props {
  initialAssets: Asset[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:   { icon: Clock,       color: "text-amber-600 bg-amber-50 border-amber-200",   label: "AI Review" },
  approved:  { icon: CheckCircle, color: "text-blue-600 bg-blue-50 border-blue-200",       label: "Approved" },
  rejected:  { icon: XCircle,     color: "text-red-600 bg-red-50 border-red-200",          label: "Needs Attention" },
  published: { icon: Globe,       color: "text-emerald-600 bg-emerald-50 border-emerald-200", label: "Live on Site" },
  archived:  { icon: Trash2,      color: "text-gray-400 bg-gray-50 border-gray-200",       label: "Archived" },
} as const;

const TREATMENT_CATEGORIES = [
  { value: "smile_makeover",           label: "Smile Makeover",           desc: "2+ procedures combined" },
  { value: "veneers",                  label: "Porcelain Veneers",        desc: "1–8+ cosmetic veneers" },
  { value: "full_mouth_reconstruction", label: "Full Mouth Reconstruction", desc: "Complete restoration" },
  { value: "implants",                 label: "Dental Implants",          desc: "Single or multiple teeth" },
  { value: "all_on_4",                 label: "All-on-4 / Full Arch",     desc: "Complete arch implants" },
  { value: "whitening",                label: "Teeth Whitening",          desc: "Color transformation" },
  { value: "crowns_bonding",           label: "Crowns & Bonding",         desc: "Chips, cracks, single tooth" },
  { value: "gum_contouring",           label: "Gum Contouring",           desc: "Gummy smile correction" },
  { value: "invisalign_ortho",         label: "Orthodontics",             desc: "Invisalign or aligners" },
  { value: "other",                    label: "Other",                    desc: "Something else" },
];

const BROUGHT_IN_OPTIONS = [
  "Embarrassed by their smile",
  "Hiding teeth in photos",
  "Avoiding smiling in social situations",
  "Pain or discomfort",
  "Missing tooth or teeth",
  "Wanted improvement before a big event",
  "Discoloration or staining",
  "Chip or crack",
  "Crooked or crowded teeth",
  "Gummy smile",
];

const AGE_GROUPS = ["Under 30", "30s", "40s", "50s", "60+"];
const GENDERS = ["Female", "Male", "Prefer not to say"];
const PATIENT_TYPES = ["New patient", "Existing patient", "Referred by another patient"];
const CONSULT_TIMELINES = ["Same day", "Within a week", "1–2 weeks"];
const TREATMENT_TIMELINES = ["Same day", "1 appointment", "2 appointments", "2–3 weeks", "4–6 weeks", "2–3 months", "4–6 months", "6+ months"];

// ─── Asset Card ──────────────────────────────────────────────────────────────

function AssetCard({ asset, onRemoved }: { asset: Asset; onRemoved: (id: string) => void }) {
  const [takedownStep, setTakedownStep] = useState<"idle" | "confirm" | "removing">("idle");
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(asset.caption ?? "");
  const [label, setLabel] = useState(asset.before_or_after ?? "na");
  const [saving, setSaving] = useState(false);

  const cfg = STATUS_CONFIG[asset.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const imageUrl = asset.pending_blob_url || asset.blob_url;

  const handleTakedown = async () => {
    setTakedownStep("removing");
    await fetch(`/api/media/${asset.id}/takedown`, { method: "POST" });
    onRemoved(asset.id);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption: caption || undefined, before_or_after: label }),
    });
    setSaving(false);
    setEditing(false);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-square bg-gray-100">
          <Image src={imageUrl} alt={asset.story_headline ?? "Patient result"} fill className="object-cover" />
          {asset.before_or_after && asset.before_or_after !== "na" && (
            <div className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow ${asset.before_or_after === "before" ? "bg-gray-700" : "bg-cyan-600"}`}>
              {asset.before_or_after.toUpperCase()}
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
          </div>

          {asset.story_headline && (
            <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{asset.story_headline}</p>
          )}

          {(asset.service_category || asset.ai_category) && (
            <p className="text-[11px] text-gray-500 capitalize">{asset.service_category ?? asset.ai_category}</p>
          )}

          {asset.status === "rejected" && asset.rejection_reason && (
            <p className="text-xs text-red-600 bg-red-50 rounded p-1.5">{asset.rejection_reason}</p>
          )}

          {asset.story_treatment_summary && (
            <p className="text-[11px] text-gray-400 border-t border-gray-100 pt-1.5 mt-1">{asset.story_treatment_summary}</p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-600 transition-colors">
              <Pencil className="h-3 w-3" /> Edit
            </button>
            <span className="text-gray-200">|</span>
            {takedownStep === "idle" && (
              <button
                onClick={() => setTakedownStep("confirm")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                {asset.status === "published" ? "Take Down" : "Remove"}
              </button>
            )}
            {takedownStep === "confirm" && (
              <div className="flex gap-1.5 w-full">
                <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1 px-1" onClick={() => setTakedownStep("idle")}>
                  Cancel
                </Button>
                <Button size="sm" className="h-6 text-[10px] flex-1 px-1 bg-red-600 hover:bg-red-700" onClick={handleTakedown}>
                  Confirm
                </Button>
              </div>
            )}
            {takedownStep === "removing" && (
              <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Takedown confirmation modal */}
      {takedownStep === "confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Remove this photo?</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This photo will be hidden from your website immediately. It will be stored securely for <strong>30 days</strong>, then permanently deleted. If you need it restored within 30 days, contact your NuStack team.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setTakedownStep("idle")}>
                Keep It
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleTakedown}>
                Yes, Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Edit Photo Details</h3>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <Image src={imageUrl} alt="Photo" fill className="object-cover" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Before or After?</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ value: "before", label: "BEFORE" }, { value: "after", label: "AFTER" }, { value: "na", label: "Single" }].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLabel(opt.value)}
                    className={`rounded-lg border-2 py-1.5 text-xs font-semibold transition-colors ${label === opt.value ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-600 hover:border-cyan-300"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Caption (optional)</label>
              <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption..." rows={2} maxLength={200} />
              <p className="text-right text-[10px] text-gray-400">{caption.length}/200</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Upload Interview ─────────────────────────────────────────────────────────

type UploadStep = "drop" | "treatment" | "interview" | "before_after" | "consent" | "done";

function UploadInterview({ onCancel, onDone }: { onCancel: () => void; onDone: () => void }) {
  const [step, setStep] = useState<UploadStep>("drop");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Treatment
  const [treatments, setTreatments] = useState<string[]>([]);
  const [otherTreatment, setOtherTreatment] = useState("");

  // Interview
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [patientType, setPatientType] = useState("");
  const [broughtIn, setBroughtIn] = useState<string[]>([]);
  const [broughtInOther, setBroughtInOther] = useState("");
  const [consultTimeline, setConsultTimeline] = useState("");
  const [treatmentTimeline, setTreatmentTimeline] = useState("");
  const [patientReaction, setPatientReaction] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  // Before/After + Consent
  const [beforeOrAfter, setBeforeOrAfter] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).slice(0, 10);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const toggleBroughtIn = (item: string) => {
    setBroughtIn((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]);
  };

  const toggleTreatment = (value: string) => {
    setTreatments((prev) => prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]);
  };

  const buildCaseNotes = () => {
    const parts: string[] = [];
    if (ageGroup) parts.push(`Patient: ${ageGroup}${gender ? `, ${gender}` : ""}${patientType ? `, ${patientType}` : ""}`);
    if (broughtIn.length) parts.push(`Reason for visit: ${[...broughtIn, broughtInOther].filter(Boolean).join("; ")}`);
    if (consultTimeline) parts.push(`Consultation: ${consultTimeline}`);
    if (treatmentTimeline) parts.push(`Treatment completed: ${treatmentTimeline}`);
    if (patientReaction) parts.push(`Patient reaction: "${patientReaction}"`);
    if (internalNotes) parts.push(`Additional notes: ${internalNotes}`);
    return parts.join("\n");
  };

  const handleUpload = async () => {
    setUploading(true);
    setError("");

    const serviceCategory = treatments
      .map((t) => {
        if (t === "other") return otherTreatment;
        return TREATMENT_CATEGORIES.find((c) => c.value === t)?.label ?? t;
      })
      .filter(Boolean)
      .join(", ");

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Upload failed"); setUploading(false); return; }

      const meta = {
        photo_type: "patient_result",
        consent_confirmed: consentConfirmed,
        consent_type: "written_on_file",
        service_category: serviceCategory,
        before_or_after: beforeOrAfter || "na",
        case_notes: buildCaseNotes() || undefined,
      };

      const metaRes = await fetch(`/api/media/${data.assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meta),
      });
      if (!metaRes.ok) {
        const metaData = await metaRes.json();
        setError(metaData.error || "Failed to save record");
        setUploading(false);
        return;
      }
    }

    setStep("done");
    setUploading(false);
  };

  const STEPS: UploadStep[] = ["drop", "treatment", "interview", "before_after", "consent"];
  const stepIdx = STEPS.indexOf(step);

  if (step === "done") {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-9 w-9 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Photos submitted!</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Our AI is reviewing and writing the story now. Compliant photos go live on your Smile Gallery automatically — usually within minutes.
        </p>
        <Button onClick={onDone}>Done</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        {["Photos", "Treatment", "Case Details", "Before/After", "Consent"].map((label, i) => (
          <span key={label} className={`flex items-center gap-1.5 ${i === stepIdx ? "text-cyan-600 font-semibold" : i < stepIdx ? "text-gray-700" : ""}`}>
            {label}
            {i < 4 && <ChevronRight className="h-3 w-3 text-gray-300" />}
          </span>
        ))}
      </div>

      {/* Step: Drop */}
      {step === "drop" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Upload Patient Photos</h3>
            <p className="text-sm text-gray-500">Select up to 10 before &amp; after photos. All will go through the same review questions.</p>
          </div>
          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-colors">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Click to select photos</span>
            <span className="text-xs text-gray-400">JPG, PNG, WEBP — up to 10 files</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button disabled={files.length === 0} onClick={() => setStep("treatment")} className="flex-1">
              Continue with {files.length || 0} photo{files.length !== 1 ? "s" : ""} →
            </Button>
          </div>
        </div>
      )}

      {/* Step: Treatment selection */}
      {step === "treatment" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">What treatment is shown?</h3>
            <p className="text-sm text-gray-500">Select all that apply. This determines which gallery filter your photo appears under.</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TREATMENT_CATEGORIES.map((cat) => {
              const selected = treatments.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleTreatment(cat.value)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors ${selected ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-cyan-300"}`}
                >
                  <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center ${selected ? "border-cyan-500 bg-cyan-500" : "border-gray-300"}`}>
                    {selected && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{cat.label}</p>
                    <p className="text-xs text-gray-500">{cat.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {treatments.includes("other") && (
            <input
              type="text"
              placeholder="Describe the treatment..."
              value={otherTreatment}
              onChange={(e) => setOtherTreatment(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              maxLength={80}
            />
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("drop")}>Back</Button>
            <Button disabled={treatments.length === 0 || (treatments.includes("other") && !otherTreatment.trim())} onClick={() => setStep("interview")} className="flex-1">
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step: Interview */}
      {step === "interview" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Tell us about this case</h3>
            <p className="text-sm text-gray-500">This helps our AI write a compelling story. Nothing here is shown publicly — all patient details are HIPAA-safe.</p>
          </div>

          {/* Patient profile */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Patient Profile (approximate)</label>
            <div>
              <p className="text-xs text-gray-500 mb-2">Age group</p>
              <div className="flex flex-wrap gap-2">
                {AGE_GROUPS.map((g) => (
                  <button key={g} type="button" onClick={() => setAgeGroup(g === ageGroup ? "" : g)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${ageGroup === g ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-600 hover:border-cyan-300"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Gender (optional)</p>
              <div className="flex flex-wrap gap-2">
                {GENDERS.map((g) => (
                  <button key={g} type="button" onClick={() => setGender(g === gender ? "" : g)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${gender === g ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-600 hover:border-cyan-300"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">This was a</p>
              <div className="flex flex-wrap gap-2">
                {PATIENT_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => setPatientType(t === patientType ? "" : t)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${patientType === t ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-600 hover:border-cyan-300"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* What brought them in */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">What brought them in?</label>
            <p className="text-xs text-gray-500">Select all that apply</p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {BROUGHT_IN_OPTIONS.map((opt) => {
                const selected = broughtIn.includes(opt);
                return (
                  <button key={opt} type="button" onClick={() => toggleBroughtIn(opt)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-left transition-colors ${selected ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-700 hover:border-cyan-300"}`}>
                    <span className={`h-3.5 w-3.5 shrink-0 rounded-sm border ${selected ? "bg-cyan-500 border-cyan-500" : "border-gray-300"}`} />
                    {opt}
                  </button>
                );
              })}
            </div>
            <input type="text" placeholder="Other reason..." value={broughtInOther} onChange={(e) => setBroughtInOther(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mt-1" maxLength={80} />
          </div>

          {/* Timeline */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Consultation timeline</label>
              <div className="flex flex-wrap gap-2">
                {CONSULT_TIMELINES.map((t) => (
                  <button key={t} type="button" onClick={() => setConsultTimeline(t === consultTimeline ? "" : t)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${consultTimeline === t ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-600 hover:border-cyan-300"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Treatment completed</label>
              <div className="flex flex-wrap gap-2">
                {TREATMENT_TIMELINES.map((t) => (
                  <button key={t} type="button" onClick={() => setTreatmentTimeline(t === treatmentTimeline ? "" : t)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${treatmentTimeline === t ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-600 hover:border-cyan-300"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient reaction */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">What did the patient say when they saw the result? <span className="font-normal text-gray-400">(optional)</span></label>
            <Textarea placeholder='e.g. "I cried. I finally feel like myself."' value={patientReaction} onChange={(e) => setPatientReaction(e.target.value)} rows={2} maxLength={200} />
            <p className="text-right text-[10px] text-gray-400">{patientReaction.length}/200</p>
          </div>

          {/* Internal notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Anything else the AI should know? <span className="font-normal text-gray-400">(internal only, never shown publicly)</span></label>
            <Textarea placeholder="Specific details, context, or anything that makes this case special..." value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={3} maxLength={500} />
            <p className="text-right text-[10px] text-gray-400">{internalNotes.length}/500</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("treatment")}>Back</Button>
            <Button onClick={() => setStep("before_after")} className="flex-1">Continue →</Button>
          </div>
        </div>
      )}

      {/* Step: Before/After */}
      {step === "before_after" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Is this a before or after photo?</h3>
            <p className="text-sm text-gray-500">Our AI will also verify this — if it disagrees, it will correct it automatically.</p>
          </div>
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "before", label: "BEFORE", sub: "Shows the problem" },
              { value: "after",  label: "AFTER",  sub: "Shows the result" },
              { value: "na",     label: "Single",  sub: "Standalone result" },
            ].map((opt) => (
              <button key={opt.value} type="button" onClick={() => setBeforeOrAfter(opt.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 text-center transition-colors ${beforeOrAfter === opt.value ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-cyan-300"}`}>
                <span className="text-sm font-bold text-gray-800">{opt.label}</span>
                <span className="text-xs text-gray-500">{opt.sub}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("interview")}>Back</Button>
            <Button disabled={!beforeOrAfter} onClick={() => setStep("consent")} className="flex-1">Continue →</Button>
          </div>
        </div>
      )}

      {/* Step: Consent */}
      {step === "consent" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Patient Consent Confirmation</h3>
            <p className="text-sm text-gray-500">Required by HIPAA before any patient photo can be published.</p>
          </div>
          <label className="flex items-start gap-3 rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:border-cyan-300 transition-colors">
            <input
              type="checkbox"
              checked={consentConfirmed}
              onChange={(e) => setConsentConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-cyan-600 accent-cyan-600"
            />
            <span className="text-sm text-gray-700">
              I confirm that written patient consent has been obtained for the use of these photos in marketing and on the practice website, in accordance with HIPAA Privacy Rule guidelines. The consent form is on file at the practice.
            </span>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("before_after")}>Back</Button>
            <Button disabled={!consentConfirmed || uploading} onClick={handleUpload} className="flex-1">
              {uploading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading {files.length} photo{files.length !== 1 ? "s" : ""}...</>
                : `Submit ${files.length} Photo${files.length !== 1 ? "s" : ""} →`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Manager ─────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { key: "all",       label: "All" },
  { key: "published", label: "Live on Site" },
  { key: "pending",   label: "In Review" },
  { key: "rejected",  label: "Needs Attention" },
  { key: "pairs",     label: "Pair Photos" },
];

// ─── Pair Mode ────────────────────────────────────────────────────────────────

function PairMode({ assets, onPaired }: { assets: Asset[]; onPaired: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [pairing, setPairing] = useState(false);

  const unpaired = assets.filter((a) => !a.pair_group_id && (a.before_or_after === "before" || a.before_or_after === "after" || a.before_or_after === "na" || !a.before_or_after));

  function toggleSelect(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]);
  }

  async function handlePair() {
    if (selected.length !== 2) return;
    setPairing(true);
    // Determine which is before/after by their label; if both same, use order of selection
    const a1 = assets.find((a) => a.id === selected[0])!;
    const a2 = assets.find((a) => a.id === selected[1])!;
    let beforeId = selected[0];
    let afterId = selected[1];
    if (a1.before_or_after === "after" || a2.before_or_after === "before") {
      beforeId = selected[1];
      afterId = selected[0];
    }
    await fetch("/api/media/pair", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ beforeId, afterId }) });
    setPairing(false);
    setSelected([]);
    onPaired();
  }

  async function handleUnpair(assetId: string) {
    await fetch("/api/media/pair", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId }) });
    onPaired();
  }

  const paired = assets.filter((a) => a.pair_group_id);
  const pairedGroups: Record<string, Asset[]> = {};
  paired.forEach((a) => {
    if (a.pair_group_id) {
      pairedGroups[a.pair_group_id] = pairedGroups[a.pair_group_id] ?? [];
      pairedGroups[a.pair_group_id].push(a);
    }
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
        <p className="font-semibold flex items-center gap-2"><SplitSquareHorizontal className="h-4 w-4" /> How pairing works</p>
        <p className="mt-1">Select a <strong>Before</strong> photo and an <strong>After</strong> photo, then click Pair. Paired photos show as a side-by-side comparison in your public Smile Gallery.</p>
      </div>

      {/* Existing pairs */}
      {Object.keys(pairedGroups).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Existing Pairs</h3>
          {Object.entries(pairedGroups).map(([groupId, group]) => {
            const before = group.find((a) => a.before_or_after === "before") ?? group[0];
            const after = group.find((a) => a.before_or_after === "after") ?? group[1];
            if (!before || !after) return null;
            return (
              <div key={groupId} className="flex items-center gap-3 rounded-xl border border-cyan-200 bg-white p-3">
                <div className="flex gap-2 flex-1 min-w-0">
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border">
                    <Image src={before.blob_url} alt="Before" fill className="object-cover" />
                    <div className="absolute bottom-1 left-1 bg-gray-800/80 text-white text-[8px] font-bold px-1 rounded">B</div>
                  </div>
                  <Link2 className="h-4 w-4 self-center text-cyan-500 shrink-0" />
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border">
                    <Image src={after.blob_url} alt="After" fill className="object-cover" />
                    <div className="absolute bottom-1 right-1 bg-cyan-600/80 text-white text-[8px] font-bold px-1 rounded">A</div>
                  </div>
                  <div className="ml-2 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{after.story_headline ?? before.service_category ?? "Paired case"}</p>
                    <p className="text-xs text-cyan-600 font-semibold">Linked pair — shows side by side in gallery</p>
                  </div>
                </div>
                <button onClick={() => handleUnpair(before.id)} className="shrink-0 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Unlink pair">
                  <Link2Off className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Select to pair */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Unpaired Photos <span className="text-gray-400 font-normal">({unpaired.length})</span>
          </h3>
          {selected.length === 2 && (
            <Button onClick={handlePair} disabled={pairing} size="sm" className="bg-cyan-600 hover:bg-cyan-700 border-0 text-white">
              {pairing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Link2 className="h-3 w-3 mr-1" />}
              Pair Selected ({selected.length}/2)
            </Button>
          )}
          {selected.length === 1 && (
            <p className="text-sm text-gray-500">Select 1 more photo to pair</p>
          )}
        </div>

        {unpaired.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">All photos are paired.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {unpaired.map((a) => {
              const isSelected = selected.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleSelect(a.id)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${isSelected ? "border-cyan-500 ring-2 ring-cyan-300 scale-95" : "border-gray-200 hover:border-cyan-300"}`}
                >
                  <Image src={a.blob_url} alt="" fill className="object-cover" />
                  {a.before_or_after && a.before_or_after !== "na" && (
                    <div className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${a.before_or_after === "before" ? "bg-gray-800" : "bg-cyan-600"}`}>
                      {a.before_or_after.toUpperCase()}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                      <div className="bg-cyan-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                        {selected.indexOf(a.id) + 1}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function BeforeAfterManager({ initialAssets }: Props) {
  const [assets, setAssets] = useState(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleRemoved = (id: string) => setAssets((prev) => prev.filter((a) => a.id !== id));

  const filtered = filter === "all" ? assets : assets.filter((a) => a.status === filter);
  const published = assets.filter((a) => a.status === "published").length;
  const pending = assets.filter((a) => a.status === "pending").length;
  const rejected = assets.filter((a) => a.status === "rejected").length;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/dashboard/postings" className="hover:text-cyan-600">Website Postings</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-800 font-medium">Before &amp; After Photos</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Before &amp; After Photos</h1>
          <div className="mt-2 flex flex-wrap gap-3">
            {published > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                <Globe className="h-3 w-3" /> {published} live
              </span>
            )}
            {pending > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <Clock className="h-3 w-3" /> {pending} reviewing
              </span>
            )}
            {rejected > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                <XCircle className="h-3 w-3" /> {rejected} need attention
              </span>
            )}
          </div>
        </div>
        <Button onClick={() => setUploading(true)} className="shrink-0">
          <Camera className="mr-2 h-4 w-4" />
          Add Photos
        </Button>
      </div>

      {/* Upload interview panel */}
      {uploading && (
        <div className="rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm">
          <UploadInterview
            onCancel={() => setUploading(false)}
            onDone={() => { setUploading(false); window.location.reload(); }}
          />
        </div>
      )}

      {/* Filter tabs */}
      {assets.length > 0 && (
        <div className="flex gap-1 border-b border-gray-200">
          {FILTER_TABS.map((tab) => {
            const count = tab.key === "all" ? assets.length
              : assets.filter((a) => a.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${filter === tab.key ? "border-cyan-500 text-cyan-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {tab.label}
                {count > 0 && <span className="ml-1.5 text-xs text-gray-400">({count})</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid or Pair Mode */}
      {filter === "pairs" ? (
        <PairMode assets={assets} onPaired={() => window.location.reload()} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((a) => (
            <AssetCard key={a.id} asset={a} onRemoved={handleRemoved} />
          ))}
        </div>
      ) : (
        !uploading && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <Camera className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <h2 className="font-semibold text-gray-700">
              {filter === "all" ? "No patient photos yet" : `No ${filter} photos`}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all" ? "Upload before & after cases to start building your Smile Gallery." : "Check back later."}
            </p>
            {filter === "all" && (
              <Button className="mt-4" onClick={() => setUploading(true)}>
                <Camera className="mr-2 h-4 w-4" /> Add Your First Photo
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
}
