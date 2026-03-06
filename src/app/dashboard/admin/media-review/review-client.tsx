"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Tag, MapPin, User, Shield, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Asset {
  id: string;
  practice_id: string;
  blob_url: string;
  pending_blob_url: string | null;
  ai_category: string | null;
  ai_description: string | null;
  ai_placement_suggestion: string | null;
  ai_tags: string[] | null;
  ai_contains_person: boolean | null;
  ai_quality: string | null;
  ai_quality_notes: string | null;
  photo_type: string | null;
  service_category: string | null;
  before_or_after: string | null;
  case_notes: string | null;
  caption: string | null;
  consent_confirmed: boolean;
  consent_confirmed_at: string | null;
  placement: string | null;
  created_at: string;
  story_headline: string | null;
  story_body: string | null;
  story_caption: string | null;
  story_treatment_summary: string | null;
}

const PLACEMENTS = [
  "smile_gallery", "homepage_hero", "team_page", "about_page",
  "services/cosmetic-dentistry", "services/dental-implants",
  "services/porcelain-veneers", "services/teeth-whitening", "other",
];

interface ReviewCardProps {
  asset: Asset;
  onDone: (id: string) => void;
}

function ReviewCard({ asset, onDone }: ReviewCardProps) {
  const [placement, setPlacement] = useState(asset.ai_placement_suggestion ?? "smile_gallery");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const imageUrl = asset.pending_blob_url || asset.blob_url;

  const approve = async () => {
    setLoading("approve");
    await fetch(`/api/media/${asset.id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placement }),
    });
    setLoading(null);
    onDone(asset.id);
  };

  const reject = async () => {
    if (!rejectReason.trim()) return;
    setLoading("reject");
    await fetch(`/api/media/${asset.id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: rejectReason }),
    });
    setLoading(null);
    onDone(asset.id);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Photo */}
      <div className="relative aspect-video bg-gray-100">
        <Image src={imageUrl} alt="Pending review" fill className="object-contain" />
      </div>

      <div className="p-4 space-y-4">
        {/* Practice + timestamp */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-semibold text-gray-700 uppercase tracking-wide">{asset.practice_id}</span>
          <span>{new Date(asset.created_at).toLocaleDateString()}</span>
        </div>

        {/* AI Analysis */}
        {asset.ai_description && (
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 space-y-1.5">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Claude Vision Analysis</p>
            <p className="text-sm text-blue-900">{asset.ai_description}</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {asset.ai_tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{tag}</span>
              ))}
            </div>
            {asset.ai_quality && (
              <p className="text-xs text-blue-600">
                Quality: <span className="font-medium capitalize">{asset.ai_quality}</span>
                {asset.ai_quality_notes && ` — ${asset.ai_quality_notes}`}
              </p>
            )}
          </div>
        )}

        {/* Client metadata */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {asset.photo_type && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Tag className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="capitalize">{asset.photo_type.replace(/_/g, " ")}</span>
            </div>
          )}
          {asset.service_category && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Star className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="capitalize">{asset.service_category}</span>
            </div>
          )}
          {asset.before_or_after && asset.before_or_after !== "na" && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="font-semibold uppercase text-xs">{asset.before_or_after}</span>
            </div>
          )}
          {asset.ai_contains_person && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Identifiable person</span>
            </div>
          )}
        </div>

        {/* Consent status */}
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm
          ${asset.consent_confirmed ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          <Shield className="h-4 w-4 flex-shrink-0" />
          {asset.consent_confirmed
            ? `Consent confirmed ${asset.consent_confirmed_at ? new Date(asset.consent_confirmed_at).toLocaleDateString() : ""}`
            : "⚠️ Consent NOT confirmed — reject this photo"}
        </div>

        {/* Case notes */}
        {asset.case_notes && (
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
            <span className="font-medium">Notes: </span>{asset.case_notes}
          </div>
        )}

        {/* AI Story Preview */}
        {(asset.story_headline || asset.story_body) && (
          <div className="rounded-lg border border-violet-100 bg-violet-50 p-3 space-y-1.5">
            <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">AI Story — shown on website</p>
            {asset.story_headline && (
              <p className="text-sm font-bold text-gray-900">{asset.story_headline}</p>
            )}
            {asset.story_body && (
              <p className="text-sm text-gray-700 leading-relaxed">{asset.story_body}</p>
            )}
            {asset.story_treatment_summary && (
              <p className="text-xs text-gray-500 italic">{asset.story_treatment_summary}</p>
            )}
          </div>
        )}

        {/* Placement selector */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
            <MapPin className="h-3.5 w-3.5" />
            Placement on site
          </label>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
          >
            {PLACEMENTS.map((p) => (
              <option key={p} value={p}>{p.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        {!showRejectForm ? (
          <div className="flex gap-2">
            <Button
              onClick={approve}
              disabled={!!loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading === "approve" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Approve & Publish
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRejectForm(true)}
              disabled={!!loading}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Textarea
              placeholder="Reason for rejection (shown to client)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRejectForm(false)} className="flex-1">Cancel</Button>
              <Button
                onClick={reject}
                disabled={!rejectReason.trim() || loading === "reject"}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {loading === "reject" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Rejection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ReviewClient({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);

  const handleDone = (id: string) => setAssets((prev) => prev.filter((a) => a.id !== id));

  if (assets.length === 0) {
    return (
      <div className="py-20 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-400" />
        <h2 className="text-xl font-semibold text-gray-900">All caught up!</h2>
        <p className="text-gray-500 mt-1">No photos pending review.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset) => (
        <ReviewCard key={asset.id} asset={asset} onDone={handleDone} />
      ))}
    </div>
  );
}
