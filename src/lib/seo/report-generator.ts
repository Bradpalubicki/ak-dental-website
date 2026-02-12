/**
 * SEO Monthly Report Generator (Engine Template)
 *
 * Generates an HTML email report with SEO metrics for the month.
 * Covers: keyword rankings, traffic overview, web vitals, audit results.
 */

export interface MonthlyReportData {
  month: string; // "2026-02"
  practiceName: string;
  siteUrl: string;
  keywords: {
    keyword: string;
    currentRank: number | null;
    previousRank: number | null;
    bestRank: number | null;
    category: string;
  }[];
  vitals: {
    lcp: number | null;
    cls: number | null;
    inp: number | null;
  };
  auditScore: number | null;
  issuesCritical: number;
  issuesWarning: number;
  gscData: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
  };
}

function getRankChangeHtml(current: number | null, previous: number | null): string {
  if (!current || !previous) return '<span style="color: #94a3b8;">--</span>';
  const diff = previous - current;
  if (diff > 0) return `<span style="color: #22c55e;">+${diff}</span>`;
  if (diff < 0) return `<span style="color: #ef4444;">${diff}</span>`;
  return '<span style="color: #94a3b8;">--</span>';
}

function getVitalStatus(name: string, value: number | null): { label: string; color: string } {
  if (value === null) return { label: "No data", color: "#94a3b8" };

  switch (name) {
    case "LCP":
      if (value <= 2500) return { label: "Good", color: "#22c55e" };
      if (value <= 4000) return { label: "Needs Improvement", color: "#f59e0b" };
      return { label: "Poor", color: "#ef4444" };
    case "CLS":
      if (value <= 0.1) return { label: "Good", color: "#22c55e" };
      if (value <= 0.25) return { label: "Needs Improvement", color: "#f59e0b" };
      return { label: "Poor", color: "#ef4444" };
    case "INP":
      if (value <= 200) return { label: "Good", color: "#22c55e" };
      if (value <= 500) return { label: "Needs Improvement", color: "#f59e0b" };
      return { label: "Poor", color: "#ef4444" };
    default:
      return { label: "Unknown", color: "#94a3b8" };
  }
}

export function generateMonthlyReportHtml(data: MonthlyReportData): string {
  const monthLabel = new Date(data.month + "-01").toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const lcpStatus = getVitalStatus("LCP", data.vitals.lcp);
  const clsStatus = getVitalStatus("CLS", data.vitals.cls);
  const inpStatus = getVitalStatus("INP", data.vitals.inp);

  const top20Keywords = data.keywords
    .filter((k) => k.currentRank)
    .sort((a, b) => (a.currentRank || 999) - (b.currentRank || 999))
    .slice(0, 20);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
</head>
<body style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0891b2, #2563eb); padding: 32px; border-radius: 12px; color: white; text-align: center; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px;">${data.practiceName}</h1>
    <p style="margin: 8px 0 0; opacity: 0.9;">SEO Performance Report - ${monthLabel}</p>
  </div>

  <!-- Executive Summary -->
  <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">Executive Summary</h2>
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 120px; text-align: center; padding: 16px; background: #f0fdf4; border-radius: 8px;">
        <div style="font-size: 28px; font-weight: bold; color: #166534;">${data.keywords.length}</div>
        <div style="font-size: 12px; color: #4b5563;">Keywords Tracked</div>
      </div>
      <div style="flex: 1; min-width: 120px; text-align: center; padding: 16px; background: #eff6ff; border-radius: 8px;">
        <div style="font-size: 28px; font-weight: bold; color: #1e40af;">${data.gscData.totalClicks.toLocaleString()}</div>
        <div style="font-size: 12px; color: #4b5563;">Clicks</div>
      </div>
      <div style="flex: 1; min-width: 120px; text-align: center; padding: 16px; background: #fefce8; border-radius: 8px;">
        <div style="font-size: 28px; font-weight: bold; color: #854d0e;">${data.gscData.totalImpressions.toLocaleString()}</div>
        <div style="font-size: 12px; color: #4b5563;">Impressions</div>
      </div>
      <div style="flex: 1; min-width: 120px; text-align: center; padding: 16px; background: ${data.auditScore && data.auditScore >= 80 ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px;">
        <div style="font-size: 28px; font-weight: bold; color: ${data.auditScore && data.auditScore >= 80 ? '#166534' : '#991b1b'};">${data.auditScore ?? '--'}</div>
        <div style="font-size: 12px; color: #4b5563;">Health Score</div>
      </div>
    </div>
  </div>

  <!-- Core Web Vitals -->
  <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">Core Web Vitals</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>LCP</strong> (Largest Contentful Paint)
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${data.vitals.lcp !== null ? `${(data.vitals.lcp / 1000).toFixed(2)}s` : '--'}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: ${lcpStatus.color}; font-weight: bold;">
          ${lcpStatus.label}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>CLS</strong> (Cumulative Layout Shift)
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${data.vitals.cls !== null ? data.vitals.cls.toFixed(3) : '--'}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: ${clsStatus.color}; font-weight: bold;">
          ${clsStatus.label}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px;">
          <strong>INP</strong> (Interaction to Next Paint)
        </td>
        <td style="padding: 12px; text-align: right;">
          ${data.vitals.inp !== null ? `${data.vitals.inp.toFixed(0)}ms` : '--'}
        </td>
        <td style="padding: 12px; text-align: right; color: ${inpStatus.color}; font-weight: bold;">
          ${inpStatus.label}
        </td>
      </tr>
    </table>
  </div>

  <!-- Keyword Rankings -->
  ${top20Keywords.length > 0 ? `
  <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">Top Keyword Rankings</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background: #f8fafc;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Keyword</th>
          <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Rank</th>
          <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Change</th>
          <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Best</th>
        </tr>
      </thead>
      <tbody>
        ${top20Keywords.map(kw => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${kw.keyword}</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f5f9; font-family: monospace;">#${kw.currentRank}</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f5f9;">${getRankChangeHtml(kw.currentRank, kw.previousRank)}</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f5f9; font-family: monospace; color: #94a3b8;">#${kw.bestRank || '--'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <!-- Technical Health -->
  <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">Technical Health</h2>
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 100px; text-align: center; padding: 12px; background: ${data.issuesCritical === 0 ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px;">
        <div style="font-size: 24px; font-weight: bold; color: ${data.issuesCritical === 0 ? '#166534' : '#991b1b'};">${data.issuesCritical}</div>
        <div style="font-size: 11px; color: #4b5563;">Critical Issues</div>
      </div>
      <div style="flex: 1; min-width: 100px; text-align: center; padding: 12px; background: ${data.issuesWarning === 0 ? '#f0fdf4' : '#fefce8'}; border-radius: 8px;">
        <div style="font-size: 24px; font-weight: bold; color: ${data.issuesWarning === 0 ? '#166534' : '#854d0e'};">${data.issuesWarning}</div>
        <div style="font-size: 11px; color: #4b5563;">Warnings</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 12px;">
    <p>Generated by NuStack Digital Ventures</p>
    <p>${data.siteUrl}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate report subject line for email
 */
export function generateReportSubject(data: MonthlyReportData): string {
  const monthLabel = new Date(data.month + "-01").toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  return `${data.practiceName} - SEO Report ${monthLabel}`;
}
