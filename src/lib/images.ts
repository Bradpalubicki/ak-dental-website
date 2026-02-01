// Curated Unsplash images for AK Ultimate Dental
// Using direct Unsplash URLs with optimization parameters

export const images = {
  // Hero and main images
  hero: {
    main: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=800&fit=crop&q=80",
    dentist: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop&q=80",
    office: "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1200&h=800&fit=crop&q=80",
    reception: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=800&fit=crop&q=80",
  },

  // Team and doctor images
  team: {
    doctor: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=800&fit=crop&q=80",
    dentistWorking: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80",
    teamGroup: "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1000&h=600&fit=crop&q=80",
    consultation: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop&q=80",
  },

  // Patient experience
  patients: {
    smile: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop&q=80",
    happy: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80",
    family: "https://images.unsplash.com/photo-1581579439002-efa0a1e3b426?w=800&h=600&fit=crop&q=80",
    woman: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=600&h=800&fit=crop&q=80",
    man: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80",
  },

  // Services
  services: {
    cleaning: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80",
    cosmetic: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop&q=80",
    implants: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80",
    crowns: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=600&fit=crop&q=80",
    rootCanal: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop&q=80",
    surgery: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=800&h=600&fit=crop&q=80",
    periodontics: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80",
    orthodontics: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop&q=80",
    pediatric: "https://images.unsplash.com/photo-1581579439002-efa0a1e3b426?w=800&h=600&fit=crop&q=80",
  },

  // Technology and equipment
  technology: {
    equipment: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=80",
    xray: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80",
    modern: "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&h=600&fit=crop&q=80",
    chair: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=80",
  },

  // Las Vegas specific
  lasVegas: {
    skyline: "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=1200&h=600&fit=crop&q=80",
    strip: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=1200&h=600&fit=crop&q=80",
    sign: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop&q=80",
    downtown: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&q=80",
    neighborhood: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80",
  },

  // Backgrounds and patterns
  backgrounds: {
    dental: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&h=1080&fit=crop&q=80",
    abstract: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&q=80",
    clean: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&h=1080&fit=crop&q=80",
  },
};

// Service slug to image mapping
export const serviceImages: Record<string, string> = {
  "cleanings-prevention": images.services.cleaning,
  "cosmetic-dentistry": images.services.cosmetic,
  "dental-implants": images.services.implants,
  "crowns-bridges": images.services.crowns,
  "root-canal": images.services.rootCanal,
  "oral-surgery": images.services.surgery,
  "periodontics": images.services.periodontics,
  "orthodontics": images.services.orthodontics,
  "pediatric-dentistry": images.services.pediatric,
};
