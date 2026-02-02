import Link from "next/link";
import Image from "next/image";
import { Phone, Star, Shield, Clock, Award, CheckCircle, MapPin, ArrowRight, Zap, Heart, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig, services, testimonials } from "@/lib/config";
import { images } from "@/lib/images";

export default function HomePage() {
  const featuredServices = services.filter((s) => s.featured);

  return (
    <>
      {/* Premium Hero Section */}
      <section className="relative min-h-[calc(100vh-11rem)] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={images.hero.main}
            alt="Modern dental office"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">4.9 Rating · 150+ Happy Patients</span>
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

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button asChild size="lg" className="text-lg h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <Link href="/appointment">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                <a href={siteConfig.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  {siteConfig.phone}
                </a>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "20+", label: "Years Experience" },
                { value: "10K+", label: "Smiles Created" },
                { value: "99%", label: "Patient Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Card */}
        <div className="absolute bottom-8 right-8 hidden lg:block">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={images.team.doctor}
                  alt="AK Ultimate Dental team"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">AK Ultimate Dental</p>
                <p className="text-sm text-gray-500">Your Dental Team</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic">
              &ldquo;Your smile is my passion. Let&apos;s create something beautiful together.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-6 border-y border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
            {[
              { icon: Star, text: "4.9/5 Google Rating", highlight: true },
              { icon: Award, text: "Top Rated Las Vegas Dentist" },
              { icon: Shield, text: "All Insurance Accepted" },
              { icon: Zap, text: "Same-Day Appointments" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <item.icon className={`h-5 w-5 ${item.highlight ? "fill-yellow-400 text-yellow-400" : "text-cyan-400"}`} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
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
            {featuredServices.map((service, index) => (
              <Card
                key={service.slug}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={images.services[Object.keys(images.services)[index % 9] as keyof typeof images.services]}
                    alt={service.title}
                    fill
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
                  src={images.team.dentistWorking}
                  alt="Dental care at AK Ultimate Dental"
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
            alt="Modern dental office interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
                Meet Your Dental Team
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Our Dental Team
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Doctor of Dental Surgery
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                With over a decade of advanced dental training spanning European and
                American methodologies, our team brings a unique blend of precision,
                artistry, and compassion to every patient interaction. Our commitment
                to continued education ensures you receive the most current,
                effective treatments available.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["DDS Certified", "10+ Years Experience", "Advanced Training", "Multilingual"].map((badge) => (
                  <span key={badge} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm">
                    {badge}
                  </span>
                ))}
              </div>
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <Link href="/about">
                  Learn More About Us
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
                  <p className="text-gray-600 italic mb-3">
                    &ldquo;Every patient deserves a smile they&apos;re proud to share with the world.&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-gray-900">— AK Ultimate Dental</p>
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
              Hear From Our Happy Patients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real patients who transformed their smiles with us
            </p>
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.5!2d-115.284!3d36.144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c0f9b8c8f9b9%3A0x0!2s7480%20W%20Sahara%20Ave%2C%20Las%20Vegas%2C%20NV%2089117!5e0!3m2!1sen!2sus!4v1234567890"
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
            alt="Happy patient smiling"
            fill
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </section>
    </>
  );
}
