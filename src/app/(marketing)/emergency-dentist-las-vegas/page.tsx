import { Metadata } from "next";
import Link from "next/link";
import { Phone, AlertCircle, Clock, CheckCircle, ArrowRight, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Emergency Dentist Las Vegas NV | AK Ultimate Dental",
  description:
    "Dental emergency in Las Vegas, NV? Same-day appointments for toothaches, broken teeth, lost crowns & swelling. Don't wait — call (702) 935-4395 now.",
  keywords: [
    "emergency dentist Las Vegas",
    "emergency dental Las Vegas",
    "same day dentist Las Vegas",
    "toothache Las Vegas",
    "broken tooth Las Vegas",
    "dental emergency Las Vegas NV",
    "urgent dental care Las Vegas",
    "walk in dentist Las Vegas",
  ],
  alternates: { canonical: `${siteConfig.url}/emergency-dentist-las-vegas` },
  openGraph: {
    title: "Emergency Dentist Las Vegas — Same-Day Appointments",
    description:
      "Dental pain? Broken tooth? Lost crown? Call AK Ultimate Dental for same-day emergency care in Las Vegas. (702) 935-4395.",
  },
};

const emergencyTypes = [
  "Severe toothache or throbbing pain",
  "Cracked, chipped, or broken tooth",
  "Knocked-out tooth (act within 30 minutes)",
  "Lost filling or crown",
  "Dental abscess or facial swelling",
  "Broken dentures or dental appliance",
  "Soft tissue injury (gum, lip, cheek)",
  "Exposed nerve from decay",
];

const steps = [
  {
    step: "1",
    title: "Call Us Immediately",
    detail: "Call (702) 935-4395 as early in the day as possible. Tell us it&apos;s an emergency and briefly describe your symptoms. We will find the first available slot — often same day.",
    color: "from-red-500 to-red-600",
  },
  {
    step: "2",
    title: "We See You Today",
    detail: "We reserve emergency slots for urgent cases. For severe pain, swelling, or trauma — we move you to the front of the line. You will not be told to &ldquo;come back next week.&rdquo;",
    color: "from-orange-500 to-orange-600",
  },
  {
    step: "3",
    title: "Relief & Treatment",
    detail: "Dr. Chireau diagnoses the problem, relieves your pain, and presents your treatment options clearly. Same-day treatment for most emergencies. Zero judgment, maximum care.",
    color: "from-cyan-500 to-cyan-600",
  },
];

const faqs = [
  {
    question: "How quickly can I be seen for a dental emergency in Las Vegas?",
    answer:
      "Call us at (702) 935-4395 first thing in the morning. For most dental emergencies, we can see you the same day. We reserve slots specifically for emergency cases. The earlier you call, the better your chances of a same-day appointment.",
  },
  {
    question: "What counts as a dental emergency?",
    answer:
      "A dental emergency is any situation involving severe pain, swelling, bleeding, or tooth trauma that cannot wait for a routine appointment. This includes: severe toothaches, knocked-out teeth, cracked or broken teeth, dental abscesses (swelling/infection), lost crowns or fillings causing pain, and soft tissue injuries.",
  },
  {
    question: "What should I do if my tooth is knocked out?",
    answer:
      "Act immediately — time is critical. Pick up the tooth by the crown (not the root). If dirty, rinse gently with water (do not scrub). Try to reinsert it in the socket, or keep it moist in milk or saliva. Call us immediately at (702) 935-4395 and come in within 30 minutes. The sooner you arrive, the better the chance of saving the tooth.",
  },
  {
    question: "Is emergency dental care expensive?",
    answer:
      "Emergency care is priced fairly and we accept most major insurance plans. We also offer flexible financing through Cherry, CareCredit, and Sunbit — with fast approvals and 0% interest options. We will always discuss costs with you before beginning treatment.",
  },
  {
    question: "What if I have a dental emergency after hours?",
    answer:
      "Our office hours are Monday–Thursday, 8:00 AM–5:00 PM. If you have a life-threatening emergency (uncontrolled bleeding, severe jaw trauma, difficulty breathing or swallowing), go to the nearest emergency room. For painful but non-life-threatening issues, call us first thing the next morning for a same-day appointment.",
  },
  {
    question: "Do you charge extra for emergency appointments?",
    answer:
      "Emergency appointments are handled at our standard fee schedule. There is no extra &ldquo;emergency surcharge.&rdquo; We bill your insurance the same as a regular appointment and only ask you to pay your standard copay/coinsurance.",
  },
];

export default function EmergencyDentistPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Emergency Dentist Las Vegas", href: "/emergency-dentist-las-vegas" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero — Phone First */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.2),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-red-500/30 border border-red-400/40 rounded-full px-5 py-2.5 mb-6">
              <AlertCircle className="h-5 w-5 text-red-300" />
              <span className="font-bold text-red-200 text-sm">SAME-DAY EMERGENCY APPOINTMENTS</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Emergency Dentist<br />
              <span className="text-red-300">Las Vegas</span>
            </h1>
            <p className="text-xl text-red-100 mb-8">
              Dental pain can&apos;t wait. We offer same-day emergency appointments
              for toothaches, broken teeth, abscesses, and dental trauma.
              Call now — we&apos;ll get you in today.
            </p>

            {/* PRIMARY CTA — BIG PHONE BUTTON */}
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold text-2xl px-10 py-5 rounded-2xl shadow-2xl transition-colors mb-4 w-full sm:w-auto justify-center"
            >
              <Phone className="h-8 w-8" />
              {siteConfig.phone}
            </a>
            <p className="text-red-200 text-sm mb-6">Call first — we answer fast and reserve emergency slots daily.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-red-200 text-sm justify-center">
                <Clock className="h-4 w-4" />
                <span>Mon–Thu 8:00 AM – 5:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-red-200 text-sm justify-center">
                <MapPin className="h-4 w-4" />
                <span>7480 W Sahara Ave, Las Vegas, NV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Counts as Emergency */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Is Your Situation a Dental Emergency?</h2>
              <p className="text-gray-600 mt-3">If you&apos;re experiencing any of the following — call us now. Don&apos;t wait.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {emergencyTypes.map((type) => (
                <div key={type} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{type}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-8 py-4 rounded-xl transition-colors"
              >
                <Phone className="h-6 w-6" />
                Call {siteConfig.phone} Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How Emergency Care Works at AK Ultimate Dental</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.step} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${s.color} rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4`}>
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: s.detail }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center md:justify-between gap-6">
            {[
              { icon: Shield, text: "Most Insurance Accepted" },
              { icon: CheckCircle, text: "No Extra Emergency Fees" },
              { icon: Clock, text: "Same-Day Appointments" },
              { icon: AlertCircle, text: "Pain Relief — Priority #1" },
            ].map((i) => (
              <div key={i.text} className="flex items-center gap-2 text-gray-700">
                <i.icon className="h-5 w-5 text-cyan-600" />
                <span className="font-medium">{i.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Emergency Dental FAQs</h2>
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

      {/* Sticky bottom phone CTA for this page */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">In Pain? Call Now.</h2>
          <p className="text-red-100 mb-6">Same-day appointments for dental emergencies in Las Vegas.</p>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-3 bg-white text-red-700 font-bold text-2xl px-10 py-5 rounded-2xl hover:bg-red-50 transition-colors"
          >
            <Phone className="h-8 w-8" />
            {siteConfig.phone}
          </a>
          <p className="text-red-200 text-sm mt-3">Or <Link href="/appointment" className="underline">book online</Link> for non-urgent appointments.</p>
        </div>
      </section>
    </>
  );
}
