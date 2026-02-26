// Dental Engine - Configuration Entry Point
// Import from here: import { siteConfig, services, ... } from "@/config";

import { practiceConfig } from "./practice";
import { engineConfig, getPublicServices } from "./engine";
import type { SiteConfig } from "./types";

// Combined site config (practice + engine)
export const siteConfig: SiteConfig = {
  ...practiceConfig,
  engine: engineConfig,
};

// Re-export for convenience
export { practiceConfig } from "./practice";
export {
  engineConfig,
  services,
  serviceImages,
  serviceContentImages,
  servicePromotions,
  getPublicServices,
  getAllRenderableServices,
  getServicePromotion,
} from "./engine";
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
  PracticeImages,
} from "./types";

// Backward-compatible exports
export const testimonials = practiceConfig.testimonials;

export const navigation = {
  main: engineConfig.navigation.main,
  services: getPublicServices().map((s) => ({ name: s.title, href: `/services/${s.slug}` })),
};

// Helper to get the primary team member (for pages that show "the doctor")
export function getPrimaryProvider() {
  return practiceConfig.team[0];
}

// Helper to get practice images with fallbacks
export function getImage(
  category: keyof typeof practiceConfig.images,
  key: string
): string {
  const cat = practiceConfig.images[category] as Record<string, string> | undefined;
  if (cat && key in cat) return cat[key];
  return practiceConfig.images.backgrounds.office;
}

// ─── Vertical Config System ─────────────────────────────────────────────────
// Used by clinical-notes, scheduling, and PMS layer
export { getVerticalConfig, dentalVertical } from "./verticals";
export type {
  VerticalConfig,
  VerticalType,
  VerticalTerminology,
  NoteType,
  NoteSection,
  NoteTemplate,
  SchedulingConfig,
  ComplianceConfig,
  AssessmentConfig,
  AiPromptConfig,
  InsuranceConfig,
  SmsTemplateConfig,
  DashboardNavItem,
  NavigationConfig,
  RoleConfig,
  ServiceCategory,
} from "./vertical";
