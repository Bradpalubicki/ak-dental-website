/**
 * Site Health Check Script (Engine Template)
 *
 * Tests critical URLs and content, generates report, sends email notification.
 * Config-driven: reads site URL and pages from practice config.
 *
 * Usage:
 *   npx ts-node scripts/site-health-check.ts
 *   npm run health-check
 *
 * Environment variables:
 *   RESEND_API_KEY       - For sending email reports
 *   SEO_ALERT_EMAIL      - Recipient email (default: brad@nustack.com)
 *   SITE_URL             - Override site URL (optional, reads from practice config)
 */

import * as fs from "fs";
import * as path from "path";

// =============================================================================
// CONFIGURATION — reads from practice config
// =============================================================================

function loadSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;

  const practiceConfigPath = path.join(
    process.cwd(),
    "src/config/practice.ts"
  );
  if (fs.existsSync(practiceConfigPath)) {
    const content = fs.readFileSync(practiceConfigPath, "utf-8");
    const urlMatch = content.match(/url:\s*["']([^"']+)["']/);
    if (urlMatch) return urlMatch[1];
  }
  return "http://localhost:3000";
}

function loadPracticeName(): string {
  const practiceConfigPath = path.join(
    process.cwd(),
    "src/config/practice.ts"
  );
  if (fs.existsSync(practiceConfigPath)) {
    const content = fs.readFileSync(practiceConfigPath, "utf-8");
    const nameMatch = content.match(/name:\s*["']([^"']+)["']/);
    if (nameMatch) return nameMatch[1];
  }
  return "Site";
}

function loadPhoneNumber(): string | null {
  const practiceConfigPath = path.join(
    process.cwd(),
    "src/config/practice.ts"
  );
  if (fs.existsSync(practiceConfigPath)) {
    const content = fs.readFileSync(practiceConfigPath, "utf-8");
    const phoneMatch = content.match(/phone:\s*["']([^"']+)["']/);
    if (phoneMatch) return phoneMatch[1];
  }
  return null;
}

const BASE_URL = loadSiteUrl();
const PRACTICE_NAME = loadPracticeName();
const PHONE = loadPhoneNumber();
const NOTIFICATION_EMAIL =
  process.env.SEO_ALERT_EMAIL || "brad@nustack.com";

// Build URLs to check from sitemap and standard paths
const URLS_TO_CHECK = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/reviews",
  "/appointment",
  "/sitemap.xml",
  "/robots.txt",
];

// Content to verify on homepage
const HOMEPAGE_CONTENT_CHECKS = [
  ...(PHONE
    ? [{ name: "Phone Number", pattern: PHONE, required: true }]
    : []),
  {
    name: "Practice Name",
    pattern: PRACTICE_NAME,
    required: true,
  },
  { name: "CTA Button", pattern: "appointment", required: true },
];

// =============================================================================
// TYPES
// =============================================================================

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

// =============================================================================
// CHECK FUNCTIONS
// =============================================================================

async function checkURL(urlPath: string): Promise<URLCheckResult> {
  const url = `${BASE_URL}${urlPath}`;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "NuStack-HealthCheck/1.0",
      },
    });

    const responseTime = Date.now() - startTime;
    const passed = response.status === 200;

    return {
      url,
      status: response.status,
      responseTime,
      passed,
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

async function checkHomepageContent(): Promise<{
  html: string;
  checks: ContentCheckResult[];
}> {
  const response = await fetch(BASE_URL, {
    headers: { "User-Agent": "NuStack-HealthCheck/1.0" },
  });

  const html = await response.text();

  const checks: ContentCheckResult[] = HOMEPAGE_CONTENT_CHECKS.map((check) => {
    const found = html.toLowerCase().includes(check.pattern.toLowerCase());
    return {
      name: check.name,
      pattern: check.pattern,
      found,
      passed: check.required ? found : true,
    };
  });

  return { html, checks };
}

// =============================================================================
// EMAIL REPORT
// =============================================================================

async function sendEmailReport(report: HealthReport): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("RESEND_API_KEY not set - skipping email notification");
    return false;
  }

  const statusIcon = report.overallStatus === "PASS" ? "PASS" : "FAIL";
  const subject = `[${statusIcon}] ${report.practiceName} Health Check - ${new Date(report.timestamp).toLocaleDateString()}`;

  const failedURLs = report.urlChecks.filter((c) => !c.passed);
  const failedContent = report.contentChecks.filter((c) => !c.passed);

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: ${report.overallStatus === "PASS" ? "#22c55e" : "#ef4444"};">
        Site Health Check: ${report.overallStatus}
      </h1>

      <p><strong>Practice:</strong> ${report.practiceName}</p>
      <p><strong>Timestamp:</strong> ${report.timestamp}</p>
      <p><strong>Base URL:</strong> ${report.baseUrl}</p>
      <p><strong>Execution Time:</strong> ${report.executionTime}ms</p>

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
        Automated health check by NuStack Digital Ventures.
      </p>
    </div>
  `;

  try {
    // Extract domain from BASE_URL for the from address
    const domain = new URL(BASE_URL).hostname;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Site Monitor <monitor@${domain}>`,
        to: [NOTIFICATION_EMAIL],
        subject,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send email:", error);
      return false;
    }

    console.log("Email report sent to", NOTIFICATION_EMAIL);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function runHealthCheck(): Promise<HealthReport> {
  const startTime = Date.now();
  console.log("Starting site health check...\n");
  console.log(`Practice: ${PRACTICE_NAME}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  // Check all URLs
  console.log("Checking URLs...");
  const urlChecks: URLCheckResult[] = [];

  for (const urlPath of URLS_TO_CHECK) {
    const result = await checkURL(urlPath);
    urlChecks.push(result);
    const status = result.passed ? "OK" : "FAIL";
    console.log(
      `  [${status}] ${urlPath} - ${result.status ?? "ERROR"} (${result.responseTime}ms)`
    );
  }

  // Check homepage content
  console.log("\nChecking homepage content...");
  const { checks: contentChecks } = await checkHomepageContent();

  for (const check of contentChecks) {
    const status = check.passed ? "OK" : "FAIL";
    console.log(
      `  [${status}] ${check.name}: ${check.found ? "Found" : "Missing"}`
    );
  }

  // Generate report
  const urlPassed = urlChecks.filter((c) => c.passed).length;
  const contentPassed = contentChecks.filter((c) => c.passed).length;
  const overallStatus =
    urlPassed === urlChecks.length && contentPassed === contentChecks.length
      ? "PASS"
      : "FAIL";

  const report: HealthReport = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    practiceName: PRACTICE_NAME,
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

  // Print summary
  console.log("\n" + "=".repeat(50));
  console.log(
    `Overall Status: ${overallStatus === "PASS" ? "PASS" : "FAIL"}`
  );
  console.log(`URL Checks: ${urlPassed}/${urlChecks.length} passed`);
  console.log(
    `Content Checks: ${contentPassed}/${contentChecks.length} passed`
  );
  console.log(`Execution Time: ${report.executionTime}ms`);
  console.log("=".repeat(50));

  return report;
}

async function main() {
  try {
    const report = await runHealthCheck();

    // Output JSON report
    console.log("\nJSON Report:");
    console.log(JSON.stringify(report, null, 2));

    // Send email notification
    console.log("\nSending email report...");
    await sendEmailReport(report);

    process.exit(report.overallStatus === "PASS" ? 0 : 1);
  } catch (error) {
    console.error("Health check failed:", error);
    process.exit(1);
  }
}

main();
