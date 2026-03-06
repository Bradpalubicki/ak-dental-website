"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Photo {
  id: string;
  blob_url: string;
  service_category: string | null;
  before_or_after: string | null;
  caption: string | null;
  ai_description: string | null;
  ai_quality: string | null;
  is_featured: boolean | null;
  story_headline: string | null;
  story_body: string | null;
  story_caption: string | null;
  story_treatment_summary: string | null;
}

interface Props {
  photos: Photo[];
}

// ─── Category taxonomy (matches upload interview) ─────────────────────────────

const CATEGORIES = [
  { key: "all",                     label: "All Results" },
  { key: "smile_makeover",          label: "Smile Makeover" },
  { key: "full_mouth_reconstruction", label: "Full Mouth" },
  { key: "veneers",                 label: "Veneers" },
  { key: "all_on_4",                label: "All-on-4" },
  { key: "implants",                label: "Implants" },
  { key: "whitening",               label: "Whitening" },
  { key: "crowns_bonding",          label: "Crowns & Bonding" },
  { key: "gum_contouring",          label: "Gum Contouring" },
  { key: "invisalign_ortho",        label: "Orthodontics" },
];

// Maps a raw service_category string to one of our keys (fuzzy match)
function matchCategory(raw: string | null): string {
  if (!raw) return "other";
  const s = raw.toLowerCase();
  if (s.includes("full mouth") || s.includes("full_mouth") || s.includes("reconstruction")) return "full_mouth_reconstruction";
  if (s.includes("all on 4") || s.includes("all_on_4") || s.includes("full arch")) return "all_on_4";
  if (s.includes("smile makeover") || s.includes("smile_makeover") || s.includes("makeover")) return "smile_makeover";
  if (s.includes("veneer")) return "veneers";
  if (s.includes("implant")) return "implants";
  if (s.includes("whiten")) return "whitening";
  if (s.includes("crown") || s.includes("bond")) return "crowns_bonding";
  if (s.includes("gum") || s.includes("contouring")) return "gum_contouring";
  if (s.includes("ortho") || s.includes("invisalign") || s.includes("aligner")) return "invisalign_ortho";
  return "other";
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function GalleryCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const headline = photo.story_headline;
  const description = photo.story_body ?? photo.ai_description ?? photo.story_caption ?? photo.caption;
  const alt = headline ?? description ?? `Patient result — AK Ultimate Dental Las Vegas`;

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all duration-300 bg-white flex flex-col w-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={photo.blob_url}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {photo.before_or_after && photo.before_or_after !== "na" && (
          <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-sm ${photo.before_or_after === "before" ? "bg-gray-800" : "bg-cyan-600"}`}>
            {photo.before_or_after.toUpperCase()}
          </div>
        )}
        {photo.is_featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="h-3 w-3 fill-yellow-900" /> Featured
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-sm font-medium">View Case →</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {photo.service_category && (
          <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider capitalize">
            {photo.service_category.replace(/_/g, " ")}
          </p>
        )}
        {headline ? (
          <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">{headline}</h3>
        ) : description ? (
          <p className="text-sm font-semibold text-gray-800 line-clamp-2">{description}</p>
        ) : null}
        {headline && description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{description}</p>
        )}
        {photo.story_treatment_summary && (
          <p className="text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
            {photo.story_treatment_summary}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  const description = photo.story_body ?? photo.ai_description ?? photo.story_caption ?? photo.caption;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative aspect-[4/3]">
          <Image
            src={photo.blob_url}
            alt={photo.story_headline ?? "Patient result"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          {photo.before_or_after && photo.before_or_after !== "na" && (
            <div className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full text-white ${photo.before_or_after === "before" ? "bg-gray-800" : "bg-cyan-600"}`}>
              {photo.before_or_after.toUpperCase()}
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {photo.service_category && (
            <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
              {photo.service_category.replace(/_/g, " ")}
            </p>
          )}
          {photo.story_headline && (
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              {photo.story_headline}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          )}
          {photo.story_treatment_summary && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Treatment</p>
              <p className="text-sm text-gray-700">{photo.story_treatment_summary}</p>
            </div>
          )}
          <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
            <Link href="/appointment">
              Get a Result Like This
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Gallery ─────────────────────────────────────────────────────────────

export function GalleryClient({ photos }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [pairsOnly, setPairsOnly] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  // Only show categories that have at least one photo
  const categoriesWithPhotos = useMemo(() => {
    const counts: Record<string, number> = {};
    photos.forEach((p) => {
      const key = matchCategory(p.service_category);
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return CATEGORIES.filter((c) => c.key === "all" || (counts[c.key] ?? 0) > 0);
  }, [photos]);

  const filtered = useMemo(() => {
    let list = photos;
    if (activeCategory !== "all") {
      list = list.filter((p) => matchCategory(p.service_category) === activeCategory);
    }
    if (pairsOnly) {
      list = list.filter((p) => p.before_or_after === "before" || p.before_or_after === "after");
    }
    return list;
  }, [photos, activeCategory, pairsOnly]);

  if (photos.length === 0) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-500 text-lg">Patient photos coming soon — check back shortly.</p>
          <Button asChild className="mt-6">
            <Link href="/appointment">Book a Free Consultation</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      {lightboxPhoto && (
        <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* Filter bar */}
            <div className="space-y-4">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                {categoriesWithPhotos.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      activeCategory === cat.key
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Before/After toggle + count */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setPairsOnly((v) => !v)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${pairsOnly ? "bg-cyan-500" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${pairsOnly ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                  <span className="text-sm text-gray-600">Before &amp; after pairs only</span>
                </label>
                <p className="text-sm text-gray-400">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filtered.map((photo) => (
                  <GalleryCard
                    key={photo.id}
                    photo={photo}
                    onClick={() => setLightboxPhoto(photo)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-gray-500">No results in this category yet. Check back soon.</p>
                <button
                  onClick={() => { setActiveCategory("all"); setPairsOnly(false); }}
                  className="mt-3 text-sm text-cyan-600 hover:underline"
                >
                  Show all results
                </button>
              </div>
            )}

            {/* CTA nudge inline */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-cyan-900 p-8 text-white text-center">
              <p className="font-bold text-lg mb-1">See a result that inspires you?</p>
              <p className="text-slate-300 text-sm mb-4">Book a free consultation and we&apos;ll show you cases that match your specific goals.</p>
              <Button asChild className="bg-white text-slate-900 hover:bg-slate-100 border-0">
                <Link href="/appointment">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
