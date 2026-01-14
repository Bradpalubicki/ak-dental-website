import { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Award, Heart, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Dr. Alexandru Chireu | Las Vegas Dentist",
  description:
    "Meet Dr. Alexandru Chireu, DDS - your trusted Las Vegas dentist with over a decade of dental education and experience. Learn about our patient-centered approach to dental care.",
  openGraph: {
    title: "About Dr. Alexandru Chireu | AK Ultimate Dental Las Vegas",
    description:
      "Meet Dr. Alexandru Chireu, DDS - your trusted Las Vegas dentist with comprehensive training in European and American dental methodologies.",
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet {siteConfig.doctor.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Doctor of Dental Surgery
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                With over a decade of comprehensive dental education spanning both
                European and American methodologies, Dr. Alexandru Chireu brings a
                unique perspective to modern dentistry. His commitment to continued
                education and patient-centered care ensures you receive the most
                current, effective treatments available.
              </p>
              <Button asChild size="lg">
                <Link href="/appointment">
                  Schedule Your Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-400 text-lg">Dr. Chireu Professional Photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Background */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Education & Training
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Dr. Alexandru Chireu&apos;s journey in dentistry began with three years of
                rigorous dental education in Romania, where he developed a strong
                foundation in dental science and patient care. He then advanced his
                studies in the United States, earning his Doctor of Dental Surgery
                (DDS) degree and gaining exposure to the latest American dental
                techniques and technologies.
              </p>
              <p>
                This unique combination of European and American dental training gives
                Dr. Chireu a comprehensive understanding of various treatment approaches
                and allows him to provide patients with truly personalized care. His
                commitment to continued education means he regularly participates in
                advanced training courses to stay at the forefront of dental innovation.
              </p>
              <p>
                When Dr. Chireu acquired AK Ultimate Dental from the retiring Dr. Scott
                L. Miller, he made a commitment to honor the practice&apos;s 20+ year legacy
                of exceptional patient care while introducing new technologies and
                treatment options to better serve the Las Vegas community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Patient-Centered Care",
                description:
                  "We take time to understand your concerns, preferences, and long-term oral health goals.",
              },
              {
                icon: GraduationCap,
                title: "Continued Education",
                description:
                  "We stay current with the latest dental techniques and technologies through ongoing training.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We hold ourselves to the highest standards in every procedure, from cleanings to complex restorations.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "We&apos;re proud to serve the Las Vegas community and build lasting relationships with our patients.",
              },
            ].map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-fit mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Philosophy */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Practice Philosophy
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At AK Ultimate Dental, we believe that exceptional dental care goes
                beyond technical expertise. It&apos;s about creating a comfortable,
                welcoming environment where patients feel heard and valued.
              </p>
              <div className="space-y-4">
                {[
                  "Transparent communication about all treatment options",
                  "Personalized treatment plans tailored to your needs",
                  "Comfortable environment with anxiety management options",
                  "State-of-the-art technology for precise, efficient care",
                  "Focus on preventive care to maintain long-term oral health",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-blue-400 text-lg">Office Interior Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Advanced Dental Technology
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              We invest in the latest dental technology to provide you with more
              accurate diagnoses, more comfortable treatments, and better outcomes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "i-CAT 3D Imaging",
                description:
                  "Advanced 3D imaging for precise treatment planning, especially for implants and complex cases.",
              },
              {
                title: "CEREC Same-Day Crowns",
                description:
                  "Get your custom crown in a single visit with our computer-aided design and milling system.",
              },
              {
                title: "BIOLASE Laser Dentistry",
                description:
                  "Minimally invasive laser treatments for soft tissue procedures with faster healing.",
              },
              {
                title: "Digital X-Rays",
                description:
                  "Lower radiation exposure and instant images for faster, more accurate diagnoses.",
              },
              {
                title: "Intraoral Cameras",
                description:
                  "See what we see with high-definition images of your teeth and gums.",
              },
              {
                title: "Diagnodent Cavity Detection",
                description:
                  "Early detection of cavities with laser technology, even before they&apos;re visible on X-rays.",
              },
            ].map((tech) => (
              <Card key={tech.title}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{tech.title}</h3>
                  <p className="text-muted-foreground text-sm">{tech.description}</p>
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
            Experience the Difference
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Schedule your appointment with Dr. Chireu and discover personalized
            dental care backed by advanced technology and genuine compassion.
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
