import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, CheckCircle, ArrowRight, Star, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Teeth Whitening Las Vegas | Professional & Take-Home | AK Ultimate Dental",
  description:
    "Professional teeth whitening in Las Vegas, NV. In-office Zoom whitening for immediate results, or custom take-home trays. Dr. Alex Chireau, DDS. Call (702) 935-4395.",
  keywords: [
    "teeth whitening Las Vegas",
    "professional teeth whitening Las Vegas",
    "Zoom whitening Las Vegas",
    "teeth bleaching Las Vegas",
    "Las Vegas teeth whitening",
    "whitening dentist Las Vegas NV",
    "same day teeth whitening Las Vegas",
  ],
  alternates: { canonical: `${siteConfig.url}/teeth-whitening-las-vegas` },
  openGraph: {
    title: "Teeth Whitening Las Vegas | Professional Results | AK Ultimate Dental",
    description:
      "Professional teeth whitening in Las Vegas. In-office Zoom or custom take-home trays. Whiten up to 8 shades. Free consultation. (702) 935-4395.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Professional teeth whitening Las Vegas AK Ultimate Dental",
      },
    ],
  },
};

const faqs = [
  {
    question: "How white can my teeth get with professional whitening?",
    answer:
      "Professional whitening at AK Ultimate Dental can lighten teeth 4–8 shades in a single in-office session. Results vary depending on the type and severity of staining, your natural tooth color, and which whitening option you choose. During your consultation, Dr. Chireau will give you a realistic preview of expected results.",
  },
  {
    question: "How long does professional teeth whitening last?",
    answer:
      "With proper maintenance, professional whitening results typically last 1–3 years. Longevity depends on your diet, lifestyle habits (coffee, tea, red wine, tobacco), and oral hygiene routine. We provide touch-up trays so you can maintain your results at home between visits.",
  },
  {
    question: "Is professional whitening safe for my enamel?",
    answer:
      "Yes. Professional whitening products are carefully formulated and professionally administered to minimize sensitivity and protect enamel. Unlike over-the-counter strips — which use lower concentrations over longer periods — in-office whitening achieves dramatic results quickly with a professionally controlled process. Dr. Chireau evaluates your enamel health before treatment.",
  },
  {
    question: "What is the difference between in-office and take-home whitening?",
    answer:
      "In-office whitening uses a higher-concentration gel activated with a special light to deliver dramatic results in about 60–90 minutes — ideal if you have an event or want immediate results. Take-home trays use custom-fitted trays with a professional-strength gel worn 30–60 minutes per day over 2–3 weeks. Both are far more effective than over-the-counter products.",
  },
  {
    question: "Will whitening work on crowns, veneers, or bonding?",
    answer:
      "Whitening only works on natural tooth enamel — it will not change the color of crowns, veneers, bridges, or composite bonding. If you have existing restorations in visible areas, we will discuss the best approach to ensure your smile is consistent in color after whitening.",
  },
  {
    question: "How much does professional teeth whitening cost in Las Vegas?",
    answer:
      "Professional whitening at AK Ultimate Dental starts at a competitive rate compared to dental spas and whitening bars — with the added benefit of a dentist-supervised process. We offer flexible payment options including Cherry financing. Call (702) 935-4395 or schedule a consultation for current pricing.",
  },
];

export default function TeethWhiteningLasVegasPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Teeth Whitening Las Vegas", href: "/teeth-whitening-las-vegas" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Professional Teeth Whitening</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Teeth Whitening in<br />
              <span className="text-cyan-400">Las Vegas, NV</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Whiten your smile up to 8 shades in one visit. Dr. Alex Chireau, DDS offers professional
              in-office and take-home whitening — safer and more effective than anything you can buy over the counter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-xl text-base">
                <Link href="/appointment">Book Free Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-xl text-base">
                <a href={`tel:${siteConfig.phoneHref}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {siteConfig.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Two Ways to a Brighter Smile</h2>
            <p className="text-gray-600 text-lg">
              Both options use professional-strength whitening gel — far more powerful than what&apos;s available in stores.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="rounded-2xl border-2 border-cyan-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold text-lg">In-Office Whitening</span>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-cyan-700 font-semibold">
                  <Clock className="h-4 w-4" />
                  <span>60–90 minutes · Immediate results</span>
                </div>
                <p className="text-gray-600">
                  Our most popular option. A professional-strength whitening gel is applied to your teeth and activated
                  under a specialized light. Walk in with stained teeth, walk out with a dramatically brighter smile —
                  often 6–8 shades lighter in a single appointment.
                </p>
                <ul className="space-y-2">
                  {[
                    "Results visible the same day",
                    "Ideal before events, weddings, interviews",
                    "Custom shade selection",
                    "Sensitivity management protocol included",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <Star className="h-5 w-5" />
                  <span className="font-bold text-lg">Take-Home Trays</span>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Clock className="h-4 w-4" />
                  <span>2–3 weeks · 30–60 min/day</span>
                </div>
                <p className="text-gray-600">
                  Custom-fitted trays made from impressions of your teeth — not generic one-size strips. Worn with
                  professional-strength whitening gel for 30–60 minutes daily, producing gradual results over 2–3 weeks.
                  Great for maintaining results long-term.
                </p>
                <ul className="space-y-2">
                  {[
                    "Custom-fitted to your teeth for comfort",
                    "Professional-grade gel (not OTC strength)",
                    "Trays reusable for touch-ups",
                    "Great for sensitivity-prone patients",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo + Why Professional */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1609840114035-3c981b3f6ba8?w=800&h=600&fit=crop&q=80"
                alt="Professional teeth whitening treatment at AK Ultimate Dental Las Vegas"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Why Professional Whitening vs. OTC Products?
              </h2>
              <p className="text-gray-600">
                Whitening strips and toothpastes use minimal concentrations of whitening agent — typically 3–10%.
                Professional whitening at AK Ultimate Dental uses concentrations up to 40%, applied safely under Dr. Chireau&apos;s
                supervision. The difference in results is dramatic.
              </p>
              <ul className="space-y-3">
                {[
                  { label: "Faster results", detail: "Dramatic whitening in one visit vs. weeks of strips" },
                  { label: "Whiter results", detail: "Professional concentrations far exceed OTC products" },
                  { label: "Safer process", detail: "Customized to your sensitivity level, gums protected" },
                  { label: "Longer lasting", detail: "Professional results stay brighter longer" },
                ].map(({ label, detail }) => (
                  <li key={label} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-cyan-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900">{label}</span>
                      <span className="text-gray-600"> — {detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
            Teeth Whitening FAQs
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-slate-200 rounded-xl px-5">
                <AccordionTrigger className="text-left font-semibold text-gray-900 py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-cyan-600 to-blue-700">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Whiter Smile?</h2>
          <p className="text-cyan-100 text-lg mb-8 max-w-xl mx-auto">
            Schedule a free consultation at AK Ultimate Dental in Las Vegas. Dr. Chireau will evaluate your teeth and
            recommend the whitening option that fits your goals and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-cyan-700 hover:bg-cyan-50 font-semibold px-8 rounded-xl">
              <Link href="/appointment">
                Book Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 px-8 rounded-xl">
              <a href={`tel:${siteConfig.phoneHref}`}>
                <Phone className="mr-2 h-4 w-4" />
                {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
