"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, Clock, XCircle, Globe, Tag, Trash2, Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AssetCardProps {
  id: string;
  blobUrl: string;
  status: "pending" | "approved" | "rejected" | "published";
  photoType?: string | null;
  serviceCategory?: string | null;
  beforeOrAfter?: string | null;
  caption?: string | null;
  caseNotes?: string | null;
  placement?: string | null;
  aiCategory?: string | null;
  createdAt: string;
  rejectionReason?: string | null;
  onRemoved?: (id: string) => void;
}

const STATUS_CONFIG = {
  pending:   { icon: Clock,       color: "text-yellow-600 bg-yellow-50 border-yellow-200",  label: "Pending Review" },
  approved:  { icon: CheckCircle, color: "text-blue-600 bg-blue-50 border-blue-200",        label: "Approved" },
  rejected:  { icon: XCircle,     color: "text-red-600 bg-red-50 border-red-200",           label: "Rejected" },
  published: { icon: Globe,       color: "text-green-600 bg-green-50 border-green-200",     label: "Published" },
};

export function AssetCard({
  id,
  blobUrl,
  status,
  photoType,
  serviceCategory,
  beforeOrAfter,
  caption: initialCaption,
  placement,
  aiCategory,
  createdAt,
  rejectionReason,
  onRemoved,
}: AssetCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [saving, setSaving] = useState(false);
  const [label, setLabel] = useState(beforeOrAfter ?? "na");

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  const handleTakedown = async () => {
    setDeleting(true);
    await fetch(`/api/media/${id}/takedown`, { method: "POST" });
    onRemoved?.(id);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/media/${id}`, {
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
          <Image src={blobUrl} alt="Uploaded photo" fill className="object-cover" />
          {beforeOrAfter && beforeOrAfter !== "na" && (
            <div className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${beforeOrAfter === "before" ? "bg-gray-700" : "bg-cyan-600"}`}>
              {beforeOrAfter.toUpperCase()}
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
            <Icon className="h-3.5 w-3.5" />
            {cfg.label}
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            {(photoType || aiCategory) && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span className="capitalize">{photoType ?? aiCategory}</span>
                {serviceCategory && <span>· {serviceCategory}</span>}
              </div>
            )}
            {placement && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span className="capitalize">{placement.replace(/_/g, " ")}</span>
              </div>
            )}
            <div className="text-gray-400">{new Date(createdAt).toLocaleDateString()}</div>
          </div>

          {status === "rejected" && rejectionReason && (
            <p className="text-xs text-red-600 bg-red-50 rounded p-1.5">{rejectionReason}</p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-600 transition-colors"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
            <span className="text-gray-200">|</span>
            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                {status === "published" ? "Take down" : "Remove"}
              </button>
            ) : (
              <div className="flex gap-1.5 w-full">
                <Button size="sm" variant="outline" className="h-6 text-[11px] flex-1 px-1" onClick={() => setConfirming(false)} disabled={deleting}>
                  Cancel
                </Button>
                <Button size="sm" className="h-6 text-[11px] flex-1 px-1 bg-red-600 hover:bg-red-700" onClick={handleTakedown} disabled={deleting}>
                  {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Remove"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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
              <Image src={blobUrl} alt="Photo" fill className="object-cover" />
            </div>

            {photoType === "patient_result" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Before or After?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "before", label: "BEFORE" },
                    { value: "after",  label: "AFTER" },
                    { value: "na",     label: "Single" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLabel(opt.value)}
                      className={`rounded-lg border-2 py-1.5 text-xs font-semibold transition-colors
                        ${label === opt.value ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-600 hover:border-cyan-300"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Caption (optional)</label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for this photo..."
                rows={2}
              />
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
