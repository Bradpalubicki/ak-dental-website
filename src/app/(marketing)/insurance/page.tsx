import { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight, CheckCircle, Shield, CreditCard, HelpCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dental Insurance & Financing | AK Ultimate Dental Las Vegas",
  description:
    "AK Ultimate Dental accepts most major dental insurance plans including Delta Dental, Cigna, Aetna, MetLife, Guardian, and more. We also offer Cherry and CareCredit financing. Las Vegas, NV.",
  alternates: {
    canonical: `${siteConfig.url}/insurance`,
  },
  openGraph: {
    title: "Dental Insurance & Financing | AK Ultimate Dental Las Vegas",
    description:
      "We accept Delta Dental, Cigna, Aetna, MetLife, Guardian, and most major insurance plans. Flexible financing available. Call to verify your benefits free.",
  },
};

const insurancePlans = [
  { name: "Delta Dental", color: "bg-blue-600", textColor: "text-white", tier: "primary" },
  { name: "Cigna", color: "bg-blue-800", textColor: "text-white", tier: "primary" },
  { name: "Aetna", color: "bg-purple-700", textColor: "text-white", tier: "primary" },
  { name: "MetLife", color: "bg-blue-500", textColor: "text-white", tier: "primary" },
  { name: "Guardian", color: "bg-green-700", textColor: "text-white", tier: "primary" },
  { name: "United Concordia", color: "bg-teal-700", textColor: "text-white", tier: "primary" },
  { name: "BlueCross BlueShield", color: "bg-blue-700", textColor: "text-white", tier: "secondary" },
  { name: "Humana", color: "bg-green-600", textColor: "text-white", tier: "secondary" },
  { name: "Principal", color: "bg-red-700", textColor: "text-white", tier: "secondary" },
  { name: "Sun Life", color: "bg-yellow-600", textColor: "text-white", tier: "secondary" },
  { name: "Ameritas", color: "bg-indigo-700", textColor: "text-white", tier: "secondary" },
  { name: "Anthem", color: "bg-blue-900", textColor: "text-white", tier: "secondary" },
  { name: "GEHA", color: "bg-gray-700", textColor: "text-white", tier: "secondary" },
  { name: "United Healthcare", color: "bg-orange-600", textColor: "text-white", tier: "secondary" },
  { name: "Most PPO Plans", color: "bg-cyan-600", textColor: "text-white", tier: "secondary" },
];

const financingOptions = [
  {
    name: "Cherry",
    tagline: "Dental Financing — No Credit Score Required",
    description:
      "Cherry offers flexible payment plans with an approval rate of over 80%. Get pre-approved in 60 seconds with no hard credit pull. Split your treatment cost into easy monthly payments.",
    features: ["80%+ approval rate", "No hard credit pull to apply", "0% APR options available", "Fast 60-second decision"],
    cta: "Check Eligibility",
    href: "https://withcherry.com",
    color: "border-pink-200 bg-pink-50",
    badgeColor: "bg-pink-600 text-white",
  },
  {
    name: "CareCredit",
    tagline: "Healthcare Credit Card",
    description:
      "CareCredit is a dedicated healthcare credit card accepted at thousands of dental practices. Apply online and use it at your appointment for same-day coverage.",
    features: ["Dedicated healthcare card", "0% deferred interest options", "No annual fee", "Use immediately upon approval"],
    cta: "Apply for CareCredit",
    href: "https://www.carecredit.com",
    color: "border-blue-200 bg-blue-50",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    name: "Sunbit",
    tagline: "Buy Now, Pay Over Time",
    description:
      "Sunbit's buy now, pay later technology is designed for everyday people. 90% of applicants are approved, with straightforward terms and no hidden fees.",
    features: ["90% approval rate", "No hard credit inquiry", "3, 6, 12 or 24 month terms", "No prepayment penalty"],
    cta: "Learn About Sunbit",
    href: "https://sunbit.com",
    color: "border-green-200 bg-green-50",
    badgeColor: "bg-green-600 text-white",
  },
];

