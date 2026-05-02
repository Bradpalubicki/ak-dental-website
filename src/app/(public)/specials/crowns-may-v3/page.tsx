import Image from "next/image";
import { ArrowRight, Phone, CheckCircle } from "lucide-react";
import { existsSync } from "fs";
import path from "path";
import FaqAccordion from "./FaqAccordion";

const PHONE = "(702) 935-4395";
const PHONE_HREF = "tel:+17029354395";
const ADDRESS = "7480 West Sahara Avenue, Las Vegas, NV 89117";
const HOURS = "Mon–Thu 8am–5pm";

const BG_DARK = "#0D0B09";
const BG_CREAM = "#F7F4EF";
const ACCENT = "#8B6F47";
const ACCENT_LIGHT = "#C4A882";
const TEXT_DARK = "#F0EAE0";
const TEXT_MUTED = "#7A736A";

const REVIEWS = [
  `⭐⭐⭐⭐⭐  "In and out in 90 minutes with a crown that fits perfectly."  — Verified Google Review · Las Vegas`,
  `⭐⭐⭐⭐⭐  "Dr. Chireau's work is in a completely different category than any dentist I've been to."  — Verified Google Review · Las Vegas`,
  `⭐⭐⭐⭐⭐  "Same-day crown with CEREC. No temporary, no second visit. Absolutely incredible."  — Verified Google Review · Las Vegas`,
  `⭐⭐⭐⭐⭐  "The most affordable crown price AND a lifetime warranty. Couldn't believe it."  — Verified Google Review · Las Vegas`,
  `⭐⭐⭐⭐⭐  "Precise, professional, and genuinely cared about my result. 128 reviews for a reason."  — Verified Google Review · Las Vegas`,
];

