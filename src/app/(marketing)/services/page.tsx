import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Sparkles, CircleDot, Crown, Heart, Scissors, Leaf, AlignCenter, Baby, Zap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig, getPublicServices, serviceImages } from "@/lib/config";
import { curatedImages } from "@/content/images";

export const metadata: Metadata = {
  title: "Dental Services in Las Vegas, NV",
  description:
    "Comprehensive dental services in Las Vegas including cleanings, cosmetic dentistry, dental implants, crowns, root canals, and more. Our dental team provides expert care.",
  keywords: [
    "dental services Las Vegas",
    "Las Vegas dentist services",
    "cosmetic dentistry Las Vegas",
    "dental implants Las Vegas",
    "teeth whitening Las Vegas",
    "dental crowns Las Vegas",
  ],
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Sparkles,
  CircleDot,
  Crown,
  Heart,
  Scissors,
  Leaf,
  AlignCenter,
  Baby,
};

export default function ServicesPage() {
  const publicServices = getPublicServices();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={curatedImages.pages.services}
            alt="Modern dental office with advanced equipment at AK Ultimate Dental"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Comprehensive Dental Services in Las Vegas
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              From routine cleanings to advanced restorations, AK Ultimate Dental
              provides complete dental care for your entire family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <Link href="/appointment">
                  Schedule Your Visit
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

      {/* Same-Day Technology Banner */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/technology"
            className="group flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow"
          >
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4">
              <Zap className="h-10 w-10 text-blue-400" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                Same-Day Crowns, Veneers & Restorations
              </h2>
              <p className="text-gray-400">
                See our in-house CEREC digital lab — permanent restorations in a single visit.
              </p>
            </div>
            <span className="text-blue-400 font-semibold group-hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap">
              View Our Technology
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicServices.map((service) => {
              const Icon = iconMap[service.icon] || Shield;
              const imageUrl = serviceImages[service.slug];
              return (
                <Card
                  key={service.slug}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-600 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{service.description}</p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-cyan-600 font-semibold text-sm hover:text-cyan-700 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose AK Ultimate Dental?
            </h2>
            <p className="text-lg text-muted-foreground">
              We combine advanced technology with personalized care to deliver
              exceptional dental services in Las Vegas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Advanced Technology",
                description:
                  "i-CAT 3D imaging, CEREC same-day crowns, digital X-rays, and BIOLASE laser dentistry for precise, comfortable treatments.",
              },
              {
                title: "Experienced Care",
                description:
                  "Our dentist brings over a decade of dental education combining European and American methodologies.",
              },
              {
                title: "Patient Comfort",
                description:
                  "We prioritize your comfort with gentle techniques, clear communication, and anxiety management options.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
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
            src={curatedImages.lifestyle.confidentSmile}
            alt="Happy patient smiling"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/95 to-blue-700/95" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Contact us today to schedule your appointment and experience the
            difference at AK Ultimate Dental.
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
