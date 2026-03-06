import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";
import { BreadcrumbSchema, ArticleSchema } from "@/components/schema/local-business";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: post } = await supabase
    .from("seo_blog_posts")
    .select("title, meta_title, meta_description, excerpt, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "Article Not Found" };

  return {
    title: post.meta_title || `${post.title} | ${siteConfig.name}`,
    description: post.meta_description || post.excerpt || "",
    alternates: { canonical: `${siteConfig.url}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || "",
      type: "article",
      publishedTime: post.published_at || undefined,
      url: `${siteConfig.url}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: post } = await supabase
    .from("seo_blog_posts")
    .select(`
      id, slug, title, meta_title, meta_description, excerpt, category,
      content_body, content_outline, word_count, published_at, ai_generated,
      primary_keyword:seo_keywords!seo_blog_posts_primary_keyword_id_fkey(keyword)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const content = post.content_body || post.content_outline || "";
  const readMinutes = post.word_count ? Math.ceil(post.word_count / 200) : null;
  const isOutline = !post.content_body && !!post.content_outline;

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: post.title, href: `/blog/${slug}` },
      ]} />
      {post.published_at && (
        <ArticleSchema
          title={post.title}
          description={post.meta_description || post.excerpt || ""}
          url={`/blog/${slug}`}
          image={`${siteConfig.url}/og-image.png`}
          datePublished={post.published_at}
          author="Dr. Alex Chireau, DDS"
        />
      )}

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-14 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          {post.category && (
            <div className="flex items-center gap-1.5 mb-4">
              <Tag className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">{post.category}</span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-slate-300 text-lg leading-relaxed">{post.excerpt}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-white">Dr. Alex Chireau, DDS</span> — AK Ultimate Dental
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {readMinutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readMinutes} min read
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          {isOutline && (
            <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              This article is an outline — full content coming soon.
            </div>
          )}
          <div className="prose prose-slate prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900
            prose-ul:space-y-1 prose-ol:space-y-1
            prose-li:text-slate-700
            prose-blockquote:border-cyan-500 prose-blockquote:text-slate-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Take the Next Step?</h2>
          <p className="text-cyan-100 mb-7 text-lg">
            Schedule a consultation at our Las Vegas office. Same-week appointments available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/get-started"
              className="inline-flex items-center justify-center gap-2 bg-white text-cyan-700 font-semibold px-8 py-3 rounded-full hover:bg-cyan-50 transition-colors">
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/blog"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
              More Articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
