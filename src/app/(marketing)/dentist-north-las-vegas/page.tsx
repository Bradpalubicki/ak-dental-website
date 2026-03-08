import { Metadata } from "next";
import Link from "next/link";
import { Phone, Star, MapPin, Clock, CheckCircle, ArrowRight, Shield, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig, testimonials } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dentist Near North Las Vegas NV | AK Ultimate Dental",
  description:
    "Serving North Las Vegas, NV with comprehensive dental care. Same-day emergencies, most insurance accepted & flexible financing. Call (702) 935-4395.",
  keywords: [
    "dentist North Las Vegas",
    "North Las Vegas dentist",
    "emergency dentist North Las Vegas",
    "dental care North Las Vegas NV",
    "same day dentist North Las Vegas",
    "affordable dentist North Las Vegas",
  ],
  alternates: { canonical: `${siteConfig.url}/dentist-north-las-vegas` },
};

const localFaqs = [
  {
    question: "How far is AK Ultimate Dental from North Las Vegas?",
    answer:
      "AK Ultimate Dental is located at 7480 West Sahara Avenue, Las Vegas, NV 89117 — approximately 15–20 minutes from North Las Vegas via US-95 South to Sahara Avenue. Free parking is available at our office.",
  },
  {
    question: "Do you offer emergency dental care for North Las Vegas patients?",
    answer:
      "Yes. We prioritize same-day appointments for dental emergencies including severe toothaches, broken teeth, lost crowns, and dental trauma. Call us first thing in the morning at (702) 935-4395 and we will do our best to see you the same day.",
  },
  {
    question: "Are you accepting new North Las Vegas patients?",
    answer:
      "Absolutely. We welcome patients from North Las Vegas, Aliante, Centennial Hills, and all surrounding neighborhoods. Book online or call (702) 935-4395 to get started.",
  },
  {
    question: "Do you accept Medicaid or low-income dental programs?",
    answer:
      "We are a private dental practice and do not accept Medicaid (Nevada Medicaid / Nevada Check Up). However, we offer flexible financing through Cherry, CareCredit, and Sunbit — with over 80% approval rates and 0% interest options — to make quality dental care accessible regardless of insurance status.",
  },
  {
    question: "What should I do if I have a dental emergency near North Las Vegas?",
    answer:
      "Call AK Ultimate Dental immediately at (702) 935-4395. For severe emergencies (uncontrolled bleeding, jaw trauma), go to the nearest emergency room. For all other urgent dental issues — toothaches, broken teeth, swelling, lost fillings — we can typically see you same day. Don&apos;t wait and let it get worse.",
  },
];

export default function DentistNorthLasVegasPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Dentist Near North Las Vegas", href: "/dentist-north-las-vegas" },
        ]}
      />
      <FAQSchema faqs={localFaqs} />

      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">Serving North Las Vegas, NV</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Dentist Near North Las Vegas</h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Accessible, comprehensive dental care for North Las Vegas residents.
              Same-day emergency appointments. Most insurance accepted. 15–20 minutes via US-95.
            </p>

            {/* Emergency CTA — prominent for North LV */}
            <div className="bg-red-600/20 border border-red-400/40 rounded-2xl p-4 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 justify-center">
                <AlertCircle className="h-6 w-6 text-red-300 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-white">Dental Emergency?</p>
                  <p className="text-red-200 text-sm">Call now — we offer same-day emergency appointments.</p>
                </div>
                <a href={siteConfig.phoneHref} className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                  Call Now
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <Link href="/appointment">Book Appointment <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                <a href={siteConfig.phoneHref}><Phone className="mr-2 h-5 w-5" />{siteConfig.phone}</a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
              {[
                { icon: Zap, text: "Same-Day Emergency Care" },
                { icon: Shield, text: "Most Insurance Accepted" },
                { icon: CheckCircle, text: "Accepting New Patients" },
                { icon: Star, text: `${siteConfig.ratings.count} Five-Star Reviews` },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white">
                  <b.icon className="h-4 w-4 text-cyan-400" /><span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: MapPin, title: "Address", detail: "7480 W Sahara Ave, Las Vegas, NV 89117" },
              { icon: Clock, title: "Hours", detail: "Mon–Thu: 8:00 AM – 5:00 PM" },
              { icon: Phone, title: "Phone", detail: siteConfig.phone },
            ].map((i) => (
              <div key={i.title} className="flex flex-col items-center gap-2">
                <div className="bg-cyan-100 rounded-full p-3"><i.icon className="h-6 w-6 text-cyan-600" /></div>
                <p className="font-semibold text-gray-900">{i.title}</p>
                <p className="text-gray-500 text-sm">{i.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900">Accessible Dental Care for North Las Vegas</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Emergency Dental Care", detail: "Same-day appointments for toothaches, broken teeth, swelling, and dental trauma. Call first thing in the morning." },
                { title: "Preventive Care", detail: "Cleanings, exams, X-rays. Preventive care is the most affordable dentistry — and we make it easy to get in." },
                { title: "Tooth Extractions", detail: "Simple and surgical extractions, including wisdom teeth, performed under comfortable local anesthesia with sedation options." },
                { title: "Fillings & Restorations", detail: "Tooth-colored fillings that look natural and restore your tooth to full function." },
                { title: "Flexible Financing", detail: "Cherry, CareCredit, and Sunbit — 80%+ approval, no hard credit pull. Monthly payment options for all budgets." },
                { title: "Most Insurance Accepted", detail: "Delta Dental, Cigna, Aetna, MetLife, Guardian, and most PPO plans. We verify benefits before your appointment." },
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

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900">What Patients Say</h2></div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.slice(1, 4).map((t, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-gray-700 mb-4">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">Verified Patient</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">North Las Vegas FAQs</h2>
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

      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">North Las Vegas Patients Welcome</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Same-day emergency care available. Accepting new patients. Call or book online.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 bg-white text-cyan-700 hover:bg-gray-100">
              <a href={siteConfig.phoneHref}><Phone className="mr-2 h-5 w-5" />Call {siteConfig.phone}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 border-2 border-white text-white hover:bg-white/10">
              <Link href="/appointment">Book Online <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
