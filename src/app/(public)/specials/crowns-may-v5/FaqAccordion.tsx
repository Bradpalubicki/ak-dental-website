"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ACCENT = "#8B6F47";

const FAQS = [
  {
    q: "Does getting a crown hurt?",
    a: "Most patients feel little to no discomfort. We use local anesthetic for the prep. CEREC milling and placement is completely painless.",
  },
  {
    q: "How long does a crown last?",
    a: "A well-placed porcelain or zirconia crown typically lasts 10–15 years. Every crown Dr. Chireau places includes a lifetime warranty — replaced or rebonded at no cost if it fails due to clinical factors.",
  },
  {
    q: "Does insurance cover crowns?",
    a: "Many plans cover 50–80% when medically necessary. We recommend calling your insurer before your visit. We also offer 0% financing through Cherry, CareCredit, and Sunbit for any remaining balance.",
  },
  {
    q: "Standard crown vs zirconia — what's the difference?",
    a: "Standard porcelain is excellent for front teeth. Zirconia is stronger and recommended for back teeth that take more biting force. Dr. Chireau will recommend the right material at your complimentary consultation.",
  },
  {
    q: "What is a build-up and do I need one?",
    a: "A build-up is a foundation placed inside the tooth when there isn't enough healthy structure to support a crown. Most significantly damaged teeth require one. Determined at your exam — no surprises.",
  },
  {
    q: "Why is the May rate lower than standard pricing?",
    a: "Dr. Chireau is personally accepting the first 20 new cosmetic cases in May. This rate will not be offered again after May 31 or when 20 slots fill.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(139,111,71,0.15)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left" }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1410" }}>{q}</span>
        <ChevronDown size={18} color={ACCENT} style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {open && (
        <p style={{ fontSize: 14, color: "#4A423A", lineHeight: 1.8, paddingBottom: 20, paddingRight: 32 }}>{a}</p>
      )}
    </div>
  );
}

export default function FaqAccordion() {
  return (
    <div>
      {FAQS.map((faq, i) => (
        <FaqItem key={i} q={faq.q} a={faq.a} />
      ))}
    </div>
  );
}
