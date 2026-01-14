import Link from "next/link";
import { Phone, Star, Shield, Clock, Award, Users, CheckCircle, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig, services, testimonials } from "@/lib/config";

export default function HomePage() {
  const featuredServices = services.filter((s) => s.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9 Rating · 150+ Reviews</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your Smile Deserves{" "}
                <span className="text-primary">Expert Care</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Comprehensive general and cosmetic dentistry in Las Vegas.
                Dr. Alexandru Chireu combines advanced technology with personalized
                care to give you the healthy, confident smile you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/appointment">
                    Book Your Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <a href={siteConfig.phoneHref}>
                    <Phone className="mr-2 h-5 w-5" />
                    {siteConfig.phone}
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-400 text-lg">Professional Office Image</span>
                </div>
              </div>
              {/* Trust badge overlay */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">20+ Years</p>
                    <p className="text-sm text-muted-foreground">Established Practice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.9/5 Google Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Serving Las Vegas Since 2003</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>Advanced Dental Technology</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Most Insurance Accepted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Dental Services in Las Vegas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From routine cleanings to advanced restorations, we provide complete
              dental care for your entire family under one roof.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.slug} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-primary font-medium hover:underline"
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Las Vegas Trusts AK Ultimate Dental
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                For over 20 years, our practice has been committed to providing
                exceptional dental care to the Las Vegas community. Now under the
                leadership of Dr. Alexandru Chireu, we continue that tradition with
                cutting-edge technology and personalized attention.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "Advanced Technology",
                    description: "i-CAT 3D imaging, CEREC same-day crowns, and BIOLASE laser dentistry",
                  },
                  {
                    title: "Patient-Centered Care",
                    description: "We listen to your concerns and create customized treatment plans",
                  },
                  {
                    title: "Comprehensive Services",
                    description: "General, cosmetic, restorative, and surgical dentistry all in one location",
                  },
                  {
                    title: "Comfort-Focused Experience",
                    description: "Gentle techniques and anxiety management for stress-free visits",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-400 text-lg">Dr. Chireu Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Doctor Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet {siteConfig.doctor.name}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              With over a decade of dental education spanning European and American
              methodologies, Dr. Chireu brings a unique blend of expertise and
              compassion to every patient interaction. His commitment to continued
              education ensures you receive the most current treatment techniques
              available.
            </p>
            <Button asChild size="lg">
              <Link href="/about">
                Learn More About Dr. Chireu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Read reviews from our satisfied patients in Las Vegas
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/reviews">Read All Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Visit Our Las Vegas Dental Office
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Conveniently located on West Sahara Avenue, our modern dental
                office is equipped with the latest technology to provide you
                with comfortable, efficient care.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">{siteConfig.address.full}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <a href={siteConfig.phoneHref} className="text-muted-foreground hover:text-primary">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Hours</h3>
                    <p className="text-muted-foreground">Monday - Thursday: 8:00 AM - 5:00 PM</p>
                    <p className="text-muted-foreground">Friday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
              <Button asChild size="lg">
                <Link href="/contact">Get Directions</Link>
              </Button>
            </div>
            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.0123456789!2d-115.2847!3d36.1447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDA4JzQwLjkiTiAxMTXCsDE3JzA0LjkiVw!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AK Ultimate Dental Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for a Healthier Smile?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and experience the difference at
            AK Ultimate Dental. New patients welcome!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/appointment">
                Book Online Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent border-white hover:bg-white/10">
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
