import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, ArrowRight, ArrowLeft, Clock, CalendarDays, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  BreadcrumbSchema,
  FAQSchema,
  ArticleSchema,
} from '@/components/schema/local-business';
import { siteConfig } from '@/lib/config';
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  type ContentBlock,
} from '@/lib/blog';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.heroImage,
          width: 1200,
          height: 630,
          alt: post.heroAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.heroImage],
    },
  };
}

function renderBlock(block: ContentBlock, index: number) {
  const key = index;

  if (block.type === 'h2') {
    return (
      <h2
        key={key}
        id={`section-${index}`}
        className="text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24"
      >
        {block.content as string}
      </h2>
    );
  }

  if (block.type === 'h3') {
    return (
      <h3
        key={key}
        className="text-xl font-bold text-slate-800 mt-8 mb-3"
      >
        {block.content as string}
      </h3>
    );
  }

  if (block.type === 'p') {
    return (
      <p key={key} className="text-slate-600 leading-relaxed mb-5 text-lg">
        {block.content as string}
      </p>
    );
  }

  if (block.type === 'ul') {
    return (
      <ul key={key} className="list-disc list-outside pl-6 mb-5 space-y-2">
        {(block.content as string[]).map((item, i) => (
          <li key={i} className="text-slate-600 leading-relaxed text-lg">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'ol') {
    return (
      <ol key={key} className="list-decimal list-outside pl-6 mb-5 space-y-2">
        {(block.content as string[]).map((item, i) => (
          <li key={i} className="text-slate-600 leading-relaxed text-lg">
            {item}
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === 'cta') {
    return (
      <div
        key={key}
        className="my-10 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-white text-center"
      >
        <p className="text-lg font-medium leading-relaxed mb-6">
          {block.content as string}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-cyan-700 hover:bg-cyan-50 font-semibold"
          >
            <Link href="/appointment">
              Book Appointment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10"
          >
            <a href={siteConfig.phoneHref}>
              <Phone className="mr-2 h-4 w-4" />
              {siteConfig.phone}
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  // Extract H2 headings for table of contents
  const tocItems = post.content
    .map((block, index) =>
      block.type === 'h2'
        ? { id: `section-${index}`, label: block.content as string }
        : null
    )
    .filter(Boolean) as { id: string; label: string }[];

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Schema */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <FAQSchema faqs={post.faqs} />
      <ArticleSchema
        title={post.metaTitle}
        description={post.metaDescription}
        url={`/blog/${post.slug}`}
        image={post.heroImage}
        datePublished={post.publishedAt}
        author={post.author}
      />

      {/* Hero Image */}
      <div className="relative w-full" style={{ height: '70vh', minHeight: '400px', maxHeight: '630px' }}>
        <Image
          src={post.heroImage}
          alt={post.heroAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-cyan-500 text-white border-0 font-semibold">
                <Tag className="h-3 w-3 mr-1" />
                {post.category}
              </Badge>
              <span className="text-white/70 text-sm flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_280px] gap-12">

            {/* Main Content */}
            <article>
              {/* Byline */}
              <div className="flex items-center gap-4 pb-8 mb-8 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  AK
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{post.author}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {formattedDate}
                    </span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Article Excerpt */}
              <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-cyan-500 pl-5">
                {post.excerpt}
              </p>

              {/* Content Blocks */}
              <div className="prose-custom">
                {post.content.map((block, i) => renderBlock(block, i))}
              </div>

              {/* FAQ Section */}
              {post.faqs.length > 0 && (
                <div className="mt-14 pt-10 border-t border-slate-100">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {post.faqs.map((faq, i) => (
                      <div key={i} className="bg-slate-50 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 mb-2 text-lg">
                          {faq.question}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Table of Contents */}
              {tocItems.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6 sticky top-24">
                  <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">
                    In This Article
                  </h3>
                  <nav>
                    <ul className="space-y-2">
                      {tocItems.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="text-sm text-slate-600 hover:text-cyan-600 transition-colors leading-snug block py-0.5"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}

              {/* Sidebar CTA */}
              <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-2xl p-6 text-white text-center">
                <h3 className="font-bold text-lg mb-2">
                  Questions? We Can Help.
                </h3>
                <p className="text-cyan-100 text-sm mb-5 leading-relaxed">
                  Our Las Vegas team at 7480 West Sahara Avenue is ready to
                  answer your questions.
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-cyan-700 hover:bg-cyan-50 font-semibold mb-3"
                >
                  <Link href="/appointment">Book Appointment</Link>
                </Button>
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center justify-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.phone}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Schedule?
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
            Call AK Ultimate Dental at{' '}
            <a
              href={siteConfig.phoneHref}
              className="text-cyan-600 font-semibold hover:underline"
            >
              (702) 935-4395
            </a>{' '}
            or book online. We are conveniently located at 7480 West Sahara
            Avenue, Las Vegas, NV.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 bg-cyan-600 text-white hover:bg-cyan-500 font-semibold"
            >
              <Link href="/appointment">
                Book Your Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 border-slate-300 text-slate-700 hover:border-cyan-500 hover:text-cyan-600"
            >
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((relPost) => (
                  <Card
                    key={relPost.slug}
                    className="border-0 shadow-md hover:shadow-lg transition-shadow group overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={relPost.heroImage}
                          alt={relPost.heroAlt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-cyan-50 text-cyan-700 border-0 text-xs">
                            {relPost.category}
                          </Badge>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relPost.readTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-3 group-hover:text-cyan-600 transition-colors">
                          {relPost.title}
                        </h3>
                        <Link
                          href={`/blog/${relPost.slug}`}
                          className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1"
                        >
                          Read Article
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-10">
                <Button asChild variant="outline" className="border-slate-300">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Articles
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
