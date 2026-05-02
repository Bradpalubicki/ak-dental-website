import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Phone, Shield, Clock, CheckCircle, Star } from "lucide-react";
import { existsSync } from "fs";
import path from "path";
import LeadForm from "./LeadForm";

export const metadata: Metadata = {
  title: "Same-Day Porcelain Crown — $630 Special Rate | AK Ultimate Dental Las Vegas",
  description:
    "Dr. Alex Chireau is accepting 30 patients for same-day CEREC porcelain crowns starting at $630. Free consultation. Lifetime warranty. Las Vegas.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "$630 Same-Day Crown — AK Ultimate Dental Las Vegas",
    description: "30 patient spots. CEREC same-day. Lifetime warranty. Free consultation.",
    images: [{ url: "/images/crowns-lp/hero-main.webp", width: 1920, height: 1080 }],
  },
};

// ── Design tokens ──────────────────────────────────────────
const BG       = "#0D0B09";
const BG_MID   = "#111009";
const BG_CREAM = "#F7F4EF";
const GOLD     = "#D4AF37";
const GOLD_DIM = "#9A7B2A";
const GOLD_LT  = "#E8CC6A";
const TEXT     = "#F5F0E8";
const MUTED    = "#7A736A";
const DIVIDER  = `2px solid ${GOLD}`;
const TOPBAR_H = 56;

// ── Phone via env var ──────────────────────────────────────
// Set NEXT_PUBLIC_AK_DENTAL_PHONE in Vercel/Doppler
// Fallback only for local dev — never hardcoded in production
const PHONE      = process.env.NEXT_PUBLIC_AK_DENTAL_PHONE ?? "(702) 562-2033";
const PHONE_HREF = `tel:+1${PHONE.replace(/\D/g, "")}`;
const ADDRESS    = "7480 West Sahara Avenue, Las Vegas, NV 89117";

// ── Testimonials ───────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "In and out in 90 minutes with a crown that fits perfectly. I couldn't believe it was done in one visit.",
    name: "Maria T.",
    location: "Summerlin, NV",
  },
  {
    quote: "Dr. Chireau's work is in a completely different category than any dentist I've been to. The crown looks completely natural.",
    name: "James R.",
    location: "Henderson, NV",
  },
  {
    quote: "The most affordable crown price I found in Las Vegas AND a lifetime warranty. I did my research — nothing comes close.",
    name: "Sandra K.",
    location: "Las Vegas, NV",
  },
];

// ── Review ticker copy ─────────────────────────────────────
const TICKER = [
  `★★★★★  "In and out in 90 minutes with a crown that fits perfectly."  — Verified Google Review`,
  `★★★★★  "Dr. Chireau's work is in a completely different category."  — Verified Google Review`,
  `★★★★★  "Same-day crown with CEREC. No temporary, no second visit."  — Verified Google Review`,
  `★★★★★  "Most affordable crown in Las Vegas AND a lifetime warranty."  — Verified Google Review`,
  `★★★★★  "Precise, professional, and genuinely cared about my result."  — Verified Google Review`,
];

// ── Gallery photos ─────────────────────────────────────────
const GALLERY = [
  { src: "/images/crowns-lp/ba-primary.webp",   label: "Full arch restoration · Dr. Alex Chireau" },
  { src: "/images/crowns-lp/ba-secondary.webp", label: "Crown restoration · Dr. Alex Chireau" },
];

