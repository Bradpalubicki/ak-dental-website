import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, CheckCircle, ArrowRight, Star, Shield, Award, Zap, Heart, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Why Choose AK Ultimate Dental? | Las Vegas Dentist Comparison",
  description:
    "See why Las Vegas patients choose AK Ultimate Dental over other practices. Dual-trained dentist, advanced technology, same-day care, all insurance accepted. 128 five-star reviews.",
  keywords: [
    "why choose AK Ultimate Dental",
    "best dentist Las Vegas",
    "AK Ultimate Dental vs other dentists",
    "top rated dentist Las Vegas",
    "Las Vegas dentist comparison",
    "Dr Alex Chireau Las Vegas",
  ],
  alternates: { canonical: `${siteConfig.url}/why-ak-dental` },
  openGraph: {
    title: "Why Choose AK Ultimate Dental? | Las Vegas Dentist",
    description: "128 five-star reviews, dual-trained dentist, same-day appointments. See what sets AK Ultimate Dental apart.",
    images: [{ url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630 }],
  },
};

const differentiators = [
  {
    icon: Award,
    title: "Dual-Trained Dentist — UNLV SDM + Romania",
    desc: "Dr. Alex Chireau completed dental training in both Romania and at the University of Nevada Las Vegas School of Dental Medicine — combining European precision with American clinical standards. This dual-trained perspective is rare in Las Vegas and drives outcomes our patients notice.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Same-Day CEREC Crowns",
    desc: "Most dental offices require 2–3 weeks and a temporary crown for a standard crown. We mill yours in-office while you wait — in about 90 minutes. No second appointment, no temporaries, no lab delays. This is rare technology that most Las Vegas practices still don't offer.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Shield,
    title: "All Major Insurance Accepted — Benefits Verified Free",
    desc: "Delta Dental, Cigna, Aetna, MetLife, Guardian, BlueCross, United Concordia, Humana, and most PPOs. We verify your benefits before your visit and file all claims directly — so there are no surprise bills after treatment.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: Clock,
    title: "Same-Day Emergency Appointments",
    desc: "Dental emergencies don't wait. When you call in pain, we find you a same-day slot — not a callback 3 days later. Our emergency line is answered during business hours by a real person, not a voicemail.",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Heart,
    title: "The Most Anxiety-Friendly Practice in Las Vegas",
    desc: "30% of adults avoid the dentist due to fear. We've built our entire experience around this reality: no judgment, no rushing, nitrous oxide and oral sedation available, and a team that takes time to explain every step before we do it. Penny C. wrote: \"I was terrified of dentists until I found this practice. Now I actually look forward to my visits.\"",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Users,
    title: "128 Five-Star Reviews — Not a Single 1-Star",
    desc: "Every single Google and Yelp review from our patients is 5 stars. That's not luck — it's a consistent experience. We read every review and we take feedback seriously. Our NPS (Net Promoter Score) is the reason our practice grows almost entirely by word of mouth.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Star,
    title: "Cherry Financing — 80%+ Approval, 0% Interest Options",
    desc: "We believe cost shouldn't be a barrier to the dental care you need. Cherry financing gives most applicants approval in 60 seconds with no hard credit pull. Dental implants, veneers, crowns — spread across manageable monthly payments.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Advanced Diagnostic Technology",
    desc: "3D CBCT cone beam imaging, digital intraoral cameras, AI-assisted X-ray analysis, and laser dentistry — not as marketing buzzwords, but as tools that genuinely improve diagnosis accuracy and patient comfort. We show you exactly what we see on screen before recommending any treatment.",
    color: "from-cyan-500 to-blue-600",
  },
];

const comparisonRows = [
  { feature: "Named, credentialed dentist on-site", ak: true, generic: false },
  { feature: "Same-day CEREC crowns (no lab wait)", ak: true, generic: false },
  { feature: "3D CBCT imaging for implant planning", ak: true, generic: false },
  { feature: "Cherry 0% financing available", ak: true, generic: false },
  { feature: "Benefits verified free before your visit", ak: true, generic: false },
  { feature: "Same-day emergency appointments", ak: true, generic: "Sometimes" },
  { feature: "Sedation dentistry (nitrous + oral)", ak: true, generic: "Sometimes" },
  { feature: "All major PPO insurance accepted", ak: true, generic: true },
  { feature: "128 verified five-star reviews", ak: true, generic: false },
  { feature: "Free new patient consultation", ak: true, generic: false },
];

export default function WhyAKDentalPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Why AK Dental", href: "/why-ak-dental" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(6,182,212,0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/40 text-yellow-200 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              128 Five-Star Reviews — Not a Single 1-Star
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Why Las Vegas Patients
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Choose AK Ultimate Dental
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              There are hundreds of dental offices in Las Vegas. Here&apos;s what makes the difference —
              and why our patients drive past other practices to see Dr. Chireau.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-lg">
                <Link href="/appointment">
                  Book Free Consultation
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
            <div className="flex flex-wrap justify-center gap-5">
              {["Free consultation", "No commitment", "Same-day appointments"].map((item) => (
                <span key={item} className="text-sm text-gray-300 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">What Sets Us Apart</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              8 Reasons Patients Choose Us
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {differentiators.map((d) => (
              <div key={d.title} className="flex gap-5 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${d.color} rounded-xl flex items-center justify-center`}>
                  <d.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{d.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                AK Dental vs. the Average Las Vegas Practice
              </h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-gray-900 text-white text-sm font-semibold">
                <div className="p-4">Feature</div>
                <div className="p-4 text-center text-cyan-400">AK Ultimate Dental</div>
                <div className="p-4 text-center text-gray-400">Average Practice</div>
              </div>
              {comparisonRows.map((row, i) => (
                <div key={row.feature} className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <div className="p-4 text-sm text-gray-700">{row.feature}</div>
                  <div className="p-4 text-center">
                    {row.ak === true ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-red-400 font-bold">✗</span>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    {row.generic === true ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : row.generic === false ? (
                      <span className="text-red-400 font-bold">✗</span>
                    ) : (
                      <span className="text-yellow-500 text-xs font-medium">{row.generic}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Real Patient Quotes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Patients Are Saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Penny C.", text: "I was terrified of dentists until I found this practice. They took the time to address my fears and now I actually look forward to my visits." },
              { name: "Nick P.", text: "Excellent work on my dental implant. The procedure was smooth and the results are amazing. Highly recommend!" },
              { name: "Cynthia C.", text: "The technology they use is impressive — digital x-rays, same-day crowns. It's like stepping into the future of dentistry." },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900 text-sm">— {t.name}</p>
                <p className="text-gray-500 text-xs">Verified Patient</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/reviews" className="text-cyan-600 font-semibold hover:underline">
              Read all 128 five-star reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            Join 128+ five-star patients. Book a free consultation — no commitment, no pressure,
            no surprise fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
            <Button asChild size="lg" className="h-14 px-8 bg-white text-cyan-600 hover:bg-gray-100 text-lg">
              <Link href="/appointment">
                Book Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="h-14 px-8 bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                {siteConfig.phone}
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {["Free consultation", "All insurance accepted", "128 five-star reviews"].map((item) => (
              <span key={item} className="text-sm text-white/80 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
