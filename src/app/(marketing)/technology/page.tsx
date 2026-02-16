import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Phone,
  Scan,
  Monitor,
  Cog,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig, getServicePromotion } from "@/lib/config";

export const metadata: Metadata = {
  title: "Dental Technology Las Vegas | AK Ultimate Dental",
  description:
    "Advanced CEREC and CAD/CAM dental technology at AK Ultimate Dental in Las Vegas. Same-day crowns, digital scanning, precision restorations. Call (702) 935-4395.",
  alternates: {
    canonical: `${siteConfig.url}/technology`,
  },
  openGraph: {
    title: "Advanced Dental Technology | AK Ultimate Dental",
    description:
      "See the CEREC and CAD/CAM technology behind same-day crowns, veneers, and restorations in Las Vegas.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Advanced dental technology at AK Ultimate Dental in Las Vegas",
      },
    ],
  },
};

const equipmentItems = [
  {
    name: "CEREC Primescan",
    category: "Intraoral Scanner",
    icon: Scan,
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=400&fit=crop&q=80",
    imageAlt: "CEREC Primescan digital intraoral scanner at AK Ultimate Dental Las Vegas",
    description:
      "The fastest and most accurate intraoral scanner available. Captures detailed 3D images of your teeth in minutes — replacing messy, uncomfortable impression trays with a comfortable digital scan.",
    highlights: [
      "Sub-millimeter accuracy for perfect restorations",
      "Full-color 3D imaging shows every detail",
      "Comfortable — no gagging, no goopy trays",
      "Scan completed in under 3 minutes",
    ],
  },
  {
    name: "CEREC CAD Software",
    category: "Digital Design",
    icon: Monitor,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop&q=80",
    imageAlt: "CEREC CAD/CAM digital design software for dental restorations Las Vegas",
    description:
      "Sophisticated computer-aided design software turns your 3D scan into a custom restoration. Dr. Khachaturian designs your crown or veneer on screen — adjusting shape, contours, and bite contact to perfection before milling begins.",
    highlights: [
      "Custom-designed to match your natural teeth",
      "See your restoration designed in real-time",
      "Precise bite alignment for comfortable chewing",
      "Color-matched to blend seamlessly",
    ],
  },
  {
    name: "CEREC Primemill",
    category: "Milling Unit",
    icon: Cog,
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=400&fit=crop&q=80",
    imageAlt: "CEREC Primemill precision milling unit for same-day dental crowns Las Vegas",
    description:
      "Our in-office milling unit carves your custom restoration from a solid block of premium dental ceramic. Both wet and dry milling capabilities handle everything from delicate veneers to ultra-strong zirconia crowns.",
    highlights: [
      "Mills a crown in under 15 minutes",
      "Premium e.max and zirconia ceramic blocks",
      "Wet milling for glass ceramics and veneers",
      "Dry milling for high-strength zirconia",
    ],
  },
  {
    name: "CEREC SpeedFire",
    category: "Sintering Furnace",
    icon: Flame,
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=400&fit=crop&q=80",
    imageAlt: "CEREC SpeedFire sintering furnace for dental ceramic processing Las Vegas",
    description:
      "The smallest and fastest sintering furnace available. After milling, your restoration is fired in the SpeedFire to achieve final strength, translucency, and natural appearance — ready for bonding in minutes.",
    highlights: [
      "Processes crowns in approximately 14 minutes",
      "Crystallization brings ceramic to full strength",
      "Creates natural translucency matching real enamel",
      "Final glazing for a smooth, polished finish",
    ],
  },
];

const processSteps = [
  {
    step: 1,
    title: "Digital Scan",
    duration: "5 minutes",
    description:
      "Dr. Khachaturian scans your tooth with the Primescan camera. A detailed 3D model appears on screen instantly. No messy impressions — just a quick, comfortable scan.",
    icon: Scan,
  },
  {
    step: 2,
    title: "Custom Design",
    duration: "10 minutes",
    description:
      "Using CEREC CAD software, your restoration is designed on screen. Shape, contours, and bite are optimized. You can watch the design process in real-time.",
    icon: Monitor,
  },
  {
    step: 3,
    title: "Precision Milling",
    duration: "15 minutes",
    description:
      "The Primemill carves your restoration from a solid block of premium ceramic — matched to your exact tooth shade. The block is automatically identified and positioned for optimal results.",
    icon: Cog,
  },
  {
    step: 4,
    title: "Firing and Glazing",
    duration: "14 minutes",
    description:
      "The SpeedFire furnace sinters your restoration to full strength and natural translucency. A final glaze creates the smooth, polished surface of natural enamel.",
    icon: Flame,
  },
  {
    step: 5,
    title: "Bonding and Fit",
    duration: "15 minutes",
    description:
      "Your finished restoration is tried in, checked for fit and color, and permanently bonded. You leave with your final restoration — no temporary, no return visit.",
    icon: CheckCircle,
  },
];

