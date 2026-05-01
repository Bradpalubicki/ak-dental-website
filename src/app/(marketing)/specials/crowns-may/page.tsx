import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Star, CheckCircle, ArrowRight, Shield, Award, Zap } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { MayCountdown } from "./may-countdown";

export const metadata: Metadata = {
  title: "May Grand Opening Rate — Dental Crowns Las Vegas | AK Ultimate Dental",
  description:
    "Dr. Alex Chireau is accepting 30 new crown patients at $1,500 — half the standard $3,000 rate. Same-day CEREC. May 2026 only. Book your free consultation.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "AK Ultimate Dental — Crown Grand Opening Rate",
    description: "30 slots. $1,500/crown. May only. Dr. Alex Chireau, Las Vegas.",
    images: [{ url: "/images/crowns-bridges/ba-full-smile-male-crowns.jpg", width: 1080, height: 1080 }],
  },
};

const beforeAfters = [
  { src: "/images/crowns-bridges/ba-full-smile-male-crowns.jpg",    alt: "Before and after full smile crown restoration — Dr. Chireau Las Vegas" },
  { src: "/images/crowns-bridges/ba-upper-arch-full-crowns.jpg",    alt: "Before and after full upper arch porcelain crowns" },
  { src: "/images/crowns-bridges/ba-anterior-crowns-akdental.jpg",  alt: "Before and after anterior crown restoration — AK Ultimate Dental" },
  { src: "/images/crowns-bridges/ba-full-arch-worn-to-crowns.jpg",  alt: "Before and after worn teeth rebuilt with porcelain crowns" },
  { src: "/images/crowns-bridges/ba-upper-anterior-crowns-1.jpg",   alt: "Before and after upper anterior porcelain crowns" },
  { src: "/images/crowns-bridges/ba-anterior-crowns-closeup.jpg",   alt: "Before and after anterior crown closeup — Dr. Alex Chireau" },
];

