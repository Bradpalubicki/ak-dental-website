import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, CheckCircle } from "lucide-react";
import { existsSync } from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "May Cosmetic Calendar — AK Ultimate Dental Las Vegas",
  description:
    "Dr. Alex Chireau is personally accepting 30 new cosmetic cases in May 2026 — crowns, bridges, veneers, and full smile restorations at a founding patient rate that will not be offered again. Lifetime warranty included.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "AK Ultimate Dental — May Founding Patient Rate · Lifetime Warranty",
    description: "30 slots. Lifetime warranty included. Dr. Alex Chireau, Las Vegas.",
    images: [{ url: "/images/crowns-lp/hero-main.webp", width: 1920, height: 1920 }],
  },
};

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

export default function CrownsMayV2Page() {
  // Video: State 1 = placeholder, State 2 = local file if it exists
  const videoPath = path.join(process.cwd(), "public", "videos", "alex-intro.mp4");
  const hasVideo = existsSync(videoPath);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', system-ui, sans-serif; background: ${BG_DARK}; color: ${TEXT_DARK}; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
      `}</style>

      {/* ── STICKY TOP BAR ──────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: BG_DARK,
        borderBottom: "1px solid rgba(196,168,130,0.2)",
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontWeight: 500, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={14} />
          {PHONE} · Call or Text
        </a>
        <a href="#consultation-form" style={{
          background: ACCENT, color: "#fff",
          padding: "9px 20px", fontWeight: 600, fontSize: 13,
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          letterSpacing: "0.03em",
        }}>
          Request a Consultation <ArrowRight size={13} />
        </a>
      </div>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ minHeight: "calc(100svh - 48px)", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="hero-grid">
        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-img-col { order: -1; min-height: 55vw; }
            .hero-text-col { padding: 40px 24px !important; }
          }
        `}</style>

        {/* Left text column */}
        <div style={{
          padding: "72px 48px 72px 48px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          background: BG_DARK,
        }} className="hero-text-col">

          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>
            May 2026 · Limited Cosmetic Calendar · Las Vegas
          </p>

          <h1 className="serif" style={{
            fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
            fontWeight: 600, lineHeight: 1.1,
            color: TEXT_DARK, marginBottom: 24,
            letterSpacing: "-0.01em",
          }}>
            The smile you&apos;ve<br />considered.<br />
            <em style={{ color: ACCENT_LIGHT }}>Finally done right.</em>
          </h1>

          <p style={{ color: TEXT_MUTED, fontSize: 16, lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
            Dr. Alex Chireau is personally accepting 30 new cosmetic cases this May — crowns, bridges, veneers, and full smile restorations — at a founding patient rate that will not be offered again.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
            <a
              href="#consultation-form"
              id="consultation-form"
              style={{
                background: ACCENT, color: "#fff",
                padding: "16px 28px", fontWeight: 600, fontSize: 15,
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
                alignSelf: "flex-start", letterSpacing: "0.02em",
              }}
            >
              Request a Complimentary Consultation <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} />
              {PHONE} · Call or Text
            </a>
          </div>

          {/* Trust bar — PART I #1: Lifetime Warranty added */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 24px", paddingTop: 24, borderTop: "1px solid rgba(196,168,130,0.15)" }}>
            {[
              "128 Five-Star Reviews",
              "CEREC Same-Day Crown",
              "UNLV DMD Trained",
              "Lifetime Warranty Included",
            ].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <CheckCircle size={13} style={{ color: ACCENT }} />
                <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right image column */}
        <div className="hero-img-col" style={{ position: "relative", overflow: "hidden" }}>
          <Image
            src="/images/crowns-lp/hero-main.webp"
            alt="Before and after full arch porcelain crowns by Dr. Alex Chireau, AK Ultimate Dental Las Vegas"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* ── REVIEW STRIP ────────────────────────────────────── */}
      <section style={{ background: "#1A1714", padding: "40px 24px", textAlign: "center", borderTop: "1px solid rgba(196,168,130,0.1)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={ACCENT} xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <blockquote className="serif" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontStyle: "italic", color: TEXT_DARK, lineHeight: 1.55, marginBottom: 16 }}>
            &ldquo;I&apos;ve been to a lot of dentists in Las Vegas. Dr. Chireau&apos;s work is in a completely different category.&rdquo;
          </blockquote>
          <p style={{ fontSize: 12, color: TEXT_MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Verified Google Review
          </p>
        </div>
      </section>

      {/* ── TREATMENTS ──────────────────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
            What&apos;s included this May
          </p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 56, letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Four treatments. One founding rate.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 1, background: "rgba(196,168,130,0.1)" }}>
            {[
              {
                num: "01", title: "Porcelain Crowns", price: "$1,500", was: "$3,000", unit: "per tooth · May rate",
                desc: "CEREC same-day. No temporaries. No lab wait. Lifetime warranty included.",
                img: "/images/crowns-lp/treatment-crowns.webp",
                alt: "Porcelain crown before and after, AK Ultimate Dental Las Vegas",
              },
              {
                num: "02", title: "Dental Bridges", price: "From $3,000", was: "From $6,000", unit: "3-unit · May rate",
                desc: "Fixed porcelain. Designed for function and aesthetics.",
                img: "/images/crowns-lp/treatment-bridges.webp",
                alt: "Custom ceramic bridge on dental model, Dr. Chireau",
              },
              {
                num: "03", title: "Porcelain Veneers", price: "$1,000", was: "$2,000", unit: "per tooth · May rate",
                desc: "Ultra-thin ceramic. Permanent. Natural-looking.",
                img: "/images/crowns-lp/treatment-veneers.webp",
                alt: "Porcelain veneer smile transformation before and after",
              },
              {
                num: "04", title: "Full Smile Restoration", price: "Custom quote", was: null, unit: "May rate applies",
                desc: "Complete mouth reconstruction planned as one aesthetic case.",
                img: "/images/crowns-lp/treatment-restoration.webp",
                alt: "Full mouth restoration before and after, Dr. Chireau Las Vegas",
              },
            ].map((card) => (
              <div key={card.num} style={{ background: "#111009", overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src={card.img} alt={card.alt} fill className="object-cover" loading="lazy" sizes="(max-width: 600px) 100vw, 25vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.8) 0%, transparent 60%)" }} />
                </div>
                <div style={{ padding: "24px 28px 32px" }}>
                  <p style={{ fontSize: 11, color: ACCENT_LIGHT, letterSpacing: "0.12em", marginBottom: 8, fontWeight: 500 }}>{card.num}</p>
                  <h3 className="serif" style={{ fontSize: "1.35rem", fontWeight: 600, color: TEXT_DARK, marginBottom: 12, lineHeight: 1.2 }}>{card.title}</h3>
                  <p style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16, lineHeight: 1.6 }}>{card.desc}</p>
                  <div>
                    {card.was && <p style={{ fontSize: 11, color: TEXT_MUTED, textDecoration: "line-through", marginBottom: 2 }}>{card.was}</p>}
                    <p style={{ fontSize: "1.4rem", fontWeight: 600, color: ACCENT_LIGHT, fontFamily: "'Cormorant Garamond', serif" }}>{card.price}</p>
                    <p style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{card.unit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 20, lineHeight: 1.7 }}>
            Founding patient rate for new patients booking consultation in May 2026. Rate locks at consultation booking. Valid for treatment accepted within 30 days.
          </p>
        </div>
      </section>

      {/* ── DOCTOR SECTION ──────────────────────────────────── */}
      <section style={{ background: BG_CREAM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="doctor-grid">
          <style>{`@media (max-width: 768px) { .doctor-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>

          {/* Left — placeholder until headshot supplied */}
          <div style={{
            aspectRatio: "3/4",
            background: "#E8E3DA",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "#9A8E82", fontSize: 14, textAlign: "center", padding: 32, gap: 12,
          }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#D5CCBF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9A8E82" strokeWidth="1.5">
                <circle cx="12" cy="7" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/>
              </svg>
            </div>
            <p style={{ fontWeight: 600, color: "#7A736A" }}>Dr. Alex Chireau, DMD</p>
            <p style={{ fontSize: 12, lineHeight: 1.5 }}>Headshot coming soon</p>
          </div>

          {/* Right — bio */}
          <div>
            <p style={{ color: ACCENT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
              Your Doctor
            </p>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: "#1A1410", marginBottom: 20, lineHeight: 1.15 }}>
              Dr. Alex Chireau, DMD
            </h2>
            <p style={{ color: "#4A423A", fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
              Dr. Chireau trained at the UNLV School of Dental Medicine and has spent years building one of Las Vegas&apos;s most trusted cosmetic practices — one patient at a time. His approach is precise, unhurried, and deeply personal.
            </p>

            <ul style={{ listStyle: "none", marginBottom: 32, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Doctor of Dental Medicine — UNLV School of Dental Medicine",
                "CEREC Certified — same-day ceramic restorations, in-office",
                "128 verified five-star reviews",
                "Every photo on this page is Dr. Chireau's own clinical work",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: ACCENT, marginTop: 3, flexShrink: 0 }}>·</span>
                  <span style={{ fontSize: 14, color: "#4A423A", lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>

            <blockquote style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 20 }}>
              <p className="serif" style={{ fontSize: "1.15rem", fontStyle: "italic", color: "#2A2016", lineHeight: 1.65, marginBottom: 8 }}>
                &ldquo;I&apos;ve always believed that the best dental work is the work nobody notices — except you, every time you smile.&rdquo;
              </p>
              <footer style={{ fontSize: 12, color: TEXT_MUTED }}>
                — Dr. Alex Chireau, DMD
                <span style={{ marginLeft: 8, fontSize: 11, fontStyle: "italic", color: "#9A8E82" }}>[Replace with your own words]</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ───────────────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "96px 24px", borderTop: "1px solid rgba(196,168,130,0.1)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500, textAlign: "center" }}>
            Meet Your Doctor
          </p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 40, lineHeight: 1.15, textAlign: "center" }}>
            A word from Dr. Chireau
          </h2>

          {hasVideo ? (
            /* STATE 2 — real video */
            <div style={{ position: "relative", width: "100%", background: "#000" }}>
              <video
                controls
                preload="metadata"
                style={{ width: "100%", display: "block", maxHeight: 540 }}
                poster="/images/crowns-lp/hero-main.webp"
              >
                <source src="/videos/alex-intro.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>
          ) : (
            /* STATE 1 — placeholder */
            <div style={{
              position: "relative", width: "100%", aspectRatio: "16/9",
              background: "linear-gradient(135deg, #1A1714 0%, #0D0B09 100%)",
              border: "1px solid rgba(196,168,130,0.15)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20,
              overflow: "hidden",
            }}>
              {/* Subtle ambient texture */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(139,111,71,0.08) 0%, transparent 70%)" }} />

              {/* Play button (visual only) */}
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(196,168,130,0.12)",
                border: "2px solid rgba(196,168,130,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={ACCENT_LIGHT} style={{ marginLeft: 3 }}>
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </div>

              <div style={{ textAlign: "center", position: "relative" }}>
                <p style={{ color: TEXT_DARK, fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Dr. Chireau · Introduction Coming Soon</p>
                <p style={{ color: TEXT_MUTED, fontSize: 13 }}>Video will appear here when published</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────── */}
      <section style={{ background: BG_CREAM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: ACCENT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
            Real Results
          </p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "#1A1410", marginBottom: 16, lineHeight: 1.15 }}>
            The work speaks for itself.
          </h2>
          <p style={{ fontSize: 15, color: "#4A423A", maxWidth: 580, lineHeight: 1.75, marginBottom: 56 }}>
            Every photograph is Dr. Chireau&apos;s own clinical work — shot in-office at AK Ultimate Dental, Las Vegas. Before and after. Zero editing. Zero stock imagery.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }} className="gallery-grid">
            <style>{`@media (max-width: 640px) { .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; } .gallery-g1 { grid-column: span 2 !important; } }`}</style>
            {[
              { src: "/images/crowns-lp/gallery-g1.webp", alt: "Before and after full arch porcelain crowns by Dr. Alex Chireau, AK Ultimate Dental Las Vegas", span: true },
              { src: "/images/crowns-lp/gallery-g2.webp", alt: "Close-up before and after porcelain veneers, Dr. Chireau Las Vegas", span: false },
              { src: "/images/crowns-lp/gallery-g3.webp", alt: "Full smile crown restoration before and after, AK Ultimate Dental", span: false },
              { src: "/images/crowns-lp/gallery-g4.webp", alt: "Custom porcelain crown detail showing natural translucency, Dr. Chireau", span: false },
              { src: "/images/crowns-lp/gallery-g5.webp", alt: "Full upper and lower crown restoration, Las Vegas cosmetic dentist", span: false },
              { src: "/images/crowns-lp/gallery-g6.webp", alt: "Single front tooth crown before and after, same-day CEREC", span: false },
            ].map((img, i) => (
              <div key={i} className={img.span ? "gallery-g1" : ""} style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", gridColumn: img.span ? "span 2" : undefined }}>
                <Image src={img.src} alt={img.alt} fill className="object-cover" loading="lazy" sizes="(max-width: 640px) 100vw, 33vw" />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 16 }}>
            All photographs are real patients of Dr. Alex Chireau, DMD. Results may vary by patient.
          </p>
        </div>
      </section>

      {/* ── PRICING TABLE ───────────────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "96px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
            Transparent Pricing
          </p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 16, lineHeight: 1.15 }}>
            No surprises. No hidden fees.
          </h2>
          <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.75, marginBottom: 40 }}>
            Your May consultation is complimentary. Your rate locks the day you book. No bait-and-switch additions.
          </p>

          {/* PART I #2 — Lifetime Warranty callout above pricing table */}
          <div style={{
            background: "rgba(196,168,130,0.08)",
            border: "1px solid rgba(196,168,130,0.25)",
            padding: "20px 24px",
            marginBottom: 32,
            display: "flex", alignItems: "flex-start", gap: 16,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACCENT_LIGHT} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <p style={{ fontWeight: 600, color: TEXT_DARK, fontSize: 15, marginBottom: 6 }}>Lifetime Warranty Included</p>
              <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.7, marginBottom: 10 }}>
                We will replace or rebond your crown at no cost for the rest of your life.* The only Las Vegas dentist to offer this guarantee.
              </p>
              <p style={{ fontSize: 11, color: "#4A423A", lineHeight: 1.65 }}>
                *Applies to crowns placed by Dr. Chireau at AK Ultimate Dental. Covers clinical crown failure or debonding. Excludes trauma, unguarded grinding, or neglected follow-up care. Current exam required to process claim.
              </p>
            </div>
          </div>

          {/* Table */}
          <div style={{ border: "1px solid rgba(196,168,130,0.15)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", background: "rgba(139,111,71,0.15)", padding: "12px 24px", gap: 16 }}>
              <p style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Service</p>
              <p style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", whiteSpace: "nowrap" }}>Standard</p>
              <p style={{ fontSize: 11, color: ACCENT_LIGHT, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", whiteSpace: "nowrap", minWidth: 110 }}>May Rate</p>
            </div>
            {[
              { service: "Porcelain Crown (per tooth)", standard: "$3,000", may: "$1,500" },
              { service: "Porcelain Veneers (per tooth)", standard: "$2,000", may: "$1,000" },
              { service: "3-Unit Bridge", standard: "From $6,000", may: "From $3,000" },
              { service: "Consultation & X-ray", standard: "$0", may: "$0" },
              { service: "CEREC Digital Scan, Design & Milling", standard: "Included", may: "Included" },
              { service: "Lifetime Warranty (Crowns)", standard: "—", may: "Included" },
              { service: "0% Financing · Cherry, CareCredit, Sunbit", standard: "Available", may: "Available" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto",
                padding: "16px 24px", gap: 16,
                borderTop: "1px solid rgba(196,168,130,0.08)",
                background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent",
                alignItems: "center",
              }}>
                <p style={{ fontSize: 14, color: TEXT_DARK }}>{row.service}</p>
                <p style={{ fontSize: 13, color: TEXT_MUTED, textDecoration: ["$3,000","$2,000","From $6,000"].includes(row.standard) ? "line-through" : "none", textAlign: "right", whiteSpace: "nowrap" }}>{row.standard}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: ACCENT_LIGHT, textAlign: "right", whiteSpace: "nowrap", minWidth: 110 }}>{row.may}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(139,111,71,0.08)", border: "1px solid rgba(139,111,71,0.2)", padding: "20px 24px", marginTop: 16, marginBottom: 48 }}>
            <p style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.75 }}>
              Founding patient rate locks at consultation booking. Valid for treatment accepted within 30 days. New patients only. Cannot be combined with insurance or other offers. 30 slots total, May 2026 only.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <a href="#consultation-form" style={{ background: ACCENT, color: "#fff", padding: "16px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, letterSpacing: "0.02em" }}>
              Book My Free Consultation <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} />
              {PHONE} · Call or Text
            </a>
          </div>
        </div>
      </section>

      {/* ── 30 SLOTS ────────────────────────────────────────── */}
      <section style={{ background: BG_CREAM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="slots-grid">
          <style>{`@media (max-width: 768px) { .slots-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>

          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 20 }}>
              {[...Array(30)].map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i < 7 ? ACCENT : "transparent",
                  border: `1px solid ${i < 7 ? ACCENT : "rgba(139,111,71,0.3)"}`,
                }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, background: ACCENT }} />
                <span style={{ fontSize: 11, color: "#4A423A" }}>Consultation booked</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, border: "1px solid rgba(139,111,71,0.4)" }} />
                <span style={{ fontSize: 11, color: "#4A423A" }}>Available</span>
              </div>
            </div>
          </div>

          <div>
            <p className="serif" style={{ fontSize: "clamp(4rem, 8vw, 7rem)", fontWeight: 600, color: "#1A1410", lineHeight: 1, marginBottom: 4 }}>30</p>
            <p style={{ fontSize: 14, color: ACCENT, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
              Founding Patient Slots · May 2026
            </p>
            <p style={{ color: "#4A423A", fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              Dr. Chireau is personally accepting 30 new cosmetic cases this month. When consultations are filled, the founding patient rate closes permanently. No waitlist, no extension, no exceptions after May 31.
            </p>
            <a href="#consultation-form" style={{ background: ACCENT, color: "#fff", padding: "16px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, letterSpacing: "0.02em" }}>
              Request My Consultation <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section style={{ background: ACCENT, padding: "96px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 className="serif" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: 20, letterSpacing: "-0.01em" }}>
            Ready to see what Dr. Chireau can do?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 40 }}>
            Complimentary consultation. Rate locks when you book. Same-day crowns available. Lifetime warranty included.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <a href="#consultation-form" style={{
              background: "#fff", color: ACCENT,
              padding: "18px 36px", fontWeight: 700, fontSize: 16,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, letterSpacing: "0.02em",
            }}>
              Request a Consultation <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={15} />
              {PHONE} · Call or Text
            </a>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 32, lineHeight: 1.6 }}>
            AK Ultimate Dental · {ADDRESS} · {HOURS}
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ background: "#080706", padding: "40px 24px", borderTop: "1px solid rgba(196,168,130,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 32 }}>
            <div>
              <p style={{ fontWeight: 600, color: TEXT_DARK, marginBottom: 6 }}>AK Ultimate Dental</p>
              <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>{ADDRESS}</p>
              <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>{HOURS}</p>
              <a href={PHONE_HREF} style={{ fontSize: 13, color: ACCENT_LIGHT, textDecoration: "none" }}>{PHONE}</a>
            </div>
            <a href="https://akultimatedental.com" style={{ fontSize: 13, color: TEXT_MUTED, textDecoration: "none" }}>
              Main Site →
            </a>
          </div>
          {/* PART I #3 — Lifetime Warranty in footer legal */}
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
