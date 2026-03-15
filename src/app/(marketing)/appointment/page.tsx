import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";
import { curatedImages } from "@/content/images";
import BookingFlow from "@/components/marketing/BookingFlow";

export const metadata: Metadata = {
  title: "Request an Appointment | AK Ultimate Dental Las Vegas",
  description:
    "Book your dental appointment online at AK Ultimate Dental in Las Vegas. New patient exams, cleanings, emergencies, and cosmetic consultations. Call (702) 935-4395.",
  openGraph: {
    title: "Book an Appointment | AK Ultimate Dental Las Vegas",
    description:
      "Schedule your dental visit online. New patients welcome. Same-day emergency appointments available.",
    url: "https://akultimatedental.com/appointment",
  },
};

export default function AppointmentPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={curatedImages.pages.appointment}
            alt="Smiling patient at AK Ultimate Dental Las Vegas"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-white">128 Five-Star Reviews</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Book Your Appointment
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Select a service, pick a date, and choose your time — we&apos;ll confirm within 2
              business hours.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                "Free new patient consultation",
                "Confirmed within 2 hours",
                "All insurance accepted",
              ].map((item) => (
                <span key={item} className="text-sm text-gray-300 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Booking Flow */}
            <div className="lg:col-span-2">
              <BookingFlow />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday</span>
                      <span>{siteConfig.hours.monday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tuesday</span>
                      <span>{siteConfig.hours.tuesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wednesday</span>
                      <span>{siteConfig.hours.wednesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thursday</span>
                      <span>{siteConfig.hours.thursday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Friday</span>
                      <span>{siteConfig.hours.friday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sat – Sun</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a href={siteConfig.phoneHref} className="font-medium hover:text-primary">
                          {siteConfig.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{siteConfig.address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {siteConfig.address.city}, {siteConfig.address.stateAbbr}{" "}
                          {siteConfig.address.zip}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Dental Emergency?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    If you&apos;re experiencing severe pain or a dental emergency, please call us
                    immediately.
                  </p>
                  <Button asChild variant="secondary" className="w-full">
                    <a href={siteConfig.phoneHref}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">What to Expect</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      We confirm your appointment within 2 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Arrive 10 minutes early for new patient paperwork
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Bring your insurance card if applicable
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Free parking available
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-center">
                Prefer to call?{" "}
                <Link href={siteConfig.phoneHref} className="text-primary hover:underline">
                  {siteConfig.phone}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
