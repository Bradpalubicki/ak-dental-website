// Backward-compatible re-exports from the new config structure.
// All imports from "@/lib/config" continue to work unchanged.
// New code should import from "@/config" directly.

export {
  siteConfig,
  services,
  serviceImages,
  serviceContentImages,
  servicePromotions,
  getPublicServices,
  getAllRenderableServices,
  getServicePromotion,
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
  ServicePromotion,
  TeamMember,
  Testimonial,
  Stat,
  NavItem,
} from "@/config";
