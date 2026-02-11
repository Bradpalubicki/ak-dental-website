// Dental Engine Configuration
// Shared across ALL dental practices using this engine.
// Change this file to create a new engine type (counseling, chiro, etc.)

import type { EngineConfig, ServiceItem } from "./types";

export const services: ServiceItem[] = [
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
];

export const serviceImages: Record<string, string> = {
  "cleanings-prevention": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop&q=80",
  "cosmetic-dentistry": "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=800&h=600&fit=crop&q=80",
  "dental-implants": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80",
  "crowns-bridges": "https://images.unsplash.com/photo-1603533800204-f584e03d9878?w=800&h=600&fit=crop&q=80",
  "root-canal": "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=600&fit=crop&q=80",
  "oral-surgery": "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=800&h=600&fit=crop&q=80",
  "periodontics": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&q=80",
  "orthodontics": "https://images.unsplash.com/photo-1629909613807-0f474baa822b?w=800&h=600&fit=crop&q=80",
  "pediatric-dentistry": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop&q=80",
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
      { name: "Reviews", href: "/reviews" },
      { name: "Contact", href: "/contact" },
    ],
    ctaLabel: "Request Appointment",
    ctaHref: "/appointment",
  },
};
