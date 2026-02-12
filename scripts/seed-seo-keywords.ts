/**
 * SEO Keyword Seed Script (Engine Template)
 *
 * Generates initial keyword list by combining:
 * - Service names + city name
 * - Service names + "near me"
 * - Provider term + city
 * - Provider term + neighborhoods/service areas
 *
 * Usage: npx ts-node scripts/seed-seo-keywords.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */

import * as fs from "fs";
import * as path from "path";

interface KeywordSeed {
  keyword: string;
  category: string;
}

// Read config files to extract practice and engine data
function loadConfig() {
  const practiceFile = fs.readFileSync(
    path.join(__dirname, "../src/config/practice.ts"),
    "utf-8"
  );
  const engineFile = fs.readFileSync(
    path.join(__dirname, "../src/config/engine.ts"),
    "utf-8"
  );

  // Extract practice name
  const nameMatch = practiceFile.match(/name:\s*"([^"]+)"/);
  const practiceName = nameMatch ? nameMatch[1] : "";

  // Extract city
  const cityMatch = practiceFile.match(/city:\s*"([^"]+)"/);
  const city = cityMatch ? cityMatch[1] : "";

  // Extract state abbreviation
  const stateMatch = practiceFile.match(/stateAbbr:\s*"([^"]+)"/);
  const stateAbbr = stateMatch ? stateMatch[1] : "";

  // Extract service areas
  const serviceAreasMatch = practiceFile.match(
    /serviceAreas:\s*\[([\s\S]*?)\]/
  );
  const serviceAreas: string[] = [];
  if (serviceAreasMatch) {
    const areasStr = serviceAreasMatch[1];
    const areaMatches = areasStr.match(/"([^"]+)"/g);
    if (areaMatches) {
      areaMatches.forEach((m) => serviceAreas.push(m.replace(/"/g, "")));
    }
  }

  // Extract provider term from engine config
  const providerMatch = engineFile.match(/provider:\s*"([^"]+)"/);
  const provider = providerMatch ? providerMatch[1] : "";

  // Extract service titles from engine config
  const serviceTitles: string[] = [];
  const titleMatches = engineFile.matchAll(/title:\s*"([^"]+)"/g);
  for (const match of titleMatches) {
    serviceTitles.push(match[1]);
  }

  // Extract engine type
  const engineTypeMatch = engineFile.match(/engineType:\s*"([^"]+)"/);
  const engineType = engineTypeMatch ? engineTypeMatch[1] : "";

  return {
    practiceName,
    city,
    stateAbbr,
    serviceAreas,
    provider,
    serviceTitles,
    engineType,
  };
}

function generateKeywords(config: ReturnType<typeof loadConfig>): KeywordSeed[] {
  const keywords: KeywordSeed[] = [];
  const seen = new Set<string>();

  const add = (keyword: string, category: string) => {
    const normalized = keyword.toLowerCase().trim();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      keywords.push({ keyword: normalized, category });
    }
  };

  const { city, stateAbbr, serviceAreas, provider, serviceTitles } = config;
  const cityState = `${city}, ${stateAbbr}`;

  // Primary: provider + city
  add(`${provider} ${city}`, "primary");
  add(`${city} ${provider}`, "primary");
  add(`${provider} in ${city}`, "primary");
  add(`best ${provider} in ${city}`, "primary");
  add(`${provider} ${cityState}`, "primary");

  // Service: each service + city
  for (const service of serviceTitles) {
    add(`${service.toLowerCase()} ${city}`, "service");
    add(`${service.toLowerCase()} ${cityState}`, "service");
    add(`${service.toLowerCase()} near me`, "long_tail");
  }

  // Local: provider + neighborhoods
  for (const area of serviceAreas.slice(0, 8)) {
    add(`${provider} ${area}`, "local");
    add(`${provider} near ${area}`, "local");
  }

  // Long tail: common modifiers
  const modifiers = [
    "affordable",
    "best",
    "top rated",
    "emergency",
    "family",
  ];
  for (const mod of modifiers) {
    add(`${mod} ${provider} ${city}`, "long_tail");
  }

  // Near me variants
  add(`${provider} near me`, "long_tail");
  add(`${provider} open now`, "long_tail");
  add(`${provider} accepting new patients`, "long_tail");

  return keywords;
}

async function seedKeywords() {
  const config = loadConfig();

  console.log(`\nSEO Keyword Seed Script`);
  console.log(`========================`);
  console.log(`Practice: ${config.practiceName}`);
  console.log(`Engine: ${config.engineType}`);
  console.log(`City: ${config.city}, ${config.stateAbbr}`);
  console.log(`Provider term: ${config.provider}`);
  console.log(`Services: ${config.serviceTitles.length}`);
  console.log(`Service areas: ${config.serviceAreas.length}`);
  console.log();

  const keywords = generateKeywords(config);

  console.log(`Generated ${keywords.length} keywords:`);
  console.log();

  const categories = new Map<string, number>();
  for (const kw of keywords) {
    categories.set(kw.category, (categories.get(kw.category) || 0) + 1);
  }
  for (const [cat, count] of categories) {
    console.log(`  ${cat}: ${count} keywords`);
  }
  console.log();

  // Check for Supabase credentials
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log("No Supabase credentials found. Printing keywords to stdout:\n");
    for (const kw of keywords) {
      console.log(`  [${kw.category}] ${kw.keyword}`);
    }
    console.log(
      "\nTo insert into database, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars."
    );
    return;
  }

  // Insert into Supabase
  console.log("Inserting into seo_keywords table...\n");

  const rows = keywords.map((kw) => ({
    keyword: kw.keyword,
    category: kw.category,
    is_active: true,
  }));

  const response = await fetch(`${supabaseUrl}/rest/v1/seo_keywords`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(rows),
  });

  if (response.ok) {
    console.log(`Successfully inserted ${keywords.length} keywords.`);
  } else {
    const error = await response.text();
    console.error(`Failed to insert keywords: ${response.status}`);
    console.error(error);

    // Fallback: print keywords
    console.log("\nKeywords that would be inserted:");
    for (const kw of keywords) {
      console.log(`  [${kw.category}] ${kw.keyword}`);
    }
  }
}

seedKeywords().catch(console.error);
