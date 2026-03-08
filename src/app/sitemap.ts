import type { MetadataRoute } from "next";
import { siteConfig, getAllRenderableServices } from "@/lib/config";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static marketing pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/technology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/appointment`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/get-started`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/patient-portal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/dentist-las-vegas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Neighborhood SEO pages
    { url: `${baseUrl}/dentist-summerlin`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/dentist-henderson`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/dentist-spring-valley`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/dentist-north-las-vegas`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    // High-intent location + service pages
    { url: `${baseUrl}/dental-implants-las-vegas`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/porcelain-veneers-las-vegas`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/cosmetic-dentistry-las-vegas`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/teeth-whitening-las-vegas`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    // Specialty conversion pages
    { url: `${baseUrl}/emergency-dentist-las-vegas`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/sedation-dentistry-las-vegas`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    // Trust / comparison pages
    { url: `${baseUrl}/team/dr-alex-chireau`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/insurance`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/smile-gallery`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/why-ak-dental`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    {
      url: `${baseUrl}/dr-scott-miller-retirement`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic service pages
  const allServices = getAllRenderableServices();
  const servicePages: MetadataRoute.Sitemap = allServices.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: service.featured ? 0.8 : 0.7,
  }));

  // Dynamic blog post pages
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createServerSupabase();
    const { data: posts } = await supabase
      .from("seo_blog_posts")
      .select("slug, published_at")
      .eq("status", "published");
    blogPages = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch { /* sitemap still works without blog posts */ }

  return [...staticPages, ...servicePages, ...blogPages];
}
