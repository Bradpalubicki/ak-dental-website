import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, CheckCircle, ArrowRight, Star, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { ProviderByline } from "@/components/marketing/provider-byline";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dental Implants Las Vegas NV | AK Ultimate Dental",
  description:
    "Replace missing teeth with permanent implants in Las Vegas, NV. Natural-looking results, same-day consults & Cherry financing. Call (702) 935-4395.",
  keywords: [
    "dental implants Las Vegas",
    "Las Vegas dental implants",
    "tooth implant Las Vegas",
    "missing teeth Las Vegas",
    "implant dentist Las Vegas",
    "dental implants cost Las Vegas",
    "full arch implants Las Vegas",
    "same day implants Las Vegas",
  ],
  alternates: { canonical: `${siteConfig.url}/dental-implants-las-vegas` },
  openGraph: {
    title: "Dental Implants Las Vegas | AK Ultimate Dental",
    description: "Replace missing teeth with permanent dental implants in Las Vegas. Natural-looking results, Cherry financing available. Call (702) 935-4395.",
    images: [{ url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    question: "How much do dental implants cost in Las Vegas?",
    answer: "A single dental implant in Las Vegas typically ranges from $3,500 to $6,000 including the implant post, abutment, and crown. Costs vary based on the number of implants, any bone grafting needed, and your specific case. We offer free consultations and Cherry financing with 0% interest options — so you can start treatment without paying everything upfront.",
  },
  {
    question: "How long does the dental implant process take?",
    answer: "Most dental implant cases take 3–6 months from placement to the final crown. The implant post is placed first and needs 3–4 months to fuse with your jawbone (osseointegration). The crown is placed after healing is complete. Complex cases involving bone grafting may take longer. We'll give you a precise timeline at your free consultation.",
  },
  {
    question: "Am I a good candidate for dental implants?",
    answer: "Most adults with missing teeth are candidates for dental implants. Good candidates have adequate jawbone density, healthy gums, and no uncontrolled systemic conditions. Smokers and diabetic patients can still receive implants with proper management. We use 3D CBCT imaging to evaluate your bone structure and determine the ideal implant plan before any treatment begins.",
  },
  {
    question: "Does getting a dental implant hurt?",
    answer: "The procedure is performed under local anesthesia — most patients report feeling pressure but no pain. Post-procedure discomfort is typically managed with over-the-counter pain relievers and resolves within a few days. Many patients are surprised at how comfortable the process is. We also offer sedation options if you have dental anxiety.",
  },
  {
    question: "Does dental insurance cover implants in Las Vegas?",
    answer: "Coverage varies by plan. Most PPO plans provide partial coverage for implants — typically covering the crown component but not the implant post. We'll verify your specific benefits before your appointment and explain exactly what you'll owe. For uncovered costs, Cherry financing makes payments as low as $150–$200/month.",
  },
  {
    question: "What's the difference between dental implants and dentures?",
    answer: "Dental implants are permanently anchored in your jawbone — they look, feel, and function like natural teeth. You care for them the same way: brushing and flossing. Dentures are removable and can slip, affect speech, and require adhesives. Implants also preserve jawbone density, which dentures do not. Most patients who switch to implants say they wish they'd done it sooner.",
  },
];

const benefits = [
  { title: "Permanent Solution", desc: "Implants are designed to last a lifetime with proper care — not a temporary fix" },
  { title: "Look & Feel Natural", desc: "Matched to your surrounding teeth. No one will know they're not natural" },
  { title: "Preserve Jawbone", desc: "Prevents the bone loss that occurs after tooth extraction — maintains facial structure" },
  { title: "No Diet Restrictions", desc: "Eat anything you want — steak, apples, corn — with full biting force" },
  { title: "Easy Maintenance", desc: "Brush and floss normally. No removal, no adhesives, no special cleaning solutions" },
  { title: "High Success Rate", desc: "Dental implants have a 95–98% long-term success rate — the gold standard in tooth replacement" },
];

export default function DentalImplantsLasVegasPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Dental Implants Las Vegas", href: "/dental-implants-las-vegas" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                128 Five-Star Reviews
              </span>
              <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 rounded-full px-4 py-1.5 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Accepting New Patients
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Dental Implants in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Las Vegas, NV
              </span>
            </h1>
            <ProviderByline variant="compact" className="mb-5" />
            <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Replace missing teeth permanently with natural-looking dental implants.
              Dr. Alex Chireau uses 3D imaging and precision planning to deliver
              implants that look, feel, and function exactly like your natural teeth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-lg">
                <Link href="/appointment">
                  Book Free Implant Consultation
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
              {["Free consultation", "Cherry financing available", "Same-day appointments"].map((item) => (
                <span key={item} className="text-sm text-gray-300 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Why Implants</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              The Permanent Solution for Missing Teeth
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dental implants are the only tooth replacement option that preserves bone,
              looks completely natural, and is designed to last a lifetime.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">The Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              What to Expect — Step by Step
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Free Consultation", desc: "3D CBCT scan evaluates bone density. We review your options and build a precise treatment plan." },
              { step: "02", title: "Implant Placement", desc: "Under local anesthesia, the titanium post is placed in your jawbone. Most patients return to work the next day." },
              { step: "03", title: "Healing (3–4 Months)", desc: "The implant fuses with your bone (osseointegration). A temporary restoration keeps you looking great." },
              { step: "04", title: "Final Crown", desc: "Your custom-milled crown is placed. It matches your surrounding teeth — nobody will know it's an implant." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{s.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing Callout */}
      <section className="py-16 bg-gradient-to-r from-cyan-50 to-blue-50 border-y border-cyan-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Implants That Fit Your Budget
            </h2>
            <p className="text-gray-600 mb-8">
              Cherry financing gives 80%+ of applicants approval in 60 seconds — no hard credit pull.
              Get started with payments as low as $150–$200/month on a single implant.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { name: "Cherry", badge: "0% Options", desc: "80%+ approval · 60-sec decision · no hard pull" },
                { name: "CareCredit", badge: "Healthcare Card", desc: "Dedicated healthcare financing · No annual fee" },
                { name: "Sunbit", badge: "90% Approval", desc: "Buy now, pay later · Fast online application" },
              ].map((f) => (
                <div key={f.name} className="bg-white rounded-xl border border-cyan-100 p-5 text-left shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{f.name}</span>
                    <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-2 py-0.5 rounded-full">{f.badge}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 h-12 px-8">
              <a href="https://withcherry.com" target="_blank" rel="noopener noreferrer">
                Check Eligibility — No Hard Pull
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
            {[
              { icon: Star, text: "128 Five-Star Reviews" },
              { icon: Award, text: "UNLV SDM Trained" },
              { icon: Shield, text: "All Insurance Accepted" },
              { icon: Clock, text: "Same-Day Consultations" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-gray-700">
                <item.icon className="h-5 w-5 text-cyan-600" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Dental Implant FAQs
              </h2>
              <p className="text-gray-600 mt-3">Everything Las Vegas patients ask about implants</p>
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
      <section className="py-20 bg-gradient-to-r from-slate-900 to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Replace Your Missing Teeth?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Book a free implant consultation with Dr. Alex Chireau. We&apos;ll do a 3D scan,
            review your options, and give you an exact treatment plan — no pressure, no obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-lg">
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
          <div className="flex flex-wrap justify-center gap-5">
            {["Free consultation", "Cherry financing", "128 five-star reviews"].map((item) => (
              <span key={item} className="text-sm text-gray-400 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-6">
            Also see: <Link href="/services/dental-implants" className="text-cyan-400 hover:underline">Dental Implants service page</Link> ·{" "}
            <Link href="/insurance" className="text-cyan-400 hover:underline">Insurance & financing</Link>
          </p>
        </div>
      </section>
    </>
  );
}
