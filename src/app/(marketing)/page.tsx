import Link from "next/link";
import Image from "next/image";
import { Phone, Star, Shield, Clock, Award, CheckCircle, MapPin, ArrowRight, Zap, Heart, Smile, Bell, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig, services, testimonials } from "@/lib/config";
import { images } from "@/lib/images";
import { GoogleReviewsBadge } from "@/components/marketing/google-reviews-badge";
import { AnimatedCounter } from "@/components/marketing/animated-counter";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AK Ultimate Dental | Dentist in Las Vegas, NV",
  description:
    "Top-rated dental care in Las Vegas, NV. General, cosmetic, and implant dentistry. Same-day CEREC crowns. Accepting new patients. Call (702) 935-4395.",
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: "AK Ultimate Dental | Dentist in Las Vegas, NV",
    description:
      "Top-rated dental care in Las Vegas. Cosmetic dentistry, implants, same-day CEREC crowns. 128 five-star reviews. Call (702) 935-4395.",
    images: [{ url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630, alt: "AK Ultimate Dental Las Vegas" }],
  },
};

export default function HomePage() {
  const featuredServices = services.filter((s) => s.featured);

  return (
    <>
      {/* Premium Hero Section */}
      <section className="relative min-h-[calc(100vh-11rem)] flex items-center overflow-hidden">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
          {/* Subtle radial accents for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(6,182,212,0.08),transparent_40%)]" />
          {/* Subtle dot pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white">
              {/* Trust Badges Row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <a
                  href={siteConfig.ratings.googleReviewUrl || siteConfig.social.google}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-colors"
                >
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{siteConfig.ratings.count} Five-Star Google Reviews</span>
                </a>
                <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 rounded-full px-4 py-2 text-sm font-semibold">
                  <CheckCircle className="h-4 w-4" />
                  Accepting New Patients
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                Your Dream Smile
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Starts Here
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-5 leading-relaxed">
                Experience world-class dentistry in Las Vegas. Advanced technology,
                compassionate care, and stunning results—all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Button asChild size="lg" className="text-lg h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                  <Link href="/appointment">
                    Book Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Link href="/appointment">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                    Get Prequalified in 2 Min
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                {["Free consultation", "No commitment", "Same-day appointments available"].map((item) => (
                  <span key={item} className="text-sm text-gray-300 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                {siteConfig.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-cyan-400">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Photo + Card */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <Image
                    src={images.team.doctor}
                    alt="Dr. Alex Chireau, DDS - AK Ultimate Dental Las Vegas"
                    fill
                    sizes="320px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                {/* Quote Card */}
                <div className="absolute -bottom-6 -left-8 bg-white rounded-xl shadow-xl p-5 max-w-xs">
                  <p className="text-sm text-gray-600 italic mb-2">
                    &ldquo;Your smile is my passion. Let&apos;s create something beautiful together.&rdquo;
                  </p>
                  <p className="text-xs font-semibold text-gray-900">— Dr. Alex Chireau, DDS</p>
                </div>
                {/* Decorative accent */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Bar */}
      <section className="bg-[#1a237e] py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-3">
              <Link href="/insurance" className="flex items-center gap-1.5 text-white font-bold text-sm whitespace-nowrap hover:text-cyan-300 transition-colors">
                Most insured patients pay $0
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span className="hidden md:block text-white/30">|</span>
              <Link href="/appointment" className="hidden md:flex items-center gap-1 text-cyan-300 font-semibold text-sm whitespace-nowrap hover:text-white transition-colors">
                Get prequalified in 2 min
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["Anthem BCBS", "Cigna", "Humana", "Molina", "UnitedHealth", "iCare", "Medicaid"].map((ins) => (
                <span key={ins} className="rounded-full bg-[#283593] border border-white/20 px-3 py-0.5 text-xs text-white font-medium">{ins}</span>
              ))}
              <Link href="/insurance" className="rounded-full bg-[#283593] border border-white/20 px-3 py-0.5 text-xs text-cyan-300 font-medium hover:text-white transition-colors">+12 more</Link>
            </div>
          </div>
          {/* Mobile: show prequalify CTA below */}
          <div className="md:hidden flex justify-center mt-1.5">
            <Link href="/appointment" className="flex items-center gap-1 text-cyan-300 font-semibold text-sm hover:text-white transition-colors">
              Get prequalified in 2 min
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-6 border-y border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
            <a
              href={siteConfig.ratings.googleReviewUrl || siteConfig.social.google}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
            >
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{siteConfig.ratings.count} Five-Star Google Reviews</span>
            </a>
            {[
              { icon: Award, text: "Top Rated Las Vegas Dentist" },
              { icon: Shield, text: "All Insurance Accepted" },
              { icon: Zap, text: "Same-Day Appointments" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <item.icon className="h-5 w-5 text-cyan-400" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Acceptance Strip */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">
              We Accept Most Major Insurance Plans
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Delta Dental", color: "bg-blue-600" },
                { name: "Cigna", color: "bg-blue-800" },
                { name: "Aetna", color: "bg-purple-700" },
                { name: "MetLife", color: "bg-blue-500" },
                { name: "Guardian", color: "bg-green-700" },
                { name: "United Concordia", color: "bg-teal-700" },
                { name: "BlueCross", color: "bg-blue-700" },
                { name: "Humana", color: "bg-green-600" },
                { name: "Most PPO Plans", color: "bg-cyan-600" },
              ].map((plan) => (
                <span key={plan.name} className={`${plan.color} text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm`}>
                  {plan.name}
                </span>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don&apos;t see yours?{" "}
              <a href={siteConfig.phoneHref} className="text-cyan-600 font-semibold hover:underline">
                Call {siteConfig.phone}
              </a>{" "}
              — we&apos;ll verify your benefits for free.{" "}
              <Link href="/insurance" className="text-cyan-600 font-semibold hover:underline">
                View all insurance info →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Services Section - Premium Cards */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Dental Care
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From routine cleanings to complete smile makeovers, we offer
              everything you need under one roof.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Card
                key={service.slug}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={images.services[service.slug as keyof typeof images.services] || images.services[Object.keys(images.services)[0] as keyof typeof images.services]}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="h-14 px-8">
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Split Section */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src={images.office.examRoom}
                  alt="AK Ultimate Dental exam room with scenic mural and modern equipment"
                  width={600}
                  height={700}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-cyan-100 rounded-2xl -z-10" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full -z-10" />

              {/* Stats Card */}
              <div className="absolute bottom-8 -right-4 bg-white rounded-xl shadow-xl p-6 z-20">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">20+</p>
                    <p className="text-gray-600">Years Serving Las Vegas</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Las Vegas&apos;s Most Trusted Dental Practice
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                For over two decades, we&apos;ve been transforming smiles and building
                lasting relationships with families throughout the Las Vegas Valley.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "Cutting-Edge Technology",
                    description: "3D imaging, CEREC same-day crowns, and laser dentistry for precise, comfortable care",
                  },
                  {
                    icon: Heart,
                    title: "Patient-First Philosophy",
                    description: "Your comfort and goals drive every treatment decision we make together",
                  },
                  {
                    icon: Award,
                    title: "Proven Excellence",
                    description: "Thousands of successful treatments and consistently 5-star reviews",
                  },
                  {
                    icon: Smile,
                    title: "Anxiety-Free Experience",
                    description: "Sedation options and a caring team ensure stress-free visits every time",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-5">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Doctor - Full Width */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images.hero.office}
            alt="AK Ultimate Dental office interior in Las Vegas"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
                Meet Your Dentist
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Dr. Alex Chireau, DDS
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Doctor of Dental Surgery — General, Cosmetic & Implant Dentistry
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Dr. Chireau brings over a decade of advanced dental training spanning
                European and American methodologies — including graduate training at
                the University of Nevada Las Vegas School of Dental Medicine. His
                approach combines precision, artistry, and genuine compassion to
                deliver results you&apos;ll be proud to show off.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["DDS — UNLV SDM", "10+ Years Experience", "Cosmetic & Implants", "Multilingual"].map((badge) => (
                  <span key={badge} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm">
                    {badge}
                  </span>
                ))}
              </div>
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <Link href="/team/dr-alex-chireau">
                  Meet Dr. Chireau
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <Image
                  src={images.team.doctor}
                  alt="Dr. Alex Chireau, DDS — AK Ultimate Dental Las Vegas"
                  width={500}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
                {/* Quote Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                  <p className="text-gray-600 italic mb-3">
                    &ldquo;Every patient deserves a smile they&apos;re proud to share with the world.&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-gray-900">— Dr. Alex Chireau, DDS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Design */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Patient Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {siteConfig.ratings.count} Five-Star Google Reviews
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Every single review is 5 stars. See what our patients are saying.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <GoogleReviewsBadge variant="full" />
              <a
                href="https://www.yelp.com/biz/ak-ultimate-dental-las-vegas"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-[#d32323] font-extrabold text-lg leading-none">yelp</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#d32323] text-[#d32323]" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">5-Star Rated</span>
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">Verified Patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="h-14 px-8">
              <Link href="/reviews">
                Read All Reviews
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Patient Experience Section */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Effortless From Start to Finish
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We Handle the Details — You Focus on Your Smile
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From the moment you book to the day of your appointment, we&apos;ve streamlined
              every step so visiting the dentist is actually stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Bell,
                title: "Automatic Reminders",
                description: "We send appointment reminders via text and email so you never miss a visit — and rescheduling takes one tap.",
                color: "from-cyan-500 to-blue-600",
              },
              {
                icon: Shield,
                title: "Insurance Handled for You",
                description: "We verify your benefits before your visit and file all claims directly — so there are no surprise bills.",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: Calendar,
                title: "Same-Day Appointments",
                description: "Dental emergencies and last-minute openings happen. Call us and we&apos;ll find a slot that works for your schedule.",
                color: "from-indigo-500 to-purple-600",
              },
              {
                icon: MessageSquare,
                title: "Easy Communication",
                description: "Questions between visits? Reach us by phone or text. Our team responds quickly — no endless hold music.",
                color: "from-purple-500 to-pink-600",
              },
              {
                icon: Heart,
                title: "Personalized Care Plans",
                description: "We track your dental history and proactively recommend what&apos;s next — preventive care that keeps you out of the chair.",
                color: "from-pink-500 to-rose-600",
              },
              {
                icon: CheckCircle,
                title: "No Surprises, Ever",
                description: "We review your treatment plan and costs with you upfront. Financing available for any budget.",
                color: "from-rose-500 to-orange-600",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5">
                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats - Animated */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { end: 5000, suffix: "+", label: "Patients Served", prefix: "" },
              { end: 128, suffix: "", label: "Five-Star Reviews", prefix: "" },
              { end: 20, suffix: "+", label: "Years Serving Las Vegas", prefix: "" },
              { end: 98, suffix: "%", label: "Patient Satisfaction", prefix: "" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                  <AnimatedCounter
                    end={stat.end}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={2500}
                  />
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section - Modern Design */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Visit Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Conveniently Located in Las Vegas
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Our modern, state-of-the-art facility on West Sahara Avenue is
                designed for your comfort and convenience.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { icon: MapPin, label: "Address", value: siteConfig.address.full },
                  { icon: Phone, label: "Phone", value: siteConfig.phone, href: siteConfig.phoneHref },
                  { icon: Clock, label: "Hours", value: "Mon-Thu: 8:00 AM - 5:00 PM" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-lg font-semibold text-gray-900 hover:text-cyan-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="h-14 px-8">
                <Link href="/contact">
                  Get Directions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.google.com/maps?q=AK+Ultimate+Dental+7480+W+Sahara+Ave+Las+Vegas+NV+89117&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AK Ultimate Dental Location"
                />
              </div>
              {/* Las Vegas Image Overlay */}
              <div className="absolute -bottom-6 -left-6 w-48 h-32 rounded-xl overflow-hidden shadow-xl hidden md:block">
                <Image
                  src={images.lasVegas.skyline}
                  alt="Las Vegas skyline"
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Premium */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images.patients.smile}
            alt="Happy patient smiling at AK Ultimate Dental"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/95 to-blue-700/95" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Smile?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            Join thousands of happy patients who&apos;ve discovered their best smile at
            AK Ultimate Dental. Your journey starts with a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-white text-cyan-600 hover:bg-gray-100">
              <Link href="/appointment">
                Book Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Free consultation", "No commitment", "128+ five-star reviews"].map((item) => (
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
