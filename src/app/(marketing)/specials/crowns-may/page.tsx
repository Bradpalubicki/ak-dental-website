import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Star, CheckCircle, ArrowRight, Clock, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { MayCountdown } from "./may-countdown";

export const metadata: Metadata = {
  title: "May Grand Opening Rate — Dental Crowns in Las Vegas | AK Ultimate Dental",
  description:
    "Dr. Alex Chireau is accepting a limited number of new crown patients at our Grand Opening Rate — $1,500/crown vs. the standard $3,000. May only. 30 slots.",
  robots: { index: false, follow: false },
};

const beforeAfters = [
  {
    src: "/images/crowns-bridges/ba-full-smile-male-crowns.jpg",
    alt: "Before and after — full smile restored with porcelain crowns by Dr. Chireau",
  },
  {
    src: "/images/crowns-bridges/ba-upper-arch-full-crowns.jpg",
    alt: "Before and after — full upper arch porcelain crown restoration",
  },
  {
    src: "/images/crowns-bridges/ba-anterior-crowns-akdental.jpg",
    alt: "Before and after — anterior crown restoration — AK Ultimate Dental",
  },
  {
    src: "/images/crowns-bridges/ba-full-arch-worn-to-crowns.jpg",
    alt: "Before and after — severely worn teeth rebuilt with full arch crowns",
  },
  {
    src: "/images/crowns-bridges/ba-upper-anterior-crowns-1.jpg",
    alt: "Before and after — upper anterior porcelain crowns",
  },
  {
    src: "/images/crowns-bridges/ba-anterior-crowns-closeup.jpg",
    alt: "Before and after — anterior crowns closeup — Dr. Alex Chireau",
  },
];

const labShots = [
  {
    src: "/images/crowns-bridges/crown-model-upper-arch.jpg",
    alt: "Full upper arch ceramic crown model — lab precision",
  },
  {
    src: "/images/crowns-bridges/zirconia-crown-closeup.jpg",
    alt: "Zirconia crown closeup — custom-crafted for each patient",
  },
  {
    src: "/images/crowns-bridges/cerec-crown-model-frontal.jpg",
    alt: "CEREC same-day crown — AK Ultimate Dental Las Vegas",
  },
];

