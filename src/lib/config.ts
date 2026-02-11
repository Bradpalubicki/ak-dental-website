// Backward-compatible re-exports from the new config structure.
// All imports from "@/lib/config" continue to work unchanged.
// New code should import from "@/config" directly.

export {
  siteConfig,
  services,
  serviceImages,
  testimonials,
  navigation,
  practiceConfig,
  engineConfig,
  getPrimaryProvider,
  getImage,
} from "@/config";

export type {
  PracticeConfig,
  EngineConfig,
  SiteConfig,
  ServiceItem,
  TeamMember,
  Testimonial,
  Stat,
  NavItem,
} from "@/config";
