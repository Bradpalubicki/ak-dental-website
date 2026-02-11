// AK Ultimate Dental - Practice Configuration
// This is the ONLY file that changes per client.
// To onboard a new dental practice: copy this file, update values, swap images.

import type { PracticeConfig } from "./types";

export const practiceConfig: PracticeConfig = {
  // Core identity
  name: "AK Ultimate Dental",
  slug: "ak-ultimate-dental",
  description:
    "Comprehensive general and cosmetic dentistry in Las Vegas, NV. Our team provides personalized dental care using advanced technology.",
  url: "https://www.akultimatedental.com",
  phone: "(702) 935-4395",
  phoneHref: "tel:+17029354395",
  email: "dr.alex@akultimatedental.com",

  // Location
  address: {
    street: "7480 West Sahara Avenue",
    city: "Las Vegas",
    state: "Nevada",
    stateAbbr: "NV",
    zip: "89117",
    full: "7480 West Sahara Avenue, Las Vegas, NV 89117",
  },
  geo: {
    latitude: 36.1447,
    longitude: -115.2847,
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.5!2d-115.284!3d36.144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c0f9b8c8f9b9%3A0x0!2s7480%20W%20Sahara%20Ave%2C%20Las%20Vegas%2C%20NV%2089117!5e0!3m2!1sen!2sus!4v1234567890",
  serviceAreas: [
    "Summerlin",
    "Spring Valley",
    "The Lakes",
    "Desert Shores",
    "Peccole Ranch",
    "Canyon Gate",
    "Downtown Las Vegas",
    "Henderson",
    "Green Valley",
    "Centennial Hills",
    "Aliante",
    "North Las Vegas",
  ],

  // Schedule
  hours: {
    monday: "8:00 AM - 5:00 PM",
    tuesday: "8:00 AM - 5:00 PM",
    wednesday: "8:00 AM - 5:00 PM",
    thursday: "8:00 AM - 5:00 PM",
    friday: "Closed",
    saturday: "Closed",
    sunday: "Closed",
  },

  // Social
  social: {
    facebook: "https://www.facebook.com/chireu.alexandru/",
    yelp: "https://www.yelp.com/biz/ak-ultimate-dental-las-vegas",
    google: "https://share.google/y4QOijKzxJN97403L",
  },

  // Team
  team: [
    {
      name: "Our Dental Team",
      title: "Doctor of Dental Surgery",
      credentials: "DDS",
      experience: "Years of dental education and hands-on experience",
      bio: "With over a decade of comprehensive dental education spanning both European and American methodologies, our dental team brings a unique perspective to modern dentistry—combining precision, artistry, and genuine compassion for every patient.",
      image: "/dr-alex-headshot.jpg",
      specialties: [
        "General Dentistry",
        "Cosmetic Dentistry",
        "Dental Implants",
        "CEREC Same-Day Crowns",
      ],
      badges: [
        "DDS Certified",
        "10+ Years Experience",
        "European & American Training",
      ],
    },
  ],

  // Branding
  branding: {
    primaryColor: "#0891b2", // cyan-600
    secondaryColor: "#2563eb", // blue-600
    accentColor: "#06b6d4", // cyan-500
    headerLogo: "/ak-logo-header.png",
    footerLogo: "/ak-logo-footer.png",
  },

  // Images
  images: {
    hero: {
      main: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&h=1080&fit=crop&q=90",
      office:
        "https://images.unsplash.com/photo-1629909615850-30d5d9d04282?w=1920&h=1080&fit=crop&q=90",
      reception: "/office-modern.png",
    },
    team: {
      primary: "/dr-alex-headshot.jpg",
      secondary: "/dr-alex-family.jpg",
      group: "/dr-alex-family.jpg",
      consultation:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80",
      graduation: "/dr-alex-graduation-unlv.jpg",
    },
    patients: {
      smile:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop&q=80",
      happy:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80",
      family:
        "https://images.unsplash.com/photo-1581579439002-efa0a1e3b426?w=800&h=600&fit=crop&q=80",
    },
    location: {
      cityscape:
        "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=1200&h=600&fit=crop&q=80",
      neighborhood:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80",
    },
    office: {
      examRoom: "/exam-room.webp",
    },
    backgrounds: {
      office: "/office-modern.png",
      abstract:
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&q=80",
    },
  },

  // Testimonials
  testimonials: [
    {
      name: "Carey K.",
      text: "Dr. Miller has been my dentist for over 20 years. The care and attention to detail is exceptional. The entire staff makes you feel like family.",
      rating: 5,
    },
    {
      name: "Jacqui C.",
      text: "I've been going to this practice for 15 years. They always take the time to explain procedures and make sure I'm comfortable.",
      rating: 5,
    },
    {
      name: "Norm K.",
      text: "Best dental experience I've ever had. Professional, thorough, and genuinely caring about their patients' well-being.",
      rating: 5,
    },
    {
      name: "Cynthia C.",
      text: "The technology they use is impressive - digital x-rays, same-day crowns. It's like stepping into the future of dentistry.",
      rating: 5,
    },
    {
      name: "Penny C.",
      text: "I was terrified of dentists until I found this practice. They took the time to address my fears and now I actually look forward to my visits.",
      rating: 5,
    },
    {
      name: "Nick P.",
      text: "Excellent work on my dental implant. The procedure was smooth and the results are amazing. Highly recommend!",
      rating: 5,
    },
    {
      name: "Janelle J.",
      text: "From the front desk to the dental chair, everyone here is professional and friendly. They truly care about their patients.",
      rating: 5,
    },
    {
      name: "Robert M.",
      text: "I've recommended this practice to all my friends and family. Quality dental care with a personal touch.",
      rating: 5,
    },
  ],

  // Stats (shown on homepage)
  stats: [
    { value: "128", label: "Five-Star Reviews" },
    { value: "5.0", label: "Google Rating" },
    { value: "20+", label: "Years Serving LV" },
  ],

  // SEO
  seo: {
    titleTemplate: `%s | AK Ultimate Dental`,
    defaultTitle: "AK Ultimate Dental | Dentist in Las Vegas, NV",
    keywords: [
      "dentist Las Vegas",
      "Las Vegas dentist",
      "dental implants Las Vegas",
      "cosmetic dentistry Las Vegas",
      "teeth whitening Las Vegas",
      "family dentist Las Vegas",
      "emergency dentist Las Vegas",
      "dental care Las Vegas NV",
    ],
  },

  // Ratings
  ratings: {
    average: "5.0",
    count: "128",
    googleReviewUrl: "https://share.google/y4QOijKzxJN97403L",
  },
};
