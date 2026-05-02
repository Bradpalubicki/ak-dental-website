import Image from "next/image";
import { ArrowRight, Phone, CheckCircle, Shield, Clock, Star } from "lucide-react";
import { existsSync } from "fs";
import path from "path";
import FaqAccordion from "./FaqAccordion";

// ── Phone: use 562-2033 (canonical public number — Google/Yelp/YouTube)
// ── Header phone: pending Brad confirming with Alex which number reaches him
const PHONE = "(702) 562-2033";
const PHONE_HREF = "tel:+17025622033";
const ADDRESS = "7480 West Sahara Avenue, Las Vegas, NV 89117";
const HOURS = "Mon–Thu 8am–5pm";

const BG_DARK = "#0D0B09";
const BG_MID = "#111009";
const BG_CREAM = "#F7F4EF";
const ACCENT = "#8B6F47";
const ACCENT_LIGHT = "#C4A882";
const TEXT_DARK = "#F0EAE0";
const TEXT_MUTED = "#7A736A";
const DIVIDER = "1px solid rgba(196,168,130,0.25)";

const TOPBAR_H = 52; // px — used to compute 100svh lock

const REVIEWS = [
  `⭐⭐⭐⭐⭐  "In and out in 90 minutes with a crown that fits perfectly."  — Verified Google Review · Las Vegas`,
  `⭐⭐⭐⭐⭐  "Dr. Chireau's work is in a completely different category than any dentist I've been to."  — Verified Google Review · Las Vegas`,
  `⭐⭐⭐⭐⭐  "Same-day crown with CEREC. No temporary, no second visit. Absolutely incredible."  — Verified Google Review · Las Vegas`,
  `⭐⭐⭐⭐⭐  "The most affordable crown price AND a lifetime warranty. Couldn't believe it."  — Verified Google Review · Las Vegas`,
  `⭐⭐⭐⭐⭐  "Precise, professional, and genuinely cared about my result. 145 reviews for a reason."  — Verified Google Review · Las Vegas`,
];

