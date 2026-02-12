#!/usr/bin/env npx ts-node

/**
 * SEO Validation Script (Engine Template)
 *
 * Validates SEO configuration to prevent indexing issues:
 * 1. Canonical tag consistency
 * 2. Noindex detection
 * 3. Meta tag length validation (title 30-70, description 100-165)
 * 4. Redirect health
 * 5. Sitemap integrity
 * 6. Duplicate content detection
 *
 * Usage:
 *   npx ts-node scripts/seo-validation.ts
 *   npm run seo:validate
 */

import * as fs from "fs";
import * as path from "path";

// =============================================================================
// CONFIGURATION — reads from practice config at build time
// =============================================================================

// Load site URL from practice config file
function loadSiteUrl(): string {
  const practiceConfigPath = path.join(
    process.cwd(),
    "src/config/practice.ts"
  );
  if (fs.existsSync(practiceConfigPath)) {
    const content = fs.readFileSync(practiceConfigPath, "utf-8");
    const urlMatch = content.match(/url:\s*["']([^"']+)["']/);
    if (urlMatch) return urlMatch[1];
  }
  return "https://localhost:3000";
}

const SITE_URL = loadSiteUrl();

const SEO_CONFIG = {
  canonicalDomain: SITE_URL,
  allowedNoindexPaths: [
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/privacy-policy",
    "/terms-of-service",
  ],
  excludeFromSitemap: [
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/privacy-policy",
    "/terms-of-service",
  ],
  titleMinLength: 30,
  titleMaxLength: 70,
  descriptionMinLength: 100,
  descriptionMaxLength: 165,
};

// =============================================================================
// TYPES
// =============================================================================

interface ValidationIssue {
  type: "critical" | "warning";
  category:
    | "canonical"
    | "noindex"
    | "redirect"
    | "sitemap"
    | "duplicate"
    | "meta";
  file: string;
  message: string;
  details?: string;
}

interface ValidationReport {
  timestamp: string;
  siteUrl: string;
  totalFiles: number;
  criticalIssues: ValidationIssue[];
  warnings: ValidationIssue[];
  passed: boolean;
}

// =============================================================================
// FILE SYSTEM HELPERS
// =============================================================================

function getAllPageFiles(dir: string, files: string[] = []): string[] {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, dashboard routes (not public)
      if (["node_modules", ".next", "api"].includes(item)) continue;
      getAllPageFiles(fullPath, files);
    } else if (item === "page.tsx" || item === "layout.tsx") {
      files.push(fullPath);
    }
  }

  return files;
}

function getRouteFromFilePath(filePath: string, appDir: string): string {
  const route = filePath
    .replace(appDir, "")
    .replace(/\\/g, "/")
    .replace("/page.tsx", "")
    .replace("/layout.tsx", "")
    .replace(/\/\([^)]+\)/g, ""); // Strip route groups like (marketing)

  if (route === "" || route === "/") {
    return "/";
  }

  return route;
}

// =============================================================================
// VALIDATION CHECKS
// =============================================================================

