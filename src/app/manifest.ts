import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AK Ultimate Dental",
    short_name: "AK Dental",
    description: "Las Vegas dentist — cosmetic, implants, and general dentistry by Dr. Alex Chireau",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0891b2",
    icons: [
      {
        src: "/ak-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/ak-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