export default function CrownsMayV3Page() {
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
          .hero-img-col { order: -1; min-height: 60vw; }
          .hero-text-col { padding: 32px 20px !important; }
          .doctor-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .slots-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .gallery-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .treatment-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .topbar-logo { display: none !important; }
          .highlight-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .social-row { flex-wrap: wrap !important; }
        }
      `}</style>

      {/* ── STICKY TOP BAR ─────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: BG_DARK, borderBottom: "1px solid rgba(196,168,130,0.2)", padding: "10px 24px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontWeight: 500, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={14} />{PHONE} · Call or Text
        </a>
        <div className="topbar-logo" style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/ak-logo.png" alt="AK Ultimate Dental" width={140} height={44} style={{ objectFit: "contain", filter: "brightness(1.05)" }} priority />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
          <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "9px 20px", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.03em" }}>
            Request a Consultation <ArrowRight size={13} />
          </a>
          <a href="https://www.instagram.com/dr.chireu/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT, display: "flex", alignItems: "center" }} title="Follow on Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ minHeight: "calc(100svh - 56px)", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr" }} className="hero-grid">
          {/* LEFT: text */}
          <div style={{ padding: "56px 48px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: BG_DARK }} className="hero-text-col">
            <div>
              <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>
                May 2026 · Limited Cosmetic Calendar · Las Vegas
              </p>
              <h1 className="serif" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 600, lineHeight: 1.1, color: TEXT_DARK, marginBottom: 20, letterSpacing: "-0.01em" }}>
                The smile you&apos;ve<br />considered.<br />
                <em style={{ color: ACCENT_LIGHT }}>Finally done right.</em>
              </h1>
              <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.75, marginBottom: 28, maxWidth: 440 }}>
                Dr. Alex Chireau is personally accepting 30 new cosmetic cases this May — crowns, bridges, veneers, and full smile restorations — at a founding patient rate that will not be offered again.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                <a href="#consult" id="consult" style={{ background: ACCENT, color: "#fff", padding: "14px 24px", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", letterSpacing: "0.02em" }}>
                  Request a Complimentary Consultation <ArrowRight size={15} />
                </a>
                <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={13} />{PHONE} · Call or Text
                </a>
              </div>
            </div>
            {/* Trust footer — flush bottom */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", paddingTop: 20, borderTop: "1px solid rgba(196,168,130,0.15)" }}>
              {["128 Five-Star Reviews", "CEREC Same-Day Crown", "UNLV DMD Trained", "Lifetime Warranty Included"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={12} style={{ color: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* RIGHT: hero photo */}
          <div className="hero-img-col" style={{ position: "relative", overflow: "hidden" }}>
            <Image src="/images/crowns-lp/hero-main.webp" alt="Before and after full arch porcelain crown restoration by Dr. Alex Chireau, AK Ultimate Dental Las Vegas" fill className="object-cover object-center" priority sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>

        {/* ── HIGHLIGHT STRIP ── */}
        <div style={{ background: "#0A0806", borderTop: "1px solid rgba(196,168,130,0.2)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="highlight-strip">
          {[
            { stat: "128", label: "Five-Star Google Reviews", sub: "Verified · Las Vegas" },
            { stat: "CEREC", label: "Same-Day Crowns", sub: "No lab. Done in one visit." },
            { stat: "50%", label: "Off Standard Rate", sub: "May founding patients only" },
            { stat: "Lifetime", label: "Crown Warranty", sub: "Replace or rebond — free, forever" },
          ].map((col, i) => (
            <div key={i} style={{ padding: "20px 24px", borderLeft: i > 0 ? "1px solid rgba(196,168,130,0.1)" : "none", display: "flex", flexDirection: "column", gap: 2 }}>
              <p style={{ fontSize: "clamp(1rem, 1.6vw, 1.4rem)", fontWeight: 700, color: ACCENT_LIGHT, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em", lineHeight: 1 }}>{col.stat}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: TEXT_DARK, marginTop: 4 }}>{col.label}</p>
              <p style={{ fontSize: 11, color: TEXT_MUTED }}>{col.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEFORE/AFTER SLIDER ─────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "80px 24px 0", borderTop: "1px solid rgba(196,168,130,0.08)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>Real Patient · Real Result</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 32, lineHeight: 1.15 }}>
            Drag to compare.
          </h2>
          {/* img-comparison-slider web component */}
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script type="module" src="https://unpkg.com/img-comparison-slider@latest/dist/index.js" async />
          <div style={{ position: "relative", fontSize: 0 }}>
            {/* @ts-ignore custom element */}
            <img-comparison-slider style={{ width: "100%", "--divider-color": ACCENT_LIGHT, "--default-handle-color": ACCENT_LIGHT, "--default-handle-shadow": "0 2px 12px rgba(0,0,0,0.5)" }}>
              {/* @ts-ignore slot */}
              <img slot="first" src="/images/crowns-lp/ba-before.webp" alt="Before crown treatment" style={{ width: "100%", display: "block" }} />
              {/* @ts-ignore slot */}
              <img slot="second" src="/images/crowns-lp/ba-after.webp" alt="After crown treatment by Dr. Chireau" style={{ width: "100%", display: "block" }} />
              {/* @ts-ignore slot */}
              <div slot="first" style={{ position: "absolute", top: 12, left: 12, background: "rgba(13,11,9,0.72)", padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>Before</div>
              {/* @ts-ignore slot */}
              <div slot="second" style={{ position: "absolute", top: 12, right: 12, background: "rgba(139,111,71,0.85)", padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>After · Dr. Chireau</div>
            {/* @ts-ignore custom element */}
            </img-comparison-slider>
          </div>
          <p style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 12, textAlign: "center" }}>Real patient. Real result. No filters. — @Dr.Chireu</p>
        </div>
      </section>

      {/* ── SMILE TRANSFORMATIONS GALLERY ───────────────── */}
      <section style={{ background: BG_DARK, padding: "80px 24px 96px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Real Patient Results</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 12, lineHeight: 1.15 }}>
            Smile transformations.
          </h2>
          <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.75, marginBottom: 48, maxWidth: 560 }}>
            Every photograph is Dr. Chireau&apos;s own clinical work — shot in-office. Before and after. No filters. No stock imagery.
          </p>
          {/* 2-col large row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 3 }} className="gallery-3col">
            {[
              { src: "/images/crowns-lp/gallery-g1.webp", label: "Full smile restoration", caption: "Complete transformation · @Dr.Chireu" },
              { src: "/images/crowns-lp/gallery-g4.webp", label: "Single crown · front tooth", caption: "Damaged → perfect · same-day CEREC" },
            ].map((img) => (
              <div key={img.src} style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1" }}>
                <Image src={img.src} alt={img.label} fill className="object-cover object-top" loading="lazy" sizes="50vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.65) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px" }}>
                  <p style={{ fontSize: 12, color: ACCENT_LIGHT, fontWeight: 600, marginBottom: 2 }}>{img.label}</p>
                  <p style={{ fontSize: 11, color: "rgba(240,234,224,0.65)" }}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
          {/* 3-col row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }} className="gallery-3col">
            {[
              { src: "/images/crowns-lp/gallery-g3.webp", label: "Dramatic male transformation", pos: "object-center" },
              { src: "/images/crowns-lp/gallery-g2.webp", label: "Artisan crown closeup", pos: "object-center" },
              { src: "/images/crowns-lp/gallery-g6.webp", label: "Luxury macro — dark background", pos: "object-center" },
            ].map((img) => (
              <div key={img.src} style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1" }}>
                <Image src={img.src} alt={img.label} fill className={`object-cover ${img.pos}`} loading="lazy" sizes="33vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.6) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px" }}>
                  <p style={{ fontSize: 11, color: ACCENT_LIGHT, fontWeight: 600 }}>{img.label}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#3A3530", marginTop: 12 }}>All photographs are real patients of Dr. Alex Chireau, DMD · AK Ultimate Dental · Las Vegas, NV · Results may vary</p>
        </div>
      </section>

      {/* ── DR. CHIREAU QUOTE PULL ───────────────────────── */}
      <section style={{ background: "#1A1714", padding: "80px 24px", borderTop: "1px solid rgba(196,168,130,0.1)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="doctor-grid">
          <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", border: "1px solid rgba(196,168,130,0.15)" }}>
            <Image src="/images/crowns-lp/procedure-4.webp" alt="X-ray showing perfect crown fit — Dr. Chireau: This is how I like my crowns to fit, ALL THE TIME" fill className="object-cover object-bottom" loading="lazy" sizes="50vw" />
          </div>
          <div>
            <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>The Standard</p>
            <blockquote style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 24, marginBottom: 28 }}>
              <p className="serif" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontStyle: "italic", color: TEXT_DARK, lineHeight: 1.5 }}>
                &ldquo;This is how I like my crowns to fit — ALL THE TIME.&rdquo;
              </p>
            </blockquote>
            <p style={{ color: TEXT_MUTED, fontSize: 14, marginBottom: 8 }}>— Dr. Alex Chireau, DMD</p>
            <p style={{ color: TEXT_MUTED, fontSize: 14, lineHeight: 1.75, marginBottom: 32 }}>
              That&apos;s not a marketing line. It&apos;s what he posts on his own clinical feed — an X-ray of a perfectly seated crown, margin-to-margin precision. This is the standard he holds every case to.
            </p>
            <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "14px 24px", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Book My Consultation <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── PATIENT TESTIMONIAL VIDEO ────────────────────── */}
      <section style={{ background: BG_DARK, padding: "96px 24px", borderTop: "1px solid rgba(196,168,130,0.08)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500, textAlign: "center" }}>In Their Own Words</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 40, lineHeight: 1.15, textAlign: "center" }}>
            What patients say.
          </h2>
          {testimonialVideoUrl ? (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
              <iframe src={testimonialVideoUrl} title="Patient testimonial — AK Ultimate Dental" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
            </div>
          ) : (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, #1A1714 0%, #0D0B09 100%)", border: "1px solid rgba(196,168,130,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(139,111,71,0.08) 0%, transparent 70%)" }} />
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(196,168,130,0.12)", border: "2px solid rgba(196,168,130,0.35)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={ACCENT_LIGHT} style={{ marginLeft: 3 }}><polygon points="5,3 19,12 5,21"/></svg>
              </div>
              <div style={{ textAlign: "center", position: "relative" }}>
                <p style={{ color: TEXT_DARK, fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Patient Testimonial · Coming Soon</p>
                <p style={{ color: TEXT_MUTED, fontSize: 13 }}>Video will appear here when published</p>
              </div>
            </div>
          )}
          <div style={{ marginTop: 32, padding: "24px 32px", background: "#1A1714", borderLeft: `3px solid ${ACCENT}` }}>
            <p className="serif" style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontStyle: "italic", color: TEXT_DARK, lineHeight: 1.6, marginBottom: 10 }}>
              &ldquo;I just wish I was so much younger, doctor — because then I would have gotten it all capped.&rdquo;
            </p>
            <p style={{ fontSize: 12, color: TEXT_MUTED }}>Real patient · AK Ultimate Dental · Las Vegas</p>
          </div>
        </div>
      </section>

      {/* ── TREATMENTS ──────────────────────────────────── */}
      <section style={{ background: "#1A1714", padding: "96px 24px", borderTop: "1px solid rgba(196,168,130,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>What&apos;s included this May</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 56, letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Four treatments. One founding rate.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(196,168,130,0.1)" }} className="treatment-grid">
            {[
              { num: "01", title: "Porcelain Crowns", price: "$630", was: "$1,260", unit: "per tooth · CEREC same-day · Lifetime warranty included", desc: "CEREC same-day. No temporaries. No lab wait. Lifetime warranty included.", img: "/images/crowns-lp/treatment-crowns.webp", alt: "Porcelain crown restoration, AK Ultimate Dental Las Vegas" },
              { num: "02", title: "Dental Bridges", price: "From $1,426", was: "From $2,852", unit: "3-unit · May rate", desc: "Fixed porcelain. Designed for function and aesthetics.", img: "/images/crowns-lp/treatment-bridges.webp", alt: "Custom ceramic bridge, Dr. Chireau" },
              { num: "03", title: "Porcelain Veneers", price: "$1,000", was: "$2,000", unit: "per tooth · May rate", desc: "Ultra-thin ceramic. Permanent. Natural-looking.", img: "/images/crowns-lp/treatment-veneers.webp", alt: "Porcelain veneer smile transformation" },
              { num: "04", title: "Full Smile Restoration", price: "Custom quote", was: null, unit: "May rate applies", desc: "Complete mouth reconstruction planned as one aesthetic case.", img: "/images/crowns-lp/treatment-restoration.webp", alt: "Full mouth restoration, Dr. Chireau Las Vegas" },
            ].map((card) => (
              <div key={card.num} style={{ background: "#111009", overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src={card.img} alt={card.alt} fill className="object-cover object-center" loading="lazy" sizes="25vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.8) 0%, transparent 60%)" }} />
                </div>
                <div style={{ padding: "24px 28px 32px" }}>
                  <p style={{ fontSize: 11, color: ACCENT_LIGHT, letterSpacing: "0.12em", marginBottom: 8, fontWeight: 500 }}>{card.num}</p>
                  <h3 className="serif" style={{ fontSize: "1.35rem", fontWeight: 600, color: TEXT_DARK, marginBottom: 12, lineHeight: 1.2 }}>{card.title}</h3>
                  <p style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16, lineHeight: 1.6 }}>{card.desc}</p>
                  {card.was && <p style={{ fontSize: 11, color: TEXT_MUTED, textDecoration: "line-through", marginBottom: 2 }}>{card.was}</p>}
                  <p style={{ fontSize: "1.4rem", fontWeight: 600, color: ACCENT_LIGHT, fontFamily: "'Cormorant Garamond', serif" }}>{card.price}</p>
                  <p style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{card.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLINICAL DEPTH ───────────────────────────────── */}
      <section style={{ background: BG_CREAM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: ACCENT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>The Precision</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: "#1A1410", marginBottom: 12, lineHeight: 1.15 }}>
            Not just cosmetic. Clinically perfect.
          </h2>
          <p style={{ fontSize: 15, color: "#4A423A", lineHeight: 1.75, marginBottom: 48, maxWidth: 560 }}>
            Dr. Chireau does the work that other dentists refer out. Root canals and crowns in a single visit. Molar restorations your X-ray shows are perfect.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }} className="gallery-3col">
            {[
              { src: "/images/crowns-lp/ba-extra-1.webp", caption: "Cracked molar → ceramic crown, closeup" },
              { src: "/images/crowns-lp/ba-extra-4.webp", caption: "Before & after · @Dr.Chireu" },
              { src: "/images/crowns-lp/procedure-2.webp", caption: "Root canal and crown in 1 visit" },
            ].map((img) => (
              <div key={img.src} style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1", background: "#E8E3DA" }}>
                <Image src={img.src} alt={img.caption} fill className="object-cover object-center" loading="lazy" sizes="33vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.55) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px" }}>
                  <p style={{ fontSize: 11, color: "#f5f0e8", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCTOR SECTION ───────────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "96px 24px", borderTop: "1px solid rgba(196,168,130,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="doctor-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {hasFamilyPhoto ? (
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", border: "1px solid rgba(196,168,130,0.1)" }}>
                <Image src="/dr-alex-family.jpg" alt="Dr. Alex Chireau with family" fill className="object-cover object-center" loading="lazy" sizes="50vw" />
              </div>
            ) : (
              <div style={{ aspectRatio: "3/4", background: "#1A1714", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: TEXT_MUTED, fontSize: 14, textAlign: "center", padding: 32, gap: 12, border: "1px solid rgba(196,168,130,0.1)" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#2A2520", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5"><circle cx="12" cy="7" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/></svg>
                </div>
                <p style={{ fontWeight: 600, color: ACCENT_LIGHT }}>Dr. Alex Chireau, DMD</p>
              </div>
            )}
            {hasGraduationPhoto && (
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", border: "1px solid rgba(196,168,130,0.08)" }}>
                <Image src="/dr-alex-graduation-unlv.jpg" alt="Dr. Chireau at UNLV School of Dental Medicine graduation" fill className="object-cover object-top" loading="lazy" sizes="50vw" />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "rgba(13,11,9,0.75)" }}>
                  <p style={{ fontSize: 11, color: ACCENT_LIGHT }}>UNLV School of Dental Medicine · Class of 2022</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Your Doctor</p>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 20, lineHeight: 1.15 }}>
              Dr. Alex Chireau, DMD
            </h2>
            <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
              Dr. Chireau trained at the UNLV School of Dental Medicine and has spent years building one of Las Vegas&apos;s most trusted cosmetic practices — one patient at a time. His approach is precise, unhurried, and deeply personal.
            </p>
            <ul style={{ listStyle: "none", marginBottom: 32, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Doctor of Dental Medicine — UNLV School of Dental Medicine", "CEREC Certified — same-day ceramic restorations, in-office", "128 verified five-star reviews", "Every photo on this page is Dr. Chireau's own clinical work"].map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: ACCENT, marginTop: 3, flexShrink: 0 }}>·</span>
                  <span style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
            <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "14px 24px", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Request a Consultation <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section style={{ background: "#1A1714", padding: "96px 24px", borderTop: "1px solid rgba(196,168,130,0.08)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Transparent Pricing</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 8, lineHeight: 1.15 }}>
            Las Vegas&apos;s most competitive crown pricing.
          </h2>
          <p style={{ color: ACCENT_LIGHT, fontSize: 15, fontWeight: 500, marginBottom: 32 }}>CEREC same-day. Lifetime warranty included.</p>

          {/* Competitive callout */}
          <div style={{ background: "rgba(196,168,130,0.08)", border: "1px solid rgba(196,168,130,0.3)", padding: "18px 24px", marginBottom: 32, display: "flex", alignItems: "flex-start", gap: 16 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACCENT_LIGHT} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <p style={{ fontWeight: 600, color: TEXT_DARK, fontSize: 15, marginBottom: 4 }}>From $630 per crown — lower than any dental chain in Las Vegas.</p>
              <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.7, marginBottom: 6 }}>Lifetime warranty included. CEREC same-day. No lab wait.</p>
              <p style={{ fontSize: 11, color: "#4A423A" }}>Comparison based on publicly advertised standard crown rates from Las Vegas dental providers, May 2026.</p>
            </div>
          </div>

          {/* Lifetime warranty callout */}
          <div style={{ background: "rgba(139,111,71,0.06)", border: "1px solid rgba(196,168,130,0.2)", padding: "18px 24px", marginBottom: 32, display: "flex", alignItems: "flex-start", gap: 16 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT_LIGHT} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <p style={{ fontWeight: 600, color: TEXT_DARK, fontSize: 14, marginBottom: 4 }}>Lifetime Warranty Included</p>
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.7 }}>We will replace or rebond your crown at no cost for the rest of your life.* The only Las Vegas dentist to offer this guarantee.</p>
            </div>
          </div>

          {/* Pricing table */}
          <div style={{ border: "1px solid rgba(196,168,130,0.15)", overflow: "hidden", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", background: "rgba(139,111,71,0.15)", padding: "12px 24px", gap: 16 }}>
              <p style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Service</p>
              <p style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", whiteSpace: "nowrap" }}>Standard</p>
              <p style={{ fontSize: 11, color: ACCENT_LIGHT, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", whiteSpace: "nowrap", minWidth: 100 }}>May Rate</p>
            </div>
            {[
              { service: "Standard Crown (per tooth)", standard: "$1,260", may: "$630", strike: true },
              { service: "Crown + Build-up (most common)", standard: "$1,426", may: "$713", strike: true },
              { service: "Zirconia Premium Crown", standard: "$1,711", may: "$855", strike: true },
              { service: "Consultation & X-ray", standard: "$0", may: "$0", strike: false },
              { service: "CEREC Scan, Design & Milling", standard: "Included", may: "Included", strike: false },
              { service: "Lifetime Warranty (Crowns)", standard: "—", may: "Included", strike: false },
              { service: "0% Financing · Cherry, CareCredit, Sunbit", standard: "Available", may: "Available", strike: false },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "14px 24px", gap: 16, borderTop: "1px solid rgba(196,168,130,0.08)", background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent", alignItems: "center" }}>
                <p style={{ fontSize: 14, color: TEXT_DARK }}>{row.service}</p>
                <p style={{ fontSize: 13, color: TEXT_MUTED, textDecoration: row.strike ? "line-through" : "none", textAlign: "right", whiteSpace: "nowrap" }}>{row.standard}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: ACCENT_LIGHT, textAlign: "right", whiteSpace: "nowrap", minWidth: 100 }}>{row.may}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.7, marginBottom: 8 }}>
            Build-up required when tooth structure is compromised — determined at exam, no surprises. Zirconia recommended for back teeth and high-bite areas.
          </p>
          <p style={{ fontSize: 11, color: "#4A423A", lineHeight: 1.75, marginBottom: 40 }}>
            Founding patient rate locks at consultation booking. Valid for treatment accepted within 30 days. New patients only. Cannot be combined with insurance or other offers. 30 slots total, May 2026 only.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "16px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Book My Free Consultation <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} />{PHONE} · Call or Text
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ────────────────────────────────── */}
      <section style={{ background: BG_CREAM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: ACCENT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Common Questions</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "#1A1410", marginBottom: 40, lineHeight: 1.15 }}>
            What patients ask us first.
          </h2>
          <FaqAccordion />
        </div>
      </section>

      {/* ── 30 SLOTS ─────────────────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="slots-grid">
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 20 }}>
              {[...Array(30)].map((_, i) => (
                <div key={i} style={{ aspectRatio: "1/1", background: i < 7 ? ACCENT : "transparent", border: `1px solid ${i < 7 ? ACCENT : "rgba(139,111,71,0.3)"}` }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, background: ACCENT }} /><span style={{ fontSize: 11, color: TEXT_MUTED }}>Consultation booked</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, border: "1px solid rgba(139,111,71,0.4)" }} /><span style={{ fontSize: 11, color: TEXT_MUTED }}>Available</span></div>
            </div>
          </div>
          <div>
            <p className="serif" style={{ fontSize: "clamp(4rem, 8vw, 7rem)", fontWeight: 600, color: TEXT_DARK, lineHeight: 1, marginBottom: 4 }}>30</p>
            <p style={{ fontSize: 14, color: ACCENT, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>Founding Patient Slots · May 2026</p>
            <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              Dr. Chireau is personally accepting 30 new cosmetic cases this month. When consultations are filled, the founding patient rate closes permanently. No waitlist, no extension, no exceptions after May 31.
            </p>
            <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "16px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Request My Consultation <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section style={{ background: ACCENT, padding: "96px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 className="serif" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: 20, letterSpacing: "-0.01em" }}>
            Ready to see what Dr. Chireau can do?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 40 }}>
            Complimentary consultation. Rate locks when you book. Same-day crowns available. Lifetime warranty included.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <a href="#consult" style={{ background: "#fff", color: ACCENT, padding: "18px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Request a Consultation <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={15} />{PHONE} · Call or Text
            </a>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 32, lineHeight: 1.6 }}>
            AK Ultimate Dental · {ADDRESS} · {HOURS}
          </p>
        </div>
      </section>

      {/* ── REVIEW TICKER ────────────────────────────────── */}
      <section style={{ background: "#1A1714", padding: "28px 0", borderTop: "1px solid rgba(196,168,130,0.1)", overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "ticker 40s linear infinite", width: "max-content", gap: 80 }}>
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <span key={i} style={{ fontSize: 13, color: TEXT_MUTED, whiteSpace: "nowrap", flexShrink: 0 }}>
              {review}
            </span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ background: "#080706", padding: "40px 24px", borderTop: "1px solid rgba(196,168,130,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Image src="/ak-logo.png" alt="AK Ultimate Dental" width={160} height={50} style={{ objectFit: "contain", objectPosition: "left" }} />
              {/* Social icons */}
              <div style={{ display: "flex", gap: 16, alignItems: "center" }} className="social-row">
                <a href="https://share.google/y4QOijKzxJN97403L" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT }} title="Google Reviews">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </a>
                <a href="https://www.facebook.com/chireu.alexandru/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT }} title="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/dr.chireu/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT }} title="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>
                <a href="https://www.yelp.com/biz/ak-ultimate-dental-las-vegas" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT_LIGHT }} title="Yelp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                </a>
              </div>
              <p style={{ fontSize: 13, color: TEXT_MUTED }}>{ADDRESS}</p>
              <p style={{ fontSize: 13, color: TEXT_MUTED }}>{HOURS}</p>
              <a href={PHONE_HREF} style={{ fontSize: 13, color: ACCENT_LIGHT, textDecoration: "none" }}>{PHONE}</a>
            </div>
            <a href="https://akultimatedental.com" style={{ fontSize: 13, color: TEXT_MUTED, textDecoration: "none" }}>Main Site →</a>
          </div>
          <div style={{ borderTop: "1px solid rgba(196,168,130,0.08)", paddingTop: 24 }}>
            <p style={{ fontSize: 11, color: "#3A3530", lineHeight: 1.8 }}>
              Founding patient rate of 50% applies to new patients who schedule and attend a consultation at AK Ultimate Dental in May 2026. Applies to porcelain crowns, veneers, and bridge work only. Standard rates apply after May 31, 2026 or when 30 slots are filled, whichever occurs first. Rate locks at consultation booking, valid for treatment accepted within 30 days. Cannot be combined with insurance benefits or other promotional offers. 0% financing subject to third-party approval. Individual results may vary. All patient photographs are real clinical results by Dr. Alex Chireau, DMD.{" "}
              Lifetime Warranty: Applies to crowns placed by Dr. Alex Chireau, DMD at AK Ultimate Dental. Covers crown failure or debonding due to clinical factors. Does not cover damage resulting from trauma, grinding without a prescribed night guard, or failure to attend recommended follow-up care. Current radiograph and clinical examination required to initiate warranty claim.{" "}
              &copy; 2026 AK Ultimate Dental. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
