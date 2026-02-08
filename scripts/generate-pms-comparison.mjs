import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "..", "AK_Ultimate_Dental_PMS_Comparison_and_Vision.pdf");

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  info: {
    Title: "Dentrix vs Eaglesoft + One Engine Vision — AK Ultimate Dental",
    Author: "NuStack Digital Ventures / One Engine",
    Subject: "PMS Comparison & Business Automation Vision",
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// ─── Colors ───
const C = {
  navy: "#0F172A",
  darkSlate: "#1E293B",
  slate: "#334155",
  midSlate: "#64748B",
  lightSlate: "#94A3B8",
  gold: "#F59E0B",
  goldDark: "#D97706",
  goldLight: "#FEF3C7",
  cyan: "#06B6D4",
  cyanDark: "#0891B2",
  cyanLight: "#CFFAFE",
  emerald: "#10B981",
  emeraldDark: "#059669",
  emeraldLight: "#D1FAE5",
  red: "#EF4444",
  redLight: "#FEE2E2",
  purple: "#8B5CF6",
  purpleLight: "#EDE9FE",
  white: "#FFFFFF",
  offWhite: "#F8FAFC",
  border: "#E2E8F0",
  bg: "#F1F5F9",
};

// ─── Helpers ───
function drawRect(x, y, w, h, fill, radius = 0) {
  if (radius > 0) {
    doc.roundedRect(x, y, w, h, radius).fill(fill);
  } else {
    doc.rect(x, y, w, h).fill(fill);
  }
}
function pw() { return doc.page.width - doc.page.margins.left - doc.page.margins.right; }
function lx() { return doc.page.margins.left; }

function checkPage(needed = 60) {
  if (doc.y + needed > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
    drawFooter();
    doc.y = doc.page.margins.top;
  }
}

function drawFooter() {
  const y = doc.page.height - 35;
  doc.fontSize(7).fillColor(C.lightSlate)
    .text("Prepared by NuStack Digital Ventures — One Engine Platform  |  Confidential", lx(), y, { width: pw(), align: "center" });
}

// ─── Section Header ───
function sectionHeader(title, subtitle, color = C.navy) {
  checkPage(50);
  drawRect(lx(), doc.y, 4, 24, color, 2);
  doc.fontSize(14).fillColor(color).font("Helvetica-Bold")
    .text(title, lx() + 14, doc.y + 3, { width: pw() - 14 });
  doc.font("Helvetica");
  if (subtitle) {
    doc.fontSize(8.5).fillColor(C.midSlate)
      .text(subtitle, lx() + 14, doc.y + 2, { width: pw() - 14 });
  }
  doc.y += 10;
}

// ─── Table ───
function compTable(headers, rows, colRatios) {
  const x = lx(); const w = pw();
  const ratios = colRatios || (headers.length === 3 ? [0.28, 0.36, 0.36] : [0.30, 0.70]);
  const colWidths = ratios.map(r => w * r);
  const padX = 7; const padY = 5;

  checkPage(24);
  const hH = 22;
  drawRect(x, doc.y, w, hH, C.navy, 3);
  doc.fontSize(8).fillColor(C.white).font("Helvetica-Bold");
  let cx = x;
  headers.forEach((h, i) => {
    doc.text(h, cx + padX, doc.y + 6, { width: colWidths[i] - padX * 2 });
    cx += colWidths[i];
  });
  doc.y += hH;
  doc.font("Helvetica");

  rows.forEach((row, ri) => {
    doc.fontSize(7.5);
    let maxH = 18;
    row.forEach((t, ci) => {
      const h = doc.heightOfString(t || "—", { width: colWidths[ci] - padX * 2 }) + padY * 2;
      if (h > maxH) maxH = h;
    });
    checkPage(maxH + 1);
    drawRect(x, doc.y, w, maxH, ri % 2 === 0 ? C.offWhite : C.white, ri === rows.length - 1 ? 3 : 0);
    cx = x;
    row.forEach((t, ci) => {
      doc.font(ci === 0 ? "Helvetica-Bold" : "Helvetica")
        .fontSize(7.5).fillColor(ci === 0 ? C.darkSlate : C.slate)
        .text(t || "—", cx + padX, doc.y + padY, { width: colWidths[ci] - padX * 2 });
      cx += colWidths[ci];
    });
    doc.y += maxH;
  });
  doc.font("Helvetica");
  doc.y += 8;
}

// ─── Info Box ───
function infoBox(title, text, accent = C.cyan, bg = C.cyanLight) {
  checkPage(60);
  const x = lx(); const w = pw(); const pad = 10;
  doc.fontSize(7.5);
  const tH = doc.heightOfString(text, { width: w - pad * 2 - 8 });
  const boxH = tH + (title ? 22 : 0) + pad * 2;
  drawRect(x, doc.y, w, boxH, bg, 5);
  drawRect(x, doc.y, 4, boxH, accent, 2);
  let iy = doc.y + pad;
  if (title) {
    doc.fontSize(8.5).fillColor(accent).font("Helvetica-Bold")
      .text(title, x + pad + 6, iy, { width: w - pad * 2 - 8 });
    iy += 14;
  }
  doc.fontSize(7.5).fillColor(C.darkSlate).font("Helvetica")
    .text(text, x + pad + 6, iy, { width: w - pad * 2 - 8 });
  doc.y += boxH + 8;
}

// ─── Bullets ───
function bullets(items, color = C.slate) {
  items.forEach(item => {
    checkPage(16);
    const x = lx() + 10; const w = pw() - 20;
    doc.fontSize(8).fillColor(C.gold).text("\u2022", x, doc.y);
    doc.fontSize(8).fillColor(color)
      .text(item, x + 12, doc.y - doc.currentLineHeight(), { width: w - 12 });
    doc.y += 3;
  });
  doc.y += 5;
}

// ─── Stat Cards ───
function statCards(cards) {
  checkPage(55);
  const x = lx(); const w = pw(); const gap = 10;
  const cardW = (w - gap * (cards.length - 1)) / cards.length;
  const cardH = 50;
  cards.forEach((card, i) => {
    const cx = x + i * (cardW + gap);
    drawRect(cx, doc.y, cardW, cardH, C.white, 5);
    doc.roundedRect(cx, doc.y, cardW, cardH, 5).lineWidth(0.5).stroke(C.border);
    doc.fontSize(16).fillColor(card.color || C.navy).font("Helvetica-Bold")
      .text(card.value, cx + 8, doc.y + 8, { width: cardW - 16, align: "center" });
    doc.fontSize(7).fillColor(C.midSlate).font("Helvetica")
      .text(card.label, cx + 8, doc.y + 28, { width: cardW - 16, align: "center" });
  });
  doc.y += cardH + 12;
}

// ─── Pros/Cons ───
function prosConsBox(title, pros, cons, color) {
  checkPage(40);
  doc.fontSize(10).fillColor(color).font("Helvetica-Bold").text(title, lx(), doc.y);
  doc.y += 5; doc.font("Helvetica");
  const halfW = (pw() - 14) / 2;
  const startY = doc.y;

  doc.fontSize(7.5).fillColor(C.emerald).font("Helvetica-Bold").text("STRENGTHS", lx(), doc.y);
  doc.y += 10; doc.font("Helvetica");
  pros.forEach(p => {
    checkPage(14);
    doc.fontSize(7).fillColor(C.emerald).text("\u2713 ", lx(), doc.y, { continued: true });
    doc.fillColor(C.slate).text(p, { width: halfW - 12 });
    doc.y += 2;
  });
  const pY = doc.y;

  doc.y = startY;
  const cx = lx() + halfW + 14;
  doc.fontSize(7.5).fillColor(C.red).font("Helvetica-Bold").text("LIMITATIONS", cx, doc.y);
  doc.y += 10; doc.font("Helvetica");
  cons.forEach(c => {
    checkPage(14);
    doc.fontSize(7).fillColor(C.red).text("\u2717 ", cx, doc.y, { continued: true });
    doc.fillColor(C.slate).text(c, { width: halfW - 12 });
    doc.y += 2;
  });
  doc.y = Math.max(pY, doc.y) + 10;
}

// ─── Paragraph ───
function para(text, size = 8.5) {
  doc.fontSize(size).fillColor(C.slate)
    .text(text, lx(), doc.y, { width: pw(), lineGap: 2.5 });
  doc.y += 10;
}

// ─── Big Quote Box ───
function quoteBox(text) {
  checkPage(80);
  const x = lx(); const w = pw(); const pad = 14;
  doc.fontSize(9);
  const tH = doc.heightOfString(text, { width: w - pad * 2 - 12 });
  const boxH = tH + pad * 2;
  drawRect(x, doc.y, w, boxH, C.navy, 6);
  drawRect(x + 6, doc.y + 8, 3, boxH - 16, C.gold, 1.5);
  doc.fontSize(9).fillColor(C.white).font("Helvetica-Oblique")
    .text(text, x + pad + 8, doc.y + pad, { width: w - pad * 2 - 12, lineGap: 3 });
  doc.font("Helvetica");
  doc.y += boxH + 10;
}

// ─── Before/After Row ───
function beforeAfter(label, before, after) {
  checkPage(30);
  const x = lx(); const w = pw();
  const labelW = w * 0.22; const halfW = w * 0.39;
  const padX = 7; const padY = 5;

  doc.fontSize(7.5);
  const bH = doc.heightOfString(before, { width: halfW - padX * 2 });
  const aH = doc.heightOfString(after, { width: halfW - padX * 2 });
  const rowH = Math.max(bH, aH) + padY * 2;

  drawRect(x, doc.y, labelW, rowH, C.offWhite);
  drawRect(x + labelW, doc.y, halfW, rowH, C.redLight);
  drawRect(x + labelW + halfW, doc.y, halfW, rowH, C.emeraldLight);

  doc.font("Helvetica-Bold").fontSize(7.5).fillColor(C.darkSlate)
    .text(label, x + padX, doc.y + padY, { width: labelW - padX * 2 });
  doc.font("Helvetica").fontSize(7.5).fillColor(C.slate)
    .text(before, x + labelW + padX, doc.y + padY, { width: halfW - padX * 2 });
  doc.fontSize(7.5).fillColor(C.emeraldDark)
    .text(after, x + labelW + halfW + padX, doc.y + padY, { width: halfW - padX * 2 });

  doc.y += rowH;
}


// ════════════════════════════════════════════════════════════════
//  PAGE 1: COVER
// ════════════════════════════════════════════════════════════════
drawRect(0, 0, doc.page.width, doc.page.height, C.navy);
drawRect(lx(), 165, pw(), 3, C.gold, 1.5);

doc.fontSize(28).fillColor(C.white).font("Helvetica-Bold")
  .text("Dentrix vs Eaglesoft", lx(), 190, { width: pw(), align: "center" });
doc.fontSize(12).fillColor(C.gold).font("Helvetica")
  .text("Practice Management System Comparison", lx(), 228, { width: pw(), align: "center" });

drawRect(lx() + 120, 258, pw() - 240, 1, C.goldDark);

doc.fontSize(22).fillColor(C.white).font("Helvetica-Bold")
  .text("+ The One Engine Vision", lx(), 280, { width: pw(), align: "center" });
doc.fontSize(11).fillColor(C.lightSlate).font("Helvetica")
  .text("How automation transforms your practice operations", lx(), 310, { width: pw(), align: "center" });

drawRect(lx() + 120, 340, pw() - 240, 0.5, C.midSlate);

doc.fontSize(10).fillColor(C.lightSlate)
  .text("Prepared for", lx(), 370, { width: pw(), align: "center" });
doc.fontSize(15).fillColor(C.white).font("Helvetica-Bold")
  .text("AK Ultimate Dental", lx(), 390, { width: pw(), align: "center" });
doc.fontSize(9.5).fillColor(C.lightSlate).font("Helvetica")
  .text("Dr. Alexandru Chireu  —  Las Vegas, NV", lx(), 414, { width: pw(), align: "center" });

const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
doc.fontSize(9).fillColor(C.midSlate).text(today, lx(), 450, { width: pw(), align: "center" });

doc.fontSize(8).fillColor(C.midSlate)
  .text("NuStack Digital Ventures  |  One Engine AI Operations Platform", lx(), doc.page.height - 75,
    { width: pw(), align: "center" });
drawRect(lx() + 150, doc.page.height - 55, pw() - 300, 0.5, C.midSlate);
doc.fontSize(7).fillColor(C.midSlate)
  .text("CONFIDENTIAL — FOR INTERNAL USE ONLY", lx(), doc.page.height - 45,
    { width: pw(), align: "center" });


// ════════════════════════════════════════════════════════════════
//  TABLE OF CONTENTS
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();

sectionHeader("What's Inside This Document", null, C.goldDark);
doc.y += 4;

const tocItems = [
  ["Part 1", "Executive Summary", "The big picture — why this decision matters"],
  ["Part 2", "Dentrix Deep Dive", "Capabilities, integrations, strengths & limitations"],
  ["Part 3", "Eaglesoft Deep Dive", "Capabilities, integrations, strengths & limitations"],
  ["Part 4", "Head-to-Head Comparison", "Side-by-side feature and integration comparison"],
  ["Part 5", "Vyne Dental & the Lawsuit", "Why this is a critical factor in the PMS decision"],
  ["Part 6", "What Vyne Dental Automates", "Every billing workflow — manual vs automated"],
  ["Part 7", "Your Billing Person: Before & After", "What they do now vs what they should be doing"],
  ["Part 8", "The Business Case & ROI", "Dollars, hours, and the financial impact"],
  ["Part 9", "The One Engine Vision", "How AI + automation transforms practice operations"],
  ["Part 10", "Pricing & Costs", "Total cost of ownership comparison"],
  ["Part 11", "Strategic Recommendation", "Three scenarios and our recommendation"],
];

tocItems.forEach(([part, title, desc]) => {
  checkPage(24);
  doc.fontSize(8).fillColor(C.goldDark).font("Helvetica-Bold")
    .text(part, lx() + 10, doc.y, { continued: true });
  doc.fillColor(C.navy).text(`   ${title}`);
  doc.fontSize(7.5).fillColor(C.midSlate).font("Helvetica")
    .text(desc, lx() + 60, doc.y, { width: pw() - 70 });
  doc.y += 8;
});


// ════════════════════════════════════════════════════════════════
//  PART 1: EXECUTIVE SUMMARY
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 1: Executive Summary", "Why this comparison matters for AK Ultimate Dental");

para("Alex currently uses Dentrix as the PMS and Vyne Dental for insurance billing at AK Ultimate Dental. Eaglesoft by Patterson Dental has been identified as a potential alternative. This document does two things:");

bullets([
  "Compares Dentrix vs Eaglesoft on every dimension — features, pricing, integrations, cloud strategy, and the Vyne Dental lawsuit risk",
  "Shows the business vision: how Vyne Dental automation + One Engine AI eliminate manual work, reduce labor costs, increase collections, and improve the patient experience",
]);

statCards([
  { value: "35-40K+", label: "Dentrix Practices", color: C.cyanDark },
  { value: "~30K", label: "Eaglesoft Users", color: C.goldDark },
  { value: "60-75%", label: "Billing Tasks Automated", color: C.emeraldDark },
  { value: "$29-49K", label: "Annual Labor Savings", color: C.navy },
]);

sectionHeader("Key Differences at a Glance", null, C.goldDark);

compTable(
  ["Feature", "Dentrix", "Eaglesoft"],
  [
    ["Parent Company", "Henry Schein One", "Patterson Dental"],
    ["Market Position", "#1 largest installed base", "#2, strong in private practices"],
    ["Target Practice", "All sizes + DSOs (Enterprise)", "Small-to-mid private practices"],
    ["Database Engine", "Microsoft SQL Server", "SAP Sybase SQL Anywhere"],
    ["Cloud Strategy", "Dentrix Ascend (cloud-native rebuild)", "Fuse (separate cloud product)"],
    ["Typical Cost", "Higher — premium pricing", "Starting ~$239/mo — moderate"],
    ["Learning Curve", "More complex, steeper", "Easier, more intuitive"],
    ["Imaging", "Strong (Dexis, Henry Schein owned)", 'Strongest — "most complete on market"'],
    ["Vyne Dental Status", "ACTIVE LAWSUIT — integration at risk", "Full integration, Patterson-promoted"],
  ]
);


// ════════════════════════════════════════════════════════════════
//  PART 2: DENTRIX DEEP DIVE
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 2: Dentrix by Henry Schein One", "The industry leader in dental practice management", C.cyanDark);

para("Dentrix has been the market-leading dental PMS for decades. Developed by Henry Schein One (a $12B+ company), it has the largest installed base and richest integration ecosystem in North American dentistry with 100+ connected products.");

sectionHeader("Core Capabilities", null, C.cyanDark);

compTable(["Capability", "Details"], [
  ["Scheduling", "Multi-operatory, multi-provider with drag-and-drop. Wait lists, quick-fill, automated reminders, online booking via Connected ecosystem."],
  ["Patient Records", "Comprehensive EHR with medical history, allergies, medications, prescriptions, clinical notes. HIPAA-compliant audit trails."],
  ["Clinical Charting", "Graphical odontogram with restorative, perio, endo, and ortho charting. Auto-populates treatment codes."],
  ["Digital Imaging", "Dexis integration (Henry Schein owned) plus third-party imaging. Digital X-rays, intraoral cameras, panoramic, CBCT."],
  ["Treatment Plans", "Plans with insurance estimates, patient portions, phased sequencing. Case acceptance tracking."],
  ["Billing & Claims", "eClaims, real-time eligibility, ERA auto-posting, electronic attachments, patient statements. Full RCM."],
  ["Reporting", "Practice Advisor reports, production/collection analysis, insurance aging, customizable dashboards."],
  ["Patient Engagement", "Connected ecosystem: text/email reminders, online booking, patient portal, reputation management, digital forms."],
]);

sectionHeader("Developer & Integration", null, C.cyanDark);
bullets([
  "Dentrix Developer Program (DDP): $5,000-$10,000+ enrollment, SOC 2 Type II required",
  "100+ approved partner integrations via Dentrix Connected ecosystem",
  "Database: Microsoft SQL Server — widely supported, standard tools for queries",
  "Dentrix Ascend (cloud version) has modern cloud-native APIs",
]);

prosConsBox("Dentrix Assessment", [
  "Largest installed base — most community support",
  "Richest integration ecosystem (100+ partners)",
  "Dentrix Ascend = true cloud migration path",
  "Most comprehensive feature set on market",
  "MS SQL Server — familiar, well-supported database",
], [
  "Most expensive legacy PMS platform",
  "Steeper learning curve for staff",
  "ACTIVE LAWSUIT with Vyne Dental",
  "DDP enrollment expensive & gated (SOC 2)",
  "HSO pushing users to DentalXChange",
  "Traditional Dentrix is still on-premise only",
], C.cyanDark);


// ════════════════════════════════════════════════════════════════
//  PART 3: EAGLESOFT DEEP DIVE
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 3: Eaglesoft by Patterson Dental", "The intuitive practice operating system for private dentistry", C.goldDark);

para("Eaglesoft is a full practice management operating system developed by Patterson Dental ($6B+ company). With 30+ years and ~30,000 users, it is known for its intuitive interface, strongest-in-class imaging integration, and reliability for private practices.");

sectionHeader("Core Capabilities", null, C.goldDark);

compTable(["Capability", "Details"], [
  ["Scheduling", "Multi-operatory, multi-provider with drag-and-drop. Weave integration (2024) for online self-scheduling."],
  ["Patient Records", "Comprehensive EHR including medical history, allergies, medications, Rx management. Paperless charting, HIPAA audit trails."],
  ["Clinical Charting", "Graphical odontogram for existing, planned, and completed work. Perio charting with probing depths, bleeding, recession. ADA CDT codes."],
  ["Digital Imaging", '"Most complete digital imaging integration on the market." 50+ device support — X-rays, intraoral cameras, CBCT 3D, panoramic.'],
  ["Treatment Plans", "Custom plans with insurance estimates, phased treatment, consent forms, financial breakdowns for patients."],
  ["Billing & Claims", "eClaims, real-time eligibility, real-time claim status, eAttachments, ERA auto-posting, eStatements. Insurance Suite bundle."],
  ["Reporting", "Performance dashboards, production/collection tracking, billing analysis, customizable reports."],
  ["Patient Engagement", "Weave partnership: automated reminders, two-way texting, calls, reviews, digital intake forms, payments."],
]);

sectionHeader("Developer & Integration", null, C.goldDark);
bullets([
  "Patterson Innovation Connection (PIC): $3,000-$5,000 enrollment — less expensive than Dentrix DDP",
  "Eaglesoft API installs with Server (v20.1+) — local server API",
  "Middleware available: Kolla (REST API wrapper), NexHealth (bidirectional sync)",
  "Database: SAP Sybase SQL Anywhere — less mainstream, limited tooling",
]);

prosConsBox("Eaglesoft Assessment", [
  "Easier to learn — more intuitive interface",
  "Strongest imaging integration on market",
  "Lower cost (~$239/mo starting)",
  "Vyne Dental integration fully supported — zero risk",
  "PIC enrollment cheaper and simpler ($3-5K)",
  "Reliable for private, single-location practices",
], [
  "On-premise only — physical server required",
  "No cloud version (Fuse is a different product)",
  "Weaker multi-location support",
  "Smaller integration ecosystem than Dentrix",
  "Patterson pivoting to Fuse — uncertain long-term future",
  "No hot database backups",
], C.goldDark);


// ════════════════════════════════════════════════════════════════
//  PART 4: HEAD-TO-HEAD
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 4: Head-to-Head Feature Comparison", "Every dimension compared side by side");

compTable(["Dimension", "Dentrix", "Eaglesoft"], [
  ["Scheduling", "Multi-provider, wait lists, quick-fill, online booking", "Multi-provider, drag-and-drop, Weave online scheduling"],
  ["Charting", "Full odontogram, perio, endo, ortho. Auto codes", "Full odontogram, perio charting. ADA CDT integration"],
  ["Digital Imaging", "Strong — Dexis (Henry Schein owned)", "Strongest — 50+ devices, CBCT 3D"],
  ["Treatment Plans", "Insurance estimates, case acceptance tracking", "Insurance estimates, phased treatment, consent"],
  ["Billing/Claims", "Full RCM: eClaims, eligibility, ERA, attachments", "Full RCM: eClaims, eligibility, ERA (Insurance Suite)"],
  ["Reporting", "Practice Advisor, custom dashboards", "Performance dashboards, billing analysis"],
  ["Patient Comms", "Connected ecosystem (100+ partners)", "Weave partnership: texting, calls, reviews"],
  ["User Interface", "Complex — steeper learning curve", "Intuitive — easier for staff to learn"],
  ["Database", "MS SQL Server — standard, easy to query", "SAP Sybase — proprietary, limited tooling"],
]);

sectionHeader("Integration & API Comparison", null, C.navy);

compTable(["Category", "Dentrix", "Eaglesoft"], [
  ["Developer Program", "DDP: $5K-$10K, SOC 2 required", "PIC: $3K-$5K, lighter requirements"],
  ["API Type", "Local + Connected partner APIs", "Local server API, REST via middleware"],
  ["Middleware", "NexHealth, Weave, 100+ partners", "Kolla, NexHealth — fewer options"],
  ["Cloud API", "Dentrix Ascend has cloud APIs", "No cloud API — bridge needed"],
]);


// ════════════════════════════════════════════════════════════════
//  PART 5: VYNE DENTAL & THE LAWSUIT
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 5: Vyne Dental & the Lawsuit", "Why this is a critical factor in the PMS decision", C.red);

para("Alex uses Vyne Dental (Trellis + FastAttach) for insurance billing and prequalification. An active lawsuit between Henry Schein One and Vyne Dental directly threatens this integration with Dentrix.");

infoBox(
  "THE LAWSUIT: Henry Schein One vs. Vyne Dental",
  "Aug 2025: HSO pushed a Dentrix update interfering with Vyne Trellis. Sep 2025: Vyne sued HSO for anti-competitive blocking. Oct 2025: HSO counter-sued alleging malicious hacking. As of early 2026, both lawsuits are active. ~8,000+ practices affected. If HSO blocks Vyne, practices must switch clearinghouses or PMS systems.",
  C.red, C.redLight
);

compTable(["Vyne Feature", "Dentrix Status", "Eaglesoft Status"], [
  ["Integration Status", "AT RISK — active lawsuit", "FULLY SUPPORTED — Patterson-promoted"],
  ["Vyne Trellis", "Works with workarounds", "Direct integration via Sync Plugin"],
  ["FastAttach", "May be disrupted by updates", '"Integrates flawlessly"'],
  ["Auto Eligibility", "Depends on lawsuit outcome", "Fully supported, no risk"],
  ["ERA Auto-Posting", "Future uncertain", "Fully supported"],
  ["Risk Level", "HIGH", "LOW"],
]);

infoBox(
  "WHAT THIS MEANS FOR ALEX",
  "If HSO blocks Vyne: switch to DentalXChange ($0.25/claim vs Vyne flat $99/mo — much more expensive at volume) or switch PMS entirely. If Alex moves to Eaglesoft, Vyne integration is rock-solid with zero legal risk.",
  C.goldDark, C.goldLight
);


// ════════════════════════════════════════════════════════════════
//  PART 6: WHAT VYNE DENTAL AUTOMATES (THE BIG ONE)
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 6: What Vyne Dental Automates", "Every billing workflow — what the machine does vs what the human does", C.emeraldDark);

quoteBox("Your billing person is spending 30-40 hours a week on tasks a machine can do — sitting on hold with insurance companies, manually keying benefit data, printing and mailing claims, hand-posting payments line by line. Vyne Trellis automates 60-75% of that work. The billing person doesn't go away — they stop being a data entry clerk and become a revenue strategist.");

// === INSURANCE VERIFICATION ===
sectionHeader("Insurance Verification", "The #1 time waster in dental billing", C.emeraldDark);

// Before/After header
checkPage(24);
const bax = lx(); const baw = pw();
drawRect(bax, doc.y, baw * 0.22, 18, C.navy);
drawRect(bax + baw * 0.22, doc.y, baw * 0.39, 18, "#DC2626");
drawRect(bax + baw * 0.22 + baw * 0.39, doc.y, baw * 0.39, 18, C.emeraldDark);
doc.fontSize(7.5).fillColor(C.white).font("Helvetica-Bold");
doc.text("Task", bax + 7, doc.y + 4, { width: baw * 0.22 - 14 });
doc.text("MANUAL PROCESS (Today)", bax + baw * 0.22 + 7, doc.y + 4, { width: baw * 0.39 - 14 });
doc.text("WITH VYNE AUTOMATION", bax + baw * 0.61 + 7, doc.y + 4, { width: baw * 0.39 - 14 });
doc.y += 18; doc.font("Helvetica");

beforeAfter("Pull Schedule", "Manually review tomorrow's patients in PMS", "Vyne Sync auto-pulls schedule data");
beforeAfter("Look Up Insurance", "Find each patient's insurance info manually", "Already synced from PMS automatically");
beforeAfter("Contact Insurer", "Call payer, wait 15-30 min on hold per patient", "Electronic inquiry sent automatically to 800+ payers");
beforeAfter("Get Benefits", "Ask about deductibles, maximums, frequencies, write it all down", "ClearCoverage returns full benefit breakdown in seconds");
beforeAfter("Enter Into System", "Manually key all benefit data into PMS", "Data already in Trellis, synced with PMS");
beforeAfter("Handle Bad Coverage", "Call patient, ask for updated insurance card", "Text-to-Verify auto-texts patient a digital form");
beforeAfter("Time Per Patient", "15-30 minutes", "Under 1 minute (automated)");

doc.y += 4;
infoBox("TIME SAVED", "At 20 patients/day: Manual = 5-7.5 hours/day (25-37.5 hrs/week). With Vyne = 1-2 hours/day reviewing results. Savings: 20-30+ hours/week on verification alone. Cost per verification drops from $7.11 to $1.48.", C.emeraldDark, C.emeraldLight);


// === CLAIMS SUBMISSION ===
doc.addPage();
drawFooter();
sectionHeader("Claims Submission & Attachments", "Eliminate paper, faxing, and mailing entirely", C.emeraldDark);

compTable(["Task", "Manual Process", "Vyne Automated"], [
  ["Claim Review", "Manually check each claim for errors", "Automated scrubbing flags errors before submission"],
  ["Attachments", "Print X-rays, perio charts. Mail or fax.", "FastAttach sends unlimited attachments electronically"],
  ["Know What to Attach", "Guess or call payer to ask", "FastLook shows exactly what each payer requires"],
  ["Submission", "Mail paper claims (15-45 day processing)", "Electronic submission (7-14 day processing)"],
  ["Tracking", "No visibility — call payer to check", "Real-time dashboard with smart notifications"],
  ["Rejections", "Start over, call to find out why", "Rejection reason displayed instantly — fix and resubmit"],
], [0.22, 0.39, 0.39]);

infoBox("KEY STAT", "96% claim acceptance rate on Vyne Trellis. Industry denial rate is 15%+. Claim scrubbing catches errors BEFORE submission. 40.2 million attachments processed annually on the platform. Zero printing, zero faxing, zero mailing.", C.emeraldDark, C.emeraldLight);


// === PAYMENT POSTING ===
sectionHeader("Payment Posting", "The most tedious task in billing — automated", C.emeraldDark);

compTable(["Task", "Manual Process", "Vyne Automated"], [
  ["Receive EOBs", "Open paper mail or log into payer portals one by one", "ERAs delivered electronically to one centralized inbox"],
  ["Match to Claims", "Manually match each EOB to the right patient/claim", "System auto-matches ERAs to claims"],
  ["Post Payments", "Key in every payment, adjustment, write-off line by line", "ERA auto-posting applies everything to the PMS automatically"],
  ["Review", "Hope you didn't make a typo", "Staff review only exceptions — underpayments, denials"],
  ["Time Required", "8-10 hours/week", "2-4 hours/week (review only)"],
], [0.22, 0.39, 0.39]);


// === CLAIM FOLLOW-UP ===
sectionHeader("Claim Follow-Up & Denial Management", null, C.emeraldDark);

compTable(["Task", "Manual Process", "Vyne Automated"], [
  ["Find Problem Claims", "Run aging report weekly, manually identify old claims", "Dashboard shows all outstanding claims with status"],
  ["Check Status", "Call payer, wait on hold 15-30 min per claim", "Real-time status tracking — no phone call needed"],
  ["Get Denial Reason", "Call payer, wait, navigate phone tree", "Rejection reason displayed on dashboard instantly"],
  ["Resubmit", "Print corrected claim, mail/fax again", "Electronic resubmission through same platform"],
  ["Time Required", "5-8 hours/week on phone calls", "1-2 hours/week on actual dispute resolution"],
], [0.22, 0.39, 0.39]);


// === PATIENT BILLING ===
doc.addPage();
drawFooter();
sectionHeader("Patient Billing & Statements", null, C.emeraldDark);

compTable(["Task", "Manual Process", "Vyne Automated"], [
  ["Generate Statements", "Run statement batch from PMS", "Triggered automatically after insurance posts"],
  ["Print & Mail", "Print, fold, stuff envelopes, stamp, take to post office", "Vyne prints, folds, stamps, and mails everything"],
  ["Patient Payment", "Wait for check in the mail", "QR code + online link on every statement + text/email reminders"],
  ["Post Patient Payment", "Open mail, manually post each check", "Online payments auto-post to patient ledger"],
  ["Financing", "Explain payment plans over the phone", "Buy Now Pay Later (Affirm) offered digitally"],
], [0.22, 0.39, 0.39]);

infoBox("WHY THIS MATTERS", "Balances older than 90 days lose 7% of their value every month. Every day a statement sits unread is money evaporating. QR codes and digital payments get money in the door in hours instead of weeks. Average patient lifetime value: $7,000-$10,000.", C.goldDark, C.goldLight);


// ════════════════════════════════════════════════════════════════
//  PART 7: BILLING PERSON BEFORE & AFTER
// ════════════════════════════════════════════════════════════════
sectionHeader("Part 7: Your Billing Person — Before & After", "The shift from data entry clerk to revenue strategist", C.purple);

para("Right now, your billing person is drowning in manual tasks that a machine should be doing. Here is what a typical week looks like today vs what it should look like with Vyne automation:");

compTable(["Task", "Hours/Week (Manual)", "Hours/Week (Automated)"], [
  ["Insurance Verification", "10-15 hours", "1-3 hours (review only)"],
  ["Claims Submission + Attachments", "5-8 hours", "1-2 hours (fix flags)"],
  ["Payment Posting (ERA/EOB)", "8-10 hours", "2-4 hours (review only)"],
  ["Claim Follow-Up Calls", "5-8 hours", "1-2 hours (true disputes only)"],
  ["Patient Statements", "2-4 hours", "0.5 hours (trigger the run)"],
  ["Pre-Auth Requests", "2-4 hours", "0.5-1 hour (electronic)"],
  ["TOTAL", "32-49 hours/week", "6-12.5 hours/week"],
]);

infoBox("THE BOTTOM LINE", "Your billing person currently spends 32-49 hours/week on repetitive tasks. Vyne automation reduces that to 6-12.5 hours/week. That is 25-37 hours/week freed up — the equivalent of going from 1.0 FTE to 0.25 FTE on these tasks. Those hours don't disappear — they get redirected to high-value work that actually grows revenue.", C.purple, C.purpleLight);


// === WHAT THEY SHOULD BE DOING ===
doc.addPage();
drawFooter();
sectionHeader("What the Billing Person Should Be Doing", "High-value work that requires human judgment and grows revenue", C.purple);

compTable(["High-Value Activity", "Why It Matters"], [
  ["Complex Denial Appeals", "Writing clinical justifications, crafting persuasive appeals. This requires understanding payer contracts, CDT nuances, and clinical context. Every successful appeal is recovered revenue."],
  ["Patient Financial Counseling", "Sitting with patients before treatment to explain costs, coverage, and payment options. Builds trust, reduces surprise bills, improves case acceptance — directly grows production."],
  ["Treatment Plan Presentation Support", "Helping the clinical team present large cases with accurate financial breakdowns. Patients who understand their costs are more likely to accept treatment."],
  ["Accounts Receivable Strategy", "Analyzing aging reports for PATTERNS — which payers deny most, which codes get downgraded, which procedures need better documentation. This is strategic work that prevents future revenue loss."],
  ["Fee Schedule Analysis", "Reviewing payer fee schedules, identifying underpayments, evaluating whether to stay in-network. This directly impacts profitability."],
  ["Coding Optimization", "Ensuring the practice codes to the highest appropriate level — not under-coding. Understanding bundling rules and how to document to support billing. Every under-coded procedure is lost revenue."],
  ["Staff Training", "Teaching hygienists and assistants what documentation is needed to support billing. Better clinical notes = fewer denials = more revenue."],
  ["Insurance Contract Review", "Understanding payer contract fine print, identifying unfavorable terms, informing credentialing decisions. This is work that prevents money from leaking out."],
]);

quoteBox("The difference between a billing person who costs you money and one who makes you money is what they spend their time on. Sitting on hold for 6 hours a day costs you money. Fighting a $3,000 denied crown claim and winning — that makes you money.");


// ════════════════════════════════════════════════════════════════
//  PART 8: BUSINESS CASE & ROI
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 8: The Business Case & ROI", "The financial impact of automation for AK Ultimate Dental", C.navy);

statCards([
  { value: "25-37", label: "Hours/Week Recovered", color: C.emeraldDark },
  { value: "$29-49K", label: "Annual Labor Savings", color: C.goldDark },
  { value: "96%", label: "Claim Acceptance Rate", color: C.cyanDark },
  { value: "50-75%", label: "Fewer Phone Calls", color: C.navy },
]);

sectionHeader("Financial Impact Breakdown", null, C.goldDark);

compTable(["Metric", "Current State", "With Full Automation"], [
  ["Billing staff time on manual tasks", "32-49 hours/week", "6-12.5 hours/week"],
  ["Insurance verification phone calls", "15+ per day (15-30 min each)", "Near zero (automated batch)"],
  ["Cost per eligibility check", "$7.11 per transaction", "$1.48 per transaction"],
  ["Claim processing time", "30-45 days (paper/mixed)", "7-14 days (electronic)"],
  ["Payment posting time", "8-10 hours/week", "2-4 hours/week"],
  ["Statement printing/mailing", "2-4 hours/week + postage", "Zero (Vyne handles it all)"],
  ["Claim denial rate", "Industry average 15%+", "Below 5% with scrubbing"],
]);

sectionHeader("Dollar Impact", null, C.goldDark);

compTable(["Category", "Calculation", "Annual Value"], [
  ["Labor savings (recovered hours)", "25-37 hrs/week x $22-27/hr x 52 weeks", "$28,600 - $49,140"],
  ["Reduced verification costs", "(20 patients/day x 250 days x $5.63 savings)", "$28,150 saved"],
  ["Faster collections", "7-14 day processing vs 30-45 days", "Improved cash flow"],
  ["Reduced denials", "96% acceptance vs 85% — fewer lost claims", "Thousands in recovered revenue"],
  ["Patient payment speed", "Digital payments vs waiting for mail checks", "Fewer 90+ day AR balances"],
  ["Vyne Trellis cost", "Flat monthly subscription", "~$99-500/month"],
  ["NET ROI", "Strongly positive", "Payback in 1-2 months"],
]);

infoBox("REAL-WORLD RESULTS", "Village Pointe Oral Surgery: 90% reduction in claim attachment work (10+ hrs to <1 hr/week). Walker & Raynal: 80% reduction (whole Tuesdays to 30 minutes). Belmont Dental: $60,000 in claims processed in one week after implementation. Vyne platform processes $5.4 billion in claims monthly across 84,000+ practices.", C.emeraldDark, C.emeraldLight);


// ════════════════════════════════════════════════════════════════
//  PART 9: THE ONE ENGINE VISION
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 9: The One Engine Vision", "How AI + automation transforms practice operations", C.goldDark);

quoteBox("One Engine is not just a website or a dashboard — it is the AI brain of your dental practice. It connects to your PMS, your billing platform, your patient communications, and your business data to give you visibility and automation that no off-the-shelf dental software provides. Vyne handles the billing automation. One Engine handles everything else.");

sectionHeader("What One Engine Delivers Today", null, C.goldDark);
compTable(["Feature", "What It Does"], [
  ["AI Business Advisor", "Ask any practice question — HR, operations, marketing, compliance — and get tailored guidance specific to dental practices. Conversations can be saved to employee HR records."],
  ["HR & Employee Management", "Employee directory, write-ups, incident reports, performance reviews, coaching notes. Tablet signing flow for document acknowledgment. Full audit trail."],
  ["Lead Management", "Every website contact becomes a tracked lead. AI drafts a personalized response. Approval queue ensures nothing falls through the cracks."],
  ["Approval Queue", "Every AI-generated action goes through human approval before sending. Alex stays in control while AI does the heavy lifting."],
  ["Patient & Appointment Tracking", "Centralized view of all patients and appointments with insurance details."],
  ["Dashboard Intelligence", "Real-time overview: pending approvals, leads waiting, documents needing signatures, upcoming appointments."],
]);

sectionHeader("What One Engine Enables with PMS Integration", "The next phase — connecting to Dentrix or Eaglesoft", C.goldDark);
compTable(["Capability", "Business Impact"], [
  ["AI-Powered Scheduling Insights", "Identify no-show patterns, optimize provider schedules, predict cancellations. Fill empty chairs automatically."],
  ["Automated Patient Outreach", "AI-drafted recall messages, reactivation campaigns, birthday greetings, treatment follow-ups — all personalized, all approved before sending."],
  ["Production & Collection Analytics", "Real-time dashboards showing production by provider, collection rates, AR aging — with AI-generated insights on what to fix."],
  ["Insurance Intelligence", "Track which payers deny most, which codes get downgraded, which procedures need better documentation. Turn data into strategy."],
  ["Automated Daily Briefing", "Every morning, Alex gets a briefing: today's patients, outstanding approvals, leads waiting, AR alerts, HR items needing attention."],
  ["Staff Performance Tracking", "Tie production data to individual team members. Identify training needs. Recognize top performers."],
]);

infoBox("THE BIG PICTURE", "Right now, Alex manages the practice from inside the operatory — between patients, between procedures. One Engine gives him a command center. One place to see everything, with AI that surfaces what matters and handles the routine. Vyne automates billing. One Engine automates operations. Together, they turn a dental practice into a business that runs itself.", C.goldDark, C.goldLight);


// ════════════════════════════════════════════════════════════════
//  PART 10: PRICING
// ════════════════════════════════════════════════════════════════
doc.addPage();
drawFooter();
sectionHeader("Part 10: Pricing & Total Cost of Ownership", null);

compTable(["Cost Category", "Dentrix", "Eaglesoft"], [
  ["Monthly Subscription", "Higher — varies by bundle", "Starting ~$239/month"],
  ["Implementation", "$5,000-$15,000 typical", "$3,000-$10,000 (Smart Start)"],
  ["Developer Program", "DDP: $5K-$10K enrollment", "PIC: $3K-$5K enrollment"],
  ["Cloud Version", "Ascend — separate subscription", "Fuse — separate product, data migration"],
  ["Vyne Dental", "~$99/mo (at risk — may need DentalXChange at $0.25/claim)", "~$99/mo flat — stable"],
  ["One Engine Integration", "NexHealth middleware ~$300-500/mo", "Kolla or NexHealth ~$300-500/mo"],
]);

infoBox("SWITCHING COST NOTE", "Switching PMS involves: data migration between different database formats, 1-2 weeks of reduced productivity during staff retraining, $3K-$10K implementation fees, and workflow disruptions. This decision should be made once and not revisited lightly.", C.navy, C.bg);


// ════════════════════════════════════════════════════════════════
//  PART 11: STRATEGIC RECOMMENDATION
// ════════════════════════════════════════════════════════════════
sectionHeader("Part 11: Strategic Recommendation", "Three scenarios for AK Ultimate Dental", C.goldDark);

infoBox(
  "SCENARIO A: Stay with Dentrix",
  "Best if: Alex wants the largest ecosystem, is open to Dentrix Ascend (cloud), and will switch from Vyne to DentalXChange if the lawsuit forces it. Risk: higher clearinghouse costs, Vyne disruption.",
  C.cyanDark, C.cyanLight
);

infoBox(
  "SCENARIO B: Switch to Eaglesoft",
  "Best if: Alex prioritizes keeping Vyne Dental, wants lower costs, values ease-of-use for staff, and prioritizes imaging. Risk: 1-2 weeks migration disruption, Eaglesoft's uncertain long-term future.",
  C.goldDark, C.goldLight
);

infoBox(
  "SCENARIO C: Stay with Dentrix + Monitor (Recommended Short-Term)",
  "Stay on Dentrix while monitoring the Vyne/HSO lawsuit. Vyne has workarounds that keep things functional. If HSO fully blocks Vyne, then evaluate switching. Meanwhile, build One Engine integration via middleware — it works with either PMS, so the investment is portable.",
  C.emerald, C.emeraldLight
);

compTable(["Decision Factor", "Dentrix Wins", "Eaglesoft Wins"], [
  ["Vyne Dental is critical", "Risk — lawsuit may force switch", "No risk — Patterson promotes Vyne"],
  ["Lower costs matter", "More expensive overall", "More affordable"],
  ["Staff ease-of-use", "Steeper learning curve", "Easier, more intuitive"],
  ["Cloud/future-proofing", "Ascend is a real cloud path", "Fuse is separate — weaker"],
  ["Imaging priority", "Strong (Dexis)", "Strongest on market"],
  ["One Engine integration", "More options, Ascend cloud APIs", "PIC cheaper, Vyne stable"],
]);

// === REGARDLESS ===
doc.addPage();
drawFooter();
sectionHeader("Regardless of PMS Choice: The Immediate Win", "What to do right now with zero risk", C.emeraldDark);

quoteBox("The PMS decision can wait. The billing automation cannot. Every week that passes with fully manual billing is 25-37 hours of wasted labor and thousands in slower collections. Vyne Trellis works with both Dentrix and Eaglesoft. One Engine works with both. The first step is maximizing Vyne automation — this is immediate ROI with zero PMS risk.");

sectionHeader("Action Plan", null, C.emeraldDark);

compTable(["Priority", "Action", "Impact"], [
  ["1 — NOW", "Audit current Vyne usage — is batch eligibility turned on? ERA auto-posting enrolled? FastAttach being used?", "Likely quick wins if features aren't fully activated"],
  ["2 — Week 1-2", "Turn on automated batch eligibility (3 days before appointments). Enroll remaining payers for ERA.", "Immediate: 10-15 hrs/week recovered from verification alone"],
  ["3 — Week 2-4", "Activate Text-to-Verify for invalid insurance. Set up eStatements with QR codes.", "Fewer phone calls + faster patient payments"],
  ["4 — Month 2", "Train billing person on new role: denial management, financial counseling, coding optimization, AR strategy", "Shift from cost center to revenue generator"],
  ["5 — Month 3+", "Connect One Engine to PMS via middleware. Enable AI-powered scheduling, outreach, and analytics.", "Full operations intelligence — the complete vision"],
], [0.10, 0.50, 0.40]);

infoBox("THE VISION IN ONE SENTENCE", "Vyne handles billing automation. One Engine handles operations intelligence. Together, they give Alex a practice that collects faster, denies less, wastes zero hours on hold, and puts AI-powered insights in front of every decision — while his billing person focuses on the work that actually grows revenue.", C.goldDark, C.goldLight);

// Footer
checkPage(40);
drawRect(lx(), doc.y, pw(), 0.5, C.border);
doc.y += 8;
doc.fontSize(7).fillColor(C.midSlate)
  .text("Prepared by NuStack Digital Ventures. Research based on publicly available vendor documentation, user reviews, case studies, and industry data as of February 2026. Pricing subject to change — contact vendors for current quotes. One Engine integration is portable across PMS platforms via middleware.", lx(), doc.y, { width: pw(), lineGap: 1.5 });

doc.end();
stream.on("finish", () => {
  console.log(`PDF generated: ${outputPath}`);
  const stats = fs.statSync(outputPath);
  console.log(`File size: ${(stats.size / 1024).toFixed(0)} KB`);
  console.log("Done!");
});
