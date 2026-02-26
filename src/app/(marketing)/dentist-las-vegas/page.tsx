import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Star, MapPin, Clock, CheckCircle, ArrowRight, Shield, Award, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig, services, testimonials } from "@/lib/config";
import { images } from "@/lib/images";
import { curatedImages } from "@/content/images";

export const metadata: Metadata = {
  title: "Best Dentist in Las Vegas, NV | Top-Rated Dental Care | AK Ultimate Dental",
  description:
    "Looking for the best dentist in Las Vegas? AK Ultimate Dental offers comprehensive dental care including implants, cosmetic dentistry & emergency services. 128 five-star reviews. Call (702) 935-4395.",
  keywords: [
    "dentist Las Vegas",
    "Las Vegas dentist",
    "best dentist Las Vegas",
    "dentist near me Las Vegas",
    "Las Vegas dental office",
    "cosmetic dentist Las Vegas",
    "emergency dentist Las Vegas",
    "family dentist Las Vegas NV",
    "dental implants Las Vegas",
    "teeth whitening Las Vegas",
    "dentist 89117",
    "dentist West Sahara Las Vegas",
  ],
  openGraph: {
    title: "Best Dentist in Las Vegas, NV | AK Ultimate Dental",
    description:
      "Top-rated Las Vegas dentist offering comprehensive dental care. 20+ years serving the community. Book your appointment today!",
    images: [{ url: curatedImages.pages.dentistLasVegas, width: 1200, height: 630, alt: "Best dentist in Las Vegas NV - AK Ultimate Dental" }],
  },
};

const localFaqs = [
  {
    question: "What areas of Las Vegas do you serve?",
    answer:
      "AK Ultimate Dental proudly serves patients throughout the Las Vegas Valley including Summerlin, Spring Valley, The Lakes, Desert Shores, and surrounding areas. We're conveniently located on West Sahara Avenue near Buffalo Drive, easily accessible from I-215 and US-95.",
  },
  {
    question: "Are you accepting new patients in Las Vegas?",
    answer:
      "Yes! We're always welcoming new patients to our Las Vegas dental family. We offer complimentary consultations for new patients and work with most insurance plans. Call (702) 935-4395 to schedule your first visit.",
  },
  {
    question: "Do you offer emergency dental services in Las Vegas?",
    answer:
      "Yes, we provide same-day emergency dental appointments for patients experiencing dental emergencies in Las Vegas. If you're experiencing severe pain, swelling, or dental trauma, call us immediately at (702) 935-4395.",
  },
  {
    question: "What makes AK Ultimate Dental different from other Las Vegas dentists?",
    answer:
      "With over 20 years serving Las Vegas, we combine advanced technology (3D imaging, CEREC same-day crowns, laser dentistry) with personalized care. Our team's unique training in European and American methodologies brings world-class expertise to our Las Vegas community.",
  },
  {
    question: "What insurance plans do you accept?",
    answer:
      "We accept most major dental insurance plans including Delta Dental, Cigna, Aetna, MetLife, Guardian, and many others. We also offer flexible payment plans for patients without insurance. Contact our office for specific coverage questions.",
  },
  {
    question: "How do I get to your Las Vegas dental office?",
    answer:
      "We're located at 7480 West Sahara Avenue, Las Vegas, NV 89117, near the intersection with Buffalo Drive. From I-215, take the Sahara Avenue exit and head east. From US-95, take Sahara Avenue west. Free parking is available on-site.",
  },
];

const neighborhoods = [
  "Summerlin",
  "Spring Valley",
  "The Lakes",
  "Desert Shores",
  "Peccole Ranch",
  "Canyon Gate",
  "Queensridge",
  "Red Rock",
  "Mountains Edge",
  "Enterprise",
  "Paradise",
  "Winchester",
];

