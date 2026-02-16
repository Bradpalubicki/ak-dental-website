// Dental Engine Configuration
// Shared across ALL dental practices using this engine.
// Change this file to create a new engine type (counseling, chiro, etc.)

import type { EngineConfig, ServiceItem, ServicePromotion } from "./types";

export const services: ServiceItem[] = [
  // ── Core Services (enabled by default) ──────────────────────────
  {
    title: "Cleanings & Prevention",
    slug: "cleanings-prevention",
    description: "Comprehensive dental exams, cleanings, and preventive care to maintain optimal oral health.",
    icon: "Shield",
    featured: true,
  },
  {
    title: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    description: "Transform your smile with teeth whitening, porcelain veneers, and CEREC same-day restorations.",
    icon: "Sparkles",
    featured: true,
  },
  {
    title: "Dental Implants",
    slug: "dental-implants",
    description: "Permanent tooth replacement solutions that look, feel, and function like natural teeth.",
    icon: "CircleDot",
    featured: true,
  },
  {
    title: "Crowns & Bridges",
    slug: "crowns-bridges",
    description: "Restore damaged or missing teeth with custom-crafted crowns and bridges.",
    icon: "Crown",
    featured: true,
  },
  {
    title: "Root Canal Therapy",
    slug: "root-canal",
    description: "Pain-free endodontic treatment to save infected teeth and relieve discomfort.",
    icon: "Heart",
    featured: true,
  },
  {
    title: "Oral Surgery",
    slug: "oral-surgery",
    description: "Expert tooth extractions, bone grafting, and surgical procedures.",
    icon: "Scissors",
    featured: true,
  },
  {
    title: "Periodontics",
    slug: "periodontics",
    description: "Diagnosis and treatment of gum disease to protect your oral health foundation.",
    icon: "Leaf",
    featured: false,
  },
  {
    title: "Orthodontics",
    slug: "orthodontics",
    description: "Straighten your smile with SureSmile and modern orthodontic solutions.",
    icon: "AlignCenter",
    featured: false,
  },
  {
    title: "Pediatric Dentistry",
    slug: "pediatric-dentistry",
    description: "Gentle, kid-friendly dental care for patients ages 6 and up.",
    icon: "Baby",
    featured: false,
  },

  // ── Standalone Procedure Pages (SEO power pages) ───────────────
  {
    title: "Porcelain Veneers",
    slug: "porcelain-veneers",
    description: "Custom porcelain veneers that transform your smile in as few as two visits. Natural-looking, stain-resistant, and long-lasting.",
    icon: "Sparkles",
    featured: true,
    // preview: true,
  },
  {
    title: "Dental Crowns",
    slug: "dental-crowns",
    description: "Restore damaged teeth with precision-crafted dental crowns. Same-day CEREC options available for your convenience.",
    icon: "Crown",
    featured: true,
    // preview: true,
  },
  {
    title: "Dental Bridges",
    slug: "dental-bridges",
    description: "Replace missing teeth with custom dental bridges that restore your smile, bite, and confidence.",
    icon: "Crown",
    featured: false,
    // preview: true,
  },

  // ── Location Variant Pages (local SEO dominance) ───────────────
  {
    title: "Porcelain Veneers Las Vegas",
    slug: "porcelain-veneers-las-vegas",
    description: "Premium porcelain veneers in Las Vegas, NV. Custom smile transformations by Dr. Alex Khachaturian at AK Ultimate Dental.",
    icon: "Sparkles",
    featured: false,
    // preview: true,
    location: "Las Vegas",
    parentSlug: "porcelain-veneers",
  },
  {
    title: "Porcelain Veneers Henderson",
    slug: "porcelain-veneers-henderson",
    description: "Porcelain veneers near Henderson, NV. Serving Henderson patients with custom cosmetic dentistry at AK Ultimate Dental.",
    icon: "Sparkles",
    featured: false,
    // preview: true,
    location: "Henderson",
    parentSlug: "porcelain-veneers",
  },
  {
    title: "Dental Crowns Las Vegas",
    slug: "dental-crowns-las-vegas",
    description: "Same-day dental crowns in Las Vegas, NV. CEREC technology for permanent crowns in one visit at AK Ultimate Dental.",
    icon: "Crown",
    featured: false,
    // preview: true,
    location: "Las Vegas",
    parentSlug: "dental-crowns",
  },
  {
    title: "Dental Crowns Henderson",
    slug: "dental-crowns-henderson",
    description: "Dental crowns near Henderson, NV. Same-day CEREC crowns and custom restorations at AK Ultimate Dental.",
    icon: "Crown",
    featured: false,
    // preview: true,
    location: "Henderson",
    parentSlug: "dental-crowns",
  },
  {
    title: "Dental Bridges Las Vegas",
    slug: "dental-bridges-las-vegas",
    description: "Custom dental bridges in Las Vegas, NV. Replace missing teeth and restore your smile at AK Ultimate Dental.",
    icon: "Crown",
    featured: false,
    // preview: true,
    location: "Las Vegas",
    parentSlug: "dental-bridges",
  },
  {
    title: "Dental Bridges Henderson",
    slug: "dental-bridges-henderson",
    description: "Dental bridges near Henderson, NV. Expert tooth replacement solutions at AK Ultimate Dental.",
    icon: "Crown",
    featured: false,
    // preview: true,
    location: "Henderson",
    parentSlug: "dental-bridges",
  },

  // ── Technology Page ────────────────────────────────────────────
  {
    title: "Same-Day Dentistry",
    slug: "same-day-dentistry",
    description: "Get your permanent crown, veneer, or restoration in a single visit with our advanced CEREC and CAD/CAM technology.",
    icon: "Sparkles",
    featured: false,
    // preview: true,
  },
];