export default function CrownsMayV5Page() {
  const hasFamilyPhoto = existsSync(path.join(process.cwd(), "public", "dr-alex-family.jpg"));
  const hasGraduationPhoto = existsSync(path.join(process.cwd(), "public", "dr-alex-graduation-unlv.jpg"));
  const testimonialVideoUrl = process.env.NEXT_PUBLIC_PATIENT_TESTIMONIAL_URL ?? "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', system-ui, sans-serif; background: ${BG_DARK}; color: ${TEXT_DARK}; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img-col { order: -1; height: 55vw !important; min-height: 260px !important; flex: none !important; }
          .hero-text-col { padding: 28px 20px 24px !important; }
          .doctor-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .gallery-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .treatment-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .topbar-logo { display: none !important; }
          .highlight-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .financing-grid { grid-template-columns: 1fr !important; }
          .ba-split { flex-direction: column !important; }
          .ba-split > div { width: 100% !important; height: 280px !important; }
        }
      `}</style>

      {/* ── STICKY TOP BAR ─────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: BG_DARK, borderBottom: DIVIDER, padding: "10px 24px", height: TOPBAR_H, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontWeight: 500, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={14} />{PHONE} · Call or Text
        </a>
        <div className="topbar-logo" style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/ak-logo.png" alt="AK Ultimate Dental" width={140} height={44} style={{ objectFit: "contain", filter: "brightness(1.05)" }} priority />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "9px 20px", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.03em" }}>
            Claim My Slot <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* ── HERO — locked to 100svh minus topbar ──────── */}
      <section style={{ height: `calc(100svh - ${TOPBAR_H}px)`, display: "flex", flexDirection: "column", borderBottom: DIVIDER }}>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 0 }} className="hero-grid">
          {/* LEFT: text */}
          <div style={{ padding: "48px 48px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: BG_DARK, borderRight: DIVIDER, overflow: "hidden" }} className="hero-text-col">
            <div>
              <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18, fontWeight: 500 }}>
                May 2026 · First 20 Patients Only · Las Vegas
              </p>
              <h1 className="serif" style={{ fontSize: "clamp(2rem, 3.8vw, 3.4rem)", fontWeight: 600, lineHeight: 1.1, color: TEXT_DARK, marginBottom: 18, letterSpacing: "-0.01em" }}>
                The smile you&apos;ve<br />considered.<br />
                <em style={{ color: ACCENT_LIGHT }}>Finally done right.</em>
              </h1>
              <p style={{ color: TEXT_MUTED, fontSize: 14, lineHeight: 1.75, marginBottom: 24, maxWidth: 420 }}>
                Dr. Alex Chireau is personally accepting 20 new cosmetic cases this May — crowns, bridges, veneers, and full smile restorations — at a founding patient rate that closes permanently when slots fill.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                <a href="#consult" id="consult" style={{ background: ACCENT, color: "#fff", padding: "14px 24px", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", letterSpacing: "0.02em" }}>
                  Claim My Founding Patient Rate <ArrowRight size={15} />
                </a>
                <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={13} />{PHONE} · Call or Text Now
                </a>
              </div>
            </div>
            {/* Trust bullets — flush bottom */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", paddingTop: 16, borderTop: DIVIDER }}>
              {["145 Five-Star Reviews", "CEREC Same-Day Crown", "UNLV DMD Trained", "Lifetime Warranty Included"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={11} style={{ color: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* RIGHT: hero photo */}
          <div className="hero-img-col" style={{ position: "relative", overflow: "hidden" }}>
            <Image
              src="/images/crowns-lp/hero-main.webp"
              alt="Before and after full arch porcelain crown restoration by Dr. Alex Chireau, AK Ultimate Dental Las Vegas"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* ── HIGHLIGHT STRIP — flush bottom of hero ── */}
        <div style={{ background: "#0A0806", borderTop: DIVIDER, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", flexShrink: 0 }} className="highlight-strip">
          {[
            { stat: "145", label: "Five-Star Google Reviews", sub: "Verified · Las Vegas" },
            { stat: "CEREC", label: "Same-Day Crowns", sub: "No lab. Done in one visit." },
            { stat: "50%", label: "Off Standard Rate", sub: "First 20 patients only" },
            { stat: "Lifetime", label: "Crown Warranty", sub: "Replace or rebond — free, forever" },
          ].map((col, i) => (
            <div key={i} style={{ padding: "16px 20px", borderLeft: i > 0 ? DIVIDER : "none", display: "flex", flexDirection: "column", gap: 2 }}>
              <p style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.35rem)", fontWeight: 700, color: ACCENT_LIGHT, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em", lineHeight: 1 }}>{col.stat}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: TEXT_DARK, marginTop: 3 }}>{col.label}</p>
              <p style={{ fontSize: 10, color: TEXT_MUTED }}>{col.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEFORE / AFTER — static split ────────────── */}
      <section style={{ background: BG_DARK, padding: "80px 24px", borderBottom: DIVIDER }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>Real Patient · Real Result</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 28, lineHeight: 1.15 }}>
            Before &amp; after.
          </h2>
          <div style={{ display: "flex", gap: 3 }} className="ba-split">
            <div style={{ flex: 1, position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
              <Image src="/images/crowns-lp/ba-before.webp" alt="Before porcelain crown treatment" fill className="object-cover object-top" sizes="50vw" />
              <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(13,11,9,0.8)", padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" }}>Before</div>
            </div>
            <div style={{ flex: 1, position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
              <Image src="/images/crowns-lp/ba-after.webp" alt="After porcelain crown treatment by Dr. Chireau" fill className="object-cover object-top" sizes="50vw" />
              <div style={{ position: "absolute", top: 12, right: 12, background: `rgba(139,111,71,0.9)`, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" }}>After · Dr. Chireau</div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 10, textAlign: "center" }}>Real patient. Real result. No filters. — @Dr.Chireu</p>
        </div>
      </section>

      {/* ── SMILE GALLERY ────────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "80px 24px 88px", borderBottom: DIVIDER }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>Real Patient Results</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 10, lineHeight: 1.15 }}>
            Smile transformations.
          </h2>
          <p style={{ color: TEXT_MUTED, fontSize: 14, lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>
            Every photograph is Dr. Chireau&apos;s own clinical work — shot in-office. No filters. No stock imagery.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 3 }} className="gallery-3col">
            {[
              { src: "/images/crowns-lp/gallery-g1.webp", label: "Full smile restoration", caption: "Complete transformation · @Dr.Chireu" },
              { src: "/images/crowns-lp/gallery-g4.webp", label: "Single crown · front tooth", caption: "Damaged → perfect · same-day CEREC" },
            ].map((img) => (
              <div key={img.src} style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1" }}>
                <Image src={img.src} alt={img.label} fill className="object-cover object-top" loading="lazy" sizes="50vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.65) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 18px" }}>
                  <p style={{ fontSize: 12, color: ACCENT_LIGHT, fontWeight: 600, marginBottom: 2 }}>{img.label}</p>
                  <p style={{ fontSize: 11, color: "rgba(240,234,224,0.6)" }}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }} className="gallery-3col">
            {[
              { src: "/images/crowns-lp/gallery-g3.webp", label: "Dramatic male transformation" },
              { src: "/images/crowns-lp/gallery-g2.webp", label: "Artisan crown closeup" },
              { src: "/images/crowns-lp/gallery-g6.webp", label: "Luxury macro — dark background" },
            ].map((img) => (
              <div key={img.src} style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1" }}>
                <Image src={img.src} alt={img.label} fill className="object-cover object-center" loading="lazy" sizes="33vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.6) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px" }}>
                  <p style={{ fontSize: 11, color: ACCENT_LIGHT, fontWeight: 600 }}>{img.label}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#3A3530", marginTop: 10 }}>All photographs are real patients of Dr. Alex Chireau, DMD · AK Ultimate Dental · Las Vegas, NV · Results may vary</p>
        </div>
      </section>

      {/* ── TREATMENTS ───────────────────────────────── */}
      <section style={{ background: BG_MID, padding: "88px 24px", borderBottom: DIVIDER }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>What&apos;s included this May</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 48, letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Four treatments. One founding rate.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(196,168,130,0.12)" }} className="treatment-grid">
            {[
              { num: "01", title: "Porcelain Crowns", price: "$630", was: "$1,260", unit: "per tooth · CEREC same-day", desc: "CEREC same-day. No temporaries. No lab wait. Lifetime warranty included.", img: "/images/crowns-lp/treatment-crowns.webp", alt: "Porcelain crown restoration, AK Ultimate Dental Las Vegas" },
              { num: "02", title: "Dental Bridges", price: "From $1,426", was: "From $2,852", unit: "3-unit · May rate", desc: "Fixed porcelain. Designed for function and aesthetics.", img: "/images/crowns-lp/treatment-bridges.webp", alt: "Custom ceramic bridge, Dr. Chireau" },
              { num: "03", title: "Porcelain Veneers", price: "$1,000", was: "$2,000", unit: "per tooth · May rate", desc: "Ultra-thin ceramic. Permanent. Natural-looking.", img: "/images/crowns-lp/treatment-veneers.webp", alt: "Porcelain veneer smile transformation" },
              { num: "04", title: "Full Smile Restoration", price: "Custom quote", was: null, unit: "May rate applies", desc: "Complete mouth reconstruction planned as one aesthetic case.", img: "/images/crowns-lp/treatment-restoration.webp", alt: "Full mouth restoration, Dr. Chireau Las Vegas" },
            ].map((card) => (
              <div key={card.num} style={{ background: "#0D0B09", overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src={card.img} alt={card.alt} fill className="object-cover object-center" loading="lazy" sizes="25vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.8) 0%, transparent 60%)" }} />
                </div>
                <div style={{ padding: "20px 24px 28px" }}>
                  <p style={{ fontSize: 11, color: ACCENT_LIGHT, letterSpacing: "0.12em", marginBottom: 6, fontWeight: 500 }}>{card.num}</p>
                  <h3 className="serif" style={{ fontSize: "1.25rem", fontWeight: 600, color: TEXT_DARK, marginBottom: 10, lineHeight: 1.2 }}>{card.title}</h3>
                  <p style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 14, lineHeight: 1.6 }}>{card.desc}</p>
                  {card.was && <p style={{ fontSize: 11, color: TEXT_MUTED, textDecoration: "line-through", marginBottom: 2 }}>{card.was}</p>}
                  <p style={{ fontSize: "1.3rem", fontWeight: 600, color: ACCENT_LIGHT, fontFamily: "'Cormorant Garamond', serif" }}>{card.price}</p>
                  <p style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{card.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TABLE ────────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "88px 24px", borderBottom: DIVIDER }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>Transparent Pricing</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 6, lineHeight: 1.15 }}>
            Las Vegas&apos;s most competitive crown pricing.
          </h2>
          <p style={{ color: ACCENT_LIGHT, fontSize: 15, fontWeight: 500, marginBottom: 28 }}>CEREC same-day. Lifetime warranty included.</p>

          <div style={{ background: "rgba(196,168,130,0.07)", border: DIVIDER, padding: "16px 22px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 14 }}>
            <Shield size={22} color={ACCENT_LIGHT} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 600, color: TEXT_DARK, fontSize: 14, marginBottom: 3 }}>From $630 per crown — lower than any dental chain in Las Vegas.</p>
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.7 }}>Lifetime warranty included. CEREC same-day. No lab wait. First 20 founding patients only.</p>
            </div>
          </div>

          <div style={{ border: DIVIDER, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", background: "rgba(139,111,71,0.15)", padding: "11px 22px", gap: 16 }}>
              <p style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Service</p>
              <p style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", whiteSpace: "nowrap" }}>Standard</p>
              <p style={{ fontSize: 11, color: ACCENT_LIGHT, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", whiteSpace: "nowrap", minWidth: 90 }}>May Rate</p>
            </div>
            {[
              { service: "Standard Crown (per tooth)", standard: "$1,260", may: "$630", strike: true },
              { service: "Crown + Build-up (most common)", standard: "$1,426", may: "$713", strike: true },
              { service: "Zirconia Premium Crown", standard: "$1,711", may: "$855", strike: true },
              { service: "Consultation & X-ray", standard: "$0", may: "$0", strike: false },
              { service: "CEREC Scan, Design & Milling", standard: "Included", may: "Included", strike: false },
              { service: "Lifetime Warranty (Crowns)", standard: "—", may: "Included", strike: false },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "13px 22px", gap: 16, borderTop: DIVIDER, background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent", alignItems: "center" }}>
                <p style={{ fontSize: 14, color: TEXT_DARK }}>{row.service}</p>
                <p style={{ fontSize: 13, color: TEXT_MUTED, textDecoration: row.strike ? "line-through" : "none", textAlign: "right", whiteSpace: "nowrap" }}>{row.standard}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: ACCENT_LIGHT, textAlign: "right", whiteSpace: "nowrap", minWidth: 90 }}>{row.may}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: "#4A423A", lineHeight: 1.75, marginBottom: 36 }}>
            Founding patient rate locks at consultation booking. Valid for treatment accepted within 30 days. New patients only. Cannot be combined with insurance or other offers. 20 slots total, May 2026 only.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "16px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Lock In My Founding Rate <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} />{PHONE} · Call or Text
            </a>
          </div>
        </div>
      </section>

      {/* ── FINANCING ────────────────────────────────── */}
      <section style={{ background: BG_MID, padding: "80px 24px", borderBottom: DIVIDER }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>0% Financing Available</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 12, lineHeight: 1.15 }}>
            Your smile shouldn&apos;t wait for your budget.
          </h2>
          <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.75, marginBottom: 40, maxWidth: 560 }}>
            We partner with three financing providers so you can start treatment today. Apply in minutes — most patients are approved on the spot.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(196,168,130,0.12)" }} className="financing-grid">
            {[
              {
                name: "Cherry",
                tagline: "Up to 24-month 0% APR plans",
                detail: "Soft credit check. Instant approval decisions. Plans from $25/month.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACCENT_LIGHT} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                ),
              },
              {
                name: "CareCredit",
                tagline: "Healthcare credit card",
                detail: "Accepted at 260,000+ providers. Special financing for qualified patients.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACCENT_LIGHT} strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                ),
              },
              {
                name: "Sunbit",
                tagline: "Approved in 30 seconds",
                detail: "Flexible monthly payments. 96% of applicants approved. No hard credit pull.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACCENT_LIGHT} strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.5-7.5-1.4 1.4M6.9 17.1l-1.4 1.4m0-11.4 1.4 1.4m10.2 10.2 1.4 1.4"/></svg>
                ),
              },
            ].map((p) => (
              <div key={p.name} style={{ background: BG_DARK, padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                {p.icon}
                <div>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, color: TEXT_DARK, marginBottom: 4 }}>{p.name}</p>
                  <p style={{ fontSize: 13, color: ACCENT_LIGHT, fontWeight: 500, marginBottom: 8 }}>{p.tagline}</p>
                  <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.65 }}>{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 16, lineHeight: 1.7 }}>
            Financing subject to third-party approval. Terms vary by lender. Ask our front desk to apply at your consultation — takes less than 2 minutes.
          </p>
        </div>
      </section>

      {/* ── PATIENT TESTIMONIAL VIDEO ────────────────── */}
      {testimonialVideoUrl && (
        <section style={{ background: BG_DARK, padding: "88px 24px", borderBottom: DIVIDER }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500, textAlign: "center" }}>In Their Own Words</p>
            <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 36, lineHeight: 1.15, textAlign: "center" }}>
              What patients say.
            </h2>
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
              <iframe src={testimonialVideoUrl} title="Patient testimonial — AK Ultimate Dental" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
            </div>
            <div style={{ marginTop: 28, padding: "22px 28px", background: BG_MID, borderLeft: `3px solid ${ACCENT}` }}>
              <p className="serif" style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontStyle: "italic", color: TEXT_DARK, lineHeight: 1.6, marginBottom: 8 }}>
                &ldquo;I just wish I was so much younger, doctor — because then I would have gotten it all capped.&rdquo;
              </p>
              <p style={{ fontSize: 12, color: TEXT_MUTED }}>Real patient · AK Ultimate Dental · Las Vegas</p>
            </div>
          </div>
        </section>
      )}

      {/* ── DR. CHIREAU ──────────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "88px 24px", borderBottom: DIVIDER }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }} className="doctor-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {hasFamilyPhoto ? (
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", border: DIVIDER }}>
                <Image src="/dr-alex-family.jpg" alt="Dr. Alex Chireau with family" fill className="object-cover object-center" loading="lazy" sizes="50vw" />
              </div>
            ) : (
              <div style={{ aspectRatio: "3/4", background: BG_MID, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: TEXT_MUTED, fontSize: 14, textAlign: "center", padding: 32, gap: 12, border: DIVIDER }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#2A2520", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5"><circle cx="12" cy="7" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/></svg>
                </div>
                <p style={{ fontWeight: 600, color: ACCENT_LIGHT }}>Dr. Alex Chireau, DMD</p>
              </div>
            )}
            {hasGraduationPhoto && (
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", border: DIVIDER }}>
                <Image src="/dr-alex-graduation-unlv.jpg" alt="Dr. Chireau at UNLV School of Dental Medicine graduation" fill className="object-cover object-top" loading="lazy" sizes="50vw" />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "rgba(13,11,9,0.78)" }}>
                  <p style={{ fontSize: 11, color: ACCENT_LIGHT }}>UNLV School of Dental Medicine · Class of 2022</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>Your Doctor</p>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 18, lineHeight: 1.15 }}>
              Dr. Alex Chireau, DMD
            </h2>
            <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.8, marginBottom: 22 }}>
              Dr. Chireau trained at the UNLV School of Dental Medicine and has spent years building one of Las Vegas&apos;s most trusted cosmetic practices — one patient at a time. His approach is precise, unhurried, and deeply personal.
            </p>
            <ul style={{ listStyle: "none", marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Doctor of Dental Medicine — UNLV School of Dental Medicine",
                "CEREC Certified — same-day ceramic restorations, in-office",
                "145 verified five-star reviews",
                "Every photo on this page is Dr. Chireau's own clinical work",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: ACCENT, marginTop: 3, flexShrink: 0 }}>·</span>
                  <span style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
            <blockquote style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 20, marginBottom: 28 }}>
              <p className="serif" style={{ fontSize: "clamp(1.15rem, 2vw, 1.5rem)", fontStyle: "italic", color: TEXT_DARK, lineHeight: 1.5 }}>
                &ldquo;This is how I like my crowns to fit — ALL THE TIME.&rdquo;
              </p>
              <p style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 6 }}>— Dr. Alex Chireau · clinical post · @Dr.Chireu</p>
            </blockquote>
            <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "14px 24px", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Schedule With Dr. Chireau <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section style={{ background: BG_CREAM, padding: "88px 24px", borderBottom: "1px solid rgba(139,111,71,0.2)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: ACCENT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>Common Questions</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "#1A1410", marginBottom: 36, lineHeight: 1.15 }}>
            What patients ask us first.
          </h2>
          <FaqAccordion />
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section style={{ background: ACCENT, padding: "88px 24px", textAlign: "center", borderBottom: "1px solid rgba(139,111,71,0.4)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Star size={20} color="rgba(255,255,255,0.6)" style={{ margin: "0 auto 20px" }} />
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.01em" }}>
            Ready to see what Dr. Chireau can do?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 36 }}>
            Complimentary consultation. Rate locks when you book. Same-day crowns available. Lifetime warranty included. First 20 patients only.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <a href="#consult" style={{ background: "#fff", color: ACCENT, padding: "17px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Claim My Founding Patient Slot <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} />{PHONE} · Call or Text
            </a>
          </div>
        </div>
      </section>

      {/* ── REVIEW TICKER ────────────────────────────── */}
      <section style={{ background: BG_MID, padding: "24px 0", borderBottom: DIVIDER, overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "ticker 40s linear infinite", width: "max-content", gap: 72 }}>
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <span key={i} style={{ fontSize: 13, color: TEXT_MUTED, whiteSpace: "nowrap", flexShrink: 0 }}>
              {review}
            </span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ background: "#060504", padding: "40px 24px 32px", borderTop: DIVIDER }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Image src="/ak-logo.png" alt="AK Ultimate Dental" width={150} height={48} style={{ objectFit: "contain", objectPosition: "left" }} />
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <a href="https://share.google/y4QOijKzxJN97403L" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT }} title="Google Reviews">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </a>
                <a href="https://www.facebook.com/chireu.alexandru/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT }} title="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/dr.chireu/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT }} title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>
                <a href="https://www.yelp.com/biz/ak-ultimate-dental-las-vegas" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT }} title="Yelp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                </a>
              </div>
              <p style={{ fontSize: 13, color: TEXT_MUTED }}>{ADDRESS}</p>
              <p style={{ fontSize: 13, color: TEXT_MUTED }}>{HOURS}</p>
              <a href={PHONE_HREF} style={{ fontSize: 13, color: ACCENT_LIGHT, textDecoration: "none" }}>{PHONE}</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "11px 22px", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                Claim My Slot <ArrowRight size={13} />
              </a>
              <a href="https://akultimatedental.com" style={{ fontSize: 12, color: TEXT_MUTED, textDecoration: "none" }}>Main Site →</a>
            </div>
          </div>
          <div style={{ borderTop: DIVIDER, paddingTop: 20 }}>
            <p style={{ fontSize: 11, color: "#3A3530", lineHeight: 1.8 }}>
              Founding patient rate of 50% applies to new patients who schedule and attend a consultation at AK Ultimate Dental in May 2026. Applies to porcelain crowns, veneers, and bridge work only. Standard rates apply after May 31, 2026 or when 20 slots are filled, whichever occurs first. Rate locks at consultation booking, valid for treatment accepted within 30 days. Cannot be combined with insurance benefits or other promotional offers. 0% financing subject to third-party approval. Individual results may vary. All patient photographs are real clinical results by Dr. Alex Chireau, DMD.{" "}
              Lifetime Warranty: Applies to crowns placed by Dr. Alex Chireau, DMD at AK Ultimate Dental. Covers crown failure or debonding due to clinical factors. Does not cover damage resulting from trauma, grinding without a prescribed night guard, or failure to attend recommended follow-up care.{" "}
              &copy; 2026 AK Ultimate Dental. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
