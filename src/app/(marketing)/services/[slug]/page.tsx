import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BreadcrumbSchema,
  ServiceSchema,
  FAQSchema,
} from "@/components/schema/local-business";
import {
  siteConfig,
  serviceImages,
  serviceContentImages,
  getAllRenderableServices,
  getServicePromotion,
} from "@/lib/config";
import { serviceContent } from "@/lib/service-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allServices = getAllRenderableServices();
  return allServices.map((service) => ({
    slug: service.slug,
  }));
}

/** Build SEO alt text with service name and location */
function getImageAlt(title: string, location?: string): string {
  const base = `${title} at AK Ultimate Dental`;
  if (location) return `${base} near ${location}, NV`;
  return `${base} in Las Vegas, NV`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = serviceContent[slug];

  if (!content) {
    return {
      title: "Service Not Found",
    };
  }

  const allServices = getAllRenderableServices();
  const serviceInfo = allServices.find((s) => s.slug === slug);
  const heroImage = serviceImages[slug];

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `${siteConfig.url}/services/${slug}`,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      ...(heroImage && {
        images: [
          {
            url: heroImage,
            width: 800,
            height: 600,
            alt: getImageAlt(content.title, serviceInfo?.location),
          },
        ],
      }),
    },
    // Preview pages should not be indexed until enabled
    ...(serviceInfo?.preview && { robots: { index: false, follow: true } }),
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const content = serviceContent[slug];
  const allServices = getAllRenderableServices();
  const serviceInfo = allServices.find((s) => s.slug === slug);

  if (!content || !serviceInfo) {
    notFound();
  }

  const promotion = getServicePromotion(slug);
  const heroImage = serviceImages[slug];
  const contentImage = serviceContentImages[slug];
  const imageAlt = getImageAlt(content.title, serviceInfo.location);

  const relatedServiceInfo = content.relatedServices
    .map((relSlug) => allServices.find((s) => s.slug === relSlug))
    .filter(Boolean);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: content.title, href: `/services/${slug}` },
        ]}
      />
      <ServiceSchema
        name={content.title}
        description={content.metaDescription}
        url={`/services/${slug}`}
      />
      <FAQSchema faqs={content.faqs} />

      {/* Preview Banner */}
      {serviceInfo.preview && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center">
          <p className="text-sm text-amber-800 font-medium">
            Preview Mode &mdash; This page is not yet visible to the public.{" "}
            <span className="text-amber-600">Toggle off preview in config to go live.</span>
          </p>
        </div>
      )}

      {/* Promotion Banner */}
      {promotion && (
        <div className="bg-gradient-to-r from-primary to-blue-700 text-white py-4 px-4 text-center">
          <p className="text-lg font-bold">{promotion.headline}</p>
          <p className="text-sm opacity-90 mt-1">{promotion.details}</p>
          {promotion.discount && (
            <span className="inline-block mt-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-semibold">
              {promotion.discount}
            </span>
          )}
        </div>
      )}

      {/* Hero Section — Split Layout with Image */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Text */}
            <div>
              <nav className="mb-6 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/services" className="hover:text-primary">
                  Services
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">{content.title}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {content.heroTitle}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {content.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/appointment">
                    Schedule a Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={siteConfig.phoneHref}>
                    <Phone className="mr-2 h-5 w-5" />
                    {siteConfig.phone}
                  </a>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            {heroImage && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={heroImage}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                {content.content.map((paragraph, index) => (
                  <div key={index}>
                    <p className="text-muted-foreground mb-6">
                      {paragraph}
                    </p>
                    {/* Inline content image after 2nd paragraph */}
                    {index === 1 && contentImage && (
                      <div className="my-8 rounded-xl overflow-hidden shadow-lg not-prose">
                        <Image
                          src={contentImage}
                          alt={`${content.title} procedure — AK Ultimate Dental${serviceInfo.location ? ` near ${serviceInfo.location}` : ", Las Vegas"}`}
                          width={800}
                          height={500}
                          className="w-full h-auto"
                          sizes="(max-width: 1024px) 100vw, 66vw"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                  Benefits of {content.title}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {content.benefits.map((benefit) => (
                    <Card key={benefit.title}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Schedule Your Visit
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    Ready to get started? Contact us today to schedule your
                    consultation.
                  </p>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/appointment">Book Appointment</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                  <div className="space-y-3 text-sm">
                    <p>
                      <span className="text-muted-foreground">Phone:</span>
                      <br />
                      <a
                        href={siteConfig.phoneHref}
                        className="font-medium hover:text-primary"
                      >
                        {siteConfig.phone}
                      </a>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Address:</span>
                      <br />
                      <span className="font-medium">
                        {siteConfig.address.full}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Hours:</span>
                      <br />
                      <span className="font-medium">Mon-Thu: 8AM-5PM</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Related Services</h3>
                  <div className="space-y-2">
                    {relatedServiceInfo.map((service) => (
                      <Link
                        key={service?.slug}
                        href={`/services/${service?.slug}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {service?.title} →
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {content.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
            Contact AK Ultimate Dental today to schedule your consultation for{" "}
            {content.title.toLowerCase()} in Las Vegas.
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