export default function DentistLasVegasPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Dentist Las Vegas", href: "/dentist-las-vegas" },
        ]}
      />
      <FAQSchema faqs={localFaqs} />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={curatedImages.pages.dentistLasVegas}
            alt="Best dentist in Las Vegas - AK Ultimate Dental on West Sahara"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 mb-6">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium">Serving Las Vegas Since 2003</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Trusted{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Las Vegas Dentist
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              AK Ultimate Dental has been transforming smiles across the Las Vegas
              Valley for over 20 years. Experience world-class dentistry right in
              your neighborhood.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg">{siteConfig.ratings.count} Five-Star Google Reviews</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
            {[
              { icon: Star, text: `${siteConfig.ratings.count} Five-Star Reviews` },
              { icon: Award, text: "Top Las Vegas Dentist" },
              { icon: Users, text: "20+ Years Serving LV" },
              { icon: Shield, text: "All Insurance Accepted" },
              { icon: Zap, text: "Same-Day Appointments" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-700">
                <item.icon className="h-5 w-5 text-cyan-600" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Las Vegas Chooses Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Why Las Vegas Trusts Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Best Dental Care in Las Vegas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For over two decades, AK Ultimate Dental has been the trusted choice
              for families throughout the Las Vegas Valley seeking exceptional dental care.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src={curatedImages.lifestyle.patientConsultation}
                alt="AK Ultimate Dental dentist consulting with patient in Las Vegas"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-100 rounded-full p-2">
                    <MapPin className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">West Sahara Ave</p>
                    <p className="text-sm text-gray-500">Las Vegas, NV 89117</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-6">
                {[
                  {
                    title: "20+ Years Serving Las Vegas",
                    description: "We've built lasting relationships with families across the Las Vegas Valley, from Summerlin to Spring Valley.",
                  },
                  {
                    title: "State-of-the-Art Technology",
                    description: "Our Las Vegas office features 3D imaging, CEREC same-day crowns, and BIOLASE laser dentistry.",
                  },
                  {
                    title: "Convenient Location",
                    description: "Easy access from I-215 and US-95. Free parking. Located near Summerlin and Spring Valley.",
                  },
                  {
                    title: "Comprehensive Services",
                    description: "General, cosmetic, restorative, and emergency dentistry—all under one roof in Las Vegas.",
                  },
                  {
                    title: "Insurance Friendly",
                    description: "We accept most major insurance plans and offer flexible payment options for Las Vegas residents.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services for Las Vegas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Dental Services in Las Vegas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive dental care for Las Vegas families
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.slug} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-cyan-600 font-medium hover:text-cyan-700"
                  >
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Service Areas
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Serving the Las Vegas Valley
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proudly serving patients from communities throughout Las Vegas and Clark County
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {neighborhoods.map((area) => (
              <div
                key={area}
                className="bg-white rounded-lg px-4 py-3 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-700 font-medium">{area}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            And surrounding areas including Henderson, North Las Vegas, and Boulder City
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              Patient Reviews
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Las Vegas Patients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">Las Vegas, NV</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                FAQ
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Questions About Our Las Vegas Dental Office
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {localFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Visit Our Office
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Las Vegas Dental Office Location
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-100 rounded-lg p-3">
                    <MapPin className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Address</h3>
                    <p className="text-gray-600">{siteConfig.address.street}</p>
                    <p className="text-gray-600">{siteConfig.address.city}, {siteConfig.address.stateAbbr} {siteConfig.address.zip}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-cyan-100 rounded-lg p-3">
                    <Phone className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <a href={siteConfig.phoneHref} className="text-cyan-600 hover:text-cyan-700 text-lg font-medium">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-cyan-100 rounded-lg p-3">
                    <Clock className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Hours</h3>
                    <p className="text-gray-600">Monday - Thursday: 8:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Friday - Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <Button asChild size="lg" className="h-14 px-8">
                <Link href="/appointment">
                  Schedule Your Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps?q=AK+Ultimate+Dental+7480+W+Sahara+Ave+Las+Vegas+NV+89117&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AK Ultimate Dental Las Vegas Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={curatedImages.lifestyle.confidentSmile}
            alt="Happy patient after dental treatment at AK Ultimate Dental Las Vegas"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/95 to-blue-700/95" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Las Vegas&apos;s Premier Dental Practice
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Join thousands of Las Vegas residents who trust AK Ultimate Dental
            for their family&apos;s dental care. Schedule your free consultation today.
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
                {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
