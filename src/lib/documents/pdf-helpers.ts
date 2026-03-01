import PDFDocument from "pdfkit";

// ---------------------------------------------------------------------------
// Shared layout constants
// ---------------------------------------------------------------------------
export const MARGIN = 72; // 1 inch
export const PAGE_WIDTH = 612; // US Letter
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export const COLORS = {
  black: "#0f172a",
  gray: "#64748b",
  lightGray: "#e2e8f0",
  accent: "#0891b2", // cyan-600 — matches AK Dental theme
  red: "#dc2626",
};

export const FONTS = {
  normal: "Helvetica",
  bold: "Helvetica-Bold",
  oblique: "Helvetica-Oblique",
};

// ---------------------------------------------------------------------------
// Creates a new PDFDocument with standard settings
// ---------------------------------------------------------------------------
export function createDoc(): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: { Creator: "Dental Engine Partners LLC / NuStack Digital Ventures" },
    bufferPages: true,
  });
  return doc;
}

// ---------------------------------------------------------------------------
// Collects the PDF stream into a Buffer
// ---------------------------------------------------------------------------
export function collectBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

// ---------------------------------------------------------------------------
// Page header — used on every page after the first
// ---------------------------------------------------------------------------
export function drawPageHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  agreementNumber: string
) {
  doc
    .font(FONTS.normal)
    .fontSize(8)
    .fillColor(COLORS.gray)
    .text(title, MARGIN, 40, { width: CONTENT_WIDTH, align: "left", continued: true })
    .text(agreementNumber, { align: "right" });

  doc
    .moveTo(MARGIN, 52)
    .lineTo(PAGE_WIDTH - MARGIN, 52)
    .strokeColor(COLORS.lightGray)
    .lineWidth(0.5)
    .stroke();
}

// ---------------------------------------------------------------------------
// Page footer — page number + disclaimer
// ---------------------------------------------------------------------------
export function drawFooters(doc: PDFKit.PDFDocument, disclaimer = true) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    const y = doc.page.height - 50;

    if (disclaimer) {
      doc
        .font(FONTS.oblique)
        .fontSize(7)
        .fillColor(COLORS.red)
        .text(
          "FRAMEWORK DOCUMENT — NOT A FINAL LEGAL INSTRUMENT. Must be reviewed and approved by a licensed attorney before execution.",
          MARGIN,
          y - 14,
          { width: CONTENT_WIDTH, align: "center" }
        );
    }

    doc
      .font(FONTS.normal)
      .fontSize(8)
      .fillColor(COLORS.gray)
      .text(
        `Page ${i + 1} of ${range.count}`,
        MARGIN,
        y,
        { width: CONTENT_WIDTH, align: "center" }
      );
  }
}

// ---------------------------------------------------------------------------
// Cover block — agreement number, title, parties
// ---------------------------------------------------------------------------
export function drawCoverBlock(
  doc: PDFKit.PDFDocument,
  opts: {
    agreementNumber: string;
    title: string;
    subtitle?: string;
    date: string;
    parties: Array<{ role: string; name: string; detail?: string }>;
  }
) {
  // Accent bar
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 4).fill(COLORS.accent);
  doc.moveDown(0.6);

  // Agreement number
  doc
    .font(FONTS.normal)
    .fontSize(9)
    .fillColor(COLORS.gray)
    .text(`Agreement No. ${opts.agreementNumber}   ·   ${opts.date}`, { align: "center" });
  doc.moveDown(0.4);

  // Title
  doc
    .font(FONTS.bold)
    .fontSize(18)
    .fillColor(COLORS.black)
    .text(opts.title, { align: "center" });

  if (opts.subtitle) {
    doc.moveDown(0.3);
    doc
      .font(FONTS.normal)
      .fontSize(11)
      .fillColor(COLORS.gray)
      .text(opts.subtitle, { align: "center" });
  }

  doc.moveDown(1);

  // Parties box
  const boxY = doc.y;
  const boxH = opts.parties.length * 42 + 16;
  doc.rect(MARGIN, boxY, CONTENT_WIDTH, boxH).strokeColor(COLORS.lightGray).lineWidth(1).stroke();

  let partyY = boxY + 10;
  opts.parties.forEach((p, idx) => {
    doc
      .font(FONTS.bold)
      .fontSize(8)
      .fillColor(COLORS.gray)
      .text(p.role.toUpperCase(), MARGIN + 12, partyY);
    doc
      .font(FONTS.bold)
      .fontSize(10)
      .fillColor(COLORS.black)
      .text(p.name, MARGIN + 12, partyY + 10);
    if (p.detail) {
      doc
        .font(FONTS.normal)
        .fontSize(9)
        .fillColor(COLORS.gray)
        .text(p.detail, MARGIN + 12, partyY + 22);
    }

    if (idx < opts.parties.length - 1) {
      doc
        .moveTo(MARGIN + 12, partyY + 36)
        .lineTo(PAGE_WIDTH - MARGIN - 12, partyY + 36)
        .strokeColor(COLORS.lightGray)
        .lineWidth(0.5)
        .stroke();
    }
    partyY += 42;
  });

  doc.y = boxY + boxH + 8;
  doc.moveDown(0.5);
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------
export function sectionHead(
  doc: PDFKit.PDFDocument,
  text: string,
  level: 1 | 2 = 1
) {
  doc.moveDown(level === 1 ? 0.8 : 0.5);

  if (level === 1) {
    doc
      .font(FONTS.bold)
      .fontSize(12)
      .fillColor(COLORS.accent)
      .text(text.toUpperCase(), { characterSpacing: 0.5 });
    doc
      .moveTo(MARGIN, doc.y + 2)
      .lineTo(PAGE_WIDTH - MARGIN, doc.y + 2)
      .strokeColor(COLORS.accent)
      .lineWidth(0.5)
      .stroke();
  } else {
    doc
      .font(FONTS.bold)
      .fontSize(10)
      .fillColor(COLORS.black)
      .text(text);
  }
  doc.moveDown(0.4);
}

