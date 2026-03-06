import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";
import { BreadcrumbSchema } from "@/components/schema/local-business";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Dental Health Blog | ${siteConfig.name}`,
  description: `Expert dental health articles from ${siteConfig.name} in Las Vegas & Summerlin. Tips on implants, veneers, cosmetic dentistry, and oral health.`,
  alternates: { canonical: `${siteConfig.url}/blog` },
};

export default async function BlogIndexPage() {
  const supabase = await createServerSupabase();
  const { data: posts } = await supabase
    .from("seo_blog_posts")
    .select("id, slug, title, meta_description, excerpt, category, published_at, word_count, ai_generated")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const published = posts || [];

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">Dental Health Resources</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Expert Dental Advice</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Evidence-based dental health articles from the team at {siteConfig.name} in Las Vegas & Summerlin, NV.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          {published.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <p className="text-xl font-medium">Articles coming soon.</p>
              <p className="mt-2 text-sm">Check back shortly — our team is publishing new content regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {published.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="h-full border border-slate-200 rounded-2xl overflow-hidden hover:border-cyan-400 hover:shadow-lg transition-all duration-200">
                    {/* Category bar */}
                    <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600" />
                    <div className="p-6">
                      {post.category && (
                        <div className="flex items-center gap-1.5 mb-3">
                          <Tag className="h-3 w-3 text-cyan-500" />
                          <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">{post.category}</span>
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug mb-3">
                        {post.title}
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt || post.meta_description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Recent"}
                        </div>
                        <span className="text-xs font-medium text-cyan-600 group-hover:gap-2 flex items-center gap-1 transition-all">
                          Read article <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cyan-600 text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Ready for Your Best Smile?</h2>
          <p className="text-cyan-100 mb-6">Schedule a consultation with Dr. Chireau — same-week appointments available.</p>
          <Link href="/get-started"
            className="inline-flex items-center gap-2 bg-white text-cyan-700 font-semibold px-8 py-3 rounded-full hover:bg-cyan-50 transition-colors">
            Book Your Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
