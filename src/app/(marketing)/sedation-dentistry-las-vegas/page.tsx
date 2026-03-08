import { Metadata } from "next";
import Link from "next/link";
import { Phone, Heart, CheckCircle, ArrowRight, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig, testimonials } from "@/lib/config";

export const metadata: Metadata = {
  title: "Sedation Dentistry Las Vegas NV | AK Ultimate Dental",
  description:
    "Afraid of the dentist? We specialize in anxiety-free care in Las Vegas, NV. Nitrous oxide & oral sedation available. You are not alone. Call (702) 935-4395.",
  keywords: [
    "sedation dentist Las Vegas",
    "sedation dentistry Las Vegas NV",
    "anxiety dentist Las Vegas",
    "dental anxiety Las Vegas",
    "comfortable dentist Las Vegas",
    "nitrous oxide Las Vegas dentist",
    "nervous patient dentist Las Vegas",
    "fear of dentist Las Vegas",
  ],
  alternates: { canonical: `${siteConfig.url}/sedation-dentistry-las-vegas` },
  openGraph: {
    title: "Sedation Dentistry Las Vegas — We Specialize in Anxious Patients",
    description:
      "20-30% of adults avoid the dentist due to anxiety. At AK Ultimate Dental, we specialize in making dental care comfortable. Nitrous oxide and oral sedation available.",
  },
};

const sedationOptions = [
  {
    name: "Nitrous Oxide",
    nickname: '"Laughing Gas"',
    description:
      "The most common and mildest form of sedation. A small mask is placed over your nose, and you breathe in a mix of nitrous oxide and oxygen. You&apos;ll feel relaxed and at ease within minutes — but you stay awake, can answer questions, and can drive yourself home after.",
    ideal: "Mild to moderate anxiety, shorter procedures, patients who want to stay in control",
    wearOff: "Effects wear off within minutes after the mask is removed",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
  },
  {
    name: "Oral Sedation",
    nickname: "Prescription pill taken before your visit",
    description:
      "A prescription sedative pill (typically Halcion or Valium) is taken about an hour before your appointment. You arrive relaxed and remain calm throughout the procedure. You may feel drowsy or even fall asleep — but you can be easily awakened. You&apos;ll need someone to drive you home.",
    ideal: "Moderate to severe anxiety, longer procedures, patients with gag reflex issues",
    wearOff: "Effects last several hours — plan to rest the remainder of the day",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-800",
  },
];

const faqs = [
  {
    question: "Is dental sedation safe?",
    answer:
      "Yes. Both nitrous oxide and oral sedation have excellent safety records when administered by trained dental professionals. Dr. Chireau is trained in sedation protocols and monitors patients closely throughout their appointment. We review your medical history, medications, and health conditions before recommending any sedation option.",
  },
  {
    question: "Will I be awake during sedation dentistry?",
    answer:
      "With nitrous oxide, yes — you stay fully awake and conscious, just relaxed. With oral sedation, you may feel drowsy or fall into a light sleep, but you can be awakened easily and will follow instructions. Neither option is &ldquo;general anesthesia&rdquo; — you are not unconscious.",
  },
  {
    question: "Will I remember my appointment?",
    answer:
      "With nitrous oxide, most patients remember the visit but describe feeling calm and less bothered by it. With oral sedation, many patients have little to no memory of the procedure — which is actually a feature many anxious patients prefer.",
  },
  {
    question: "Can I drive after sedation dentistry?",
    answer:
      "After nitrous oxide, you can drive yourself home — the effects wear off within minutes after the mask is removed. After oral sedation, you must have someone drive you home and should plan not to drive for the rest of the day.",
  },
  {
    question: "Does insurance cover sedation dentistry?",
    answer:
      "Coverage varies by plan. Some insurance plans cover nitrous oxide as a benefit; others do not. Oral sedation is typically not covered by dental insurance. Our team will check your specific coverage and discuss costs with you before your appointment. Financing is available through Cherry, CareCredit, and Sunbit.",
  },
  {
    question: "I&apos;ve avoided the dentist for years. Is it too late?",
    answer:
      "It is never too late. We see patients every week who haven&apos;t been to a dentist in 5, 10, or even 20+ years — and we treat them without judgment. Dr. Chireau understands that anxiety is real and that avoiding the dentist often makes things worse. Our goal is to get you comfortable, assess where you are, and build a realistic plan to restore your oral health.",
  },
];