const faqs = [
  {
    question: "What is CEREC technology?",
    answer:
      "CEREC stands for Chairside Economical Restoration of Esthetic Ceramics. It is an advanced CAD/CAM system that allows us to scan, design, mill, and place custom ceramic restorations in a single visit — eliminating temporaries and return appointments.",
  },
  {
    question: "What can be made with this technology?",
    answer:
      "Our CEREC system fabricates single crowns, porcelain veneers, inlays, onlays, endocrowns, and implant crowns. Small bridges can also be milled in-office. Full-arch restorations and complex multi-unit bridges are fabricated by our partner lab.",
  },
  {
    question: "Are same-day restorations as strong as lab-made ones?",
    answer:
      "Yes. CEREC restorations use the same premium ceramic materials as dental laboratories — IPS e.max lithium disilicate and zirconia. Clinical studies demonstrate equivalent longevity and strength.",
  },
  {
    question: "How long does the entire process take?",
    answer:
      "From scan to bonded restoration, the entire process takes approximately two hours. The digital scan takes about 5 minutes, design takes 10 minutes, milling takes 15 minutes, sintering takes 14 minutes, and final fitting and bonding takes 15 minutes.",
  },
  {
    question: "Is the digital scan comfortable?",
    answer:
      "Extremely comfortable. The Primescan is a small handheld camera that captures images as it passes over your teeth. No gagging, no messy material, and no waiting for impressions to set.",
  },
  {
    question: "What materials are available?",
    answer:
      "We use IPS e.max lithium disilicate for natural aesthetics and strength, zirconia for maximum durability on back teeth, and advanced composite resins for specific applications. Each material is selected based on tooth location and functional requirements.",
  },
  {
    question: "Does this cost more than traditional restorations?",
    answer:
      "No. Same-day CEREC restorations at AK Ultimate Dental are competitively priced with traditional crowns. The technology reduces lab fees and eliminates temporary materials. Insurance covers CEREC restorations the same as traditional ones.",
  },
  {
    question: "How long do CEREC restorations last?",
    answer:
      "With proper care, CEREC crowns and restorations typically last 10 to 20 years — comparable to traditional lab-fabricated restorations. Good oral hygiene and regular dental visits help maximize their lifespan.",
  },
];

export default function TechnologyPage() {
  const promotion = getServicePromotion("dental-crowns");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Technology", href: "/technology" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Promotion Banner */}
      {promotion && (
        <div className="bg-gradient-to-r from-primary to-blue-700 text-white py-4 px-4 text-center">
          <p className="text-lg font-bold">{promotion.headline}</p>
          <p className="text-sm opacity-90 mt-1">{promotion.details}</p>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24 overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&h=900&fit=crop&q=70"
            alt="Advanced dental technology equipment at AK Ultimate Dental Las Vegas"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <nav className="mb-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Technology</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">
                In-House Digital Lab
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Advanced Dental Technology at AK Ultimate Dental
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Our in-office CEREC CAD/CAM system designs, fabricates, and places
              custom dental restorations in a single visit. See the equipment
              and process that makes same-day crowns, veneers, and restorations
              possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                <Link href="/appointment">
                  Schedule a Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <a href={siteConfig.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  {siteConfig.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-white border-b py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { icon: Clock, value: "~2 Hours", label: "Total Appointment Time" },
              { icon: Sparkles, value: "1 Visit", label: "No Return Appointment" },
              { icon: Shield, value: "10-20 Yrs", label: "Restoration Longevity" },
              { icon: Scan, value: "Digital", label: "No Messy Impressions" },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Showcase with Images */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Equipment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four integrated components work together to create your permanent
              restoration while you wait.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {equipmentItems.map((item) => (
              <Card key={item.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Equipment Image */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-xs font-medium text-blue-300 uppercase tracking-wider">
                        {item.category}
                      </p>
                      <h3 className="text-xl font-bold text-white">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    <ul className="space-y-2">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Same-Day Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From scan to finished restoration in approximately two hours.
              Here is exactly what happens at each stage.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative flex gap-6 pb-10">
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200" />
                )}
                {/* Step circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Premium Ceramic Materials
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We use the same high-quality materials as top dental laboratories.
              Each material is selected for the specific needs of your tooth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">IPS e.max</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Lithium disilicate glass-ceramic
                </p>
                <p className="text-sm text-muted-foreground">
                  The gold standard for natural aesthetics. Mimics the
                  translucency and light-reflecting properties of real enamel.
                  Ideal for front teeth, veneers, and visible restorations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Zirconia</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  High-strength ceramic
                </p>
                <p className="text-sm text-muted-foreground">
                  The strongest dental ceramic available. Exceptional durability
                  for back teeth under heavy bite forces. Allows thinner
                  restorations that preserve more tooth structure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Cog className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Composite Resin</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced polymer composite
                </p>
                <p className="text-sm text-muted-foreground">
                  Versatile material for inlays, onlays, and temporary
                  restorations. Tooth-colored and biocompatible. Used when
                  specific clinical situations call for it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison: Same-Day vs Traditional */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Same-Day vs. Traditional Crowns
              </h2>
              <p className="text-lg text-muted-foreground">
                See why patients prefer our digital workflow.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional */}
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-500 mb-4">
                    Traditional Process
                  </h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      "Two separate appointments required",
                      "Messy putty impressions",
                      "Temporary crown for 2-3 weeks",
                      "Risk of temporary breaking or falling off",
                      "Second visit for permanent crown",
                      "Time off work for both appointments",
                      "Possible fit adjustments at second visit",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-gray-400 mt-0.5">&#x2717;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Same-Day */}
              <Card className="border-primary/30 bg-primary/5 ring-2 ring-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold text-primary">
                      Our Same-Day Process
                    </h3>
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Better
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {[
                      "Single two-hour appointment",
                      "Comfortable digital 3D scan",
                      "No temporary crown at all",
                      "No risk of temporary issues",
                      "Leave with permanent restoration",
                      "One visit — minimal time off work",
                      "Computer-designed precision fit",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
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
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.question}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience Same-Day Dentistry
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Schedule your visit and experience the convenience of same-day
            crowns, veneers, and restorations at AK Ultimate Dental in Las Vegas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/appointment">
                Book Your Visit
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
