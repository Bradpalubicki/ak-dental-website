import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  MapPin,
  Heart,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BreadcrumbSchema,
  ProviderSchema,
  FAQSchema,
} from "@/components/schema/local-business";
import { GoogleReviewsBadge } from "@/components/marketing/google-reviews-badge";
import { siteConfig } from "@/lib/config";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Dr. Alex Chireau DDS | Las Vegas | AK Ultimate Dental",
  description:
    "Meet Dr. Alex Chireau, DDS — dual-trained in Romania & the US (UNLV SDM). Cosmetic dentistry, implants & comprehensive care in Las Vegas, NV.",
  alternates: {
    canonical: `${siteConfig.url}/team/dr-alex-chireau`,
  },
  openGraph: {
    title: "Dr. Alex Chireau, DDS | AK Ultimate Dental Las Vegas",
    description:
      "Meet Dr. Alex Chireau — Las Vegas dentist specializing in cosmetic dentistry, dental implants, and same-day CEREC crowns. UNLV SDM graduate.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Dr. Alex Chireau DDS - AK Ultimate Dental Las Vegas",
      },
    ],
  },
};

const credentials = [
  { label: "Degree", value: "Doctor of Dental Surgery (DDS)" },
  { label: "School", value: "UNLV School of Dental Medicine, Las Vegas, NV" },
  { label: "Additional Training", value: "Romanian Dental School (3 years)" },
  { label: "Experience", value: "10+ years of dental education & practice" },
  { label: "Languages", value: "English, Romanian" },
  { label: "Location", value: "Las Vegas, NV" },
];

const specialties = [
  { icon: Zap, label: "Cosmetic Dentistry", detail: "Veneers, whitening, bonding, smile makeovers" },
  { icon: CheckCircle, label: "Dental Implants", detail: "Single implants, full-arch restoration, bone grafting" },
  { icon: Award, label: "CEREC Same-Day Crowns", detail: "In-office crown milling — done in a single visit" },
  { icon: Heart, label: "General Dentistry", detail: "Cleanings, exams, fillings, preventive care" },
  { icon: GraduationCap, label: "Oral Surgery", detail: "Extractions, wisdom teeth, surgical procedures" },
  { icon: Star, label: "Restorative Dentistry", detail: "Bridges, dentures, root canal therapy" },
];

