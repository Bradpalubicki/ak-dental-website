import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { testimonials, siteConfig } from "@/lib/config";
import { GoogleReviewsBadge } from "@/components/marketing/google-reviews-badge";
import { curatedImages } from "@/content/images";

export const metadata: Metadata = {
  title: "Patient Reviews & Testimonials | Las Vegas Dentist",
  description:
    "Read reviews from our satisfied patients at AK Ultimate Dental in Las Vegas. See why patients trust our team for their dental care.",
  alternates: {
    canonical: `${siteConfig.url}/reviews`,
  },
  keywords: [
    "AK Ultimate Dental reviews",
    "Las Vegas dentist reviews",
    "AK Ultimate Dental dentist reviews",
    "dental reviews Las Vegas",
    "best dentist Las Vegas reviews",
  ],
};

export default function ReviewsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Reviews", href: "/reviews" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={curatedImages.pages.reviews}
            alt="Happy patient smiling after dental treatment"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/75 to-gray-900/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-8 w-8 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {siteConfig.ratings.count} Five-Star Google Reviews
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Every single review is 5 stars. See what our Las Vegas patients are
              saying about their experience at AK Ultimate Dental.
            </p>
            <div className="flex justify-center mb-8">
              <GoogleReviewsBadge variant="full" className="bg-white/10 backdrop-blur-sm border border-white/20" />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-white/10 border border-white/30 text-white hover:bg-white/20">
                <a
                  href={siteConfig.ratings.googleReviewUrl || siteConfig.social.google}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Google Reviews
                </a>
              </Button>
              <Button asChild className="bg-white/10 border border-white/30 text-white hover:bg-white/20">
                <a
                  href={siteConfig.social.yelp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Yelp Reviews
                </a>
              </Button>
              <Button asChild className="bg-white/10 border border-white/30 text-white hover:bg-white/20">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Facebook
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Our Patients Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((review, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground flex-grow mb-4">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <p className="font-semibold">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Review Highlights */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              What Patients Love About Us
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Experienced Care",
                  description:
                    "Patients consistently praise the expertise and skill of our dental team.",
                  percentage: "98%",
                },
                {
                  title: "Friendly Staff",
                  description:
                    "Our welcoming team makes every visit comfortable and stress-free.",
                  percentage: "99%",
                },
                {
                  title: "Modern Technology",
                  description:
                    "Patients appreciate our investment in the latest dental technology.",
                  percentage: "96%",
                },
                {
                  title: "Clear Communication",
                  description:
                    "We take time to explain procedures and answer all your questions.",
                  percentage: "97%",
                },
              ].map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <span className="text-2xl font-bold text-primary">
                        {item.percentage}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leave Review Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Share Your Experience</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We value your feedback! If you&apos;ve visited our office, we&apos;d love to
              hear about your experience. Your review helps others find quality
              dental care in Las Vegas.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild>
                <a
                  href={siteConfig.social.google}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leave a Google Review
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={siteConfig.social.yelp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leave a Yelp Review
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={curatedImages.lifestyle.patientCare}
            alt="Dental care at AK Ultimate Dental"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/95 to-blue-700/95" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our Satisfied Patients
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Experience the quality care that&apos;s earned us {siteConfig.ratings.count} five-star
            reviews. Schedule your appointment today.
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