function checkCanonicalConsistency(
  content: string,
  filePath: string,
  route: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check for canonical in alternates
  const canonicalMatch = content.match(/canonical:\s*['"`]([^'"`]+)['"`]/);

  if (!canonicalMatch) {
    if (!filePath.includes("layout.tsx")) {
      issues.push({
        type: "warning",
        category: "canonical",
        file: filePath,
        message: `Missing canonical tag`,
        details: `Route: ${route}`,
      });
    }
    return issues;
  }

  const canonical = canonicalMatch[1];

  // Check domain consistency
  if (
    !canonical.startsWith(SEO_CONFIG.canonicalDomain) &&
    !canonical.includes("siteConfig.url")
  ) {
    issues.push({
      type: "critical",
      category: "canonical",
      file: filePath,
      message: `Canonical uses wrong domain`,
      details: `Expected: ${SEO_CONFIG.canonicalDomain}, Found: ${canonical}`,
    });
  }

  // Check for www/non-www mismatch
  const configHasWww = SEO_CONFIG.canonicalDomain.includes("www.");
  const canonicalHasWww = canonical.includes("www.");

  if (configHasWww !== canonicalHasWww && !canonical.includes("siteConfig")) {
    issues.push({
      type: "critical",
      category: "canonical",
      file: filePath,
      message: `www/non-www mismatch in canonical`,
      details: `Config: ${configHasWww ? "www" : "non-www"}, Canonical: ${canonicalHasWww ? "www" : "non-www"}`,
    });
  }

  // Check for query parameters
  if (canonical.includes("?")) {
    issues.push({
      type: "warning",
      category: "canonical",
      file: filePath,
      message: `Canonical contains query parameters`,
      details: `Canonical: ${canonical}`,
    });
  }

  return issues;
}

function checkNoindex(
  content: string,
  filePath: string,
  route: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const noindexMatch = content.match(/(?<![a-z])index:\s*false/);

  if (noindexMatch) {
    const isAllowed = SEO_CONFIG.allowedNoindexPaths.some(
      (allowed) => route === allowed || route.startsWith(`${allowed}/`)
    );

    if (!isAllowed) {
      issues.push({
        type: "critical",
        category: "noindex",
        file: filePath,
        message: `Page has noindex but is not in allowed list`,
        details: `Route: ${route}. Add to allowedNoindexPaths if intentional.`,
      });
    }
  }

  return issues;
}

function checkMetaTags(
  content: string,
  filePath: string,
  route: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (filePath.includes("layout.tsx")) {
    return issues;
  }

  // Skip dashboard pages
  if (route.startsWith("/dashboard")) {
    return issues;
  }

  // Check for title
  const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
  if (!titleMatch) {
    issues.push({
      type: "warning",
      category: "meta",
      file: filePath,
      message: `Missing title tag`,
      details: `Route: ${route}`,
    });
  } else {
    const title = titleMatch[1];
    if (title.length < SEO_CONFIG.titleMinLength) {
      issues.push({
        type: "warning",
        category: "meta",
        file: filePath,
        message: `Title too short (${title.length} chars, min ${SEO_CONFIG.titleMinLength})`,
        details: `Title: "${title}"`,
      });
    }
    if (title.length > SEO_CONFIG.titleMaxLength) {
      issues.push({
        type: "warning",
        category: "meta",
        file: filePath,
        message: `Title too long (${title.length} chars, max ${SEO_CONFIG.titleMaxLength})`,
        details: `Title: "${title.substring(0, 50)}..."`,
      });
    }
  }

  // Check for description
  const descMatch = content.match(/description:\s*\n?\s*['"`]([^'"`]+)['"`]/);
  if (!descMatch) {
    issues.push({
      type: "warning",
      category: "meta",
      file: filePath,
      message: `Missing meta description`,
      details: `Route: ${route}`,
    });
  } else {
    const desc = descMatch[1];
    if (desc.length < SEO_CONFIG.descriptionMinLength) {
      issues.push({
        type: "warning",
        category: "meta",
        file: filePath,
        message: `Description too short (${desc.length} chars, min ${SEO_CONFIG.descriptionMinLength})`,
        details: `Route: ${route}`,
      });
    }
    if (desc.length > SEO_CONFIG.descriptionMaxLength) {
      issues.push({
        type: "warning",
        category: "meta",
        file: filePath,
        message: `Description too long (${desc.length} chars, max ${SEO_CONFIG.descriptionMaxLength})`,
        details: `Route: ${route}`,
      });
    }
  }

  return issues;
}

function checkRedirects(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check next.config.js or next.config.ts or next.config.mjs
  const configFiles = [
    "next.config.js",
    "next.config.ts",
    "next.config.mjs",
  ];
  let configContent = "";
  let configFile = "";

  for (const file of configFiles) {
    const configPath = path.join(process.cwd(), file);
    if (fs.existsSync(configPath)) {
      configContent = fs.readFileSync(configPath, "utf-8");
      configFile = file;
      break;
    }
  }

  if (!configFile) {
    issues.push({
      type: "warning",
      category: "redirect",
      file: "next.config.*",
      message: `No Next.js config file found`,
    });
    return issues;
  }

  // Check for 302 redirects (should be 301)
  if (configContent.includes("permanent: false")) {
    issues.push({
      type: "warning",
      category: "redirect",
      file: configFile,
      message: `Found non-permanent (302) redirect - consider using permanent: true for SEO`,
    });
  }

  return issues;
}

function checkSitemap(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check multiple possible sitemap locations
  const sitemapPaths = [
    "src/app/sitemap.ts",
    "src/app/(marketing)/sitemap.ts",
  ];

  let sitemapContent = "";
  let sitemapFile = "";

  for (const sp of sitemapPaths) {
    const fullPath = path.join(process.cwd(), sp);
    if (fs.existsSync(fullPath)) {
      sitemapContent = fs.readFileSync(fullPath, "utf-8");
      sitemapFile = sp;
      break;
    }
  }

  if (!sitemapFile) {
    issues.push({
      type: "critical",
      category: "sitemap",
      file: "sitemap.ts",
      message: `sitemap.ts not found in src/app/ or src/app/(marketing)/`,
    });
    return issues;
  }

  // Check for hardcoded URLs (should use siteConfig.url)
  const hardcodedUrlMatch = sitemapContent.match(
    /const\s+baseUrl\s*=\s*["']https?:\/\/[^"']+["']/
  );
  if (hardcodedUrlMatch) {
    issues.push({
      type: "warning",
      category: "sitemap",
      file: sitemapFile,
      message: `Sitemap uses hardcoded URL instead of siteConfig.url`,
      details: hardcodedUrlMatch[0],
    });
  }

  // Extract URLs from sitemap
  const urlMatches = Array.from(
    sitemapContent.matchAll(/url:\s*`\$\{baseUrl\}([^`]*)`/g)
  );
  const sitemapUrls = new Set<string>();

  for (const match of urlMatches) {
    sitemapUrls.add(match[1] || "/");
  }

  // Get all marketing page routes
  const appDir = path.join(process.cwd(), "src/app");
  const marketingDir = path.join(appDir, "(marketing)");
  const searchDir = fs.existsSync(marketingDir) ? marketingDir : appDir;
  const pageFiles = getAllPageFiles(searchDir);
  const pageRoutes = new Set<string>();

  for (const file of pageFiles) {
    if (file.includes("layout.tsx")) continue;
    if (file.includes("dashboard")) continue;
    const route = getRouteFromFilePath(file, appDir);
    pageRoutes.add(route);
  }

  // Check for pages not in sitemap
  for (const route of Array.from(pageRoutes)) {
    if (!sitemapUrls.has(route)) {
      const isExcluded = SEO_CONFIG.excludeFromSitemap.some(
        (excluded) =>
          route === excluded || route.startsWith(`${excluded}/`)
      );
      const isNoindexAllowed = SEO_CONFIG.allowedNoindexPaths.some(
        (allowed) =>
          route === allowed || route.startsWith(`${allowed}/`)
      );
      // Skip dynamic routes like [slug]
      const isDynamic = route.includes("[");

      if (!isExcluded && !isNoindexAllowed && !isDynamic) {
        issues.push({
          type: "warning",
          category: "sitemap",
          file: sitemapFile,
          message: `Page not in sitemap`,
          details: `Route: ${route}`,
        });
      }
    }
  }

  return issues;
}

function checkDuplicateContent(
  pageFiles: string[],
  appDir: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();

  for (const file of pageFiles) {
    if (file.includes("layout.tsx")) continue;

    const content = fs.readFileSync(file, "utf-8");
    const route = getRouteFromFilePath(file, appDir);

    const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
    const descMatch = content.match(/description:\s*\n?\s*['"`]([^'"`]+)['"`]/);

    if (titleMatch) {
      const title = titleMatch[1];
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title)!.push(route);
    }

    if (descMatch) {
      const desc = descMatch[1];
      if (!descMap.has(desc)) {
        descMap.set(desc, []);
      }
      descMap.get(desc)!.push(route);
    }
  }

  for (const [title, routes] of Array.from(titleMap)) {
    if (routes.length > 1) {
      issues.push({
        type: "warning",
        category: "duplicate",
        file: "multiple",
        message: `Duplicate title found on ${routes.length} pages`,
        details: `Title: "${title.substring(0, 50)}..." | Routes: ${routes.join(", ")}`,
      });
    }
  }

  for (const [, routes] of Array.from(descMap)) {
    if (routes.length > 1) {
      issues.push({
        type: "warning",
        category: "duplicate",
        file: "multiple",
        message: `Duplicate description found on ${routes.length} pages`,
        details: `Routes: ${routes.join(", ")}`,
      });
    }
  }

  return issues;
}

function checkMiddleware(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const middlewarePath = path.join(process.cwd(), "src/middleware.ts");

  if (!fs.existsSync(middlewarePath)) {
    issues.push({
      type: "warning",
      category: "redirect",
      file: "src/middleware.ts",
      message: `middleware.ts not found - www/non-www redirect may not be configured`,
    });
    return issues;
  }

  const content = fs.readFileSync(middlewarePath, "utf-8");

  const configHasWww = SEO_CONFIG.canonicalDomain.includes("www.");

  if (configHasWww && !content.includes("www.")) {
    issues.push({
      type: "warning",
      category: "redirect",
      file: "src/middleware.ts",
      message: `Middleware should redirect non-www to www (canonical domain uses www)`,
    });
  }

  return issues;
}

// =============================================================================
// MAIN VALIDATION
// =============================================================================

function runValidation(): ValidationReport {
  console.log("Running SEO Validation...\n");
  console.log(`Site URL: ${SITE_URL}`);

  const appDir = path.join(process.cwd(), "src/app");
  const pageFiles = getAllPageFiles(appDir);

  const allIssues: ValidationIssue[] = [];

  console.log(`Checking ${pageFiles.length} page files...`);

  for (const file of pageFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const route = getRouteFromFilePath(file, appDir);

    allIssues.push(...checkCanonicalConsistency(content, file, route));
    allIssues.push(...checkNoindex(content, file, route));
    allIssues.push(...checkMetaTags(content, file, route));
  }

  console.log("Checking redirects...");
  allIssues.push(...checkRedirects());

  console.log("Checking middleware...");
  allIssues.push(...checkMiddleware());

  console.log("Checking sitemap...");
  allIssues.push(...checkSitemap());

  console.log("Checking for duplicate content...");
  allIssues.push(...checkDuplicateContent(pageFiles, appDir));

  const criticalIssues = allIssues.filter((i) => i.type === "critical");
  const warnings = allIssues.filter((i) => i.type === "warning");

  return {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    totalFiles: pageFiles.length,
    criticalIssues,
    warnings,
    passed: criticalIssues.length === 0,
  };
}

function printReport(report: ValidationReport): void {
  console.log("\n" + "=".repeat(60));
  console.log("SEO VALIDATION REPORT");
  console.log("=".repeat(60));
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`Site URL:  ${report.siteUrl}`);
  console.log(`Total Files: ${report.totalFiles}`);
  console.log("");

  if (report.criticalIssues.length > 0) {
    console.log("CRITICAL ISSUES (" + report.criticalIssues.length + ")");
    console.log("-".repeat(40));
    for (const issue of report.criticalIssues) {
      console.log(`  [${issue.category.toUpperCase()}] ${issue.message}`);
      console.log(`    File: ${issue.file}`);
      if (issue.details) {
        console.log(`    Details: ${issue.details}`);
      }
      console.log("");
    }
  }

  if (report.warnings.length > 0) {
    console.log("WARNINGS (" + report.warnings.length + ")");
    console.log("-".repeat(40));
    for (const issue of report.warnings) {
      console.log(`  [${issue.category.toUpperCase()}] ${issue.message}`);
      if (issue.details) {
        console.log(`    ${issue.details}`);
      }
    }
    console.log("");
  }

  console.log("=".repeat(60));
  if (report.passed) {
    console.log("VALIDATION PASSED (no critical issues)");
  } else {
    console.log(
      "VALIDATION FAILED (" + report.criticalIssues.length + " critical issues)"
    );
  }
  console.log("=".repeat(60));
}

// =============================================================================
// ENTRY POINT
// =============================================================================

const report = runValidation();
printReport(report);

process.exit(report.passed ? 0 : 1);