/** Active promotions for service pages */
export const servicePromotions: ServicePromotion[] = [
  {
    serviceSlugs: [
      "porcelain-veneers", "porcelain-veneers-las-vegas", "porcelain-veneers-henderson",
      "dental-crowns", "dental-crowns-las-vegas", "dental-crowns-henderson",
      "dental-bridges", "dental-bridges-las-vegas", "dental-bridges-henderson",
      "crowns-bridges",
    ],
    headline: "Special Offer on Veneers, Crowns & Bridges",
    details: "Ask about our dental discount program for veneers, crowns, and bridges. Flexible financing available with payments as low as $99/month.",
    discount: "Call for Special Pricing",
    active: true,
  },
];

/** Helper: Get services visible in public navigation/listings */
export function getPublicServices(): ServiceItem[] {
  return services.filter((s) => s.enabled !== false && !s.preview && !s.parentSlug);
}

/** Helper: Get all renderable services (including preview, excluding disabled) */
export function getAllRenderableServices(): ServiceItem[] {
  return services.filter((s) => s.enabled !== false);
}

/** Helper: Get promotion for a service slug */
export function getServicePromotion(slug: string): ServicePromotion | undefined {
  return servicePromotions.find((p) => p.active && p.serviceSlugs.includes(slug));
}

export const serviceImages: Record<string, string> = {
  "cleanings-prevention": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop&q=80",
  "cosmetic-dentistry": "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=800&h=600&fit=crop&q=80",
  "dental-implants": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80",
  "crowns-bridges": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=600&fit=crop&q=80",
  "root-canal": "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=600&fit=crop&q=80",
  "oral-surgery": "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=800&h=600&fit=crop&q=80",
  "periodontics": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&q=80",
  "orthodontics": "https://images.unsplash.com/photo-1629909613807-0f474baa822b?w=800&h=600&fit=crop&q=80",
  "pediatric-dentistry": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop&q=80",
  // Standalone procedure pages — distinct images per procedure
  "porcelain-veneers": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80",
  "dental-crowns": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80",
  "dental-bridges": "https://images.unsplash.com/photo-1603807008857-ad66b70431aa?w=800&h=600&fit=crop&q=80",
  // Location variants share parent hero image
  "porcelain-veneers-las-vegas": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80",
  "porcelain-veneers-henderson": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80",
  "dental-crowns-las-vegas": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80",
  "dental-crowns-henderson": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80",
  "dental-bridges-las-vegas": "https://images.unsplash.com/photo-1603807008857-ad66b70431aa?w=800&h=600&fit=crop&q=80",
  "dental-bridges-henderson": "https://images.unsplash.com/photo-1603807008857-ad66b70431aa?w=800&h=600&fit=crop&q=80",
  "same-day-dentistry": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=600&fit=crop&q=80",
};

/** Secondary images displayed inline within service page content */
export const serviceContentImages: Record<string, string> = {
  "porcelain-veneers": "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=800&h=500&fit=crop&q=80",
  "dental-crowns": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=500&fit=crop&q=80",
  "dental-bridges": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop&q=80",
  "porcelain-veneers-las-vegas": "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=800&h=500&fit=crop&q=80",
  "porcelain-veneers-henderson": "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=800&h=500&fit=crop&q=80",
  "dental-crowns-las-vegas": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=500&fit=crop&q=80",
  "dental-crowns-henderson": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=500&fit=crop&q=80",
  "dental-bridges-las-vegas": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop&q=80",
  "dental-bridges-henderson": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop&q=80",
  "same-day-dentistry": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=500&fit=crop&q=80",
  "crowns-bridges": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=500&fit=crop&q=80",
  "cleanings-prevention": "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=500&fit=crop&q=80",
  "cosmetic-dentistry": "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=800&h=500&fit=crop&q=80",
  "dental-implants": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=500&fit=crop&q=80",
  "root-canal": "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=800&h=500&fit=crop&q=80",
  "oral-surgery": "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=500&fit=crop&q=80",
  "periodontics": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=500&fit=crop&q=80",
  "orthodontics": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop&q=80",
  "pediatric-dentistry": "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=800&h=500&fit=crop&q=80",
};

export const engineConfig: EngineConfig = {
  engineType: "dental",
  engineLabel: "Dental Engine",
  dashboardHomeName: "Dashboard",

  schemaType: "Dentist",
  medicalSpecialties: [
    "General Dentistry",
    "Cosmetic Dentistry",
    "Dental Implants",
    "Orthodontics",
  ],

  services,
  serviceImages,

  terminology: {
    customer: "patient",
    customerPlural: "patients",
    provider: "dentist",
    providerPlural: "dentists",
    visit: "appointment",
    visitPlural: "appointments",
    treatment: "procedure",
    treatmentPlural: "procedures",
    facility: "office",
  },

  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Technology", href: "/technology" },
      { name: "Reviews", href: "/reviews" },
      { name: "Contact", href: "/contact" },
    ],
    ctaLabel: "Request Appointment",
    ctaHref: "/appointment",
  },
};
