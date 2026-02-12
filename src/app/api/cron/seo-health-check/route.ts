/**
 * SEO Health Check Cron (Engine Template)
 *
 * Daily health check: tests critical URLs and content, sends email report.
 * Config-driven: reads site URL and practice info from siteConfig.
 *
 * Schedule: Daily 7 AM Central (13:00 UTC)
 */

import { NextRequest, NextResponse } from "next/server";
import { siteConfig, services } from "@/lib/config";
import { verifyCronSecret } from "@/lib/cron-auth";

const BASE_URL = siteConfig.url;

const URLS_TO_CHECK = [
  "/",
  "/about",
  "/contact",
  "/reviews",
  "/services",
  "/appointment",
  "/sitemap.xml",
  "/robots.txt",
  ...services.slice(0, 3).map((s) => `/services/${s.slug}`),
];

const HOMEPAGE_CONTENT_CHECKS = [
  { name: "Phone Number", pattern: siteConfig.phone, required: true },
  { name: "Practice Name", pattern: siteConfig.name, required: true },
  { name: "CTA", pattern: "appointment", required: true },
];

interface URLCheckResult {
  url: string;
  status: number | null;
  responseTime: number;
  passed: boolean;
  error?: string;
}

interface ContentCheckResult {
  name: string;
  pattern: string;
  found: boolean;
  passed: boolean;
}

interface HealthReport {
  timestamp: string;
  baseUrl: string;
  practiceName: string;
  overallStatus: "PASS" | "FAIL";
  summary: {
    urlChecks: { passed: number; failed: number; total: number };
    contentChecks: { passed: number; failed: number; total: number };
  };
  urlChecks: URLCheckResult[];
  contentChecks: ContentCheckResult[];
  executionTime: number;
}

async function checkURL(urlPath: string): Promise<URLCheckResult> {
  const url = `${BASE_URL}${urlPath}`;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "NuStack-HealthCheck/1.0" },
    });

    return {
      url,
      status: response.status,
      responseTime: Date.now() - startTime,
      passed: response.status === 200,
    };
  } catch (error) {
    return {
      url,
      status: null,
      responseTime: Date.now() - startTime,
      passed: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkHomepageContent(): Promise<ContentCheckResult[]> {
  const response = await fetch(BASE_URL, {
    headers: { "User-Agent": "NuStack-HealthCheck/1.0" },
  });

  const html = await response.text();

  return HOMEPAGE_CONTENT_CHECKS.map((check) => {
    const found = html.toLowerCase().includes(check.pattern.toLowerCase());
    return {
      name: check.name,
      pattern: check.pattern,
      found,
      passed: check.required ? found : true,
    };
  });
}

async function sendEmailReport(report: HealthReport): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const alertEmail =
    process.env.SEO_ALERT_EMAIL || "brad@nustack.com";

  if (!apiKey) {
    console.log("RESEND_API_KEY not set - skipping email");
    return false;
  }

  const subject = `[${report.overallStatus}] ${report.practiceName} Health Check - ${new Date(report.timestamp).toLocaleDateString()}`;

  const failedURLs = report.urlChecks.filter((c) => !c.passed);
  const failedContent = report.contentChecks.filter((c) => !c.passed);

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: ${report.overallStatus === "PASS" ? "#22c55e" : "#ef4444"};">
        Health Check: ${report.overallStatus}
      </h1>

      <p>
        <strong>Practice:</strong> ${report.practiceName}<br>
        <strong>Timestamp:</strong> ${report.timestamp}<br>
        <strong>Base URL:</strong> ${report.baseUrl}<br>
        <strong>Execution Time:</strong> ${report.executionTime}ms
      </p>

      <h2>Summary</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">URL Checks</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: ${report.summary.urlChecks.failed > 0 ? "#ef4444" : "#22c55e"};">
            ${report.summary.urlChecks.passed}/${report.summary.urlChecks.total} passed
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Content Checks</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: ${report.summary.contentChecks.failed > 0 ? "#ef4444" : "#22c55e"};">
            ${report.summary.contentChecks.passed}/${report.summary.contentChecks.total} passed
          </td>
        </tr>
      </table>

      ${
        failedURLs.length > 0
          ? `
        <h2 style="color: #ef4444;">Failed URL Checks</h2>
        <ul>
          ${failedURLs.map((c) => `<li>${c.url} - Status: ${c.status ?? "Error"} ${c.error ? `(${c.error})` : ""}</li>`).join("")}
        </ul>
      `
          : ""
      }

      ${
        failedContent.length > 0
          ? `
        <h2 style="color: #ef4444;">Failed Content Checks</h2>
        <ul>
          ${failedContent.map((c) => `<li>${c.name}: "${c.pattern}" not found</li>`).join("")}
        </ul>
      `
          : ""
      }

      <h2>All URL Checks</h2>
      <table style="border-collapse: collapse; width: 100%; font-size: 12px;">
        <tr style="background: #f3f4f6;">
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">URL</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Status</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Time</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Result</th>
        </tr>
        ${report.urlChecks
          .map(
            (c) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${c.url.replace(BASE_URL, "")}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${c.status ?? "ERR"}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${c.responseTime}ms</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: ${c.passed ? "#22c55e" : "#ef4444"};">
              ${c.passed ? "PASS" : "FAIL"}
            </td>
          </tr>
        `
          )
          .join("")}
      </table>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">
        NuStack Digital Ventures - Automated Health Check
      </p>
    </div>
  `;

  try {
    const domain = new URL(BASE_URL).hostname;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Site Monitor <monitor@${domain}>`,
        to: [alertEmail],
        subject,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send email:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

async function runHealthCheck(): Promise<HealthReport> {
  const startTime = Date.now();

  const urlChecks: URLCheckResult[] = [];
  for (const urlPath of URLS_TO_CHECK) {
    const result = await checkURL(urlPath);
    urlChecks.push(result);
  }

  const contentChecks = await checkHomepageContent();

  const urlPassed = urlChecks.filter((c) => c.passed).length;
  const contentPassed = contentChecks.filter((c) => c.passed).length;
  const overallStatus =
    urlPassed === urlChecks.length && contentPassed === contentChecks.length
      ? "PASS"
      : "FAIL";

  return {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    practiceName: siteConfig.name,
    overallStatus,
    summary: {
      urlChecks: {
        passed: urlPassed,
        failed: urlChecks.length - urlPassed,
        total: urlChecks.length,
      },
      contentChecks: {
        passed: contentPassed,
        failed: contentChecks.length - contentPassed,
        total: contentChecks.length,
      },
    },
    urlChecks,
    contentChecks,
    executionTime: Date.now() - startTime,
  };
}

export async function GET(request: NextRequest) {
  const auth = verifyCronSecret(request);
  if (!auth.valid) return auth.response!;

  try {
    const report = await runHealthCheck();
    await sendEmailReport(report);

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        error: "Health check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
