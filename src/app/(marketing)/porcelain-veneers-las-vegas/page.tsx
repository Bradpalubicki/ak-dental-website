import { Metadata } from "next";
import Link from "next/link";
import { Phone, CheckCircle, ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { ProviderByline } from "@/components/marketing/provider-byline";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Porcelain Veneers Las Vegas NV | AK Ultimate Dental",
  description:
    "Transform your smile with porcelain veneers in Las Vegas, NV — ultra-thin & natural-looking in just 2 visits. Cherry financing available. Call (702) 935-4395.",
  keywords: [
    "porcelain veneers Las Vegas",
    "dental veneers Las Vegas",
    "cosmetic veneers Las Vegas NV",
    "veneers cost Las Vegas",
    "smile makeover Las Vegas",
    "teeth veneers Las Vegas",
    "veneer dentist Las Vegas",
  ],
  alternates: { canonical: `${siteConfig.url}/porcelain-veneers-las-vegas` },
  openGraph: {
    title: "Porcelain Veneers Las Vegas | AK Ultimate Dental",
    description: "Get your dream smile with porcelain veneers in Las Vegas. Natural-looking results in 2 visits. Cherry financing available.",
    images: [{ url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    question: "How much do porcelain veneers cost in Las Vegas?",
    answer: "Porcelain veneers in Las Vegas typically range from $1,200 to $2,500 per tooth. A full smile transformation (6–10 veneers) can range from $7,200 to $25,000. The cost depends on the number of veneers, complexity, and porcelain quality. We offer Cherry financing with 0% interest options — making a complete smile makeover as low as $300–$500/month.",
  },
  {
    question: "How long do porcelain veneers last?",
    answer: "High-quality porcelain veneers last 10–20 years with proper care. They're resistant to staining, chipping, and daily wear. To maximize longevity: avoid biting hard objects (ice, pens), wear a nightguard if you grind your teeth, and maintain regular checkups. Dr. Chireau uses premium porcelain that mimics the light-reflective properties of natural enamel.",
  },
  {
    question: "Is getting veneers painful?",
    answer: "The veneer process is minimally invasive and comfortable. A thin layer of enamel (0.5mm — about the thickness of a contact lens) is removed to accommodate the veneer. The procedure is done under local anesthesia. Most patients experience mild sensitivity for a few days after placement, which resolves quickly.",
  },
  {
    question: "Can veneers fix crooked teeth without braces?",
    answer: "Yes — veneers can correct mild-to-moderate crowding, gaps, and misalignment without orthodontics. For more significant alignment issues, we may recommend Invisalign first. During your consultation, Dr. Chireau will show you a digital preview of your projected results so you can see exactly how your smile will look before committing.",
  },
  {
    question: "Do veneers look natural?",
    answer: "Modern porcelain veneers are virtually indistinguishable from natural teeth. They're custom-crafted to match the shape, size, and translucency of your surrounding teeth. Unlike older composite veneers, porcelain reflects light the same way natural enamel does. Dr. Chireau has dual European and American cosmetic training — achieving results that look elegant, not \"done.\"",
  },
  {
    question: "Does dental insurance cover veneers?",
    answer: "Veneers are generally considered cosmetic and aren't covered by most dental insurance plans. However, if veneers are used to restore a cracked or broken tooth, partial coverage may apply. We'll verify your benefits before your appointment. For cosmetic cases, Cherry financing makes veneers accessible on any budget.",
  },
];

const candidateReasons = [
  "Chipped, cracked, or broken teeth",
  "Stained teeth that don't respond to whitening",
  "Gaps between front teeth",
  "Mildly crooked or misaligned teeth",
  "Worn or short teeth from grinding",
  "Uneven or irregular tooth shapes",
];

export default function PorcelainVeneersLasVegasPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Porcelain Veneers Las Vegas", href: "/porcelain-veneers-las-vegas" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(168,85,247,0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                128 Five-Star Reviews
              </span>
              <span className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/40 text-purple-200 rounded-full px-4 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Transform in 2 Visits
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Porcelain Veneers in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Las Vegas, NV
              </span>
            </h1>
            <ProviderByline variant="compact" className="mb-5" />
            <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Ultra-thin porcelain veneers custom-crafted to give you a flawless, natural-looking
              smile. Dr. Alex Chireau combines precision artistry with advanced cosmetic training
              to deliver results that look beautiful — not artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 text-lg">
                <Link href="/appointment">
                  Book Free Smile Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg">
                <a href={siteConfig.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  {siteConfig.phone}
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              {["Free smile consultation", "Digital smile preview", "Cherry financing available"].map((item) => (
                <span key={item} className="text-sm text-gray-300 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-purple-300 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who Is a Candidate */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Are You a Candidate?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Veneers Can Fix All of These
              </h2>
              <div className="space-y-3">
                {candidateReasons.map((reason) => (
                  <div key={reason} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 mt-6 text-sm">
                Not sure if veneers are right for you? Book a free consultation — Dr. Chireau will
                show you a digital preview of your projected results before any commitment.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              <h3 className="font-bold text-gray-900 text-xl mb-6">The Veneer Process — 2 Visits</h3>
              <div className="space-y-6">
                {[
                  { visit: "Visit 1", title: "Consultation + Preparation", desc: "Digital smile design, minimal enamel prep, temporary veneers placed." },
                  { visit: "Visit 2", title: "Final Placement", desc: "Custom porcelain veneers bonded permanently. Walk out with your new smile." },
                ].map((v) => (
                  <div key={v.visit} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{v.visit}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{v.title}</div>
                      <div className="text-gray-600 text-sm mt-1">{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financing */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50 border-y border-purple-100">
        <div className="container mx-auto px-4 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Your Dream Smile on Any Budget
          </h2>
          <p className="text-gray-600 mb-6">
            Cherry financing — 0% interest options, 80%+ approval rate, 60-second decision.
            A 6-veneer smile makeover can start at under $400/month.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 h-12 px-8">
            <a href="https://withcherry.com" target="_blank" rel="noopener noreferrer">
              Check My Financing Options
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <p className="text-gray-500 text-sm mt-3">No hard credit pull · Results in 60 seconds</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Veneer FAQs</h2>
              <p className="text-gray-600 mt-3">Las Vegas patients ask us these every day</p>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border border-gray-200 px-6">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to See Your New Smile?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Book a free smile consultation. Dr. Chireau will show you a digital preview
            of your projected results — no commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 text-lg">
              <Link href="/appointment">
                Book Free Smile Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 border-white/40 text-white hover:bg-white/10 text-lg">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                {siteConfig.phone}
              </a>
            </Button>
          </div>
          <p className="text-gray-400 text-sm">
            Also see: <Link href="/services/porcelain-veneers" className="text-purple-400 hover:underline">Veneers service page</Link> ·{" "}
            <Link href="/smile-gallery" className="text-purple-400 hover:underline">Smile Gallery</Link>
          </p>
        </div>
      </section>
    </>
  );
}
