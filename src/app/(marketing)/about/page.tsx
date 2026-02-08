import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Award, Heart, Users, ArrowRight, CheckCircle, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Our Team | Las Vegas Dentist",
  description:
    "Meet the team at AK Ultimate Dental - your trusted Las Vegas dentist with over a decade of dental education and experience. Learn about our patient-centered approach to dental care.",
  openGraph: {
    title: "About Our Team | AK Ultimate Dental Las Vegas",
    description:
      "Meet the team at AK Ultimate Dental - your trusted Las Vegas dentist with comprehensive training in European and American dental methodologies.",
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={images.hero.office}
            alt="AK Ultimate Dental office"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
                Meet Our Team
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Our Dental Team
              </h1>
              <p className="text-2xl text-cyan-400 font-medium mb-6">
                Doctor of Dental Surgery
              </p>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                With over a decade of comprehensive dental education spanning both
                European and American methodologies, our dental team brings a unique
                perspective to modern dentistry—combining precision, artistry, and
                genuine compassion for every patient.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["DDS Certified", "10+ Years Experience", "European & American Training"].map((badge) => (
                  <span key={badge} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm">
                    {badge}
                  </span>
                ))}
              </div>
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <Link href="/appointment">
                  Schedule Your Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <Image
                  src={images.team.doctor}
                  alt="AK Ultimate Dental team"
                  width={500}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
                {/* Quote Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic text-sm">
                    &ldquo;Your smile is my passion. Every patient deserves to feel confident and healthy.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey & Education */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <Image
                src={images.team.graduation}
                alt="Dr. Alexandru Chireu - UNLV School of Dental Medicine graduation"
                width={600}
                height={450}
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-cyan-100 rounded-2xl -z-10" />
            </div>

            <div>
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Education & Training
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                A Unique Dental Education
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  Our practice&apos;s journey in dentistry began with three years of
                  rigorous dental education in Romania, where a strong
                  foundation in dental science and patient care was developed.
                </p>
                <p>
                  He then advanced his studies in the United States, earning his Doctor
                  of Dental Surgery (DDS) degree and gaining exposure to the latest
                  American dental techniques and technologies.
                </p>
                <p>
                  This unique combination gives our team a comprehensive understanding
                  of various treatment approaches, allowing us to provide truly
                  personalized care to every patient.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-10">
                {[
                  { value: "10+", label: "Years Training" },
                  { value: "2", label: "Continents" },
                  { value: "1000+", label: "Procedures" },
                  { value: "100%", label: "Dedication" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-cyan-600">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy & Transition */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Our Legacy
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Continuing a 20+ Year Tradition
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              When our new leadership acquired AK Ultimate Dental from the retiring Dr. Scott
              L. Miller, a commitment was made to honor the practice&apos;s two-decade legacy
              of exceptional patient care while introducing new technologies and
              treatment options to better serve the Las Vegas community.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/dr-scott-miller-retirement">
                Learn About Our Transition
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Drives Us Every Day
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Patient-Centered Care",
                description: "Your concerns and goals are at the heart of every treatment decision we make.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: GraduationCap,
                title: "Continued Education",
                description: "We stay current with the latest techniques through ongoing training and certification.",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: Award,
                title: "Clinical Excellence",
                description: "We hold ourselves to the highest standards in every procedure we perform.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: Users,
                title: "Community Focus",
                description: "We're proud to serve Las Vegas families and build lasting relationships.",
                color: "from-cyan-500 to-teal-500",
              },
            ].map((value) => (
              <Card key={value.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className={`bg-gradient-to-br ${value.color} rounded-2xl p-4 w-fit mx-auto mb-6`}>
                    <value.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Philosophy */}
      <section className="py-20 md:py-32 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
                Our Philosophy
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                More Than Just Dentistry
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                At AK Ultimate Dental, we believe exceptional dental care goes beyond
                technical expertise. It&apos;s about creating an environment where you
                feel heard, respected, and genuinely cared for.
              </p>

              <div className="space-y-4">
                {[
                  "Transparent communication about all treatment options",
                  "Personalized treatment plans tailored to your needs",
                  "Comfortable environment with anxiety management options",
                  "State-of-the-art technology for precise, efficient care",
                  "Focus on preventive care for long-term oral health",
                ].map((item) => (
                  <div key={item} className="flex gap-4 items-start">
                    <CheckCircle className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Image
                src={images.team.consultation}
                alt="Patient consultation"
                width={600}
                height={450}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Our Technology
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced Dental Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We invest in cutting-edge technology to provide more accurate diagnoses,
              more comfortable treatments, and better outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Zap,
                title: "i-CAT 3D Imaging",
                description: "Precise 3D imaging for implant planning and complex case visualization.",
              },
              {
                icon: Shield,
                title: "CEREC Same-Day Crowns",
                description: "Custom crowns designed and milled in-office, completed in one visit.",
              },
              {
                icon: Award,
                title: "BIOLASE Laser Dentistry",
                description: "Minimally invasive soft tissue procedures with faster healing times.",
              },
              {
                icon: CheckCircle,
                title: "Digital X-Rays",
                description: "90% less radiation than traditional X-rays with instant, high-quality images.",
              },
              {
                icon: Heart,
                title: "Intraoral Cameras",
                description: "See what we see with HD images of your teeth and gums.",
              },
              {
                icon: Star,
                title: "Diagnodent Detection",
                description: "Early cavity detection using laser technology before they're visible.",
              },
            ].map((tech) => (
              <Card key={tech.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-cyan-100 rounded-xl p-3 w-fit mb-4">
                    <tech.icon className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{tech.title}</h3>
                  <p className="text-gray-600 text-sm">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images.patients.smile}
            alt="Happy patient"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/95 to-blue-700/95" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience the Difference
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Schedule your appointment with our team and discover personalized
            dental care backed by advanced technology and genuine compassion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-white text-cyan-600 hover:bg-gray-100">
              <Link href="/appointment">
                Book Your Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10">
              <a href={siteConfig.phoneHref}>
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
