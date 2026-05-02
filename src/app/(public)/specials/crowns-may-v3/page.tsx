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
    images: [{ url: "/images/crowns-lp/ba-extra-2.webp", width: 1200, height: 1200 }],
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

export default function CrownsMayV3Page() {
  const videoPath = path.join(process.cwd(), "public", "videos", "alex-intro.mp4");
  const hasVideo = existsSync(videoPath);
  const testimonialVideoUrl = process.env.NEXT_PUBLIC_PATIENT_TESTIMONIAL_URL ?? "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', system-ui, sans-serif; background: ${BG_DARK}; color: ${TEXT_DARK}; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img-col { order: -1; min-height: 65vw; }
          .hero-text-col { padding: 40px 20px !important; }
          .doctor-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .slots-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .gallery-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .gallery-span2 { grid-column: span 2 !important; }
          .topbar-logo { display: none !important; }
        }
      `}</style>

      {/* ── STICKY TOP BAR ─────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: BG_DARK, borderBottom: "1px solid rgba(196,168,130,0.2)", padding: "10px 24px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        {/* Left: phone */}
        <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontWeight: 500, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={14} />{PHONE} · Call or Text
        </a>
        {/* Center: logo */}
        <div className="topbar-logo" style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/ak-logo.png" alt="AK Ultimate Dental" width={140} height={44} style={{ objectFit: "contain", filter: "brightness(1.05)" }} priority />
        </div>
        {/* Right: CTA */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "9px 20px", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.03em" }}>
            Request a Consultation <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ minHeight: "calc(100svh - 56px)", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="hero-grid">
        <div style={{ padding: "72px 48px", display: "flex", flexDirection: "column", justifyContent: "center", background: BG_DARK }} className="hero-text-col">
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>
            May 2026 · Limited Cosmetic Calendar · Las Vegas
          </p>
          <h1 className="serif" style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", fontWeight: 600, lineHeight: 1.1, color: TEXT_DARK, marginBottom: 24, letterSpacing: "-0.01em" }}>
            The smile you&apos;ve<br />considered.<br />
            <em style={{ color: ACCENT_LIGHT }}>Finally done right.</em>
          </h1>
          <p style={{ color: TEXT_MUTED, fontSize: 16, lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
            Dr. Alex Chireau is personally accepting 30 new cosmetic cases this May — crowns, bridges, veneers, and full smile restorations — at a founding patient rate that will not be offered again.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
            <a href="#consult" id="consult" style={{ background: ACCENT, color: "#fff", padding: "16px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", letterSpacing: "0.02em" }}>
              Request a Complimentary Consultation <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} />{PHONE} · Call or Text
            </a>
          </div>
          {/* Trust bar — lifetime warranty #1 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 20px", paddingTop: 24, borderTop: "1px solid rgba(196,168,130,0.15)" }}>
            {["128 Five-Star Reviews", "CEREC Same-Day Crown", "UNLV DMD Trained", "Lifetime Warranty Included"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <CheckCircle size={13} style={{ color: ACCENT }} />
                <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Hero image — ba-extra-2: best dramatic full-mouth B/A */}
        <div className="hero-img-col" style={{ position: "relative", overflow: "hidden" }}>
          <Image src="/images/crowns-lp/ba-extra-2.webp" alt="Before and after full mouth porcelain crown restoration by Dr. Alex Chireau, AK Ultimate Dental Las Vegas" fill className="object-cover object-top" priority sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      </section>

      {/* ── REVIEW STRIP ────────────────────────────────── */}
      <section style={{ background: "#1A1714", padding: "40px 24px", textAlign: "center", borderTop: "1px solid rgba(196,168,130,0.1)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
            {[...Array(5)].map((_, i) => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={ACCENT}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
          </div>
          <blockquote className="serif" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontStyle: "italic", color: TEXT_DARK, lineHeight: 1.55, marginBottom: 16 }}>
            &ldquo;I&apos;ve been to a lot of dentists in Las Vegas. Dr. Chireau&apos;s work is in a completely different category.&rdquo;
          </blockquote>
          <p style={{ fontSize: 12, color: TEXT_MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Verified Google Review</p>
        </div>
      </section>

      {/* ── SMILE TRANSFORMATIONS — 4 dramatic B/A ──────── */}
      <section style={{ background: BG_DARK, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Real Patient Results</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 12, lineHeight: 1.15 }}>
            Smile transformations.
          </h2>
          <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.75, marginBottom: 48, maxWidth: 560 }}>
            Every photograph below is Dr. Chireau&apos;s own clinical work — shot in-office. Before and after. No filters. No stock imagery.
          </p>

          {/* 2-col grid — large B/As side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 3 }} className="gallery-3col" >
            {[
              { src: "/images/crowns-lp/ba-extra-5.webp", label: "Full upper arch crowns", caption: "Complete upper arch · porcelain crowns" },
              { src: "/images/crowns-lp/ba-extra-7.webp", label: "Chipped anteriors → crowns", caption: "Damaged front teeth · same-day CEREC · @AK Ultimate Dental" },
            ].map((img) => (
              <div key={img.src} style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1" }}>
                <Image src={img.src} alt={img.label} fill className="object-cover" loading="lazy" sizes="50vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,11,9,0.65) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px" }}>
                  <p style={{ fontSize: 12, color: ACCENT_LIGHT, fontWeight: 600, marginBottom: 2 }}>{img.label}</p>
                  <p style={{ fontSize: 11, color: "rgba(240,234,224,0.65)" }}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }} className="gallery-3col">
            {[
              { src: "/images/crowns-lp/ba-extra-9.webp", label: "Yellowed/gapped → white crowns" },
              { src: "/images/crowns-lp/ba-extra-6.webp", label: "Full arch · before & after side view" },
              { src: "/images/crowns-lp/ba-extra-8.webp", label: "Cracked anteriors → restored" },
            ].map((img) => (
              <div key={img.src} style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1" }}>
                <Image src={img.src} alt={img.label} fill className="object-cover" loading="lazy" sizes="33vw" />
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
          {/* X-ray card — procedure-4: "This is how I like my crowns to fit - ALL THE TIME!" */}
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
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 16, lineHeight: 1.15, textAlign: "center" }}>
            What patients say.
          </h2>
          <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.75, marginBottom: 40, textAlign: "center", maxWidth: 560, margin: "0 auto 40px" }}>
            This is a real patient, in Dr. Chireau&apos;s chair, reviewing her X-rays after treatment.
          </p>
          {testimonialVideoUrl ? (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
              <iframe
                src={testimonialVideoUrl}
                title="Patient testimonial — AK Ultimate Dental"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              />
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
          {/* Pull quote below video */}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 1, background: "rgba(196,168,130,0.1)" }}>
            {[
              { num: "01", title: "Porcelain Crowns", price: "$1,500", was: "$3,000", unit: "per tooth · May rate", desc: "CEREC same-day. No temporaries. No lab wait. Lifetime warranty included.", img: "/images/crowns-lp/treatment-crowns.webp", alt: "Porcelain crown before and after, AK Ultimate Dental Las Vegas" },
              { num: "02", title: "Dental Bridges", price: "From $3,000", was: "From $6,000", unit: "3-unit · May rate", desc: "Fixed porcelain. Designed for function and aesthetics.", img: "/images/crowns-lp/treatment-bridges.webp", alt: "Custom ceramic bridge on dental model, Dr. Chireau" },
              { num: "03", title: "Porcelain Veneers", price: "$1,000", was: "$2,000", unit: "per tooth · May rate", desc: "Ultra-thin ceramic. Permanent. Natural-looking.", img: "/images/crowns-lp/treatment-veneers.webp", alt: "Porcelain veneer smile transformation before and after" },
              { num: "04", title: "Full Smile Restoration", price: "Custom quote", was: null, unit: "May rate applies", desc: "Complete mouth reconstruction planned as one aesthetic case.", img: "/images/crowns-lp/treatment-restoration.webp", alt: "Full mouth restoration before and after, Dr. Chireau Las Vegas" },
            ].map((card) => (
              <div key={card.num} style={{ background: "#111009", overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src={card.img} alt={card.alt} fill className="object-cover" loading="lazy" sizes="25vw" />
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
          <p style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 20, lineHeight: 1.7 }}>Founding patient rate for new patients booking consultation in May 2026. Rate locks at consultation booking. Valid for treatment accepted within 30 days.</p>
        </div>
      </section>

      {/* ── CLINICAL DEPTH — molar & root canal work ─────── */}
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
              { src: "/images/crowns-lp/ba-extra-1.webp", label: "Molar crown B/A", caption: "Cracked molar → ceramic crown, closeup" },
              { src: "/images/crowns-lp/ba-extra-4.webp", label: "Molar restoration", caption: "Before & after · @Dr.Chireu" },
              { src: "/images/crowns-lp/procedure-2.webp", label: "Root canal + crown · 1 visit", caption: "Root canal and crown in 1 visit" },
            ].map((img) => (
              <div key={img.src} style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1", background: "#E8E3DA" }}>
                <Image src={img.src} alt={img.label} fill className="object-cover object-center" loading="lazy" sizes="33vw" />
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
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="doctor-grid">
          {/* Placeholder until headshot supplied */}
          <div style={{ aspectRatio: "3/4", background: "#1A1714", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: TEXT_MUTED, fontSize: 14, textAlign: "center", padding: 32, gap: 12, border: "1px solid rgba(196,168,130,0.1)" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#2A2520", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5"><circle cx="12" cy="7" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/></svg>
            </div>
            <p style={{ fontWeight: 600, color: ACCENT_LIGHT }}>Dr. Alex Chireau, DMD</p>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: "#4A423A" }}>Headshot coming soon</p>
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
            <blockquote style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 20 }}>
              <p className="serif" style={{ fontSize: "1.15rem", fontStyle: "italic", color: TEXT_DARK, lineHeight: 1.65, marginBottom: 8 }}>
                &ldquo;I&apos;ve always believed that the best dental work is the work nobody notices — except you, every time you smile.&rdquo;
              </p>
              <footer style={{ fontSize: 12, color: TEXT_MUTED }}>
                — Dr. Alex Chireau, DMD <span style={{ fontStyle: "italic", marginLeft: 8, color: "#3A3530" }}>[Replace with your own words]</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── DR. INTRO VIDEO ──────────────────────────────── */}
      <section style={{ background: "#1A1714", padding: "96px 24px", borderTop: "1px solid rgba(196,168,130,0.1)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500, textAlign: "center" }}>Meet Your Doctor</p>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 40, lineHeight: 1.15, textAlign: "center" }}>
            A word from Dr. Chireau
          </h2>
          {hasVideo ? (
            <div style={{ position: "relative", width: "100%", background: "#000" }}>
              <video controls preload="metadata" style={{ width: "100%", display: "block", maxHeight: 540 }} poster="/images/crowns-lp/ba-extra-2.webp">
                <source src="/videos/alex-intro.mp4" type="video/mp4" />
              </video>
            </div>
          ) : (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, #1A1714 0%, #0D0B09 100%)", border: "1px solid rgba(196,168,130,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(139,111,71,0.08) 0%, transparent 70%)" }} />
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(196,168,130,0.12)", border: "2px solid rgba(196,168,130,0.35)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={ACCENT_LIGHT} style={{ marginLeft: 3 }}><polygon points="5,3 19,12 5,21"/></svg>
              </div>
              <div style={{ textAlign: "center", position: "relative" }}>
                <p style={{ color: TEXT_DARK, fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Dr. Chireau · Introduction Coming Soon</p>
                <p style={{ color: TEXT_MUTED, fontSize: 13 }}>Video will appear here when published</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PRICING + WARRANTY ───────────────────────────── */}
      <section style={{ background: BG_DARK, padding: "96px 24px", borderTop: "1px solid rgba(196,168,130,0.08)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ color: ACCENT_LIGHT, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Transparent Pricing</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: TEXT_DARK, marginBottom: 16, lineHeight: 1.15 }}>
            No surprises. No hidden fees.
          </h2>
          <p style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.75, marginBottom: 40 }}>
            Your May consultation is complimentary. Your rate locks the day you book. No bait-and-switch additions.
          </p>

          {/* Lifetime warranty callout — #2 */}
          <div style={{ background: "rgba(196,168,130,0.08)", border: "1px solid rgba(196,168,130,0.25)", padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "flex-start", gap: 16 }}>
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
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "16px 24px", gap: 16, borderTop: "1px solid rgba(196,168,130,0.08)", background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent", alignItems: "center" }}>
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
            <a href="#consult" style={{ background: ACCENT, color: "#fff", padding: "16px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Book My Free Consultation <ArrowRight size={16} />
            </a>
            <a href={PHONE_HREF} style={{ color: ACCENT_LIGHT, fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} />{PHONE} · Call or Text
            </a>
          </div>
        </div>
      </section>

      {/* ── 30 SLOTS ─────────────────────────────────────── */}
      <section style={{ background: BG_CREAM, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="slots-grid">
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 20 }}>
              {[...Array(30)].map((_, i) => (
                <div key={i} style={{ aspectRatio: "1/1", background: i < 7 ? ACCENT : "transparent", border: `1px solid ${i < 7 ? ACCENT : "rgba(139,111,71,0.3)"}` }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, background: ACCENT }} /><span style={{ fontSize: 11, color: "#4A423A" }}>Consultation booked</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, border: "1px solid rgba(139,111,71,0.4)" }} /><span style={{ fontSize: 11, color: "#4A423A" }}>Available</span></div>
            </div>
          </div>
          <div>
            <p className="serif" style={{ fontSize: "clamp(4rem, 8vw, 7rem)", fontWeight: 600, color: "#1A1410", lineHeight: 1, marginBottom: 4 }}>30</p>
            <p style={{ fontSize: 14, color: ACCENT, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>Founding Patient Slots · May 2026</p>
            <p style={{ color: "#4A423A", fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
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

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ background: "#080706", padding: "40px 24px", borderTop: "1px solid rgba(196,168,130,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Image src="/ak-logo.png" alt="AK Ultimate Dental" width={160} height={50} style={{ objectFit: "contain", objectPosition: "left" }} />
              <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>{ADDRESS}</p>
              <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>{HOURS}</p>
              <a href={PHONE_HREF} style={{ fontSize: 13, color: ACCENT_LIGHT, textDecoration: "none" }}>{PHONE}</a>
            </div>
            <a href="https://akultimatedental.com" style={{ fontSize: 13, color: TEXT_MUTED, textDecoration: "none" }}>Main Site →</a>
          </div>
          {/* Lifetime warranty in footer legal — #3 */}
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
