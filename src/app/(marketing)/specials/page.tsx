import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, Clock, Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createServiceSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";
import { BreadcrumbSchema } from "@/components/schema/local-business";

export const metadata: Metadata = {
  title: "Dental Specials & Offers | AK Ultimate Dental Las Vegas",
  description:
    "Current dental specials and promotions at AK Ultimate Dental in Las Vegas, NV. New patient offers, cosmetic dentistry discounts, and limited-time promotions.",
  alternates: {
    canonical: `${siteConfig.url}/specials`,
  },
};

export const dynamic = "force-dynamic";

interface Special {
  id: string;
  title: string;
  description: string | null;
  fine_print: string | null;
  cta_label: string;
  cta_href: string;
  badge_text: string | null;
  discount_display: string | null;
  expires_at: string | null;
  is_featured: boolean;
}

function SpecialCard({ special, nowMs }: { special: Special; nowMs: number }) {
  const daysLeft = special.expires_at
    ? Math.ceil((new Date(special.expires_at).getTime() - nowMs) / 86400000)
    : null;

  return (
    <div className={`relative rounded-2xl border bg-white shadow-sm overflow-hidden transition-all hover:shadow-lg ${special.is_featured ? "border-amber-300 ring-2 ring-amber-200" : "border-gray-200"}`}>
      {special.is_featured && (
        <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-2 text-center">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center justify-center gap-1">
            <Star className="h-3 w-3 fill-amber-900" /> Featured Offer
          </p>
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {special.badge_text && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2.5 py-0.5">
                {special.badge_text}
              </span>
            )}
            {daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && (
              <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {daysLeft === 1 ? "Expires today" : `${daysLeft} days left`}
              </span>
            )}
          </div>

          {special.discount_display && (
            <p className="text-3xl font-extrabold text-amber-600">{special.discount_display}</p>
          )}
          <h2 className="text-xl font-bold text-gray-900">{special.title}</h2>
        </div>

        {special.description && (
          <p className="text-gray-600 leading-relaxed">{special.description}</p>
        )}

        <Button asChild className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-white font-semibold">
          <Link href={special.cta_href}>
            {special.cta_label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        {special.fine_print && (
          <p className="text-xs text-gray-400 leading-relaxed">{special.fine_print}</p>
        )}

        {special.expires_at && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Offer expires {new Date(special.expires_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function SpecialsPage() {
  const supabase = createServiceSupabase();
  const nowDate = new Date();
  const now = nowDate.toISOString();
  const nowMs = nowDate.getTime();

  const { data: specials } = await supabase
    .from("practice_specials")
    .select("id, title, description, fine_print, cta_label, cta_href, badge_text, discount_display, expires_at, is_featured")
    .eq("practice_id", "ak-ultimate-dental")
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const activeSpecials = specials ?? [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Specials", href: "/specials" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,rgba(251,191,36,0.3),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <span className="inline-block text-amber-400 font-semibold text-sm uppercase tracking-wider mb-4">
            Current Promotions
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dental Specials &amp; Offers
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
            Limited-time promotions on cosmetic dentistry, new patient exams, and more at AK Ultimate Dental in Las Vegas.
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-medium">
            <Tag className="h-4 w-4" />
            <span>{activeSpecials.length} active offer{activeSpecials.length !== 1 ? "s" : ""} available now</span>
          </div>
        </div>
      </section>

      {/* Specials grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">

            {activeSpecials.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSpecials.map((s) => (
                  <SpecialCard key={s.id} special={s} nowMs={nowMs} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                <Tag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h2 className="text-xl font-bold text-gray-700">No active specials right now</h2>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">Check back soon — we regularly run promotions on cosmetic dentistry and new patient services.</p>
                <Button asChild className="mt-6">
                  <Link href="/appointment">Book a Free Consultation</Link>
                </Button>
              </div>
            )}

            {/* Always-available CTA */}
            <div className="mt-12 rounded-2xl bg-gradient-to-r from-slate-800 to-cyan-900 p-8 md:p-10 text-white">
              <div className="md:flex items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Don&apos;t see what you&apos;re looking for?</h3>
                  <p className="text-slate-300">Call us — we often have unadvertised new patient pricing. Dr. Chireau does free consultations for cosmetic cases.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-0 shrink-0">
                  <Button asChild className="bg-white text-slate-900 hover:bg-slate-100 border-0">
                    <Link href="/appointment">Book Free Consult <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <a href={siteConfig.phoneHref}>
                      <Phone className="mr-2 h-4 w-4" /> {siteConfig.phone}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
