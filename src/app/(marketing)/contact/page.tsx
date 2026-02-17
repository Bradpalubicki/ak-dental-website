import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";
import { curatedImages } from "@/content/images";

export const metadata: Metadata = {
  title: "Contact Us | Las Vegas Dental Office",
  description:
    "Contact AK Ultimate Dental in Las Vegas. Located at 7480 West Sahara Avenue. Call (702) 935-4395. Open Monday-Thursday 8AM-5PM.",
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  keywords: [
    "dentist Las Vegas contact",
    "AK Ultimate Dental phone",
    "Las Vegas dental office",
    "dentist West Sahara Avenue",
    "dental office 89117",
  ],
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={curatedImages.pages.contact}
            alt="AK Ultimate Dental office in Las Vegas"
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
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Contact Our Las Vegas Dental Office
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              We&apos;re here to help with all your dental needs. Reach out to schedule
              an appointment or ask any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <a href={siteConfig.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call {siteConfig.phone}
                </a>
              </Button>
              <Button asChild size="lg" className="h-14 px-8 bg-white/10 border border-white/30 text-white hover:bg-white/20">
                <Link href="/appointment">
                  Book Online
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Map */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Address</h3>
                      <p className="text-muted-foreground">{siteConfig.address.street}</p>
                      <p className="text-muted-foreground">
                        {siteConfig.address.city}, {siteConfig.address.stateAbbr}{" "}
                        {siteConfig.address.zip}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address.full)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm mt-2 inline-block"
                      >
                        Get Directions →
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Phone</h3>
                      <a
                        href={siteConfig.phoneHref}
                        className="text-muted-foreground hover:text-primary text-lg"
                      >
                        {siteConfig.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Office Hours</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <div className="flex justify-between gap-8">
                          <span>Monday</span>
                          <span>{siteConfig.hours.monday}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span>Tuesday</span>
                          <span>{siteConfig.hours.tuesday}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span>Wednesday</span>
                          <span>{siteConfig.hours.wednesday}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span>Thursday</span>
                          <span>{siteConfig.hours.thursday}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span>Friday</span>
                          <span>{siteConfig.hours.friday}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span>Sat - Sun</span>
                          <span>Closed</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Find Us</h2>
              <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.5!2d-115.284!3d36.144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c0f9b8c8f9b9%3A0x0!2s7480%20W%20Sahara%20Ave%2C%20Las%20Vegas%2C%20NV%2089117!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AK Ultimate Dental Location Map"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Located on West Sahara Avenue, near the intersection with Buffalo
                Drive. Ample parking available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Info */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Dental Emergency?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you&apos;re experiencing a dental emergency during office hours, call
              us immediately. We make every effort to see emergency patients the
              same day.
            </p>
            <Button asChild size="lg">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                Call Now: {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={curatedImages.lifestyle.confidentSmile}
            alt="Confident smile after dental treatment"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/95 to-blue-700/95" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Schedule Your Visit?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Book your appointment online and take the first step toward a
            healthier, more beautiful smile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-white text-cyan-600 hover:bg-gray-100">
              <Link href="/appointment">
                Book Online
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
