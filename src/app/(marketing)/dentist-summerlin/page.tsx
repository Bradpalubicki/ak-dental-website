import { Metadata } from "next";
import Link from "next/link";
import { Phone, Star, MapPin, Clock, CheckCircle, ArrowRight, Shield, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig, testimonials } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dentist Near Summerlin, Las Vegas NV | AK Ultimate Dental",
  description:
    "Top-rated dentist serving Summerlin, NV. AK Ultimate Dental is just minutes from Summerlin on West Sahara Ave. Cosmetic dentistry, implants, veneers & more. Call (702) 935-4395.",
  keywords: [
    "dentist Summerlin",
    "Summerlin dentist",
    "dentist near Summerlin Las Vegas",
    "cosmetic dentist Summerlin NV",
    "dental implants Summerlin",
    "veneers Summerlin Las Vegas",
    "best dentist Summerlin Nevada",
  ],
  alternates: { canonical: `${siteConfig.url}/dentist-summerlin` },
  openGraph: {
    title: "Dentist Near Summerlin Las Vegas | AK Ultimate Dental",
    description: "Serving Summerlin patients with top-rated cosmetic dentistry, implants, and general dental care. Minutes from Summerlin on West Sahara Ave.",
  },
};

const localFaqs = [
  {
    question: "How far is AK Ultimate Dental from Summerlin?",
    answer:
      "AK Ultimate Dental is located at 7480 West Sahara Avenue, Las Vegas, NV 89117 — approximately 5–10 minutes from most Summerlin neighborhoods. From the 215 Beltway, take the Sahara exit heading east. From Downtown Summerlin, head south on Town Center Drive and east on Sahara. Free parking is available on-site.",
  },
  {
    question: "Do you offer cosmetic dentistry for Summerlin patients?",
    answer:
      "Yes! We are Summerlin&apos;s go-to practice for cosmetic dentistry. Dr. Alex Chireau, DDS specializes in porcelain veneers, teeth whitening, dental bonding, and complete smile makeovers. Many of our Summerlin patients come specifically for cosmetic consultations.",
  },
  {
    question: "Are you accepting new Summerlin patients?",
    answer:
      "Absolutely. We welcome new patients from Summerlin, The Lakes, Desert Shores, Peccole Ranch, and all surrounding areas. Call (702) 935-4395 or book online for your complimentary new patient consultation.",
  },
  {
    question: "What dental financing options are available for Summerlin patients?",
    answer:
      "We offer Cherry, CareCredit, and Sunbit financing with fast approvals and 0% interest options — making high-quality cosmetic and restorative dentistry accessible for all budgets. Many Summerlin patients use Cherry for implants and veneers.",
  },
  {
    question: "What insurance plans do you accept?",
    answer:
      "We accept most major dental insurance plans including Delta Dental, Cigna, Aetna, MetLife, and Guardian. We verify your benefits before your appointment so you know exactly what to expect. Call (702) 935-4395 to confirm your plan.",
  },
];

export default function DentistSummerlinPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Dentist Near Summerlin", href: "/dentist-summerlin" },
        ]}
      />
      <FAQSchema faqs={localFaqs} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Serving Summerlin, NV
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Dentist Near Summerlin, Las Vegas
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Summerlin&apos;s preferred destination for cosmetic dentistry, dental implants,
              and comprehensive dental care. AK Ultimate Dental is minutes from Summerlin
              on West Sahara Avenue — with {siteConfig.ratings.count} five-star reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <Link href="/appointment">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                <a href={siteConfig.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  {siteConfig.phone}
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
              {[
                { icon: Star, text: `${siteConfig.ratings.count} Five-Star Reviews` },
                { icon: Shield, text: "Most Insurance Accepted" },
                { icon: Zap, text: "Same-Day Appointments" },
                { icon: Award, text: "Accepting New Patients" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white">
                  <b.icon className="h-4 w-4 text-cyan-400" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: MapPin, title: "Our Address", detail: "7480 W Sahara Ave, Las Vegas, NV 89117" },
              { icon: Clock, title: "Hours", detail: "Mon–Thu: 8:00 AM – 5:00 PM" },
              { icon: Phone, title: "Phone", detail: siteConfig.phone },
            ].map((i) => (
              <div key={i.title} className="flex flex-col items-center gap-2">
                <div className="bg-cyan-100 rounded-full p-3">
                  <i.icon className="h-6 w-6 text-cyan-600" />
                </div>
                <p className="font-semibold text-gray-900">{i.title}</p>
                <p className="text-gray-500 text-sm">{i.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Summerlin Patients Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Why Summerlin Chooses AK Ultimate Dental
              </span>
              <h2 className="text-4xl font-bold text-gray-900">
                Summerlin&apos;s Preferred Dental Practice
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Cosmetic Dentistry Specialists", detail: "Veneers, whitening, bonding, smile makeovers — the cosmetic procedures Summerlin patients most frequently request, done by a specialist." },
                { title: "Luxury-Level Experience", detail: "Modern, beautifully designed office. No long waits. Thorough explanations. The level of care Summerlin residents expect." },
                { title: "Same-Day CEREC Crowns", detail: "No temporary crowns. No second visit. CEREC technology mills your permanent crown in-office in a single appointment." },
                { title: "5 Minutes from Summerlin", detail: "Conveniently located on West Sahara Avenue — an easy drive from any Summerlin neighborhood, with free on-site parking." },
                { title: "Flexible Financing", detail: "Cherry, CareCredit, and Sunbit available. 0% interest options. 80%+ approval. Cost never has to be a barrier to your best smile." },
                { title: "All Insurance Accepted", detail: "Delta Dental, Cigna, Aetna, MetLife, Guardian, and most PPO plans. We verify your benefits before you arrive." },
              ].map((item) => (
                <Card key={item.title} className="border-0 shadow-sm">
                  <CardContent className="p-5 flex gap-4 items-start">
                    <CheckCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{item.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              What Summerlin Patients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.slice(0, 3).map((t, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 mb-4">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">Verified Patient</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
              Summerlin Patient FAQs
            </h2>
            <div className="space-y-4">
              {localFaqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Summerlin&apos;s #1 Rated Dental Practice
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {siteConfig.ratings.count} five-star reviews. Accepting new Summerlin patients now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 bg-white text-cyan-700 hover:bg-gray-100">
              <Link href="/appointment">Book Free Consultation <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 border-2 border-white text-white hover:bg-white/10">
              <a href={siteConfig.phoneHref}><Phone className="mr-2 h-5 w-5" />{siteConfig.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