const accreditations = [
  { name: "ADA Member", description: "American Dental Association", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { name: "Nevada Dental Assoc.", description: "State chapter member", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { name: "UNLV SDM Alumni", description: "Doctor of Dental Surgery", color: "bg-red-100 text-red-800 border-red-200" },
  { name: "HIPAA Certified", description: "Patient privacy compliance", color: "bg-green-100 text-green-800 border-green-200" },
];

const faqs = [
  {
    question: "Where did Dr. Chireau receive his dental training?",
    answer:
      "Dr. Alex Chireau has a unique dual-continent dental education. He began his dental studies in Romania, completing three years of rigorous clinical training. He then moved to the United States and earned his Doctor of Dental Surgery (DDS) degree from the UNLV School of Dental Medicine in Las Vegas — giving him a comprehensive perspective on both European and American dental methodologies.",
  },
  {
    question: "What dental procedures does Dr. Chireau specialize in?",
    answer:
      "Dr. Chireau specializes in cosmetic dentistry (porcelain veneers, teeth whitening, bonding), dental implants, CEREC same-day crowns, and comprehensive general dentistry. He is trained to handle the full spectrum of dental care from routine cleanings to full-mouth reconstructions.",
  },
  {
    question: "Is Dr. Chireau accepting new patients?",
    answer:
      "Yes! Dr. Chireau and the team at AK Ultimate Dental are always welcoming new patients. We offer complimentary new patient consultations. Call (702) 935-4395 or book online to schedule your first visit.",
  },
  {
    question: "Does Dr. Chireau speak languages other than English?",
    answer:
      "Yes, Dr. Chireau speaks both English and Romanian fluently, which is helpful for patients who are more comfortable communicating in Romanian.",
  },
  {
    question: "What sets Dr. Chireau apart from other Las Vegas dentists?",
    answer:
      "Dr. Chireau's dual-continent training (Romania + UNLV) gives him a broader clinical perspective than most dentists. Combined with his use of cutting-edge technology — CEREC same-day crowns, i-CAT 3D imaging, BIOLASE laser dentistry — and his genuinely patient-centered approach, patients consistently describe their experience with him as the best dental care they've ever received.",
  },
];

export default function DrAlexChireauPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Our Team", href: "/about" },
          { name: "Dr. Alex Chireau, DDS", href: "/team/dr-alex-chireau" },
        ]}
      />
      <ProviderSchema />
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
                Meet Your Dentist
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-3 leading-tight">
                Dr. Alex Chireau
                <span className="block text-2xl md:text-3xl font-normal text-cyan-400 mt-2">
                  Doctor of Dental Surgery, DDS
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                Dual-trained in Romanian and American dentistry. UNLV SDM graduate.
                Specializing in cosmetic dentistry, dental implants, and comprehensive
                care for Las Vegas families.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {["DDS Certified", "UNLV SDM Graduate", "10+ Years Training", "Romanian & American Methods", "Multilingual"].map((badge) => (
                  <span key={badge} className="bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full text-sm">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                  <Link href="/appointment">
                    Book with Dr. Chireau
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

              <div className="mt-2">
                <GoogleReviewsBadge variant="compact" className="bg-white/10 backdrop-blur-sm border border-white/20" />
              </div>
            </div>

            {/* Doctor Photo */}
            <div className="relative hidden lg:flex justify-center">
              <div className="relative">
                <div className="relative w-80 h-[480px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <Image
                    src={images.team.doctor}
                    alt="Dr. Alex Chireau, DDS — AK Ultimate Dental Las Vegas"
                    fill
                    sizes="320px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-8 bg-white rounded-xl shadow-xl p-5 max-w-xs">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    &ldquo;Your smile is my passion. Every patient deserves to feel confident and healthy.&rdquo;
                  </p>
                  <p className="text-xs font-semibold text-gray-900 mt-1">— Dr. Alex Chireau, DDS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credentials.map((c) => (
                <div key={c.label} className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{c.label}</p>
                    <p className="text-gray-900 font-medium">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Story */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div className="relative">
              <Image
                src={images.team.graduation}
                alt="Dr. Alex Chireau — UNLV School of Dental Medicine graduation"
                width={560}
                height={420}
                className="rounded-2xl shadow-xl object-cover"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-cyan-100 rounded-2xl -z-10" />
            </div>

            <div>
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Education &amp; Training
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                A Dentist Trained on Two Continents
              </h2>
              <div className="space-y-5 text-lg text-gray-600">
                <p>
                  Dr. Chireau&apos;s dental journey began with three rigorous years of
                  dental education in Romania — a country known for its strong
                  emphasis on foundational clinical skills and hands-on patient care.
                </p>
                <p>
                  He then continued his training in the United States, earning his
                  Doctor of Dental Surgery (DDS) from the{" "}
                  <strong className="text-gray-800">UNLV School of Dental Medicine</strong>{" "}
                  — one of the most technically advanced dental programs in the country,
                  right here in Las Vegas.
                </p>
                <p>
                  This rare combination gives Dr. Chireau a broad clinical lens —
                  blending European precision and methodology with American
                  technology and innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Clinical Expertise
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              Dr. Chireau&apos;s Specialties
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {specialties.map((s) => (
              <Card key={s.label} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-cyan-100 rounded-xl p-3 w-fit mb-4">
                    <s.icon className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{s.label}</h3>
                  <p className="text-gray-500 text-sm">{s.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Professional Memberships &amp; Credentials</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {accreditations.map((a) => (
              <div
                key={a.name}
                className={`border rounded-xl px-5 py-3 text-center ${a.color}`}
              >
                <p className="font-bold text-sm">{a.name}</p>
                <p className="text-xs opacity-80">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900">
                Questions About Dr. Chireau
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left">
            <div className="bg-cyan-100 rounded-full p-4 flex-shrink-0">
              <MapPin className="h-8 w-8 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Visit Dr. Chireau at</p>
              <p className="text-xl font-bold text-gray-900">{siteConfig.address.full}</p>
              <p className="text-gray-500">Mon–Thu 8:00 AM – 5:00 PM · {siteConfig.phone}</p>
            </div>
            <div className="sm:ml-auto flex gap-3">
              <Button asChild size="lg" className="h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <Link href="/appointment">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
