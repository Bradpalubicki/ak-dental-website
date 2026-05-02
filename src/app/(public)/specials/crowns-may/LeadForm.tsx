"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { submitLead } from "./actions";

const ACCENT = "#D4AF37";
const BG_DARK = "#0D0B09";
const TEXT_LIGHT = "#F5F0E8";
const TEXT_MUTED = "#9A8F7A";

export default function LeadForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitLead(fd);
      if (result.success) {
        setDone(true);
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  if (done) {
    return (
      <div style={{
        background: "rgba(0,0,0,0.25)",
        border: `1px solid rgba(212,175,55,0.4)`,
        padding: "40px 32px",
        textAlign: "center",
        maxWidth: 480,
        margin: "0 auto",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", color: TEXT_LIGHT, fontWeight: 600, marginBottom: 8 }}>
          You&apos;re on the list.
        </p>
        <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.7 }}>
          Dr. Chireau&apos;s team will call you within one business day to confirm your spot.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: TEXT_LIGHT,
    padding: "14px 16px",
    fontSize: 15,
    outline: "none",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: TEXT_MUTED,
    marginBottom: 6,
    fontWeight: 600,
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={labelStyle} htmlFor="name">Your Name</label>
        <input id="name" name="name" type="text" required placeholder="First and last name" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle} htmlFor="phone">Phone Number</label>
        <input id="phone" name="phone" type="tel" required placeholder="(702) 000-0000" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle} htmlFor="preferred_time">Best Time to Call</label>
        <select id="preferred_time" name="preferred_time" required style={{ ...inputStyle, cursor: "pointer" }}>
          <option value="">Select a time...</option>
          <option value="Morning">Morning (8am – 12pm)</option>
          <option value="Afternoon">Afternoon (12pm – 4pm)</option>
          <option value="Evening">Evening (4pm – 7pm)</option>
        </select>
      </div>

      {error && (
        <p style={{ fontSize: 13, color: "#E87070", textAlign: "center" }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          background: isPending ? "#9A8F7A" : BG_DARK,
          color: ACCENT,
          border: `2px solid ${ACCENT}`,
          padding: "16px 28px",
          fontWeight: 700,
          fontSize: 15,
          cursor: isPending ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          letterSpacing: "0.02em",
          width: "100%",
        }}
      >
        {isPending ? "Submitting..." : <>Claim My Spot <ArrowRight size={16} /></>}
      </button>

      <p style={{ fontSize: 11, color: TEXT_MUTED, textAlign: "center", lineHeight: 1.7 }}>
        By submitting, you agree to be contacted by AK Ultimate Dental. We never share your information.
      </p>
    </form>
  );
}
