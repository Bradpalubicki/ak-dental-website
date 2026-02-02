import { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { testimonials, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Patient Reviews & Testimonials | Las Vegas Dentist",
  description:
    "Read reviews from our satisfied patients at AK Ultimate Dental in Las Vegas. See why patients trust our team for their dental care.",
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
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-8 w-8 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              4.9 out of 5 Stars
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Based on 150+ patient reviews. See what our Las Vegas patients are
              saying about their experience at AK Ultimate Dental.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="outline">
                <a
                  href={siteConfig.social.google}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Google Reviews
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={siteConfig.social.yelp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Yelp Reviews
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Facebook Reviews
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Satisfied Patients
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Experience the quality care that&apos;s earned us hundreds of 5-star
            reviews. Schedule your appointment today.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/appointment">
              Book Your Appointment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
