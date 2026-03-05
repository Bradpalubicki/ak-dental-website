import {
  createDoc,
  collectBuffer,
  drawFooters,
  sectionHead,
  MARGIN,
  CONTENT_WIDTH,
  PAGE_WIDTH,
  COLORS,
  FONTS,
} from "./pdf-helpers";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

interface ProposalItem {
  id: string;
  cdt_code?: string | null;
  procedure_name: string;
  procedure_description?: string | null;
  tooth_number?: string | null;
  fee: number;
  insurance_pays: number;
  patient_pays: number;
  tier?: string | null;
  sort_order: number;
}

interface Proposal {
  id: string;
  title: string;
  notes?: string | null;
  status: string;
  total_fee: number;
  insurance_estimate: number;
  patient_estimate: number;
  financing_provider?: string | null;
  financing_monthly?: number | null;
  financing_term_months?: number | null;
  tier?: string | null;
  signature_name?: string | null;
  signed_at?: string | null;
  signed_ip?: string | null;
  expires_at: string;
  created_at: string;
}

interface PatientData {
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
}

interface ProviderData {
  first_name: string;
  last_name: string;
}

export async function generateTreatmentProposalPdf(
  proposal: Proposal,
  items: ProposalItem[],
  patient: PatientData | null | undefined,
  provider: ProviderData | null | undefined
): Promise<Buffer> {
  const doc = createDoc();
  const buf = collectBuffer(doc);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const patientName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : "Patient";
  const providerName = provider
    ? `Dr. ${provider.first_name} ${provider.last_name}`
    : "Your Provider";

  // ─── Cover / Header ──────────────────────────────────────────────────────────

  // Accent bar
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 5).fill(COLORS.accent);
  doc.moveDown(0.6);

  // Practice name + proposal number
  doc
    .font(FONTS.bold)
    .fontSize(20)
    .fillColor(COLORS.accent)
    .text("AK Ultimate Dental", { align: "center" });

  doc
    .font(FONTS.normal)
    .fontSize(10)
    .fillColor(COLORS.gray)
    .text("7480 W Sahara Ave, Las Vegas, NV 89117  ·  (702) 935-4395", { align: "center" });

  doc.moveDown(0.8);

  // Title block
  doc
    .font(FONTS.bold)
    .fontSize(16)
    .fillColor(COLORS.black)
    .text("Treatment Proposal", { align: "center" });

  doc.moveDown(0.3);

  doc
    .font(FONTS.normal)
    .fontSize(10)
    .fillColor(COLORS.gray)
    .text(`Prepared for ${patientName}  ·  ${today}`, { align: "center" });

  doc.moveDown(1);

  // Summary box
  const boxY = doc.y;
  const colW = CONTENT_WIDTH / 3;

  doc.rect(MARGIN, boxY, CONTENT_WIDTH, 56).fill("#f0f9ff");
  doc.rect(MARGIN, boxY, CONTENT_WIDTH, 56).strokeColor("#bae6fd").lineWidth(1).stroke();

  const summaryItems = [
    { label: "Practice Fee", value: fmt(proposal.total_fee), color: COLORS.black },
    { label: "Insurance Estimate", value: fmt(proposal.insurance_estimate), color: "#059669" },
    { label: "Your Estimated Cost", value: fmt(proposal.patient_estimate), color: COLORS.accent },
  ];

  summaryItems.forEach((item, idx) => {
    const cx = MARGIN + colW * idx;
    const center = cx + colW / 2;

    doc
      .font(FONTS.normal)
      .fontSize(8.5)
      .fillColor(COLORS.gray)
      .text(item.label, cx, boxY + 10, { width: colW, align: "center" });

    doc
      .font(FONTS.bold)
      .fontSize(idx === 2 ? 14 : 12)
      .fillColor(item.color)
      .text(item.value, cx, boxY + 24, { width: colW, align: "center" });

    if (idx < 2) {
      doc
        .moveTo(cx + colW, boxY + 10)
        .lineTo(cx + colW, boxY + 46)
        .strokeColor("#bae6fd")
        .lineWidth(0.5)
        .stroke();
    }

    void center;
  });

  doc.y = boxY + 64;

  // Provider + date row
  doc
    .font(FONTS.normal)
    .fontSize(9)
    .fillColor(COLORS.gray)
    .text(
      `Prepared by ${providerName}  ·  Expires ${new Date(proposal.expires_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      MARGIN,
      doc.y,
      { width: CONTENT_WIDTH, align: "center" }
    );

  doc.moveDown(1.2);

  // ─── Procedures ──────────────────────────────────────────────────────────────

  sectionHead(doc, "Recommended Procedures");

  // Group by tier if applicable
  const hasTiers = items.some((i) => i.tier);

  if (hasTiers) {
    const tiers: Array<{ key: string; label: string }> = [
      { key: "good", label: "Good" },
      { key: "better", label: "Better" },
      { key: "best", label: "Best (Recommended)" },
    ];

    tiers.forEach(({ key, label }) => {
      const tierItems = items.filter((i) => i.tier === key || !i.tier);
      if (tierItems.length === 0) return;

      doc
        .font(FONTS.bold)
        .fontSize(10)
        .fillColor(COLORS.accent)
        .text(`— ${label} —`, { align: "center" });
      doc.moveDown(0.3);

      drawProceduresTable(doc, tierItems);
      doc.moveDown(0.5);
    });
  } else {
    drawProceduresTable(doc, items);
  }

  doc.moveDown(0.5);

  // ─── Totals ──────────────────────────────────────────────────────────────────

  sectionHead(doc, "Cost Summary");

  const totalsRows: Array<[string, string]> = [
    ["Practice Fee", fmt(proposal.total_fee)],
    ["Insurance Estimate (not guaranteed)", fmt(proposal.insurance_estimate)],
    ["Your Estimated Patient Cost", fmt(proposal.patient_estimate)],
  ];

  let ty = doc.y;
  totalsRows.forEach(([label, value], i) => {
    const isLast = i === totalsRows.length - 1;
    const bg = isLast ? "#f0f9ff" : i % 2 === 0 ? "#f8fafc" : "#ffffff";
    const h = isLast ? 24 : 20;

    doc.rect(MARGIN, ty, CONTENT_WIDTH, h).fill(bg);

    if (isLast) {
      doc
        .moveTo(MARGIN, ty)
        .lineTo(MARGIN + CONTENT_WIDTH, ty)
        .strokeColor(COLORS.accent)
        .lineWidth(0.8)
        .stroke();
    }

    doc
      .font(isLast ? FONTS.bold : FONTS.normal)
      .fontSize(isLast ? 11 : 9)
      .fillColor(isLast ? COLORS.accent : COLORS.black)
      .text(label, MARGIN + 6, ty + (isLast ? 6 : 5), { width: 280 });

    doc
      .font(isLast ? FONTS.bold : FONTS.normal)
      .fontSize(isLast ? 13 : 9)
      .fillColor(isLast ? COLORS.accent : COLORS.black)
      .text(value, MARGIN + 6, ty + (isLast ? 5 : 5), {
        width: CONTENT_WIDTH - 12,
        align: "right",
      });

    ty += h;
  });

  doc
    .rect(MARGIN, doc.y, CONTENT_WIDTH, ty - doc.y)
    .strokeColor(COLORS.lightGray)
    .lineWidth(0.5)
    .stroke();

  doc.y = ty + 8;
  doc.moveDown(0.5);

  // ─── Financing ───────────────────────────────────────────────────────────────

  if (proposal.financing_provider && proposal.financing_monthly) {
    sectionHead(doc, "Financing Options");

    const providerLabel =
      proposal.financing_provider === "cherry"
        ? "Cherry Financing"
        : proposal.financing_provider === "sunbit"
        ? "Sunbit"
        : proposal.financing_provider === "carecredit"
        ? "CareCredit"
        : proposal.financing_provider;

    const rows: Array<[string, string]> = [
      ["Financing Provider", providerLabel],
      [
        "Estimated Monthly Payment",
        `${fmt(proposal.financing_monthly)}/mo`,
      ],
    ];

    if (proposal.financing_term_months) {
      rows.push(["Term", `${proposal.financing_term_months} months`]);
    }

    rows.push([
      "Note",
      "Financing subject to credit approval. Rates and terms set by financing provider.",
    ]);

    let fy = doc.y;
    rows.forEach(([key, val], i) => {
      const bg = i % 2 === 0 ? "#f0fdf4" : "#ffffff";
      doc.rect(MARGIN, fy, CONTENT_WIDTH, 18).fill(bg);
      doc
        .font(FONTS.bold)
        .fontSize(9)
        .fillColor(COLORS.gray)
        .text(key, MARGIN + 6, fy + 4, { width: 160 });
      doc
        .font(FONTS.normal)
        .fontSize(9)
        .fillColor(COLORS.black)
        .text(val, MARGIN + 172, fy + 4, { width: CONTENT_WIDTH - 180 });
      fy += 18;
    });

    doc
      .rect(MARGIN, doc.y, CONTENT_WIDTH, fy - doc.y)
      .strokeColor(COLORS.lightGray)
      .lineWidth(0.5)
      .stroke();

    doc.y = fy + 8;
    doc.moveDown(0.5);
  }

  // ─── E-Signature ─────────────────────────────────────────────────────────────

  if (proposal.signature_name && proposal.signed_at) {
    sectionHead(doc, "Electronic Signature");

    const sigRows: Array<[string, string]> = [
      ["Signed By", proposal.signature_name],
      [
        "Date & Time",
        new Date(proposal.signed_at).toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }),
      ],
    ];

    if (proposal.signed_ip) {
      sigRows.push(["IP Address", proposal.signed_ip]);
    }

    sigRows.push([
      "Legal Notice",
      "Electronically signed per Nevada ESIGN Act (NRS 719.240). This signature is legally binding.",
    ]);

    let sy = doc.y;
    sigRows.forEach(([key, val], i) => {
      const bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
      doc.rect(MARGIN, sy, CONTENT_WIDTH, 18).fill(bg);
      doc
        .font(FONTS.bold)
        .fontSize(9)
        .fillColor(COLORS.gray)
        .text(key, MARGIN + 6, sy + 4, { width: 160 });
      doc
        .font(i === 0 ? FONTS.oblique : FONTS.normal)
        .fontSize(9)
        .fillColor(COLORS.black)
        .text(val, MARGIN + 172, sy + 4, { width: CONTENT_WIDTH - 180 });
      sy += 18;
    });

    doc
      .rect(MARGIN, doc.y, CONTENT_WIDTH, sy - doc.y)
      .strokeColor(COLORS.lightGray)
      .lineWidth(0.5)
      .stroke();

    doc.y = sy + 8;
    doc.moveDown(0.5);
  }

  // ─── Notes ───────────────────────────────────────────────────────────────────

  if (proposal.notes) {
    sectionHead(doc, "Clinical Notes", 2);
    doc
      .font(FONTS.normal)
      .fontSize(9)
      .fillColor(COLORS.gray)
      .text(proposal.notes, { lineGap: 2 });
    doc.moveDown(0.5);
  }

  // ─── Disclaimer ──────────────────────────────────────────────────────────────

  doc.moveDown(0.5);
  doc
    .font(FONTS.oblique)
    .fontSize(8)
    .fillColor(COLORS.gray)
    .text(
      "This estimate is valid for 30 days from the date of preparation. Insurance estimates are based on your current benefits and are not a guarantee of coverage. Actual patient costs may vary based on final insurance processing. Please contact our office if you have any questions.",
      { lineGap: 2 }
    );

  // Footer
  drawFooters(doc, false);
  doc.end();
  return buf;
}

function drawProceduresTable(doc: PDFKit.PDFDocument, items: ProposalItem[]) {
  const colWidths = {
    name: 185,
    tooth: 55,
    fee: 70,
    ins: 75,
    pt: 83,
  };

  const headerY = doc.y;
  doc.rect(MARGIN, headerY, CONTENT_WIDTH, 18).fill(COLORS.accent);

  const cols = [
    { label: "Procedure", x: MARGIN + 6, w: colWidths.name },
    { label: "Tooth", x: MARGIN + colWidths.name + 6, w: colWidths.tooth },
    { label: "Fee", x: MARGIN + colWidths.name + colWidths.tooth + 6, w: colWidths.fee },
    {
      label: "Insurance",
      x: MARGIN + colWidths.name + colWidths.tooth + colWidths.fee + 6,
      w: colWidths.ins,
    },
    {
      label: "Your Cost",
      x: MARGIN + colWidths.name + colWidths.tooth + colWidths.fee + colWidths.ins + 6,
      w: colWidths.pt,
    },
  ];

  cols.forEach((col) => {
    doc
      .font(FONTS.bold)
      .fontSize(8)
      .fillColor("#ffffff")
      .text(col.label, col.x, headerY + 5, { width: col.w - 6 });
  });

  let rowY = headerY + 18;

  items.forEach((item, idx) => {
    // Estimate row height
    const nameLines = Math.ceil(item.procedure_name.length / 28);
    const descLines = item.procedure_description
      ? Math.ceil(item.procedure_description.length / 28)
      : 0;
    const rowH = Math.max(20, (nameLines + descLines) * 12 + 8);

    // Check page break
    if (rowY + rowH > doc.page.height - 120) {
      doc.addPage();
      rowY = MARGIN;
    }

    const bg = idx % 2 === 0 ? "#f8fafc" : "#ffffff";
    doc.rect(MARGIN, rowY, CONTENT_WIDTH, rowH).fill(bg);

    // Procedure name
    doc
      .font(FONTS.bold)
      .fontSize(9)
      .fillColor(COLORS.black)
      .text(item.procedure_name, MARGIN + 6, rowY + 5, { width: colWidths.name - 12 });

    if (item.procedure_description) {
      doc
        .font(FONTS.normal)
        .fontSize(8)
        .fillColor(COLORS.gray)
        .text(item.procedure_description, MARGIN + 6, rowY + 17, {
          width: colWidths.name - 12,
        });
    }

    // Tooth
    doc
      .font(FONTS.normal)
      .fontSize(9)
      .fillColor(COLORS.gray)
      .text(item.tooth_number ? `#${item.tooth_number}` : "—", MARGIN + colWidths.name + 6, rowY + 5, {
        width: colWidths.tooth - 6,
      });

    // Fee
    doc
      .font(FONTS.normal)
      .fontSize(9)
      .fillColor(COLORS.black)
      .text(fmt(item.fee), MARGIN + colWidths.name + colWidths.tooth + 6, rowY + 5, {
        width: colWidths.fee - 6,
        align: "right",
      });

    // Insurance
    doc
      .font(FONTS.normal)
      .fontSize(9)
      .fillColor("#059669")
      .text(
        fmt(item.insurance_pays),
        MARGIN + colWidths.name + colWidths.tooth + colWidths.fee + 6,
        rowY + 5,
        { width: colWidths.ins - 6, align: "right" }
      );

    // Patient cost
    doc
      .font(FONTS.bold)
      .fontSize(9)
      .fillColor(COLORS.accent)
      .text(
        fmt(item.patient_pays),
        MARGIN + colWidths.name + colWidths.tooth + colWidths.fee + colWidths.ins + 6,
        rowY + 5,
        { width: colWidths.pt - 6, align: "right" }
      );

    rowY += rowH;
  });

  // Totals row
  const totalFee = items.reduce((s, i) => s + (i.fee ?? 0), 0);
  const totalIns = items.reduce((s, i) => s + (i.insurance_pays ?? 0), 0);
  const totalPt = items.reduce((s, i) => s + (i.patient_pays ?? 0), 0);

  doc.rect(MARGIN, rowY, CONTENT_WIDTH, 22).fill("#e0f2fe");

  doc
    .font(FONTS.bold)
    .fontSize(9.5)
    .fillColor(COLORS.black)
    .text("Subtotal", MARGIN + 6, rowY + 6, { width: colWidths.name - 6 });

  doc
    .font(FONTS.bold)
    .fontSize(9.5)
    .fillColor(COLORS.black)
    .text(fmt(totalFee), MARGIN + colWidths.name + colWidths.tooth + 6, rowY + 6, {
      width: colWidths.fee - 6,
      align: "right",
    });

  doc
    .font(FONTS.bold)
    .fontSize(9.5)
    .fillColor("#059669")
    .text(fmt(totalIns), MARGIN + colWidths.name + colWidths.tooth + colWidths.fee + 6, rowY + 6, {
      width: colWidths.ins - 6,
      align: "right",
    });

  doc
    .font(FONTS.bold)
    .fontSize(10)
    .fillColor(COLORS.accent)
    .text(fmt(totalPt), MARGIN + colWidths.name + colWidths.tooth + colWidths.fee + colWidths.ins + 6, rowY + 6, {
      width: colWidths.pt - 6,
      align: "right",
    });

  doc
    .rect(MARGIN, doc.y, CONTENT_WIDTH, rowY + 22 - doc.y)
    .strokeColor(COLORS.lightGray)
    .lineWidth(0.5)
    .stroke();

  doc.y = rowY + 22 + 6;
}

// Suppress unused variable warning for PAGE_WIDTH (imported but used via helper)
void PAGE_WIDTH;
