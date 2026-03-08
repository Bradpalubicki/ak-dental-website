import { Metadata } from "next";
import Link from "next/link";
import { Phone, CheckCircle, ArrowRight, Star, Smile, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { ProviderByline } from "@/components/marketing/provider-byline";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Cosmetic Dentistry Las Vegas NV | AK Ultimate Dental",
  description:
    "Las Vegas, NV cosmetic dentist — veneers, whitening, Invisalign & smile makeovers. Dual-trained Dr. Alex Chireau, DDS. Free consultations. (702) 935-4395.",
  keywords: [
    "cosmetic dentistry Las Vegas",
    "cosmetic dentist Las Vegas",
    "smile makeover Las Vegas",
    "teeth whitening Las Vegas",
    "cosmetic dental Las Vegas NV",
    "smile transformation Las Vegas",
    "cosmetic dental work Las Vegas",
    "aesthetic dentistry Las Vegas",
  ],
  alternates: { canonical: `${siteConfig.url}/cosmetic-dentistry-las-vegas` },
  openGraph: {
    title: "Cosmetic Dentistry Las Vegas | AK Ultimate Dental",
    description: "Transform your smile with Las Vegas's top cosmetic dentist. Veneers, whitening, Invisalign & smile makeovers. Free consultation. (702) 935-4395.",
    images: [{ url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630 }],
  },
};

const cosmeticServices = [
  {
    title: "Porcelain Veneers",
    href: "/services/porcelain-veneers",
    locationHref: "/porcelain-veneers-las-vegas",
    desc: "Ultra-thin shells bonded to the front of teeth — fix chips, gaps, stains, and shape in 2 visits.",
    detail: "Starting ~$1,200/tooth",
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Teeth Whitening",
    href: "/services/teeth-whitening",
    locationHref: null,
    desc: "Professional in-office whitening delivers 6–10 shades brighter in a single 90-minute session.",
    detail: "Same-day results",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Smile Makeovers",
    href: "/services/cosmetic-dentistry",
    locationHref: "/smile-gallery",
    desc: "Comprehensive treatment plans combining veneers, whitening, bonding, and reshaping for a total transformation.",
    detail: "Custom plan per patient",
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Invisalign Clear Aligners",
    href: "/services/orthodontics",
    locationHref: null,
    desc: "Straighten teeth discreetly with removable clear aligners. Average treatment 6–18 months.",
    detail: "No metal braces",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Dental Bonding",
    href: "/services/cosmetic-dentistry",
    locationHref: null,
    desc: "Tooth-colored composite resin applied to fix chips, cracks, or gaps in a single visit.",
    detail: "Single-visit fix",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Gum Contouring",
    href: "/services/cosmetic-dentistry",
    locationHref: null,
    desc: "Laser reshaping of the gum line to correct a \"gummy smile\" or uneven appearance.",
    detail: "Laser precision",
    color: "from-rose-500 to-red-600",
  },
];

const faqs = [
  {
    question: "What cosmetic dental procedures are most popular in Las Vegas?",
    answer: "Porcelain veneers, professional teeth whitening, and smile makeovers are consistently the most requested cosmetic procedures at our Las Vegas practice. Invisalign is also very popular for patients wanting straighter teeth without braces. During your free consultation, Dr. Chireau will recommend the best options based on your specific goals.",
  },
  {
    question: "How do I know which cosmetic procedure is right for me?",
    answer: "Every patient is different — that's why we start with a free consultation rather than a one-size-fits-all recommendation. Dr. Chireau will evaluate your teeth, listen to what bothers you about your smile, and show you a digital preview of projected results for each option. You'll leave knowing exactly what's possible and what it will cost.",
  },
  {
    question: "Is cosmetic dentistry covered by insurance in Las Vegas?",
    answer: "Most purely cosmetic procedures (whitening, veneers for aesthetics, bonding) aren't covered by dental insurance. However, some restorative cosmetic work (crowns, implants for missing teeth) may have partial coverage. We verify your benefits before your appointment and offer Cherry financing with 0% interest options for uncovered cosmetic work.",
  },
  {
    question: "How long does a smile makeover take?",
    answer: "Timelines vary by treatment: teeth whitening takes one 90-minute visit; bonding is single-visit; veneers take 2 visits over 2–3 weeks; Invisalign takes 6–18 months; dental implants take 3–6 months. For comprehensive smile makeovers combining multiple treatments, Dr. Chireau will sequence your plan to achieve results efficiently, often completing major changes in 4–8 weeks.",
  },
  {
    question: "Does cosmetic dental work look natural?",
    answer: "Yes — and this is where Dr. Chireau's dual European and American cosmetic training makes a difference. He focuses on results that look elegant and natural, not \"overdone.\" Modern porcelain mimics the light-reflective properties of natural enamel. Most patients report that friends and family notice they look great but can't pinpoint exactly why.",
  },
];

export default function CosmeticDentistryLasVegasPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Cosmetic Dentistry Las Vegas", href: "/cosmetic-dentistry-las-vegas" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                128 Five-Star Reviews
              </span>
              <span className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 rounded-full px-4 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Dual European & American Training
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Cosmetic Dentistry in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Las Vegas, NV
              </span>
            </h1>
            <ProviderByline variant="compact" className="mb-5" />
            <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              From a single chip to a complete smile transformation — Dr. Alex Chireau
              delivers cosmetic results that look natural, not artificial. Advanced cosmetic
              training + Las Vegas&apos;s most welcoming dental team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 border-0 text-lg">
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
              {["Free consultation", "Digital smile preview", "Cherry financing", "All insurance accepted"].map((item) => (
                <span key={item} className="text-sm text-gray-300 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Hub */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Cosmetic Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Every Smile Goal, One Practice
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you want a subtle refresh or a complete transformation, Dr. Chireau
              has the training and technology to deliver it.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {cosmeticServices.map((service) => (
              <Card key={service.title} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} mb-4`}>
                    <Smile className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{service.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">{service.detail}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.desc}</p>
                  <div className="flex gap-3">
                    <Link href={service.href} className="text-sm text-indigo-600 font-semibold hover:underline">
                      Learn more →
                    </Link>
                    {service.locationHref && (
                      <Link href={service.locationHref} className="text-sm text-gray-500 hover:underline">
                        Gallery →
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Dr. Chireau for Cosmetics */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-cyan-50 border-y border-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Dr. Chireau for Cosmetic Dentistry?
            </h2>
            <div className="grid sm:grid-cols-2 gap-5 text-left">
              {[
                { title: "Dual European & American Training", desc: "UNLV SDM graduate with additional Romanian dental school training — a unique combination of precision and artistry rarely found in Las Vegas." },
                { title: "Digital Smile Design", desc: "See your projected results before any treatment starts. No surprises, no buyer's remorse." },
                { title: "Natural-Looking Results", desc: "Dr. Chireau is known for results that enhance your natural appearance — not obvious cosmetic work." },
                { title: "Full Spectrum of Cosmetic Options", desc: "From $300 bonding to full smile makeovers — we match the right treatment to your goals and budget." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-white rounded-xl p-5 border border-indigo-100">
                  <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                    <div className="text-gray-600 text-sm leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="mt-8 h-14 px-8 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 border-0 text-lg">
              <Link href="/team/dr-alex-chireau">
                Meet Dr. Chireau
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Cosmetic Dentistry FAQs</h2>
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
      <section className="py-20 bg-gradient-to-r from-slate-900 to-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Best Smile Is a Free Consultation Away
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Book a free cosmetic consultation. Dr. Chireau will evaluate your smile, show you
            digital projections of your results, and build a plan that fits your timeline and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 border-0 text-lg">
              <Link href="/appointment">
                Book Free Consultation
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
            <Link href="/smile-gallery" className="text-indigo-400 hover:underline">View Smile Gallery</Link> ·{" "}
            <Link href="/porcelain-veneers-las-vegas" className="text-indigo-400 hover:underline">Porcelain Veneers</Link> ·{" "}
            <Link href="/dental-implants-las-vegas" className="text-indigo-400 hover:underline">Dental Implants</Link>
          </p>
        </div>
      </section>
    </>
  );
}