const faqs = [
  {
    question: "Does AK Ultimate Dental accept my dental insurance?",
    answer:
      "We accept most major dental insurance plans including Delta Dental, Cigna, Aetna, MetLife, Guardian, United Concordia, BlueCross BlueShield, Humana, Principal, and many more. Call us at (702) 935-4395 and we will verify your specific plan at no charge before your appointment.",
  },
  {
    question: "How do I know what my insurance will cover?",
    answer:
      "Call our office at (702) 935-4395 and we will run a complimentary insurance verification before your visit. We will explain exactly what your plan covers, what your estimated out-of-pocket cost will be, and walk you through your benefits so there are no surprises.",
  },
  {
    question: "What if I don't have dental insurance?",
    answer:
      "No insurance? No problem. We offer flexible financing through Cherry, CareCredit, and Sunbit — all with fast approvals and 0% interest options. We also offer competitive self-pay rates. Ask about our new patient special when you call.",
  },
  {
    question: "Does dental financing affect my credit score?",
    answer:
      "Checking your eligibility for Cherry or Sunbit does NOT affect your credit score — they use a soft credit pull only. CareCredit uses a standard credit application. All three options have options suitable for a wide range of credit profiles.",
  },
  {
    question: "Are implants and cosmetic procedures covered by insurance?",
    answer:
      "Insurance coverage for implants and cosmetic procedures varies by plan. Many plans cover a portion of implants when they replace a missing tooth for functional reasons. Purely cosmetic procedures like teeth whitening or veneers are typically not covered. We will verify your specific benefits and help you use financing to cover any gaps.",
  },
  {
    question: "Do you file insurance claims on my behalf?",
    answer:
      "Yes. We handle all insurance claim filing for you. You simply provide your insurance card at your first visit and we take care of the paperwork. We work directly with your insurer to maximize your benefits.",
  },
];

export default function InsurancePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Insurance & Financing", href: "/insurance" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Insurance &amp; Financing
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              We Work With Your Insurance
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              AK Ultimate Dental accepts most major dental insurance plans. We verify
              your benefits before your visit — no surprises, no billing confusion.
              Flexible financing available for those without insurance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <a href={siteConfig.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  Verify My Benefits Free
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Link href="/appointment">
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              We&apos;ll verify your coverage for free — call {siteConfig.phone}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, text: "Most Insurance Accepted" },
              { icon: CheckCircle, text: "Free Benefits Verification" },
              { icon: DollarSign, text: "0% Financing Available" },
              { icon: CreditCard, text: "All Major Cards Accepted" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-gray-700">
                <item.icon className="h-5 w-5 text-cyan-600" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Plans */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Accepted Insurance Plans
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                We Accept Most Major Plans
              </h2>
              <p className="text-lg text-gray-600">
                Including but not limited to the plans below. Don&apos;t see yours?
                Call us — we likely accept it.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {insurancePlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`${plan.color} ${plan.textColor} px-4 py-2 rounded-lg font-semibold text-sm shadow-sm`}
                >
                  {plan.name}
                </div>
              ))}
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6 text-center">
              <p className="text-lg text-gray-800 mb-4">
                <strong>Not sure if we accept your plan?</strong> We&apos;ll check for you — for free.
              </p>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <Phone className="h-5 w-5" />
                Call {siteConfig.phone} to Verify
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How Insurance Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                How It Works
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                We Handle the Insurance So You Don&apos;t Have To
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Provide Your Card",
                  description: "Bring your insurance card to your first appointment (or call us ahead — we can look it up by name and DOB).",
                  color: "from-cyan-500 to-cyan-600",
                },
                {
                  step: "2",
                  title: "We Verify Your Benefits",
                  description: "Our team contacts your insurer, verifies your coverage, and tells you exactly what to expect — before treatment begins.",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  step: "3",
                  title: "We File Your Claim",
                  description: "After your visit, we file your insurance claim directly. You pay only your estimated portion at time of service.",
                  color: "from-cyan-600 to-blue-700",
                },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Financing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Flexible Financing
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                No Insurance? No Problem.
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We offer three financing options with fast approvals so cost never
                stands between you and the smile you deserve.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {financingOptions.map((option) => (
                <Card key={option.name} className={`border-2 ${option.color} shadow-md hover:shadow-xl transition-shadow`}>
                  <CardContent className="p-6">
                    <div className={`inline-block ${option.badgeColor} text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                      {option.name}
                    </div>
                    <p className="font-bold text-gray-900 mb-2">{option.tagline}</p>
                    <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                    <ul className="space-y-2 mb-6">
                      {option.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={option.href}
                      target="_blank" rel="noopener noreferrer"
                      className="block text-center bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      {option.cta}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              Financing is provided by third-party partners. Call {siteConfig.phone} for help selecting the right option.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Insurance FAQs
              </span>
              <h2 className="text-4xl font-bold text-gray-900">
                Common Insurance Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex gap-3 items-start">
                    <HelpCircle className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Call us now and we&apos;ll verify your insurance benefits for free before your visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 bg-white text-cyan-700 hover:bg-gray-100">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                {siteConfig.phone}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 border-2 border-white text-white hover:bg-white/10">
              <Link href="/appointment">
                Book Online
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
