import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Shield, Camera, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Before & After Smile Gallery | AK Ultimate Dental Las Vegas",
  description:
    "See real patient smile transformations at AK Ultimate Dental in Las Vegas, NV. Before and after photos for veneers, dental implants, teeth whitening, crowns, and full smile makeovers.",
  alternates: {
    canonical: `${siteConfig.url}/smile-gallery`,
  },
  openGraph: {
    title: "Smile Gallery — Before & After | AK Ultimate Dental Las Vegas",
    description:
      "Real smile transformations from AK Ultimate Dental in Las Vegas. Veneers, implants, whitening, crowns, and complete smile makeovers.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Smile gallery before and after AK Ultimate Dental Las Vegas",
      },
    ],
  },
};

const categories = [
  {
    id: "veneers",
    label: "Porcelain Veneers",
    href: "/services/porcelain-veneers",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "implants",
    label: "Dental Implants",
    href: "/services/dental-implants",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "whitening",
    label: "Teeth Whitening",
    href: "/services/cosmetic-dentistry",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    id: "crowns",
    label: "Crowns & Bridges",
    href: "/services/crowns-bridges",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: "smile-makeover",
    label: "Smile Makeovers",
    href: "/services/cosmetic-dentistry",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
];

const cases = [
  {
    id: 1,
    category: "veneers",
    categoryLabel: "Porcelain Veneers",
    title: "Complete Smile Transformation",
    description: "8 porcelain veneers for a natural, symmetrical smile. Treatment completed in 2 visits.",
    duration: "2 visits · 3 weeks",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&q=80",
    patientNote: "Las Vegas patient, age 34",
    placeholder: true,
  },
  {
    id: 2,
    category: "implants",
    categoryLabel: "Dental Implants",
    title: "Single Tooth Implant",
    description: "Single implant replacing a missing molar. Restored full bite function and natural appearance.",
    duration: "4–6 months total",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&q=80",
    patientNote: "Las Vegas patient, age 52",
    placeholder: true,
  },
  {
    id: 3,
    category: "whitening",
    categoryLabel: "Teeth Whitening",
    title: "Professional In-Office Whitening",
    description: "6–8 shades brighter with in-office whitening in a single appointment.",
    duration: "1 visit · 90 minutes",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&q=80",
    patientNote: "Las Vegas patient, age 28",
    placeholder: true,
  },
  {
    id: 4,
    category: "crowns",
    categoryLabel: "CEREC Same-Day Crown",
    title: "Same-Day Ceramic Crown",
    description: "CEREC crown milled in-office. Perfectly matched to natural tooth color. Completed in one visit.",
    duration: "1 visit · 2 hours",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&q=80",
    patientNote: "Las Vegas patient, age 45",
    placeholder: true,
  },
  {
    id: 5,
    category: "smile-makeover",
    categoryLabel: "Smile Makeover",
    title: "Full Smile Makeover",
    description: "Combination of veneers, whitening, and gum contouring for a complete transformation.",
    duration: "6 weeks · 4 visits",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&q=80",
    patientNote: "Las Vegas patient, age 41",
    placeholder: true,
  },
  {
    id: 6,
    category: "veneers",
    categoryLabel: "Porcelain Veneers",
    title: "Chipped & Worn Teeth Restored",
    description: "6 upper veneers correcting chipping, wear, and slight misalignment without orthodontics.",
    duration: "2 visits · 3 weeks",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&q=80",
    patientNote: "Summerlin patient, age 39",
    placeholder: true,
  },
  {
    id: 7,
    category: "implants",
    categoryLabel: "Dental Implants",
    title: "Full-Arch Implant Restoration",
    description: "Multiple implants replacing a full arch with fixed, permanent teeth — no more dentures.",
    duration: "6–9 months",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&q=80",
    patientNote: "Henderson patient, age 61",
    placeholder: true,
  },
  {
    id: 8,
    category: "smile-makeover",
    categoryLabel: "Smile Makeover",
    title: "Wedding Smile Preparation",
    description: "Whitening + 4 veneers + composite bonding for a picture-perfect smile before the big day.",
    duration: "4 weeks",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&q=80",
    patientNote: "Las Vegas patient, age 29",
    placeholder: true,
  },
];

export default function SmileGalleryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Smile Gallery", href: "/smile-gallery" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Before &amp; After
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Real Smiles. Real Results.
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Browse real patient transformations from AK Ultimate Dental in Las Vegas.
              From single veneers to complete smile makeovers — see what&apos;s possible.
            </p>
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
              <Link href="/appointment">
                Book a Free Smile Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* HIPAA Notice */}
      <section className="bg-amber-50 border-y border-amber-200 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3 text-amber-800">
            <Shield className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Patient Privacy:</strong> All photos are shared with written patient
              consent in accordance with HIPAA guidelines. Patient identifiers are removed.
              Results vary by individual case.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter Labels */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="font-semibold text-gray-700 self-center">Browse by treatment:</span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className={`border rounded-full px-4 py-1.5 text-sm font-medium hover:shadow-md transition-shadow ${cat.color}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            {/* Coming Soon Notice */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6 mb-10 flex items-start gap-4">
              <Camera className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-cyan-900 mb-1">More photos being added regularly</p>
                <p className="text-cyan-800 text-sm">
                  We photograph new cases weekly. Ask your care coordinator at your appointment — we&apos;re
                  happy to show you specific case types matching your treatment goals.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {cases.map((c) => {
                const cat = categories.find((cat) => cat.id === c.category);
                return (
                  <div key={c.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
                    {/* Before/After Images */}
                    <div className="grid grid-cols-2 relative">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={c.beforeImage}
                          alt={`Before ${c.title} — AK Ultimate Dental Las Vegas`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                          BEFORE
                        </div>
                      </div>
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={c.afterImage}
                          alt={`After ${c.title} — AK Ultimate Dental Las Vegas`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded">
                          AFTER
                        </div>
                      </div>
                      {/* Divider line */}
                      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white z-10" />
                    </div>

                    {/* Case Info */}
                    <div className="p-5">
                      {cat && (
                        <Badge className={`${cat.color} border mb-3 text-xs`}>
                          {c.categoryLabel}
                        </Badge>
                      )}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{c.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{c.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">{c.patientNote}</span>
                        </div>
                        <span className="text-xs text-gray-400">{c.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Could This Be Your Smile?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book a free cosmetic consultation with Dr. Chireau. We&apos;ll review your goals,
            show you relevant cases, and build a custom treatment plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
              <Link href="/appointment">
                Book Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
