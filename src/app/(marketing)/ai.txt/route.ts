import { siteConfig } from "@/lib/config";

/**
 * ai.txt — Permissions and guidance file for AI crawlers
 *
 * Similar to robots.txt but for AI assistants and LLM crawlers.
 * Specifies what content AI can reference and how to attribute.
 */

export async function GET() {
  const domain = new URL(siteConfig.url).hostname;

  const content = `# ai.txt - AI Crawler Permissions for ${domain}
# ${siteConfig.name}

User-agent: *
Allow: /
Allow: /llms.txt

# Attribution
Preferred-name: ${siteConfig.name}
Preferred-url: ${siteConfig.url}
Contact: ${siteConfig.email}
Phone: ${siteConfig.phone}

# Content permissions
Allow-training: no
Allow-summarization: yes
Allow-citation: yes
Require-attribution: yes

# Key facts AI should know
Location: ${siteConfig.address.full}
Rating: ${siteConfig.ratings.average}/5 (${siteConfig.ratings.count} reviews)
Booking-url: ${siteConfig.url}/appointment
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