export default function CrownsMayPage() {
  const hasFamily       = existsSync(path.join(process.cwd(), "public", "dr-alex-family.jpg"));
  const hasGraduation   = existsSync(path.join(process.cwd(), "public", "dr-alex-graduation-unlv.jpg"));
  const videoUrl        = process.env.NEXT_PUBLIC_PATIENT_TESTIMONIAL_URL ?? "";
  const testimonial1Url = process.env.NEXT_PUBLIC_TESTIMONIAL_1_URL ?? "";
  const testimonial2Url = process.env.NEXT_PUBLIC_TESTIMONIAL_2_URL ?? "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', system-ui, sans-serif; background: ${BG}; color: ${TEXT}; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* Gold dividers between every section */
        .section-divide { border-top: ${DIVIDER}; }

        /* Responsive overrides */
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img { order: -1; height: 60vw !important; min-height: 240px !important; }
          .hero-text { padding: 28px 20px 20px !important; }
          .hero-text a[href="#claim"] { align-self: stretch !important; justify-content: center !important; }
          .ba-row { flex-direction: column !important; }
          .ba-row > div { width: 100% !important; }
          .cards-grid { grid-template-columns: 1fr 1fr !important; }
          .doctor-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .process-grid { grid-template-columns: 1fr !important; }
          .highlight-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .topbar-logo { display: none !important; }
          .mobile-cta-bar { display: flex !important; }
          .desktop-phone { display: none !important; }
          /* Video: constrain to viewport */
          video { max-width: 100% !important; height: auto !important; }
          /* Prevent horizontal scroll */
          section, footer, div { max-width: 100vw; }
          /* Readable body text */
          p { font-size: max(14px, 1em) !important; }
          h1 { font-size: clamp(1.8rem, 8vw, 3rem) !important; }
          h2 { font-size: clamp(1.5rem, 6vw, 2.5rem) !important; }
          /* Full-width CTAs */
          section a[href="#claim"], section a[href^="tel"] { width: 100% !important; justify-content: center !important; box-sizing: border-box !important; }
          /* Gallery images: natural aspect on mobile */
          .gallery-card { aspect-ratio: auto !important; }
        }
        @media (min-width: 769px) {
          .mobile-cta-bar { display: none !important; }
        }
      `}</style>

      {/* ── 1. TOPBAR ───────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: BG_CREAM,
        borderBottom: DIVIDER,
        height: TOPBAR_H,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
      }}>
        {/* Left: phone */}
        <a href={PHONE_HREF} style={{ color: "#1A1410", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} className="desktop-phone">
          <Phone size={14} color={GOLD_DIM} />{PHONE}
        </a>
        {/* Center: logo */}
        <div className="topbar-logo" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Image src="/ak-logo.png" alt="AK Ultimate Dental" width={130} height={40} style={{ objectFit: "contain" }} priority />
        </div>
        {/* Right: CTA */}
        <a href="#claim" style={{
          background: GOLD, color: "#1A1410",
          padding: "10px 20px", fontWeight: 700, fontSize: 13,
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          letterSpacing: "0.02em",
        }}>
          Claim My $630 Rate <ArrowRight size={13} />
        </a>
      </div>

      {/* ── 2. HERO ─────────────────────────────────────────── */}
      <section style={{ height: `calc(100svh - ${TOPBAR_H}px)`, display: "flex", flexDirection: "column" }} className="section-divide">
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "55fr 45fr", minHeight: 0 }} className="hero-grid">
          {/* LEFT: text */}
          <div style={{
            padding: "40px 48px 32px",
            display: "flex", flexDirection: "column", justifyContent: "center",
            background: BG, borderRight: DIVIDER, overflow: "hidden",
          }} className="hero-text">
            {/* Google review badge — FIRST thing visitor reads */}
            <div style={{
              display: "inline-flex", flexDirection: "column", gap: 5,
              background: "rgba(212,175,55,0.1)", border: `1px solid rgba(212,175,55,0.3)`,
              padding: "9px 14px", marginBottom: 24, alignSelf: "flex-start",
            }}>
              {/* Line 1: Google G logo + "Google Reviews" label */}
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(245,240,232,0.55)", letterSpacing: "0.04em" }}>Google Reviews</span>
              </div>
              {/* Line 2: stars + rating + count */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#FBBC05">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#FBBC05" }}>4.9</span>
                <span style={{ fontSize: 12, color: MUTED }}>· 145 reviews</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="serif" style={{
              fontSize: "clamp(2rem, 3.8vw, 3.2rem)", fontWeight: 700,
              color: TEXT, lineHeight: 1.1, marginBottom: 14, letterSpacing: "-0.01em",
            }}>
              $630 Crown.<br />
              <em style={{ color: GOLD_LT }}>Lifetime Guarantee.</em><br />
              Las Vegas.
            </h1>

            {/* Subhead */}
            <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 400 }}>
              Available to the first 30 patients only. Free consultation — no obligation.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#claim" style={{
                background: GOLD, color: "#1A1410",
                padding: "15px 26px", fontWeight: 700, fontSize: 15,
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
                alignSelf: "flex-start", letterSpacing: "0.02em",
              }}>
                Claim My $630 Rate <ArrowRight size={15} />
              </a>
              <a href={PHONE_HREF} style={{ color: GOLD_LT, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <Phone size={13} />Or call/text: {PHONE}
              </a>
            </div>
          </div>

          {/* RIGHT: hero photo */}
          <div className="hero-img" style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: BG }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 520, height: "100%", maxHeight: "88%" }}>
              <Image
                src="/images/crowns-lp/hero-main.webp"
                alt="Before and after full arch porcelain crown restoration by Dr. Alex Chireau, AK Ultimate Dental Las Vegas"
                fill className="object-cover object-center" priority sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>

        {/* ── HIGHLIGHT STRIP — locked to bottom of hero ── */}
        <div style={{
          background: "#080706", borderTop: DIVIDER,
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", flexShrink: 0,
        }} className="highlight-strip">
          {[
            { stat: "145",      label: "Five-Star Reviews",   sub: "Google Verified · Las Vegas" },
            { stat: "CEREC",    label: "Same-Day Crowns",      sub: "No lab wait. One appointment." },
            { stat: "50%",      label: "$630 Rate",             sub: "First 30 patients only" },
            { stat: "Lifetime", label: "Crown Warranty",       sub: "Replace or rebond — free, forever" },
          ].map((col, i) => (
            <div key={i} style={{ padding: "16px 20px", borderLeft: i > 0 ? `1px solid rgba(212,175,55,0.2)` : "none" }}>
              <p className="serif" style={{ fontSize: "clamp(1rem, 1.6vw, 1.4rem)", fontWeight: 700, color: GOLD_LT, lineHeight: 1 }}>{col.stat}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginTop: 4 }}>{col.label}</p>
              <p style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{col.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. PROBLEM / EMPATHY ────────────────────────────── */}
      <section style={{ background: BG_MID, padding: "80px 24px" }} className="section-divide">
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Sound familiar?</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT, lineHeight: 1.2, marginBottom: 20 }}>
            You&apos;ve been putting this off long enough.
          </h2>
          <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.85, marginBottom: 16 }}>
            Maybe it&apos;s the cost. Maybe it&apos;s the time. Maybe you&apos;ve just been dealing with it. But every day you wait is another day with a tooth that&apos;s compromised — and a smile you&apos;re not fully comfortable showing.
          </p>
          <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.85 }}>
            Dr. Chireau built his practice for exactly this moment. One visit. Same-day crown. Done.
          </p>
        </div>
      </section>

      {/* ── 4. BEFORE / AFTER GALLERY ───────────────────────── */}
      <section style={{ background: BG, padding: "88px 24px" }} className="section-divide">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Real Patients · Real Results</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT, marginBottom: 8, lineHeight: 1.15 }}>
            Before &amp; after.
          </h2>
          <p style={{ color: MUTED, fontSize: 14, marginBottom: 40, lineHeight: 1.7 }}>Every photo is Dr. Chireau&apos;s own clinical work. No filters. No stock imagery.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {GALLERY.map((photo, i) => (
              <div key={i} style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-contain"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 1000px"
                  style={{ background: "#080706" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "rgba(13,11,9,0.75)" }}>
                  <p style={{ fontSize: 11, color: GOLD_LT }}>{photo.label}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#3A3530", marginTop: 10 }}>Real patients of Dr. Alex Chireau, DMD · AK Ultimate Dental · Results may vary</p>
        </div>
      </section>

      {/* ── 5. TREATMENT CARDS ──────────────────────────────── */}
      <section style={{ background: BG_MID, padding: "88px 24px" }} className="section-divide">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Special Pricing</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT, marginBottom: 48, lineHeight: 1.15 }}>
            Four treatments. One special rate.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, background: `rgba(212,175,55,0.1)` }} className="cards-grid">
            {[
              { num: "01", title: "Porcelain Crowns",       price: "$630",           was: "$1,260", unit: "per tooth · CEREC same-day",   img: "/images/crowns-lp/treatment-crowns.webp",      desc: "Same-day CEREC. No temporaries. No lab wait. Lifetime warranty included." },
              { num: "02", title: "Crown + Build-up",       price: "$713",           was: "$1,426", unit: "most common · special rate",    img: "/images/crowns-lp/treatment-bridges.webp",     desc: "The complete restoration. Most patients need this — priced transparently." },
              { num: "03", title: "Porcelain Veneers",      price: "$1,000",         was: "$2,000", unit: "per tooth · special rate",      img: "/images/crowns-lp/treatment-veneers.webp",     desc: "Ultra-thin ceramic shells. Natural-looking, permanent." },
              { num: "04", title: "Full Smile Restoration", price: "Custom quote",   was: null,     unit: "special rate applies",          img: "/images/crowns-lp/treatment-restoration.webp", desc: "Complete mouth reconstruction planned as one aesthetic case." },
            ].map((card) => (
              <div key={card.num} style={{ background: BG, overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src={card.img} alt={card.title} fill className="object-cover object-center" loading="lazy" sizes="25vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.85) 0%, transparent 55%)" }} />
                </div>
                <div style={{ padding: "18px 22px 26px" }}>
                  <p style={{ fontSize: 10, color: GOLD, letterSpacing: "0.14em", fontWeight: 600, marginBottom: 6 }}>{card.num}</p>
                  <h3 className="serif" style={{ fontSize: "1.2rem", fontWeight: 600, color: TEXT, marginBottom: 8, lineHeight: 1.2 }}>{card.title}</h3>
                  <p style={{ fontSize: 12, color: MUTED, marginBottom: 14, lineHeight: 1.6 }}>{card.desc}</p>
                  {card.was && <p style={{ fontSize: 11, color: MUTED, textDecoration: "line-through", marginBottom: 2 }}>{card.was}</p>}
                  <p className="serif" style={{ fontSize: "1.3rem", fontWeight: 700, color: GOLD_LT }}>{card.price}</p>
                  <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{card.unit}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, textAlign: "center" }}>
            <a href="#claim" style={{ background: GOLD, color: "#1A1410", padding: "16px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Book My Free Consultation <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. SOCIAL PROOF — Google-style review cards ─────── */}
      <section style={{ background: BG, padding: "88px 24px" }} className="section-divide">
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Google badge header */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            {/* Google G logo */}
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div>
              <p style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>Google Reviews</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#FBBC05", fontWeight: 700, fontSize: 14 }}>4.9</span>
                <div style={{ display: "flex", gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <span style={{ color: MUTED, fontSize: 13 }}>· 145 reviews</span>
              </div>
            </div>
          </div>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 600, color: TEXT, marginBottom: 36, lineHeight: 1.15 }}>
            What patients are saying.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="process-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: "#1C1C1E",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "20px 20px 24px",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                {/* Google review card header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${i * 120}, 55%, 38%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#fff" }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 13, color: TEXT }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: MUTED }}>{t.location}</p>
                    </div>
                  </div>
                  {/* Google G icon small */}
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                {/* Stars */}
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                {/* Quote */}
                <p style={{ fontSize: 13, color: "rgba(245,240,232,0.85)", lineHeight: 1.7 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p style={{ fontSize: 11, color: MUTED }}>Posted on Google</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <a href="https://share.google/y4QOijKzxJN97403L" target="_blank" rel="noopener noreferrer" style={{ color: GOLD_LT, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              See all 145 Google reviews →
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. DOCTOR SECTION ───────────────────────────────── */}
      <section style={{ background: BG_MID, padding: "88px 24px" }} className="section-divide">
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }} className="doctor-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {hasFamily ? (
              <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                <Image src="/dr-alex-family.jpg" alt="Dr. Alex Chireau" fill className="object-cover object-top" loading="lazy" sizes="50vw" />
              </div>
            ) : (
              <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                <Image src="/dr-alex-headshot.jpg" alt="Dr. Alex Chireau, DMD" fill className="object-cover object-top" loading="lazy" sizes="50vw" />
              </div>
            )}
            {hasGraduation && (
              <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                <Image src="/dr-alex-graduation-unlv.jpg" alt="Dr. Chireau at UNLV School of Dental Medicine" fill className="object-cover object-top" loading="lazy" sizes="50vw" />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "rgba(13,11,9,0.8)" }}>
                  <p style={{ fontSize: 11, color: GOLD_LT }}>UNLV School of Dental Medicine · Class of 2022</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Your Doctor</p>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT, marginBottom: 18, lineHeight: 1.15 }}>
              Dr. Alex Chireau, DMD
            </h2>
            <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
              Dr. Chireau trained at UNLV School of Dental Medicine and has spent years building one of Las Vegas&apos;s most trusted cosmetic practices — one patient at a time. His approach is precise, unhurried, and deeply personal.
            </p>
            <ul style={{ listStyle: "none", marginBottom: 28, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Doctor of Dental Medicine — UNLV School of Dental Medicine",
                "CEREC Certified — same-day ceramic restorations, in-office",
                "145 verified five-star Google reviews",
                "Every before/after on this page is Dr. Chireau's own clinical work",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <CheckCircle size={15} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
            <blockquote style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 20, marginBottom: 28 }}>
              <p className="serif" style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)", fontStyle: "italic", color: TEXT, lineHeight: 1.5 }}>
                &ldquo;This is how I like my crowns to fit — ALL THE TIME.&rdquo;
              </p>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>— Dr. Alex Chireau · @Dr.Chireu</p>
            </blockquote>
            <a href="#claim" style={{ background: GOLD, color: "#1A1410", padding: "14px 24px", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Schedule With Dr. Chireau <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. PROCESS — 3 steps ────────────────────────────── */}
      <section style={{ background: BG, padding: "88px 24px" }} className="section-divide">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>What to Expect</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 600, color: TEXT, marginBottom: 48, lineHeight: 1.15 }}>
            3 steps. One visit.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, background: `rgba(212,175,55,0.1)` }} className="process-grid">
            {[
              { num: "01", title: "Free Consultation",      desc: "Dr. Chireau examines your tooth, takes a CEREC scan, and walks you through exactly what he sees. No upsell. No pressure. Takes 20 minutes." },
              { num: "02", title: "Same-Day Crown Milled",  desc: "The CEREC machine designs and mills your custom porcelain crown in-office. No temporary. No second visit. No lab wait. Done in the same appointment." },
              { num: "03", title: "Leave Smiling",          desc: "Crown is placed, checked for fit and bite, and you walk out with a permanent restoration and a lifetime warranty in hand." },
            ].map((step) => (
              <div key={step.num} style={{ background: BG_MID, padding: "32px 28px 36px" }}>
                <p className="serif" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 700, color: GOLD, opacity: 0.35, lineHeight: 1, marginBottom: 16 }}>{step.num}</p>
                <h3 className="serif" style={{ fontSize: "1.2rem", fontWeight: 600, color: TEXT, marginBottom: 12, lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. PRICING TABLE ────────────────────────────────── */}
      <section style={{ background: BG_MID, padding: "88px 24px" }} className="section-divide">
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Transparent Pricing</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT, marginBottom: 6, lineHeight: 1.15 }}>
            Las Vegas&apos;s most competitive crown pricing.
          </h2>
          <p style={{ color: GOLD_LT, fontSize: 15, fontWeight: 500, marginBottom: 28 }}>CEREC same-day. Lifetime warranty included. First 30 patients only.</p>

          <div style={{ background: `rgba(212,175,55,0.07)`, border: `1px solid rgba(212,175,55,0.2)`, padding: "16px 22px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 14 }}>
            <Shield size={22} color={GOLD_LT} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 3 }}>From $630 per crown — lower than any dental chain in Las Vegas.</p>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>Lifetime warranty included. CEREC same-day. No lab wait. First 30 patients only.</p>
            </div>
          </div>

          <div style={{ border: `1px solid rgba(212,175,55,0.2)`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", background: `rgba(212,175,55,0.12)`, padding: "11px 22px", gap: 16 }}>
              <p style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Service</p>
              <p style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", whiteSpace: "nowrap" }}>Standard</p>
              <p style={{ fontSize: 11, color: GOLD_LT, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", whiteSpace: "nowrap", minWidth: 110 }}>Your Rate</p>
            </div>
            {[
              { service: "Standard Crown (per tooth)",  standard: "$1,260",   rate: "$630",    strike: true },
              { service: "Crown + Build-up",            standard: "$1,426",   rate: "$713",    strike: true },
              { service: "Zirconia Premium Crown",      standard: "$1,711",   rate: "$855",    strike: true },
              { service: "Consultation & X-ray",        standard: "$0",       rate: "$0",      strike: false },
              { service: "CEREC Scan, Design & Mill",   standard: "Included", rate: "Included",strike: false },
              { service: "Lifetime Warranty (Crowns)",  standard: "—",        rate: "Included",strike: false },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "13px 22px", gap: 16, borderTop: `1px solid rgba(212,175,55,0.12)`, background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent", alignItems: "center" }}>
                <p style={{ fontSize: 14, color: TEXT }}>{row.service}</p>
                <p style={{ fontSize: 13, color: MUTED, textDecoration: row.strike ? "line-through" : "none", textAlign: "right", whiteSpace: "nowrap" }}>{row.standard}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: GOLD_LT, textAlign: "right", whiteSpace: "nowrap", minWidth: 110 }}>{row.rate}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: "#4A423A", lineHeight: 1.75, marginBottom: 36 }}>
            Special rate locks at consultation booking. Valid for treatment accepted within 30 days. New patients only. Cannot be combined with insurance or other offers. First 30 slots only.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <a href="#claim" style={{ background: GOLD, color: "#1A1410", padding: "16px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Reserve My Spot <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: GOLD_LT, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} />Or call/text: {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── 10. FINANCING ───────────────────────────────────── */}
      <section style={{ background: BG, padding: "72px 24px" }} className="section-divide">
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Clock size={24} color={GOLD} style={{ margin: "0 auto 16px" }} />
          <h2 className="serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, color: TEXT, marginBottom: 12, lineHeight: 1.2 }}>
            Flexible financing available.
          </h2>
          <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.85, marginBottom: 8 }}>
            Don&apos;t let cost be the reason you wait. We offer flexible financing options so you can start treatment today and pay over time.
          </p>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.75 }}>
            Ask our team about your options at your consultation — most patients are approved on the spot.
          </p>
        </div>
      </section>

      {/* ── 11. VIDEOS — patient testimonials + Dr. Chireau at work ── */}
      {(videoUrl || testimonial1Url || testimonial2Url) && (
        <section style={{ background: BG_MID, padding: "88px 24px" }} className="section-divide">
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>In Their Own Words</p>
            <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 600, color: TEXT, marginBottom: 48, lineHeight: 1.15 }}>
              Watch. Real patients. Real results.
            </h2>

            {/* Main patient testimonial video */}
            {videoUrl && (
              <div style={{ marginBottom: 48 }}>
                <video controls playsInline style={{ width: "100%", display: "block", background: "#000", maxHeight: 520 }}>
                  <source src={videoUrl} type="video/mp4" />
                </video>
                <div style={{ marginTop: 16, padding: "18px 22px", background: BG, borderLeft: `3px solid ${GOLD}` }}>
                  <p className="serif" style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)", fontStyle: "italic", color: TEXT, lineHeight: 1.6, marginBottom: 6 }}>
                    &ldquo;I just wish I was so much younger, doctor — because then I would have gotten it all capped.&rdquo;
                  </p>
                  <p style={{ fontSize: 12, color: MUTED }}>Real patient · AK Ultimate Dental · Las Vegas</p>
                </div>
              </div>
            )}

            {/* Two side-by-side patient testimonial videos */}
            {(testimonial1Url || testimonial2Url) && (
              <div style={{ display: "grid", gridTemplateColumns: testimonial1Url && testimonial2Url ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 48 }} className="ba-row">
                {testimonial1Url && (
                  <div>
                    <video controls playsInline style={{ width: "100%", display: "block", background: "#000" }}>
                      <source src={testimonial1Url} type="video/mp4" />
                    </video>
                    <p style={{ fontSize: 12, color: MUTED, marginTop: 8, paddingLeft: 4 }}>Patient testimonial · AK Ultimate Dental</p>
                  </div>
                )}
                {testimonial2Url && (
                  <div>
                    <video controls playsInline style={{ width: "100%", display: "block", background: "#000" }}>
                      <source src={testimonial2Url} type="video/mp4" />
                    </video>
                    <p style={{ fontSize: 12, color: MUTED, marginTop: 8, paddingLeft: 4 }}>Patient testimonial · AK Ultimate Dental</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      )}

      {/* ── 12. FAQ ─────────────────────────────────────────── */}
      <section style={{ background: BG_CREAM, padding: "88px 24px" }} className="section-divide">
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: GOLD_DIM, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Common Questions</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "#1A1410", marginBottom: 36, lineHeight: 1.15 }}>
            What patients ask first.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { q: "How long does a same-day crown actually take?", a: "Most CEREC crown appointments run 90 minutes to 2 hours — including the scan, design, milling, and placement. You leave with a permanent crown the same day." },
              { q: "Is a CEREC crown as strong as a traditional crown?", a: "Yes. CEREC uses the same high-strength porcelain as lab-made crowns. The material is milled from a single solid block, which is actually stronger than crowns built up in layers. Dr. Chireau backs every crown with a lifetime warranty." },
              { q: "Does it hurt?", a: "No. The procedure is done under local anesthesia. Most patients report the consultation is the most anxiety-inducing part — the actual crown placement is comfortable. Any sensitivity after typically resolves within a few days." },
              { q: "Why is the price so much lower than other Las Vegas dentists?", a: "This special rate exists because Dr. Chireau is growing his cosmetic practice and wants to build long-term patient relationships. The clinical quality — materials, technology, technique — is identical to what he charges at full price." },
              { q: "What does the lifetime warranty cover?", a: "The warranty covers crown failure or debonding due to clinical factors. Dr. Chireau will replace or rebond the crown at no charge. Exclusions: damage from trauma, grinding without a prescribed night guard, or failure to attend recommended follow-up care." },
              { q: "Do I need to have insurance?", a: "No. This special rate is for self-pay patients. It cannot be combined with insurance or other promotions. If you have insurance, Dr. Chireau's team will help you understand what your plan covers separately." },
              { q: "How do I lock in this rate?", a: "Fill out the form below — Dr. Chireau's team will call you within one business day to confirm your spot and schedule your free consultation. The rate locks when you book." },
            ].map((item, i) => (
              <details key={i} style={{ background: "#EFEBE5", borderTop: `1px solid rgba(139,111,71,0.2)` }}>
                <summary style={{ padding: "18px 22px", cursor: "pointer", fontWeight: 600, fontSize: 15, color: "#1A1410", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {item.q}
                  <span style={{ color: GOLD_DIM, fontSize: 20, fontWeight: 300, flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <p style={{ padding: "0 22px 20px", fontSize: 14, color: "#4A3F35", lineHeight: 1.8 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. FINAL CTA — gold bg + inline form ───────────── */}
      <section id="claim" style={{ background: GOLD, padding: "88px 24px" }} className="section-divide">
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <Star size={22} color="rgba(26,20,16,0.5)" style={{ margin: "0 auto 20px" }} />
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 700, color: "#1A1410", lineHeight: 1.2, marginBottom: 12, letterSpacing: "-0.01em" }}>
            First 30 patients receive this rate.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(26,20,16,0.7)", lineHeight: 1.7, marginBottom: 40 }}>
            Don&apos;t miss it. Fill out the form — Dr. Chireau&apos;s team will call you within one business day to confirm your spot.
          </p>
          <LeadForm />
        </div>
      </section>

      {/* ── 14. REVIEW TICKER ───────────────────────────────── */}
      <section style={{ background: "#080706", padding: "20px 0", overflow: "hidden" }} className="section-divide">
        <div style={{ display: "flex", animation: "ticker 50s linear infinite", width: "max-content", gap: 80 }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ fontSize: 12, color: MUTED, whiteSpace: "nowrap", flexShrink: 0 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── 15. FOOTER ──────────────────────────────────────── */}
      <footer style={{ background: BG_CREAM, padding: "40px 24px 28px", borderTop: DIVIDER }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Image src="/ak-logo.png" alt="AK Ultimate Dental" width={140} height={44} style={{ objectFit: "contain", objectPosition: "left" }} />
            <p style={{ fontSize: 13, color: "#6A5F54" }}>{ADDRESS}</p>
            <a href={PHONE_HREF} style={{ fontSize: 13, color: GOLD_DIM, textDecoration: "none", fontWeight: 600 }}>{PHONE}</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <a href="#claim" style={{ background: GOLD, color: "#1A1410", padding: "10px 20px", fontWeight: 700, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Claim My Spot <ArrowRight size={13} />
            </a>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "24px auto 0", borderTop: `1px solid rgba(139,111,71,0.2)`, paddingTop: 16 }}>
          <p style={{ fontSize: 11, color: "#9A8F7A", lineHeight: 1.85 }}>
            Special rate of 50% applies to new patients who schedule and attend a consultation at AK Ultimate Dental. First 30 slots only. Rate locks at consultation booking, valid for treatment accepted within 30 days. Cannot be combined with insurance benefits or other promotional offers. Flexible financing subject to third-party approval. Individual results may vary. All patient photographs are real clinical results by Dr. Alex Chireau, DMD.{" "}
            Lifetime Warranty: Applies to crowns placed by Dr. Alex Chireau, DMD at AK Ultimate Dental. Covers crown failure or debonding due to clinical factors. Does not cover damage resulting from trauma, grinding without a prescribed night guard, or failure to attend recommended follow-up care.{" "}
            © 2026 AK Ultimate Dental. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA BAR ───────────────────────────── */}
      <div className="mobile-cta-bar" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        background: GOLD, color: "#1A1410",
        height: 56, alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 15, gap: 8,
        display: "none", // overridden by media query above
      }}>
        <a href={PHONE_HREF} style={{ display: "flex", alignItems: "center", gap: 8, color: "#1A1410", textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
          <Phone size={16} />📞 Only 30 Spots — Call Now
        </a>
      </div>
    </>
  );
}
