import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    const redirectMap = [
      // Main pages
      ["/welcome", "/"],
      ["/our-practice", "/about"],
      ["/our-practice/meet-the-doctor", "/about"],
      ["/our-practice/office-tour", "/about"],
      ["/our-practice/before-and-afters", "/reviews"],
      ["/our-practice/blog", "/blog"],
      ["/patient-information", "/patient-portal"],
      ["/patient-information/patient-forms", "/patient-portal"],
      ["/patient-information/dental-videos", "/technology"],
      ["/appointment-request", "/appointment"],
      ["/leave-a-review", "/reviews"],
      ["/leave-a-review-/testimonials", "/reviews"],

      // Procedures hub
      ["/procedures", "/services"],

      // Cleanings & Prevention
      ["/procedures/cleanings-prevention", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/dental-exams-cleanings", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/digital-radiographs", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/intraoral-cameras", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/diagnodent", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/dental-x-rays", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/digital-x-rays", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/sealants", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/fluoride-treatment", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/i-cat-3d-imaging", "/technology"],
      ["/procedures/cleanings-prevention/oral-cancer-exam", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/oral-hygiene-aids", "/services/cleanings-prevention"],
      ["/procedures/cleanings-prevention/panoramic-x-rays", "/services/cleanings-prevention"],

      // Cosmetic
      ["/procedures/cosmetic-dentistry", "/services/cosmetic-dentistry"],
      ["/procedures/cosmetic-dentistry/teeth-whitening", "/services/cosmetic-dentistry"],
      ["/procedures/cosmetic-dentistry/composite-fillings", "/services/cosmetic-dentistry"],
      ["/procedures/cosmetic-dentistry/porcelain-veneers", "/services/porcelain-veneers"],
      ["/procedures/cosmetic-dentistry/cerec", "/services/same-day-dentistry"],
      ["/procedures/cosmetic-dentistry/porcelain-inlays", "/services/cosmetic-dentistry"],
      ["/procedures/cosmetic-dentistry/porcelain-onlays", "/services/cosmetic-dentistry"],

      // Restorations
      ["/procedures/restorations", "/services/crowns-bridges"],
      ["/procedures/restorations/amalgam-fillings", "/services/crowns-bridges"],
      ["/procedures/restorations/crowns-bridges", "/services/crowns-bridges"],
      ["/procedures/restorations/dental-implants", "/services/dental-implants"],
      ["/procedures/restorations/dentures-partial-dentures", "/services/crowns-bridges"],

      // Endodontics
      ["/procedures/endodontics", "/services/root-canal"],
      ["/procedures/endodontics/root-canal-therapy", "/services/root-canal"],

      // Oral Surgery
      ["/procedures/oral-maxillofacial-surgery", "/services/oral-surgery"],
      ["/procedures/oral-maxillofacial-surgery/tooth-extractions", "/services/oral-surgery"],
      ["/procedures/oral-maxillofacial-surgery/bone-grafting", "/services/oral-surgery"],
      ["/procedures/oral-maxillofacial-surgery/sleep-apnea", "/services/oral-surgery"],

      // Periodontal
      ["/procedures/periodontal-disease", "/services/periodontics"],
      ["/procedures/periodontal-disease/diagnosis", "/services/periodontics"],
      ["/procedures/periodontal-disease/treatment", "/services/periodontics"],
      ["/procedures/periodontal-disease/maintenance", "/services/periodontics"],
      ["/procedures/periodontal-disease/causes-of-periodontal-disease", "/services/periodontics"],
      ["/procedures/periodontal-disease/types-of-periodontal-disease", "/services/periodontics"],
      ["/procedures/periodontal-disease/signs-symptoms-of-periodontal-disease", "/services/periodontics"],
      ["/procedures/periodontics", "/services/periodontics"],
      ["/procedures/periodontics/when-to-see-a-periodontist", "/services/periodontics"],
      ["/procedures/periodontics/antibiotic-treatment", "/services/periodontics"],
      ["/procedures/periodontics/bone-grafting", "/services/oral-surgery"],
      ["/procedures/periodontics/bruxism", "/services/periodontics"],
      ["/procedures/periodontics/crown-lengthening", "/services/periodontics"],
      ["/procedures/periodontics/prophylaxis-teeth-cleaning", "/services/cleanings-prevention"],

      // Orthodontics
      ["/procedures/orthodontics", "/services/orthodontics"],
      ["/procedures/orthodontics/suresmile", "/services/orthodontics"],
      ["/procedures/orthodontics/care-during-orthodontic-treatment", "/services/orthodontics"],
      ["/procedures/orthodontics/when-should-my-child-get-an-orthodontic-evaluation", "/services/orthodontics"],
      ["/procedures/orthodontics/what-does-orthodontic-treatment-involve", "/services/orthodontics"],
      ["/procedures/orthodontics/types-of-braces", "/services/orthodontics"],
      ["/procedures/orthodontics/orthodontic-treatment-phases", "/services/orthodontics"],
      ["/procedures/orthodontics/orthodontic-exams", "/services/orthodontics"],
      ["/procedures/orthodontics/orthodontic-conditions", "/services/orthodontics"],
      ["/procedures/orthodontics/orthodontic-appliances", "/services/orthodontics"],
      ["/procedures/orthodontics/is-it-ever-too-late-to-get-braces", "/services/orthodontics"],
      ["/procedures/orthodontics/repositioning-teeth-with-orthodontic-appliances", "/services/orthodontics"],
      ["/procedures/orthodontics/does-my-child-need-early-orthodontics", "/services/orthodontics"],
      ["/procedures/orthodontics/brushing-and-flossing-with-braces", "/services/orthodontics"],
      ["/procedures/orthodontics/what-is-a-malocclusion", "/services/orthodontics"],
      ["/procedures/orthodontics/care-following-orthodontics-retainers", "/services/orthodontics"],
      ["/procedures/orthodontics/why-straighten-teeth", "/services/orthodontics"],

      // Laser
      ["/procedures/laser-dentistry", "/technology"],
      ["/procedures/laser-dentistry/biolase-waterlase", "/technology"],

      // Dental Anxiety
      ["/procedures/dental-anxiety-and-fear", "/faqs"],

      // Pediatric
      ["/procedures/pediatric-dentistry", "/services/pediatric-dentistry"],
      ["/procedures/pediatric-dentistry/care-for-your-childs-teeth", "/services/pediatric-dentistry"],
      ["/procedures/pediatric-dentistry/fluoride", "/services/pediatric-dentistry"],
      ["/procedures/pediatric-dentistry/good-diet", "/services/pediatric-dentistry"],
      ["/procedures/pediatric-dentistry/how-often-should-children-have-dental-checkups", "/services/pediatric-dentistry"],
      ["/procedures/pediatric-dentistry/how-to-prevent-cavities", "/services/pediatric-dentistry"],
      ["/procedures/pediatric-dentistry/sealing-out-tooth-decay", "/services/pediatric-dentistry"],
      ["/procedures/pediatric-dentistry/why-see-a-pediatric-dentist", "/services/pediatric-dentistry"],

      // Prosthodontics
      ["/procedures/prosthodontics", "/services/crowns-bridges"],

      // Emergencies
      ["/procedures/dental-emergencies", "/services/oral-surgery"],

      // Surgical Instructions
      ["/procedures/surgical-instructions", "/faqs"],
      ["/procedures/surgical-instructions/after-tooth-extractions", "/faqs"],
      ["/procedures/surgical-instructions/after-dental-implant-surgery", "/faqs"],

      // Blog posts
      ["/our-practice/blog/what-happens-if-you-don-t-replace-a-missing-tooth", "/blog/dental-implants-las-vegas-complete-guide"],
      ["/our-practice/blog/2026/2/18/the-importance-of-jawbone-density-in-oral-surgery-planning", "/blog/tooth-extraction-las-vegas-what-to-expect"],
      ["/our-practice/blog/2026/1/7/the-most-common-preventable-dental-problems", "/blog/how-often-should-you-see-dentist"],
      ["/our-practice/blog/teeth-whitening-options", "/blog/teeth-whitening-las-vegas-professional-vs-otc"],
      ["/our-practice/blog/dental-implants", "/blog/dental-implants-las-vegas-complete-guide"],
      ["/our-practice/blog/cosmetic-dentistry", "/blog/cosmetic-dentistry-las-vegas-options"],
    ];

    return redirectMap.flatMap(([source, destination]) => [
      { source, destination, permanent: true },
      { source: `${source}/`, destination, permanent: true },
    ]);
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