export default function SedationDentistryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Sedation Dentistry Las Vegas", href: "/sedation-dentistry-las-vegas" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero — empathy-first */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-5 py-2.5 mb-6">
              <Heart className="h-5 w-5 text-indigo-300" />
              <span className="text-indigo-200 font-semibold text-sm">You are not alone — 30% of adults avoid the dentist due to fear</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Dental Care That Feels
              <span className="block text-indigo-400">Safe and Comfortable</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              If dental anxiety has kept you from the care you need — we&apos;re here for you.
              AK Ultimate Dental specializes in anxious patients. We move at your pace.
              We listen. We offer sedation options so you can finally get comfortable care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0">
                <Link href="/appointment">
                  Book a Comfort Consultation
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
          </div>
        </div>
      </section>

      {/* Empathy Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">
                  We Understand
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Dental Anxiety Is Real. We Take It Seriously.
                </h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>
                    An estimated 30% of adults experience enough dental anxiety to affect their dental care.
                    Many haven&apos;t been to a dentist in years — not because they don&apos;t care about their
                    health, but because the experience feels overwhelming.
                  </p>
                  <p>
                    Dr. Chireau has a simple philosophy: your comfort comes first. We move at your pace.
                    We explain everything before we do it. We stop if you ask us to.
                    You are always in control.
                  </p>
                  <p>
                    Many of our most loyal patients came in terrified — and now they&apos;re the ones
                    recommending us to their friends.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "We never rush or pressure you",
                  "Everything is explained before we begin",
                  "You can stop the procedure at any time — just raise your hand",
                  "Sedation options available for all anxiety levels",
                  "Judgment-free — no matter how long it&apos;s been",
                  "A calm, comforting office environment",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sedation Options */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Sedation Options
              </span>
              <h2 className="text-4xl font-bold text-gray-900">
                Your Comfort, Your Choice
              </h2>
              <p className="text-lg text-gray-600 mt-4">
                We offer two sedation levels so you can choose what feels right for you.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {sedationOptions.map((opt) => (
                <Card key={opt.name} className={`border-2 ${opt.color} shadow-md`}>
                  <CardContent className="p-6">
                    <div className={`inline-block ${opt.badge} text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                      {opt.name}
                    </div>
                    <p className="text-gray-500 text-sm italic mb-3">{opt.nickname}</p>
                    <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: opt.description }} />
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="font-semibold text-gray-700 flex-shrink-0">Ideal for:</span>
                        <span className="text-gray-600">{opt.ideal}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-gray-700 flex-shrink-0">Duration:</span>
                        <span className="text-gray-600">{opt.wearOff}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Not sure which option is right for you? We&apos;ll help you decide during your consultation — no commitment required.</p>
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0">
                <Link href="/appointment">
                  Book a Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — specifically anxiety-related ones */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              &ldquo;I Was Terrified. Now I Actually Look Forward to My Visits.&rdquo;
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.filter((t) => t.text.toLowerCase().includes("terrif") || t.text.toLowerCase().includes("fear") || t.text.toLowerCase().includes("comfort")).slice(0, 2).length > 0
              ? testimonials.filter((t) => t.text.toLowerCase().includes("terrif") || t.text.toLowerCase().includes("fear") || t.text.toLowerCase().includes("comfort")).slice(0, 2).map((t, i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}</div>
                    <p className="text-gray-700 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                  </CardContent>
                </Card>
              ))
              : testimonials.slice(4, 6).map((t, i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}</div>
                    <p className="text-gray-700 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Sedation Dentistry FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-12 w-12 text-white/50 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your comfort is our priority. No judgment. Ever.
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Wherever you are starting from — we will meet you there. Book a free,
            no-pressure consultation to discuss your concerns and comfort options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 bg-white text-indigo-700 hover:bg-gray-100">
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
