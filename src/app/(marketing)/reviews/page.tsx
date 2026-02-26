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

function YelpLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FF1A1A">
      <path d="M20.16 12.73l-4.703 1.14c-.48.116-.913-.32-.778-.794l1.524-5.355c.143-.498.78-.617 1.084-.2l3.179 4.214c.298.394.088.907-.306.995zM13.67 9.082l-1.856-4.927c-.19-.503.243-.997.762-.878l5.34 1.22c.52.12.69.775.296 1.124L14.5 9.14c-.392.35-.985.165-1.168-.325zm-5.51 11.3l2.07-4.85c.21-.492.862-.563 1.173-.12l3.027 4.3c.306.438-.01 1.03-.543 1.03H8.65c-.532 0-.85-.59-.49-1.025zM7.037 9.63L2.23 11.2c-.506.17-.67.82-.29 1.214l3.77 3.857c.384.393 1.006.215 1.152-.282l1.04-3.68c.148-.52-.354-1.02-.866-.88zm-1.19-5.297l4.498 2.59c.46.265.476.92.03 1.204L5.83 11.01c-.45.285-1.02.01-1.1-.52L3.88 5.04c-.078-.53.476-.914.964-.63z"/>
    </svg>
  );
}

function YelpBadge() {
  return (
    <a
      href="https://www.yelp.com/biz/ak-ultimate-dental-las-vegas"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-5 hover:shadow-xl transition-shadow"
    >
      <YelpLogo className="h-10 w-10 flex-shrink-0" />
      <div>
        <div className="flex gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-2 text-lg font-bold text-gray-900">5.0</span>
        </div>
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">Rated 5 Stars</span> on Yelp
        </p>
      </div>
    </a>
  );
}

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

      {/* Find Us On Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Find Our Reviews On</h2>
            <p className="text-slate-600 text-center mb-10">Read what our patients say across all platforms</p>
            <div className="grid md:grid-cols-2 gap-6">
              <GoogleReviewsBadge variant="full" />
              <YelpBadge />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button asChild size="lg" variant="outline" className="border-2">
                <a href="https://share.google/y4QOijKzxJN97403L" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Leave a Google Review
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-[#FF1A1A] text-[#FF1A1A] hover:bg-red-50">
                <a href="https://www.yelp.com/biz/ak-ultimate-dental-las-vegas" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Yelp Reviews
                </a>
              </Button>
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
