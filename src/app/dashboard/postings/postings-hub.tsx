"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Tag,
  Megaphone,
  Clock3,
  Globe,
  ChevronRight,
  CheckCircle,
  Hourglass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Asset {
  id: string;
  blob_url: string;
  status: string;
  photo_type: string | null;
  service_category: string | null;
  before_or_after: string | null;
  story_headline: string | null;
  created_at: string;
  published_at: string | null;
}

interface Props {
  published: Asset[];
  pending: Asset[];
  activeSpecials: number;
  activeAnnouncements: number;
}

const ACTIONS = [
  {
    href: "/dashboard/postings/before-after",
    icon: Camera,
    iconColor: "text-cyan-600",
    iconBg: "bg-cyan-50",
    title: "Post a Before & After",
    description: "Upload patient results and our AI writes the story. Goes live automatically once approved.",
    badge: null,
    badgeColor: "",
  },
  {
    href: "/dashboard/postings/specials",
    icon: Tag,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Special Offers",
    description: "Publish promotions to your Specials page. Set an expiry date and they remove themselves automatically.",
    badge: null,
    badgeColor: "",
  },
  {
    href: "/dashboard/postings/announcements",
    icon: Megaphone,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    title: "Announcements",
    description: "Add a temporary banner to the top of your website. Great for holiday hours, closures, or news.",
    badge: null,
    badgeColor: "",
  },
  {
    href: "/dashboard/postings/hours",
    icon: Clock3,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "Office Hours Override",
    description: "Set temporary hours for holidays or closures. Shown on your site with an optional banner.",
    badge: null,
    badgeColor: "",
  },
];

export function PostingsHub({ published, pending, activeSpecials, activeAnnouncements }: Props) {
  const totalLive = published.length;

  // Inject live counts into action cards so dashboard feels alive
  const ACTION_COUNTS: Record<string, string | null> = {
    "/dashboard/postings/specials": activeSpecials > 0 ? `${activeSpecials} live` : null,
    "/dashboard/postings/announcements": activeAnnouncements > 0 ? `${activeAnnouncements} live` : null,
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Website Postings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Control what appears on your website — photos, specials, announcements, and hours. All changes are reviewed before going live.
        </p>
      </div>

      {/* Status bar */}
      {(totalLive > 0 || pending.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {totalLive > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700">
              <Globe className="h-4 w-4" />
              {totalLive} photo{totalLive !== 1 ? "s" : ""} live on your site
            </div>
          )}
          {pending.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700">
              <Hourglass className="h-4 w-4" />
              {pending.length} pending AI review
            </div>
          )}
        </div>
      )}

      {/* Action cards — "What would you like to do?" */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">What would you like to do?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            const liveCount = ACTION_COUNTS[action.href];
            return (
              <Link key={action.href} href={action.href}>
                <div className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-cyan-300 hover:shadow-md cursor-pointer">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconBg}`}>
                    <Icon className={`h-5 w-5 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{action.title}</p>
                      {liveCount && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {liveCount}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-cyan-500 transition-colors self-center shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* What's currently live */}
      {published.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Currently on Your Website</h2>
            <Link href="/dashboard/postings/before-after" className="text-xs text-cyan-600 hover:underline font-medium">
              Manage all photos →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {published.slice(0, 12).map((a) => (
              <Link
                key={a.id}
                href="/dashboard/postings/before-after"
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 hover:border-cyan-400 transition-colors"
              >
                <Image src={a.blob_url} alt={a.story_headline ?? "Published photo"} fill className="object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute bottom-1 left-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 drop-shadow" />
                </div>
                {a.before_or_after && a.before_or_after !== "na" && (
                  <div className={`absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white ${a.before_or_after === "before" ? "bg-gray-700" : "bg-cyan-600"}`}>
                    {a.before_or_after.toUpperCase()}
                  </div>
                )}
              </Link>
            ))}
            {published.length > 12 && (
              <Link
                href="/dashboard/postings/before-after"
                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-400 hover:border-cyan-300 hover:text-cyan-600 transition-colors"
              >
                +{published.length - 12} more
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Pending review */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Being Reviewed by AI</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {pending.map((a) => (
              <div
                key={a.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-amber-200 bg-amber-50"
              >
                <Image src={a.blob_url} alt="Pending review" fill className="object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge className="bg-amber-400 text-amber-900 text-[9px] font-bold">Reviewing</Badge>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">Compliant photos go live automatically — usually within a few minutes.</p>
        </section>
      )}

      {/* Empty state */}
      {published.length === 0 && pending.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Globe className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h2 className="font-semibold text-gray-700">Nothing posted yet</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            Start by posting a before &amp; after photo. Our AI will write the story and publish it to your Smile Gallery automatically.
          </p>
        </div>
      )}
    </div>
  );
}