export default function CrownsMayPage() {
  return (
    <div className="min-h-screen" style={{ background: "#05090f", color: "#f0f0f0", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── URGENCY RIBBON ─────────────────────────────────── */}
      <div style={{ background: "linear-gradient(90deg, #b8860b 0%, #f5c842 50%, #b8860b 100%)" }} className="py-2.5 px-4 text-center">
        <p className="text-xs md:text-sm font-black text-black tracking-[0.12em] uppercase">
          ⚡ Grand Opening Rate — 30 Slots · May 2026 Only · Expires May 31
        </p>
      </div>

      {/* ── NAV ────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-5 md:px-10 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <Image
          src="/ak-logo-header.png"
          alt="AK Ultimate Dental"
          width={160}
          height={48}
          className="h-9 md:h-11 w-auto object-contain"
        />
        <a
          href={siteConfig.phoneHref}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all"
          style={{ background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.35)", color: "#f5c842" }}
        >
          <Phone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{siteConfig.phone}</span>
          <span className="sm:hidden">Call Now</span>
        </a>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative px-5 md:px-10 pt-10 pb-14 md:pt-16 md:pb-20 overflow-hidden">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "55%", height: "70%", background: "radial-gradient(ellipse, rgba(245,200,66,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50%", height: "60%", background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* LEFT */}
            <div>
              {/* Review badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-xs font-medium" style={{ color: "#c8c8c8" }}>{siteConfig.ratings.count} Five-Star Google Reviews</span>
              </div>

              {/* Headline */}
              <h1 className="font-black leading-[1.08] mb-5" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", letterSpacing: "-0.02em" }}>
                <span style={{ color: "#e8e8e8" }}>A Crown Worth</span>{" "}
                <br className="hidden sm:block" />
                <span style={{ background: "linear-gradient(135deg, #f5c842 0%, #e8a020 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  $3,000.
                </span>
                <br />
                <span style={{ color: "#e8e8e8" }}>Yours for</span>{" "}
                <span style={{ background: "linear-gradient(135deg, #f5c842 0%, #e8a020 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  $1,500.
                </span>
              </h1>

              <p className="text-base md:text-lg leading-relaxed mb-3" style={{ color: "#9aa5b4" }}>
                Dr. Alex Chireau is among Las Vegas&apos;s most trusted cosmetic dentists — 128 five-star reviews,
                CEREC same-day technology, and restorations that last decades.
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "#9aa5b4" }}>
                To mark this milestone in our practice, he&apos;s opening{" "}
                <strong style={{ color: "#f0f0f0" }}>30 slots at half price</strong> — this May only.
                Once they fill, pricing returns to standard. No exceptions.
              </p>

              {/* Bullets */}
              <div className="space-y-3 mb-9">
                {[
                  "Permanent CEREC crown designed, milled & placed same day — no temporaries",
                  "Custom all-ceramic matched to your natural teeth — no metal lines",
                  "Price locks the day you book your free consultation",
                  "0% financing — Cherry, CareCredit & Sunbit — 60-second approval",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.4)" }}>
                      <CheckCircle className="h-3 w-3" style={{ color: "#f5c842" }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: "#c0c8d0" }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/appointment"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-bold transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #f5c842 0%, #e8a020 100%)", color: "#000", boxShadow: "0 8px 32px rgba(245,200,66,0.35)" }}
                >
                  Claim My Slot — Free Consult
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#e0e0e0", background: "rgba(255,255,255,0.04)" }}
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.phone}
                </a>
              </div>

              <p className="text-xs mt-4 leading-relaxed" style={{ color: "#4a5568" }}>
                *$1,500/crown Grand Opening Rate. Standard rate $3,000/crown. New patients only.
                Expires May 31, 2026 or at 30 slots. Rate locks at consultation booking.
              </p>
            </div>

            {/* RIGHT — hero image */}
            <div className="relative mt-2 lg:mt-0">
              {/* Price badge */}
              <div className="absolute -top-3 -right-3 md:-top-5 md:-right-5 z-20 text-center rounded-2xl px-4 py-3 shadow-2xl" style={{ background: "linear-gradient(135deg, #f5c842 0%, #d4a017 100%)", boxShadow: "0 12px 40px rgba(245,200,66,0.4)" }}>
                <p className="text-black text-[10px] font-black uppercase tracking-widest">May Rate</p>
                <p className="text-black text-2xl md:text-3xl font-black leading-none">$1,500</p>
                <p className="text-black/50 text-xs line-through">$3,000</p>
              </div>

              {/* Main image */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(245,200,66,0.2)", boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)" }}>
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/images/crowns-bridges/ba-full-smile-male-crowns.jpg"
                    alt="Real patient before and after full smile crown restoration — Dr. Alex Chireau, AK Ultimate Dental Las Vegas"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,9,15,0.7) 0%, rgba(5,9,15,0.1) 50%, transparent 100%)" }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <div className="rounded-xl px-4 py-3" style={{ background: "rgba(5,9,15,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(245,200,66,0.2)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#f5c842" }}>Real Patient · @Dr.Chireu</p>
                    <p className="text-sm font-semibold text-white">Full smile restoration — custom porcelain crowns</p>
                  </div>
                </div>
              </div>

              {/* Slots remaining */}
              <div className="mt-3 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-medium" style={{ color: "#9aa5b4" }}>30 Grand Opening slots available · Las Vegas, NV</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ─────────────────────────────────────── */}
      <section className="py-10 md:py-12 px-5" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: "#f5c842" }}>Rate Expires In</p>
          <MayCountdown />
          <p className="text-xs mt-4" style={{ color: "#4a5568" }}>May 31, 2026 · 11:59 PM Pacific · or when 30 slots are filled</p>
        </div>
      </section>

      {/* ── 4-STAT STRIP ──────────────────────────────────── */}
      <section className="py-10 px-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
          {[
            { stat: "128", label: "Five-Star Reviews", icon: Star },
            { stat: "Same Day", label: "CEREC Crowns", icon: Zap },
            { stat: "30", label: "May Slots Only", icon: Shield },
            { stat: "0%", label: "Financing Available", icon: Award },
          ].map(({ stat, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-center" style={{ background: "#05090f" }}>
              <Icon className="h-5 w-5" style={{ color: "#f5c842" }} />
              <p className="text-2xl md:text-3xl font-black text-white">{stat}</p>
              <p className="text-xs" style={{ color: "#6b7280" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT DR. ALEX ─────────────────────────────────── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            <div className="order-2 md:order-1">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: "#f5c842" }}>Your Doctor</p>
              <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "#f0f0f0" }}>
                Dr. Alex Chireau,<br />
                <span style={{ color: "#9aa5b4", fontWeight: 700, fontSize: "0.65em" }}>DMD · AK Ultimate Dental</span>
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#9aa5b4" }}>
                Dr. Chireau trained at the UNLV School of Dental Medicine and built AK Ultimate Dental
                into one of Las Vegas&apos;s most trusted practices. His crown work is known for precision fit,
                natural aesthetics, and lasting results.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "#9aa5b4" }}>
                With CEREC technology, he designs and mills your permanent ceramic crown in-office.
                You walk in with a damaged tooth. You walk out with a final restoration — same day.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { stat: "128+", label: "Google Reviews" },
                  { stat: "UNLV", label: "Dental Medicine" },
                  { stat: "CEREC", label: "Same-Day Tech" },
                ].map(({ stat, label }) => (
                  <div key={label} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="font-black text-lg" style={{ color: "#f5c842" }}>{stat}</p>
                    <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 md:order-2">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[3/4]" style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
                <Image
                  src="/dr-alex-headshot.jpg"
                  alt="Dr. Alex Chireau — AK Ultimate Dental, Las Vegas, NV"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,9,15,0.5) 0%, transparent 60%)" }} />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "#0d1520", border: "1px solid rgba(245,200,66,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <Award className="h-5 w-5 flex-shrink-0" style={{ color: "#f5c842" }} />
                <div>
                  <p className="text-white text-xs font-bold">UNLV School of Dental Medicine</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>Doctor of Dental Medicine</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BEFORE & AFTER GALLERY ─────────────────────────── */}
      <section className="py-16 md:py-24 px-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: "#f5c842" }}>The Results</p>
            <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em", color: "#f0f0f0" }}>
              Real Patients. No Filters.
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "#9aa5b4" }}>
              Every photo below is Dr. Chireau&apos;s own clinical work — photographed in-office at AK Ultimate Dental.
              Before and after. Zero editing.
            </p>
          </div>

          {/* Gallery grid — 1 large + 5 smaller on mobile: 2-col; desktop: 3-col */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {beforeAfters.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden group ${i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""}`}
                style={{ borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: i === 0 ? "1/1" : "1/1", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,9,15,0.5) 0%, transparent 60%)", opacity: 0, transition: "opacity 0.3s" }} className="group-hover:opacity-100" />
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="rounded-lg px-3 py-2" style={{ background: "rgba(5,9,15,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(245,200,66,0.2)" }}>
                      <p className="text-xs font-bold" style={{ color: "#f5c842" }}>@Dr.Chireu · Real Patient</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-5" style={{ color: "#374151" }}>Photos by Dr. Alex Chireau · AK Ultimate Dental · Las Vegas, NV · Results may vary by patient</p>
        </div>
      </section>

      {/* ── CEREC QUALITY ──────────────────────────────────── */}
      <section className="py-16 md:py-24 px-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Lab images */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 overflow-hidden rounded-2xl aspect-video" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <Image src="/images/crowns-bridges/crown-model-upper-arch.jpg" alt="Full upper arch ceramic crown model — lab precision" fill className="object-cover" sizes="100vw" />
              </div>
              <div className="relative overflow-hidden rounded-xl aspect-square" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <Image src="/images/crowns-bridges/zirconia-crown-closeup.jpg" alt="Zirconia crown closeup — natural translucency" fill className="object-cover" sizes="50vw" />
              </div>
              <div className="relative overflow-hidden rounded-xl aspect-square" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <Image src="/images/crowns-bridges/cerec-crown-model-frontal.jpg" alt="CEREC crown model — same-day precision" fill className="object-cover" sizes="50vw" />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: "#f5c842" }}>The Craft</p>
              <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em", color: "#f0f0f0" }}>
                Custom ceramic.<br />Milled here. Same day.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "#9aa5b4" }}>
                Every crown is designed digitally using your exact tooth shape and bite, then milled
                from a solid block of premium ceramic — right in our office. No lab wait. No temporaries.
                The result is a restoration that looks, fits, and feels like your natural tooth.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: "Single visit", desc: "Scan, design, mill, and place — all in one appointment" },
                  { icon: Shield, title: "All-ceramic", desc: "No metal show-through at the gumline — ever" },
                  { icon: CheckCircle, title: "Color-matched", desc: "Shade-matched to your adjacent natural teeth" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.2)" }}>
                      <Icon className="h-5 w-5" style={{ color: "#f5c842" }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{title}</p>
                      <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: "#f5c842" }}>Transparent Pricing</p>
            <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", letterSpacing: "-0.02em", color: "#f0f0f0" }}>
              No surprises. No hidden fees.
            </h2>
          </div>

          <div className="rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
            {/* Header */}
            <div className="grid grid-cols-3 py-3 px-5" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6b7280" }}>Item</p>
              <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#6b7280" }}>Standard</p>
              <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#f5c842" }}>May Rate</p>
            </div>
            {[
              { item: "Porcelain Crown (per tooth)", standard: "$3,000", may: "$1,500" },
              { item: "Free Consultation & X-ray", standard: "$0", may: "$0" },
              { item: "CEREC Digital Scan", standard: "Included", may: "Included" },
              { item: "Crown Design & Milling", standard: "Included", may: "Included" },
              { item: "Final Placement & Polish", standard: "Included", may: "Included" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 items-center px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                <p className="text-sm font-medium text-white pr-2">{row.item}</p>
                <p className="text-sm text-center line-through" style={{ color: "#4a5568" }}>{row.standard}</p>
                <p className="text-sm font-bold text-center" style={{ color: "#f5c842" }}>{row.may}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.2)" }}>
            <p className="text-sm leading-relaxed text-center" style={{ color: "#c0c8d0" }}>
              The Grand Opening Rate of <strong className="text-white">$1,500/crown</strong> applies to new patients
              who book a consultation in May 2026. After May 31 — or when 30 slots fill —
              pricing returns to <strong className="text-white">$3,000/crown</strong>.{" "}
              <strong className="text-white">Your rate locks the day you book your consultation.</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              href="/appointment"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #f5c842 0%, #e8a020 100%)", color: "#000", boxShadow: "0 8px 32px rgba(245,200,66,0.35)" }}
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#e0e0e0", background: "rgba(255,255,255,0.04)" }}
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
          </div>
          <p className="text-xs text-center" style={{ color: "#374151" }}>
            0% financing available · Cherry · CareCredit · Sunbit · 80%+ approval rate
          </p>
        </div>
      </section>

      {/* ── FINAL CTA STRIP ────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "linear-gradient(135deg, rgba(245,200,66,0.07) 0%, rgba(5,9,15,0) 60%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em", color: "#f0f0f0" }}>
            30 slots. May 31 deadline.<br />
            <span style={{ background: "linear-gradient(135deg, #f5c842 0%, #e8a020 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Don&apos;t leave $1,500 on the table.
            </span>
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "#9aa5b4" }}>
            Your consultation is free. Your rate locks when you book.
            Same-day crown. Real results. Dr. Alex Chireau, Las Vegas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/appointment"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-10 py-5 text-lg font-black transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #f5c842 0%, #e8a020 100%)", color: "#000", boxShadow: "0 12px 48px rgba(245,200,66,0.4)" }}
            >
              Claim My Slot Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-5 text-lg font-semibold transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#e0e0e0", background: "rgba(255,255,255,0.05)" }}
            >
              <Phone className="h-5 w-5" />
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="px-5 py-8 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white font-semibold text-sm">AK Ultimate Dental</p>
            <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{siteConfig.address.full}</p>
          </div>
          <div className="flex items-center gap-5">
            <a href={siteConfig.phoneHref} className="text-sm font-semibold transition-colors" style={{ color: "#f5c842" }}>{siteConfig.phone}</a>
            <Link href="/" className="text-xs transition-colors" style={{ color: "#374151" }}>Main Site →</Link>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs text-center leading-relaxed" style={{ color: "#1f2937" }}>
            *Grand Opening Rate of $1,500/crown available to new patients who schedule a consultation at AK Ultimate Dental in May 2026.
            Applies to porcelain dental crowns only. Standard rate is $3,000/crown and applies after May 31, 2026 or when 30 patient slots are filled,
            whichever occurs first. Rate locks at time of consultation booking. Cannot be combined with insurance benefits or other promotional offers.
            Individual results may vary. Photos are real patients of Dr. Alex Chireau, DMD.
          </p>
        </div>
      </footer>

    </div>
  );
}
