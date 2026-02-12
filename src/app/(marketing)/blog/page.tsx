import { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  ArrowRight,
  BookOpen,
  Clock,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Blog | AK Ultimate Dental | Las Vegas, NV",
  description:
    "Dental health articles, oral care tips, and wellness insights from AK Ultimate Dental in Las Vegas, NV. Coming soon.",
};

const placeholderArticles = [
  {
    title: "5 Signs You Should Not Ignore: When to See a Dentist",
    excerpt:
      "Some dental symptoms seem minor but can indicate serious problems. Learn which warning signs mean you should schedule a visit right away.",
    category: "Oral Health",
    readTime: "5 min read",
  },
  {
    title: "CEREC Same-Day Crowns: What You Need to Know",
    excerpt:
      "Gone are the days of temporary crowns and multiple visits. Learn how CEREC technology delivers a permanent crown in a single appointment.",
    category: "Technology",
    readTime: "6 min read",
  },
  {
    title: "The Complete Guide to Dental Implants",
    excerpt:
      "Missing a tooth? Dental implants are the gold standard for replacement. Here is everything you need to know about the process, cost, and results.",
    category: "Treatments",
    readTime: "8 min read",
  },
  {
    title: "How to Overcome Dental Anxiety",
    excerpt:
      "Dental anxiety is incredibly common. Here are practical strategies to feel more comfortable and confident during your next dental visit.",
    category: "Patient Comfort",
    readTime: "5 min read",
  },
  {
    title: "Teeth Whitening: Professional vs. Over-the-Counter",
    excerpt:
      "Whitening strips or in-office treatment? We break down the differences in safety, effectiveness, and results to help you decide.",
    category: "Cosmetic",
    readTime: "6 min read",
  },
  {
    title: "Protecting Your Smile: A Guide to Preventive Dentistry",
    excerpt:
      "The best dental care is preventive care. Learn daily habits, professional treatments, and lifestyle choices that keep your teeth healthy for life.",
    category: "Prevention",
    readTime: "7 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
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
              Insights & Articles
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              The AK Ultimate Dental Blog
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Helpful articles, dental health tips, and oral care insights from
              our team. Written to educate, inform, and help you maintain a
              healthy, beautiful smile.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="py-16 md:py-20 bg-cyan-50 border-b border-cyan-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              We are working on a library of helpful articles on dental health,
              oral hygiene, cosmetic dentistry, and patient wellness. Sign up
              below to be notified when we publish our first articles.
            </p>

            {/* Newsletter Signup */}
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Get Notified
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Be the first to read our articles. We will never spam you or share
                your email.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-3"
                action="#"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 h-12 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder Articles */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Preview
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Articles We Are Working On
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Here is a preview of topics we will be covering. Check back soon for
                full articles.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {placeholderArticles.map((article) => (
                <Card
                  key={article.title}
                  className="border-0 shadow-md hover:shadow-lg transition-shadow group cursor-default"
                >
                  <CardContent className="p-0">
                    {/* Placeholder image area */}
                    <div className="h-48 bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-cyan-300" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">
                          <Tag className="h-3 w-3" />
                          {article.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-sm">{article.excerpt}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
            You do not have to wait for our blog to get started. Book an
            appointment today and take the first step toward better dental health.
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
