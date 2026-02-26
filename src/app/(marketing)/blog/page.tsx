import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ArrowRight, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbSchema } from '@/components/schema/local-business';
import { siteConfig } from '@/lib/config';
import { getAllPosts } from '@/lib/blog';
import { CategoryFilter } from './CategoryFilter';

export const metadata: Metadata = {
  title: 'Dental Health Blog | AK Ultimate Dental | Las Vegas, NV',
  description:
    'Expert dental health articles from AK Ultimate Dental in Las Vegas, NV — covering implants, cosmetic dentistry, emergency care, preventive tips, and more.',
  openGraph: {
    title: 'Dental Health Blog | AK Ultimate Dental Las Vegas',
    description:
      'Expert dental health tips, oral care guides, and practice news from AK Ultimate Dental in Las Vegas, NV.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'AK Ultimate Dental health blog',
      },
    ],
  },
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const [featured, ...rest] = allPosts;
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Insights &amp; Articles
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              The AK Ultimate Dental Blog
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Helpful articles, dental health tips, and oral care insights from
              our team in Las Vegas, NV. Written to educate, inform, and help
              you maintain a healthy, beautiful smile.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-6">
              Featured Article
            </span>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64 md:h-auto min-h-[280px]">
                  <Image
                    src={featured.heroImage}
                    alt={featured.heroAlt}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-cyan-50 text-cyan-700 border-0 text-xs font-semibold">
                      <Tag className="h-3 w-3 mr-1" />
                      {featured.category}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {featured.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-cyan-600 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 group-hover:text-cyan-700 transition-colors">
                    Read Full Article
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* All Articles with Category Filter */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                All Articles
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Dental Health Guides &amp; Tips
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Browse our library of articles written by the AK Ultimate Dental
                team in Las Vegas, NV.
              </p>
            </div>

            <CategoryFilter posts={rest} categories={categories} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-r from-slate-900 to-cyan-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_60%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for a Healthier Smile?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Reading about dental care is a great start. Book an appointment
            today and take the next step toward better oral health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-16 px-10 text-lg bg-cyan-500 text-white hover:bg-cyan-400 font-semibold"
            >
              <Link href="/appointment">
                Book Your Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-16 px-10 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10"
            >
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
