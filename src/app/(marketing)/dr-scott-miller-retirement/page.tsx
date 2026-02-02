import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Heart, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dr. Scott Miller Retirement | AK Ultimate Dental Las Vegas",
  description:
    "Dr. Scott L. Miller has retired after 20+ years serving Las Vegas. AK Ultimate Dental continues under new leadership with the same commitment to exceptional care.",
  keywords: [
    "Dr. Scott Miller Las Vegas",
    "Dr. Scott Miller dentist",
    "Dr. Scott L. Miller DDS",
    "Dr. Miller Las Vegas dentist retired",
    "AK Ultimate Dental new dentist",
    "Las Vegas dentist succession",
  ],
  openGraph: {
    title: "Dr. Scott Miller Retirement - AK Ultimate Dental Las Vegas",
    description:
      "After 20+ years of dedicated service, Dr. Scott L. Miller has retired. AK Ultimate Dental continues under new leadership.",
  },
};

const faqs = [
  {
    question: "Has Dr. Scott Miller retired?",
    answer:
      "Yes, Dr. Scott L. Miller, DDS has retired after more than 20 years of dedicated service to the Las Vegas community. The practice continues under new ownership, providing the same high-quality dental care that patients have come to expect from AK Ultimate Dental.",
  },
  {
    question: "Who is the new dentist at AK Ultimate Dental?",
    answer:
      "AK Ultimate Dental's new dentist has over a decade of dental education combining European and American methodologies, and is committed to maintaining the practice's legacy of exceptional patient care.",
  },
  {
    question: "Are my dental records still available?",
    answer:
      "Yes, all patient records have been securely transferred to AK Ultimate Dental's new leadership. Your complete dental history is maintained, ensuring continuity of care for all existing patients.",
  },
  {
    question: "Is the practice still at the same location?",
    answer:
      "Yes, AK Ultimate Dental remains at 7480 West Sahara Avenue, Las Vegas, NV 89117. The same convenient location, the same commitment to excellent care.",
  },
  {
    question: "Has the phone number changed?",
    answer:
      "No, you can reach us at the same phone number: (702) 935-4395. Our office hours remain Monday through Thursday, 8:00 AM to 5:00 PM.",
  },
  {
    question: "Will I receive the same quality of care?",
    answer:
      "Absolutely. Our new dentist is committed to honoring the legacy of exceptional care that Dr. Miller built over 20+ years. The practice continues to use advanced technology including i-CAT 3D imaging, CEREC same-day crowns, and BIOLASE laser dentistry.",
  },
];

export default function DrMillerRetirementPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Dr. Miller Retirement", href: "/dr-scott-miller-retirement" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Dr. Scott L. Miller Has Retired
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              After more than 20 years of dedicated service to the Las Vegas
              community, Dr. Scott L. Miller, DDS has retired. AK Ultimate Dental
              continues under new leadership, committed to
              the same exceptional care you&apos;ve always received.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/about">
                  Meet Our Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/appointment">Schedule an Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tribute to Dr. Miller */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Honoring Dr. Miller&apos;s Legacy
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                For over two decades, Dr. Scott L. Miller served the Las Vegas
                community with dedication, skill, and genuine compassion. His
                commitment to patient care and excellence in dentistry touched
                thousands of lives and built lasting relationships with families
                throughout the area.
              </p>
              <p>
                Dr. Miller was known for taking the time to listen to his patients,
                explain procedures thoroughly, and ensure everyone felt comfortable
                and cared for. Many patients have been coming to the practice for
                15-20+ years, a testament to the trust and rapport Dr. Miller built
                over his career.
              </p>
              <p>
                When it came time to retire, Dr. Miller was careful to find a
                successor who shared his values and commitment to exceptional patient
                care. In the new owner, he found a dentist with the education,
                skill, and dedication to continue the practice&apos;s legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Highlights */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What Hasn&apos;t Changed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CheckCircle,
                title: "Same Location",
                description: "7480 West Sahara Avenue - convenient and familiar",
              },
              {
                icon: Users,
                title: "Your Records",
                description: "All patient histories securely maintained",
              },
              {
                icon: Award,
                title: "Quality Care",
                description: "Same commitment to excellence in dentistry",
              },
              {
                icon: Heart,
                title: "Patient Focus",
                description: "Personalized care remains our priority",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our New Dentist */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet Your New Dental Team
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our new dentist brings over a decade of dental education and
                hands-on experience to AK Ultimate Dental. This unique training
                combines European and American dental methodologies, providing a
                comprehensive approach to patient care.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Doctor of Dental Surgery (DDS) degree",
                  "Three years of dental education in Romania",
                  "Advanced training in American dental techniques",
                  "Commitment to continued education",
                  "Patient-centered, compassionate approach",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg">
                <Link href="/about">
                  Learn More About Our Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-400 text-lg">Our New Dentist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Message to Existing Patients */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Message to Dr. Miller&apos;s Patients
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground mx-auto">
              <p>
                If you were a patient of Dr. Miller, we want you to know that your
                care remains our top priority. All of your dental records and
                history have been securely transferred to ensure continuity of
                care. Our new dentist has familiarized themselves with the practice&apos;s
                patients and is committed to maintaining the relationships Dr.
                Miller built over the years.
              </p>
              <p>
                We invite you to schedule an appointment to meet our new dentist and
                experience the same quality care you&apos;ve come to expect from AK
                Ultimate Dental. We look forward to continuing to serve you and
                your family for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Continue Your Dental Care Journey
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Whether you&apos;ve been with us for years or you&apos;re looking for a new
            dentist in Las Vegas, we&apos;re here to help. Schedule your appointment
            with our team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/appointment">
                Book Your Appointment
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
