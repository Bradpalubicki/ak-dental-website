import { Metadata } from "next";
import Link from "next/link";
import { Phone, Star, MapPin, Clock, CheckCircle, ArrowRight, Shield, Award, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig, testimonials } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dentist Near Spring Valley NV | AK Ultimate Dental",
  description:
    "Affordable dental care for Spring Valley, NV — minutes away on W Sahara Ave, Las Vegas. Most insurance accepted, flexible financing. Call (702) 935-4395.",
  keywords: [
    "dentist Spring Valley NV",
    "Spring Valley dentist",
    "dentist near Spring Valley Las Vegas",
    "affordable dentist Spring Valley",
    "dental office Spring Valley Nevada",
    "Spring Valley dental care",
  ],
  alternates: { canonical: `${siteConfig.url}/dentist-spring-valley` },
};

const localFaqs = [
  {
    question: "How close is AK Ultimate Dental to Spring Valley?",
    answer:
      "Very close! AK Ultimate Dental is located at 7480 West Sahara Avenue, Las Vegas, NV 89117 — just a few minutes from Spring Valley neighborhoods. From Spring Valley, head north on Jones Blvd or Decatur to Sahara Avenue and turn east. You&apos;ll find us on the right with free parking.",
  },
  {
    question: "Do you accept insurance for Spring Valley patients?",
    answer:
      "Yes. We accept Delta Dental, Cigna, Aetna, MetLife, Guardian, and most PPO plans. We also offer flexible financing through Cherry, CareCredit, and Sunbit for patients without insurance — with fast approvals and 0% interest options.",
  },
  {
    question: "Are you accepting new Spring Valley patients?",
    answer:
      "Yes! We&apos;re always welcoming new patients from Spring Valley and surrounding areas. Call (702) 935-4395 or book online for your first visit.",
  },
  {
    question: "Do you offer affordable dental care for Spring Valley families?",
    answer:
      "Absolutely. We offer competitive pricing, transparent estimates before treatment, and three financing partners (Cherry, CareCredit, Sunbit) to make dental care affordable. Many Spring Valley patients take advantage of our interest-free financing options.",
  },
  {
    question: "What preventive dental services do you offer?",
    answer:
      "We offer comprehensive preventive care: dental cleanings, full-mouth exams, digital X-rays (90% less radiation than traditional), oral cancer screenings, fluoride treatments, and dental sealants. We believe in catching problems early to save you money and discomfort long-term.",
  },
];

export default function DentistSpringValleyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Dentist Near Spring Valley", href: "/dentist-spring-valley" },
        ]}
      />
      <FAQSchema faqs={localFaqs} />

      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">Serving Spring Valley, NV</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Dentist Near Spring Valley, Las Vegas</h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Comprehensive, affordable dental care for Spring Valley residents.
              Minutes away on West Sahara Avenue. Most insurance accepted.
              Flexible financing. {siteConfig.ratings.count} five-star reviews.
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
                { icon: Shield, text: "Most Insurance Accepted" },
                { icon: DollarSign, text: "0% Financing Available" },
                { icon: Award, text: `${siteConfig.ratings.count} Five-Star Reviews` },
                { icon: CheckCircle, text: "Accepting New Patients" },
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
              <h2 className="text-4xl font-bold text-gray-900">Services for Spring Valley Patients</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Preventive Cleanings", detail: "Comprehensive exams and cleanings. Digital X-rays with 90% less radiation. Oral cancer screenings." },
                { title: "Tooth-Colored Fillings", detail: "Natural-looking composite fillings that blend seamlessly with your tooth." },
                { title: "Dental Crowns", detail: "CEREC same-day crowns — no temporaries, no second visit, done in a single appointment." },
                { title: "Tooth Extractions", detail: "Simple and surgical extractions performed comfortably with sedation options." },
                { title: "Flexible Payment Plans", detail: "Cherry, CareCredit, and Sunbit financing — fast approval, 0% interest options available." },
                { title: "Urgent Dental Care", detail: "Same-day appointments for toothaches and dental emergencies. Call first thing in the morning." },
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
            <h2 className="text-4xl font-bold text-gray-900">What Our Patients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.slice(4, 7).map((t, i) => (
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
            <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Spring Valley FAQs</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Spring Valley&apos;s Trusted Dental Practice</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Accepting new patients. Most insurance accepted. Flexible financing available.</p>
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
