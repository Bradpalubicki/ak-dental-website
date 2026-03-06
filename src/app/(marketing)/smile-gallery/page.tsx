import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";
import { createServiceSupabase } from "@/lib/supabase/server";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Before & After Smile Gallery | AK Ultimate Dental Las Vegas",
  description:
    "See real patient smile transformations at AK Ultimate Dental in Las Vegas, NV. Before and after photos for veneers, dental implants, teeth whitening, crowns, and full smile makeovers.",
  alternates: {
    canonical: `${siteConfig.url}/smile-gallery`,
  },
  openGraph: {
    title: "Smile Gallery — Before & After | AK Ultimate Dental Las Vegas",
    description:
      "Real smile transformations from AK Ultimate Dental in Las Vegas. Veneers, implants, whitening, crowns, and complete smile makeovers.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Smile gallery before and after AK Ultimate Dental Las Vegas",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function SmileGalleryPage() {
  const supabase = createServiceSupabase();
  const { data: photos } = await supabase
    .from("media_assets")
    .select("id, blob_url, service_category, before_or_after, pair_group_id, caption, ai_description, ai_quality, is_featured, story_headline, story_body, story_caption, story_treatment_summary")
    .eq("practice_id", "ak-ultimate-dental")
    .eq("status", "published")
    .eq("photo_type", "patient_result")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(200);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Smile Gallery", href: "/smile-gallery" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Before &amp; After
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Real Smiles. Real Results.
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Browse real patient transformations from AK Ultimate Dental in Las Vegas.
              From single veneers to complete smile makeovers — see what&apos;s possible.
            </p>
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
              <Link href="/appointment">
                Book a Free Smile Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* HIPAA Notice */}
      <section className="bg-amber-50 border-y border-amber-200 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3 text-amber-800">
            <Shield className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Patient Privacy:</strong> All photos are shared with written patient
              consent in accordance with HIPAA guidelines. Patient identifiers are removed.
              Results vary by individual case.
            </p>
          </div>
        </div>
      </section>

      {/* Client-side gallery with filters */}
      <GalleryClient photos={photos ?? []} />

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Could This Be Your Smile?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book a free cosmetic consultation with Dr. Chireau. We&apos;ll review your goals,
            show you relevant cases, and build a custom treatment plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
              <Link href="/appointment">
                Book Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
