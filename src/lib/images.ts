// Backward-compatible re-exports from the new config structure.
// All imports from "@/lib/images" continue to work unchanged.
// New code should import from "@/config" directly.

import { practiceConfig, serviceImages } from "@/config";

// Re-export practice images in the old format for backward compatibility
export const images = {
  hero: {
    main: practiceConfig.images.hero.main,
    dentist: practiceConfig.team[0]?.image ?? practiceConfig.images.team.primary,
    office: practiceConfig.images.hero.office,
    reception: practiceConfig.images.hero.reception ?? practiceConfig.images.hero.office,
  },
  team: {
    doctor: practiceConfig.images.team.primary,
    dentistWorking: practiceConfig.images.team.secondary ?? practiceConfig.images.team.primary,
    teamGroup: practiceConfig.images.team.group ?? practiceConfig.images.team.primary,
    consultation: practiceConfig.images.team.consultation ?? practiceConfig.images.patients.smile,
    graduation: practiceConfig.images.team.secondary ?? practiceConfig.images.team.primary,
    family: practiceConfig.images.team.group ?? practiceConfig.images.team.primary,
  },
  patients: {
    smile: practiceConfig.images.patients.smile,
    happy: practiceConfig.images.patients.happy ?? practiceConfig.images.patients.smile,
    family: practiceConfig.images.patients.family ?? practiceConfig.images.patients.smile,
  },
  services: serviceImages,
  technology: {
    equipment: practiceConfig.images.backgrounds.office,
    xray: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80",
    modern: practiceConfig.images.backgrounds.office,
    chair: practiceConfig.images.backgrounds.office,
  },
  location: {
    cityscape: practiceConfig.images.location?.cityscape ?? practiceConfig.images.hero.main,
    neighborhood: practiceConfig.images.location?.neighborhood ?? practiceConfig.images.hero.main,
  },
  // Backward compat: old pages reference images.lasVegas
  lasVegas: {
    skyline: practiceConfig.images.location?.cityscape ?? practiceConfig.images.hero.main,
    strip: practiceConfig.images.location?.cityscape ?? practiceConfig.images.hero.main,
    sign: practiceConfig.images.location?.cityscape ?? practiceConfig.images.hero.main,
    downtown: practiceConfig.images.location?.cityscape ?? practiceConfig.images.hero.main,
    neighborhood: practiceConfig.images.location?.neighborhood ?? practiceConfig.images.hero.main,
  },
  backgrounds: {
    dental: practiceConfig.images.backgrounds.office,
    abstract: practiceConfig.images.backgrounds.abstract ?? practiceConfig.images.backgrounds.office,
    clean: practiceConfig.images.backgrounds.office,
  },
};

// Re-export service images mapping
export { serviceImages };