export default function CrownsMayPage() {
  return (
    <div className="min-h-screen bg-[#080f1a]">

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 py-2.5 px-4 text-center">
        <p className="text-sm font-bold text-black tracking-wide">
          GRAND OPENING RATE — MAY 2026 ONLY · 30 PATIENT SLOTS · EXPIRES MAY 31
        </p>
      </div>

      {/* ── NAV STRIP ───────────────────────────────────────── */}
      <div className="border-b border-white/10 py-4 px-6 flex items-center justify-between">
        <Image src="/ak-logo-gold.jpg" alt="AK Ultimate Dental" width={140} height={44} className="h-10 w-auto object-contain" />
        <a href={siteConfig.phoneHref} className="flex items-center gap-2 text-amber-400 font-semibold text-sm hover:text-amber-300 transition-colors">
          <Phone className="h-4 w-4" />
          {siteConfig.phone}
        </a>
      </div>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative px-4 pt-14 pb-10 md:pt-20 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — copy */}
            <div>
              {/* Stars */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-gray-300 text-sm">{siteConfig.ratings.count} Five-Star Reviews · Las Vegas</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                A{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  $3,000 Crown
                </span>
                <br />
                for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  $1,500.
                </span>
                <br />
                <span className="text-2xl md:text-3xl font-normal text-gray-300 mt-2 block">
                  Same doctor. Same CEREC technology. May only.
                </span>
              </h1>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Dr. Alex Chireau is one of Las Vegas&apos;s most sought-after cosmetic dentists.
                To mark our practice&apos;s growth, he&apos;s accepting <strong className="text-white">30 new patients</strong> at
                his Grand Opening Rate this May — then pricing returns to standard.
                This is not a discount practice. This is your window.
              </p>

              {/* Trust bullets */}
              <div className="space-y-2.5 mb-8">
                {[
                  "Same-day CEREC crowns — no temporaries, no second visit",
                  "Custom ceramic matched to your natural teeth",
                  "0% financing through Cherry, CareCredit & Sunbit",
                  "Price locks the day you book — not the day of your appointment",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black font-bold border-0">
                  <Link href="/appointment">
                    Claim My Slot — Book Free Consult
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-6 text-base border-white/30 text-white bg-white/5 hover:bg-white/10">
                  <a href={siteConfig.phoneHref}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call {siteConfig.phone}
                  </a>
                </Button>
              </div>

              <p className="text-gray-500 text-xs mt-3">
                *Grand Opening Rate is $1,500 per crown. Standard rate is $3,000 per crown.
                Rate applies to new patients who book a consultation in May 2026.
                Offer expires May 31, 2026 or when 30 slots are filled, whichever comes first.
              </p>
            </div>

            {/* RIGHT — hero before/after */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/20 border border-white/10 aspect-[4/5]">
                <Image
                  src="/images/crowns-bridges/ba-full-smile-male-crowns.jpg"
                  alt="Before and after — full smile crown restoration by Dr. Alex Chireau, AK Ultimate Dental Las Vegas"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-amber-400/30">
                    <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">Real Patient · @Dr.Chireu</p>
                    <p className="text-white text-sm font-medium">Full smile restoration — porcelain crowns</p>
                  </div>
                </div>
              </div>

              {/* Floating price badge */}
              <div className="absolute -top-4 -right-4 bg-amber-400 rounded-2xl px-4 py-3 shadow-xl shadow-amber-400/30 text-center">
                <p className="text-black text-xs font-bold uppercase tracking-wide">May Rate</p>
                <p className="text-black text-2xl font-black">$1,500</p>
                <p className="text-black/60 text-xs line-through">$3,000</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ───────────────────────────────────────── */}
      <section className="py-8 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-4 font-medium">Grand Opening Rate Ends</p>
          <MayCountdown />
          <p className="text-gray-500 text-xs mt-3">May 31, 2026 · 11:59 PM Pacific · or when 30 slots fill</p>
        </div>
      </section>

      {/* ── ABOUT DR. ALEX ──────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/dr-alex-headshot.jpg"
                  alt="Dr. Alex Chireau — AK Ultimate Dental, Las Vegas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Credential badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#0f1c2e] border border-amber-400/40 rounded-xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-white text-xs font-bold">UNLV School of Dental Medicine</p>
                    <p className="text-gray-400 text-xs">Doctor of Dental Medicine</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Meet Your Doctor</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                Dr. Alex Chireau
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-5">
                Dr. Chireau trained at the UNLV School of Dental Medicine and has built AK Ultimate Dental
                into one of Las Vegas&apos;s most trusted practices — with {siteConfig.ratings.count} five-star reviews
                and a reputation for transformations that other dentists refer out.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                His crown work is done with CEREC technology — meaning your permanent, custom-crafted
                ceramic crown is designed and milled right in the office. No temporaries. No lab wait.
                You leave with your final restoration the same day.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { stat: siteConfig.ratings.count + "+", label: "Five-Star Reviews" },
                  { stat: "Same Day", label: "CEREC Crowns" },
                  { stat: "30", label: "May Slots" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-amber-400 text-xl font-bold">{item.stat}</p>
                    <p className="text-gray-400 text-xs mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE WORK — B/A GRID ─────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">The Results</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Real Patients. No Filters.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every result below is Dr. Chireau&apos;s own clinical work. Before and after.
              Photographed in-office at AK Ultimate Dental.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {beforeAfters.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group shadow-lg">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs">Photos by Dr. Alex Chireau · @Dr.Chireu · Results may vary by patient</p>
          </div>
        </div>
      </section>

      {/* ── LAB QUALITY ─────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">The Craft</p>
              <h2 className="text-3xl font-bold text-white mb-5">
                Custom ceramic. Milled in-office.<br />Matched to your teeth.
              </h2>
              <p className="text-gray-300 leading-relaxed mb-5">
                These aren&apos;t off-the-shelf. Every crown Dr. Chireau places is designed digitally,
                using your exact tooth shape and bite, then milled from a solid block of premium dental
                ceramic. The result: a restoration that looks, fits, and feels like your natural tooth.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: "All-ceramic — no metal show-through at the gumline" },
                  { icon: Clock, text: "Single visit — final crown placed same day" },
                  { icon: CheckCircle, text: "Color-matched to your natural adjacent teeth" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {labShots.map((img, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden border border-white/10 shadow-lg ${i === 0 ? "col-span-3 aspect-video" : "aspect-square"}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING TRANSPARENCY ─────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Transparent Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            No surprises. No hidden fees.
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
            <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
              <div className="px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wide text-left">Procedure</div>
              <div className="px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wide text-center">Standard Rate</div>
              <div className="px-4 py-3 text-amber-400 text-xs font-semibold uppercase tracking-wide text-center">May Rate</div>
            </div>
            {[
              { procedure: "Porcelain Crown (single)", standard: "$3,000", may: "$1,500" },
              { procedure: "Consultation & X-ray", standard: "$0", may: "$0 — Free" },
              { procedure: "CEREC Digital Scan", standard: "Included", may: "Included" },
              { procedure: "Final Crown Placement", standard: "Included", may: "Included" },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                <div className="px-4 py-4 text-white text-sm text-left">{row.procedure}</div>
                <div className="px-4 py-4 text-gray-400 text-sm text-center line-through">{row.standard}</div>
                <div className="px-4 py-4 text-amber-400 text-sm font-semibold text-center">{row.may}</div>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            The Grand Opening Rate of $1,500/crown applies to new patients who book a consultation
            in May 2026. After May 31 — or when 30 slots are filled — pricing returns to the
            standard rate of $3,000/crown. Your rate locks the day you book your consultation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black font-bold border-0">
              <Link href="/appointment">
                Book Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-6 border-white/30 text-white bg-white/5 hover:bg-white/10">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-4 w-4" />
                {siteConfig.phone}
              </a>
            </Button>
          </div>

          <p className="text-gray-500 text-xs">
            0% financing available through Cherry · CareCredit · Sunbit.
            Over 80% of applicants approved in 60 seconds.
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold">AK Ultimate Dental</p>
            <p className="text-gray-500 text-sm">{siteConfig.address.full}</p>
          </div>
          <div className="flex items-center gap-6">
            <a href={siteConfig.phoneHref} className="text-amber-400 text-sm hover:text-amber-300 transition-colors font-medium">
              {siteConfig.phone}
            </a>
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-400 transition-colors">
              Main Site
            </Link>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-white/5">
          <p className="text-gray-600 text-xs text-center leading-relaxed">
            *Grand Opening Rate of $1,500/crown is available to new patients who schedule a consultation at
            AK Ultimate Dental in May 2026. This rate applies to porcelain dental crowns only.
            Standard rate is $3,000/crown and will apply after May 31, 2026 or when 30 patient slots are filled.
            Rate locks at time of consultation booking. Cannot be combined with insurance or other offers.
            Results vary by patient. Photos are real patients of Dr. Alex Chireau.
          </p>
        </div>
      </footer>

    </div>
  );
}
