import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles, CircleDot, Crown, Heart, Scissors, Leaf, AlignCenter, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { services, siteConfig } from "@/lib/config";

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
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Dental Services in Las Vegas
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From routine cleanings to advanced restorations, AK Ultimate Dental
              provides complete dental care for your entire family. Our team
              combines expertise with the latest technology to deliver
              exceptional results.
            </p>
            <Button asChild size="lg">
              <Link href="/appointment">
                Schedule Your Visit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Shield;
              return (
                <Card
                  key={service.slug}
                  className="group hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <CardContent className="p-8">
                    <div className="bg-blue-100 rounded-lg p-4 w-fit mb-6">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/services/${service.slug}`}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule your appointment and experience the
            difference at AK Ultimate Dental.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/appointment">
                Book Online
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white hover:bg-white/10"
            >
              <a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
