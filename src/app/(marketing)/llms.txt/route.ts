import { siteConfig, services } from "@/lib/config";

/**
 * llms.txt — Structured information file for LLM crawlers
 *
 * Provides key practice information in a format that AI assistants
 * (ChatGPT, Perplexity, Google AI Overviews) can parse and reference.
 *
 * @see https://llmstxt.org/
 */

export async function GET() {
  const provider = siteConfig.team[0];
  const serviceList = services
    .map((s) => `- ${s.title}: ${s.description}`)
    .join("\n");

  const serviceAreas = siteConfig.serviceAreas.join(", ");

  const content = `# ${siteConfig.name}

> ${siteConfig.description}

## Contact Information

- Website: ${siteConfig.url}
- Phone: ${siteConfig.phone}
- Email: ${siteConfig.email}
- Address: ${siteConfig.address.full}

## Hours of Operation

${Object.entries(siteConfig.hours)
  .map(([day, hours]) => `- ${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours}`)
  .join("\n")}

## Services

${serviceList}

## About

${provider ? `${provider.name} — ${provider.title}, ${provider.credentials}` : siteConfig.name}

${provider?.bio || ""}

## Service Areas

${serviceAreas}

## Ratings

- Google Rating: ${siteConfig.ratings.average}/5.0
- Reviews: ${siteConfig.ratings.count}+ reviews

## Booking

Schedule an appointment: ${siteConfig.url}/appointment
Call: ${siteConfig.phone}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