// ---------------------------------------------------------------------------
// Body paragraph
// ---------------------------------------------------------------------------
export function para(
  doc: PDFKit.PDFDocument,
  text: string,
  opts?: { indent?: boolean; small?: boolean }
) {
  doc
    .font(FONTS.normal)
    .fontSize(opts?.small ? 8.5 : 10)
    .fillColor(COLORS.black)
    .text(text, {
      indent: opts?.indent ? 24 : 0,
      align: "justify",
      lineGap: 2,
    });
  doc.moveDown(0.4);
}

// ---------------------------------------------------------------------------
// Numbered clause
// ---------------------------------------------------------------------------
export function clause(
  doc: PDFKit.PDFDocument,
  number: string,
  title: string,
  body: string
) {
  doc
    .font(FONTS.bold)
    .fontSize(10)
    .fillColor(COLORS.black)
    .text(`${number}  ${title}`, { continued: false });
  doc
    .font(FONTS.normal)
    .fontSize(10)
    .fillColor(COLORS.black)
    .text(body, { indent: 16, align: "justify", lineGap: 2 });
  doc.moveDown(0.4);
}

// ---------------------------------------------------------------------------
// Signature block — two-column
// ---------------------------------------------------------------------------
export function drawSignatureBlock(
  doc: PDFKit.PDFDocument,
  left: { entity: string; role: string; name: string; title: string },
  right: { entity: string; role: string; name: string; title: string }
) {
  doc.moveDown(1);
  sectionHead(doc, "Signatures", 1);

  const col = CONTENT_WIDTH / 2 - 12;
  const lx = MARGIN;
  const rx = MARGIN + col + 24;
  const startY = doc.y;

  // Left column
  doc.font(FONTS.bold).fontSize(9).fillColor(COLORS.black)
    .text(left.entity, lx, startY, { width: col });
  doc.font(FONTS.normal).fontSize(8.5).fillColor(COLORS.gray)
    .text(left.role, lx, doc.y, { width: col });
  doc.moveDown(1.2);
  doc
    .moveTo(lx, doc.y)
    .lineTo(lx + col, doc.y)
    .strokeColor(COLORS.black)
    .lineWidth(0.5)
    .stroke();
  doc.moveDown(0.3);
  doc.font(FONTS.normal).fontSize(9).fillColor(COLORS.black)
    .text(`Name: ${left.name}`, lx, doc.y, { width: col });
  doc.font(FONTS.normal).fontSize(9)
    .text(`Title: ${left.title}`, lx, doc.y, { width: col });
  doc.font(FONTS.normal).fontSize(9)
    .text("Date: ___________________", lx, doc.y, { width: col });

  // Right column
  const rightStart = startY;
  doc.font(FONTS.bold).fontSize(9).fillColor(COLORS.black)
    .text(right.entity, rx, rightStart, { width: col });
  doc.font(FONTS.normal).fontSize(8.5).fillColor(COLORS.gray)
    .text(right.role, rx, doc.y, { width: col });

  const sigLineY = startY + 42;
  doc
    .moveTo(rx, sigLineY)
    .lineTo(rx + col, sigLineY)
    .strokeColor(COLORS.black)
    .lineWidth(0.5)
    .stroke();
  doc.font(FONTS.normal).fontSize(9).fillColor(COLORS.black)
    .text(`Name: ${right.name}`, rx, sigLineY + 6, { width: col });
  doc.font(FONTS.normal).fontSize(9)
    .text(`Title: ${right.title}`, rx, doc.y, { width: col });
  doc.font(FONTS.normal).fontSize(9)
    .text("Date: ___________________", rx, doc.y, { width: col });

  doc.moveDown(2);
}

// ---------------------------------------------------------------------------
// Table (simple 2-col key/value)
// ---------------------------------------------------------------------------
export function kvTable(
  doc: PDFKit.PDFDocument,
  rows: Array<[string, string]>,
  opts?: { colWidth?: number }
) {
  const keyW = opts?.colWidth ?? 180;
  const valW = CONTENT_WIDTH - keyW;
  let y = doc.y;

  rows.forEach(([key, val], i) => {
    const bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
    doc.rect(MARGIN, y, CONTENT_WIDTH, 18).fill(bg);

    doc.font(FONTS.bold).fontSize(9).fillColor(COLORS.gray)
      .text(key, MARGIN + 6, y + 4, { width: keyW - 6 });
    doc.font(FONTS.normal).fontSize(9).fillColor(COLORS.black)
      .text(val, MARGIN + keyW + 6, y + 4, { width: valW - 6 });

    y += 18;
  });

  doc
    .rect(MARGIN, doc.y, CONTENT_WIDTH, y - doc.y)
    .strokeColor(COLORS.lightGray)
    .lineWidth(0.5)
    .stroke();

  doc.y = y + 6;
  doc.moveDown(0.4);
}
