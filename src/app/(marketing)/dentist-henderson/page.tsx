import { Metadata } from "next";
import Link from "next/link";
import { Phone, Star, MapPin, Clock, CheckCircle, ArrowRight, Shield, Award, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig, testimonials } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dentist Near Henderson, NV | Family Dental Care | AK Ultimate Dental",
  description:
    "Serving Henderson, NV families with comprehensive dental care. AK Ultimate Dental is conveniently located on West Sahara Ave, Las Vegas — 20 minutes from Henderson. Call (702) 935-4395.",
  keywords: [
    "dentist Henderson NV",
    "Henderson dentist",
    "dentist near Henderson Las Vegas",
    "family dentist Henderson Nevada",
    "dental implants Henderson",
    "Henderson dental office",
    "best dentist Henderson NV",
  ],
  alternates: { canonical: `${siteConfig.url}/dentist-henderson` },
};

const localFaqs = [
  {
    question: "How far is AK Ultimate Dental from Henderson?",
    answer:
      "AK Ultimate Dental is located at 7480 West Sahara Avenue, Las Vegas, NV 89117 — approximately 20–25 minutes from most Henderson neighborhoods via US-95 North to Sahara Ave. Free parking available on-site.",
  },
  {
    question: "Do you offer family dental care for Henderson patients?",
    answer:
      "Yes! We welcome patients of all ages. Dr. Chireau provides comprehensive family dental care including pediatric-friendly cleanings, orthodontic consultations, and adult restorative and cosmetic procedures — all under one roof.",
  },
  {
    question: "Are you accepting new Henderson patients?",
    answer:
      "Yes — always. We welcome Henderson families and offer complimentary new patient consultations. Call (702) 935-4395 or book online to get started.",
  },
  {
    question: "What insurance plans do you accept for Henderson patients?",
    answer:
      "We accept Delta Dental, Cigna, Aetna, MetLife, Guardian, and most major PPO plans. We verify your benefits before your first visit and handle all insurance filing on your behalf.",
  },
  {
    question: "Do you have Saturday appointments for Henderson families?",
    answer:
      "Our current hours are Monday–Thursday, 8:00 AM–5:00 PM. For Henderson families with weekday scheduling challenges, we recommend calling ahead — we do accommodate early morning slots. Ask about our flexible scheduling when you call.",
  },
];

export default function DentistHendersonPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Dentist Near Henderson", href: "/dentist-henderson" },
        ]}
      />
      <FAQSchema faqs={localFaqs} />

      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Serving Henderson, NV
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Dentist Near Henderson, Nevada
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Trusted family dental care for Henderson, NV residents. From routine
              cleanings to dental implants, AK Ultimate Dental has served the Las Vegas
              Valley — including Henderson families — for over 20 years.
            </p>
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
                { icon: Users, text: "Family Dentistry" },
                { icon: Shield, text: "Most Insurance Accepted" },
                { icon: Zap, text: "Same-Day Appointments" },
                { icon: Award, text: `${siteConfig.ratings.count} Five-Star Reviews` },
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
              <h2 className="text-4xl font-bold text-gray-900">Complete Family Dental Care</h2>
              <p className="text-lg text-gray-600 mt-4">Everything your Henderson family needs, under one roof.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Preventive Care", detail: "Cleanings, exams, X-rays, sealants, and fluoride treatments to keep the whole family healthy." },
                { title: "Restorative Dentistry", detail: "Fillings, crowns, bridges, and implants to restore damaged or missing teeth." },
                { title: "Orthodontic Consultations", detail: "SureSmile clear aligners and traditional orthodontic evaluations for teens and adults." },
                { title: "Emergency Dental Care", detail: "Same-day appointments for toothaches, chipped teeth, and dental emergencies." },
                { title: "Cosmetic Procedures", detail: "Teeth whitening, veneers, and bonding to help adults look and feel their best." },
                { title: "Sedation Options", detail: "Nitrous oxide and oral sedation for anxiety-free visits — perfect for nervous patients of all ages." },
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
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">What Henderson Patients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.slice(2, 5).map((t, i) => (
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

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Henderson Patient FAQs</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Henderson Families Welcome</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Accepting new patients from Henderson. Call to book or request online.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 bg-white text-cyan-700 hover:bg-gray-100">
              <Link href="/appointment">Book Appointment <ArrowRight className="ml-2 h-5 w-5" /></Link>
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
