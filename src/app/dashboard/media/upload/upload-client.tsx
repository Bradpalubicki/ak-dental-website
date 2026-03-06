"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/dashboard/media/upload-dropzone";
import { ConsentCheckbox } from "@/components/dashboard/media/consent-checkbox";

type Step = "drop" | "type" | "consent" | "service" | "before_after" | "notes" | "done";
type PhotoType = "patient_result" | "office" | "team" | "equipment";

interface FileResult {
  assetId: string;
  blobUrl: string;
  fileName: string;
}

const SERVICE_CATEGORIES = [
  "Veneers", "Implants", "Whitening", "Crowns", "Smile Makeover",
  "Orthodontics / Invisalign", "Bonding", "Gum Contouring", "General / Other",
];

const OFFICE_TYPES = [
  { value: "exam_room", label: "Exam Room / Treatment Room" },
  { value: "reception", label: "Reception / Waiting Area" },
  { value: "exterior", label: "Office Exterior" },
  { value: "other", label: "Other" },
];

export function UploadClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("drop");
  const [photoType, setPhotoType] = useState<PhotoType | null>(null);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [beforeOrAfter, setBeforeOrAfter] = useState("");
  const [caseNotes, setCaseNotes] = useState("");
  const [caption, setCaption] = useState("");
  const [officeType, setOfficeType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<FileResult[]>([]);
  const [error, setError] = useState("");

  const uploadAll = async () => {
    setUploading(true);
    setError("");
    const out: FileResult[] = [];

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      // Save metadata
      const meta: Record<string, unknown> = {
        photo_type: photoType,
        caption: caption || undefined,
      };
      if (photoType === "patient_result") {
        meta.consent_confirmed = consentConfirmed;
        meta.consent_type = "written_on_file";
        meta.service_category = serviceCategories.map(s => s.toLowerCase().replace(/\s*\/.*/, "").trim()).join(", ");
        meta.before_or_after = beforeOrAfter || "na";
        meta.case_notes = caseNotes || undefined;
      } else {
        meta.service_category = officeType;
      }

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

      out.push({ assetId: data.assetId, blobUrl: data.blobUrl, fileName: file.name });
    }

    setResults(out);
    setStep("done");
    setUploading(false);
  };

  if (step === "done") {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-9 w-9 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">All Set!</h2>
        <p className="mt-2 text-gray-600">
          {results.length} photo{results.length !== 1 ? "s" : ""} uploaded. Our AI is reviewing them now — compliant photos go live automatically within minutes.
        </p>
        <Button className="mt-6" onClick={() => { setStep("drop"); setFiles([]); setPreviews([]); setResults([]); setPhotoType(null); setConsentConfirmed(false); setServiceCategories([]); setBeforeOrAfter(""); setCaseNotes(""); setCaption(""); setOfficeType(""); }}>
          Upload More Photos
        </Button>
        <Button variant="outline" className="mt-3 ml-3" asChild>
          <a href="/dashboard/media">View My Media</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {["drop", "type", photoType === "patient_result" ? "consent" : null, "notes"].filter(Boolean).map((s, i, arr) => (
          <span key={s} className={`flex items-center gap-2 ${step === s ? "font-semibold text-cyan-600" : ""}`}>
            {s === "drop" ? "Upload" : s === "type" ? "Photo Type" : s === "consent" ? "Consent" : "Details"}
            {i < arr.length - 1 && <ChevronRight className="h-3 w-3" />}
          </span>
        ))}
      </div>

      {/* Step: Drop */}
      {step === "drop" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Upload Photos</h2>
            <p className="text-sm text-gray-500">Select up to 10 photos. All will go through the same review questions.</p>
          </div>
          <UploadDropzone onFilesSelected={(f, urls) => { setFiles(f); setPreviews(urls); }} maxFiles={10} />
          <Button disabled={files.length === 0} onClick={() => setStep("type")} className="w-full">
            Continue with {files.length} photo{files.length !== 1 ? "s" : ""} →
          </Button>
        </div>
      )}

      {/* Step: Photo type */}
      {step === "type" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">What type of photos are these?</h2>
            <p className="text-sm text-gray-500">This helps us place them correctly on your site.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "patient_result", label: "Patient Result / Before & After", emoji: "😁" },
              { value: "office", label: "Office or Treatment Room", emoji: "🏥" },
              { value: "team", label: "Team Member / Staff", emoji: "👨‍⚕️" },
              { value: "equipment", label: "Equipment / Technology", emoji: "⚙️" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setPhotoType(opt.value as PhotoType); setStep(opt.value === "patient_result" ? "consent" : "service"); }}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-colors hover:border-cyan-400
                  ${photoType === opt.value ? "border-cyan-500 bg-cyan-50" : "border-gray-200 bg-white"}`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-sm font-medium text-gray-800">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Consent (patient only) */}
      {step === "consent" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Patient Consent Confirmation</h2>
            <p className="text-sm text-gray-500">Required before we can publish any patient photo.</p>
          </div>
          <ConsentCheckbox checked={consentConfirmed} onChange={setConsentConfirmed} />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("type")}>Back</Button>
            <Button disabled={!consentConfirmed} onClick={() => setStep("service")} className="flex-1">
              I Have Consent — Continue →
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Photos without confirmed consent will be rejected during review.
          </p>
        </div>
      )}

      {/* Step: Service / office details */}
      {step === "service" && (
        <div className="space-y-4">
          {photoType === "patient_result" ? (
            <>
              <div>
                <h2 className="text-lg font-semibold">What treatment or service is shown?</h2>
              </div>
              <p className="text-sm text-gray-500">Select all that apply.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const selected = serviceCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setServiceCategories(prev =>
                        selected ? prev.filter(s => s !== cat) : [...prev, cat]
                      )}
                      className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors
                        ${selected ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-700 hover:border-cyan-300"}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("consent")}>Back</Button>
                <Button disabled={serviceCategories.length === 0} onClick={() => setStep("before_after")} className="flex-1">
                  Continue →
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-semibold">What does this photo show?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(photoType === "team"
                  ? [{ value: "team_member", label: "Team Member" }, { value: "group_photo", label: "Group / Team Photo" }]
                  : photoType === "equipment"
                  ? [{ value: "cerec", label: "CEREC / CAD-CAM" }, { value: "cbct", label: "CBCT / 3D Imaging" }, { value: "laser", label: "Laser Dentistry" }, { value: "other_equipment", label: "Other Equipment" }]
                  : OFFICE_TYPES
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOfficeType(opt.value)}
                    className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium text-center transition-colors
                      ${officeType === opt.value ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-700 hover:border-cyan-300"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Caption (optional)</label>
                <Textarea
                  placeholder="e.g. Our state-of-the-art exam room..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("type")}>Back</Button>
                <Button onClick={uploadAll} disabled={uploading || !officeType} className="flex-1">
                  {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</> : "Submit Photos →"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step: Before/After (patient only) */}
      {step === "before_after" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Is this a before or after photo?</h2>
          </div>
          {/* Photo previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "before", label: "BEFORE", emoji: "◀️" },
              { value: "after", label: "AFTER", emoji: "▶️" },
              { value: "na", label: "Single Result", emoji: "📸" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setBeforeOrAfter(opt.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-colors hover:border-cyan-400
                  ${beforeOrAfter === opt.value ? "border-cyan-500 bg-cyan-50" : "border-gray-200 bg-white"}`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-sm font-semibold">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("service")}>Back</Button>
            <Button disabled={!beforeOrAfter} onClick={() => setStep("notes")} className="flex-1">
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step: Notes (patient only) */}
      {step === "notes" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Any notes about this case?</h2>
            <p className="text-sm text-gray-500">Internal only — patients will never see these notes.</p>
          </div>
          <Textarea
            placeholder="e.g. Full smile makeover, 6 upper veneers + whitening. Patient is a referral from Dr. Smith."
            value={caseNotes}
            onChange={(e) => setCaseNotes(e.target.value)}
            rows={4}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("before_after")}>Back</Button>
            <Button onClick={uploadAll} disabled={uploading} className="flex-1">
              {uploading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading {files.length} photo{files.length !== 1 ? "s" : ""}...</>
                : `Submit ${files.length} Photo${files.length !== 1 ? "s" : ""} →`}
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            We&apos;ll review and publish within 24 hours. You&apos;ll be notified when it&apos;s live.
          </p>
        </div>
      )}
    </div>
  );
}
