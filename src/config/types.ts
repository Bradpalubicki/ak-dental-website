// Dental Engine - Configuration Types
// These types define the contract for any dental practice using this engine.

export interface PracticeConfig {
  // Core identity
  name: string;
  slug: string;
  description: string;
  url: string;
  phone: string;
  phoneHref: string;
  email: string;

  // Location
  address: {
    street: string;
    city: string;
    state: string;
    stateAbbr: string;
    zip: string;
    full: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  mapEmbedUrl: string;
  serviceAreas: string[];

  // Schedule
  hours: Record<string, string>;

  // Social
  social: {
    facebook?: string;
    yelp?: string;
    google?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };

  // Team
  team: TeamMember[];

  // Branding
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headerLogo: string;
    footerLogo: string;
    favicon?: string;
  };

  // Images
  images: PracticeImages;

  // Content
  testimonials: Testimonial[];
  stats: Stat[];

  // SEO
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    keywords: string[];
    ogImage?: string;
  };

  // Ratings
  ratings: {
    average: string;
    count: string;
    googleReviewUrl?: string;
  };
}

export interface TeamMember {
  name: string;
  title: string;
  credentials: string;
  experience: string;
  bio: string;
  image: string;
  specialties?: string[];
  badges?: string[];
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

export interface Stat {
  value: string;
  label: string;
}

export interface PracticeImages {
  hero: {
    main: string;
    office: string;
    reception?: string;
  };
  team: {
    primary: string;
    secondary?: string;
    group?: string;
    consultation?: string;
    graduation?: string;
  };
  patients: {
    smile: string;
    happy?: string;
    family?: string;
  };
  location?: {
    exterior?: string;
    neighborhood?: string;
    cityscape?: string;
  };
  office?: {
    examRoom?: string;
  };
  backgrounds: {
    office: string;
    abstract?: string;
  };
}

export interface EngineConfig {
  // Engine identity
  engineType: "dental" | "stylist" | "counseling" | "chiro" | "vet" | "privatepay-medical" | "home-services";
  engineLabel: string;

  // Schema.org type
  schemaType: string;
  medicalSpecialties: string[];

  // Services
  services: ServiceItem[];

  // Service images (mapped by slug)
  serviceImages: Record<string, string>;

  // Terminology
  terminology: {
    customer: string;         // "patient" for dental
    customerPlural: string;   // "patients"
    provider: string;         // "dentist"
    providerPlural: string;   // "dentists"
    visit: string;            // "appointment"
    visitPlural: string;      // "appointments"
    treatment: string;        // "procedure"
    treatmentPlural: string;  // "procedures"
    facility: string;         // "office" or "practice"
  };

  // Navigation
  navigation: {
    main: NavItem[];
    ctaLabel: string;
    ctaHref: string;
  };
}

export interface ServiceItem {
  title: string;
  slug: string;
  description: string;
  icon: string;
  featured: boolean;
  image?: string;
}

export interface NavItem {
  name: string;
  href: string;
}

// Combined config that pages use
export interface SiteConfig extends PracticeConfig {
  engine: EngineConfig;
}
