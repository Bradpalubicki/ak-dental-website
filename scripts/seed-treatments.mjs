// Seed treatment plans for demo - run with: node scripts/seed-treatments.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const idx = line.indexOf("=");
  if (idx > 0 && !line.startsWith("#")) {
    env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
  }
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  console.log("Clearing existing treatment plans...");
  await supabase.from("oe_treatment_plans").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const plans = [
    {
      id: "c0000001-0000-0000-0000-000000000001",
      patient_id: "a0000001-0000-0000-0000-000000000006", // Michael Kim
      provider_name: "Dr. Alex",
      title: "Crown Restoration - Tooth #14",
      status: "presented",
      procedures: [
        { name: "Porcelain Crown", code: "D2740", cost: 1200, description: "Full porcelain crown to restore cracked molar. Custom-matched to your natural tooth color for a seamless look.", category: "Major Restorative" },
        { name: "Core Buildup", code: "D2950", cost: 350, description: "Foundation buildup to support the new crown. Ensures long-term stability and a proper fit.", category: "Major Restorative" },
        { name: "Local Anesthesia", code: "D9210", cost: 0, description: "Numbing for your comfort during the procedure. You won't feel a thing.", category: "Included" },
      ],
      total_cost: 1550,
      insurance_estimate: 775,
      patient_estimate: 775,
      ai_summary: "Michael's upper left first molar (#14) has a significant crack that's weakened the tooth structure. Without treatment, the crack could extend into the root, potentially requiring extraction. A porcelain crown will restore full function and protect the tooth for 10-15+ years. The procedure takes two visits: prep and impressions today, then crown placement in about two weeks.",
    },
    {
      id: "c0000001-0000-0000-0000-000000000002",
      patient_id: "a0000001-0000-0000-0000-000000000002", // James Rodriguez
      provider_name: "Dr. Alex",
      title: "Single Tooth Implant - Tooth #8",
      status: "draft",
      procedures: [
        { name: "Dental Implant", code: "D6010", cost: 2200, description: "Titanium implant post surgically placed in the jawbone. This becomes the new root for your replacement tooth.", category: "Implant" },
        { name: "Implant Abutment", code: "D6057", cost: 800, description: "Custom connector piece that attaches to the implant and supports the crown.", category: "Implant" },
        { name: "Implant Crown (Porcelain)", code: "D6065", cost: 1500, description: "Custom porcelain crown that looks and functions exactly like a natural tooth.", category: "Implant" },
        { name: "CT Scan / 3D Imaging", code: "D0367", cost: 350, description: "Advanced 3D imaging to precisely plan implant placement for the best possible outcome.", category: "Diagnostic" },
        { name: "Bone Graft (if needed)", code: "D7953", cost: 650, description: "May be needed to ensure sufficient bone density for implant success. We'll confirm during the CT scan.", category: "Surgical" },
      ],
      total_cost: 5500,
      insurance_estimate: 1500,
      patient_estimate: 4000,
      ai_summary: "James lost his upper right central incisor (#8) during a basketball game. A dental implant is the gold standard for replacing a single missing tooth — it looks, feels, and functions like a natural tooth. The process takes 3-6 months total: implant placement, healing period, then crown placement. Success rate is over 97%. This is a permanent solution that can last a lifetime with proper care.",
    },
    {
      id: "c0000001-0000-0000-0000-000000000003",
      patient_id: "a0000001-0000-0000-0000-000000000003", // Sarah Chen
      provider_name: "Dr. Alex",
      title: "Cosmetic Veneer Package - Upper Front 6",
      status: "presented",
      procedures: [
        { name: "Porcelain Veneers (x6)", code: "D2962", cost: 7200, description: "Six custom-crafted porcelain veneers for your upper front teeth (#6-#11). Each veneer is individually designed for a natural, radiant smile.", category: "Cosmetic" },
        { name: "Digital Smile Design", code: "D0470", cost: 500, description: "Advanced digital preview of your new smile before any work begins. See your results before we start.", category: "Diagnostic" },
        { name: "Temporary Veneers", code: "D2999", cost: 300, description: "Custom temporary veneers you'll wear while your permanent set is being crafted in our lab.", category: "Cosmetic" },
      ],
      total_cost: 8000,
      insurance_estimate: 0,
      patient_estimate: 8000,
      ai_summary: "Sarah is looking to transform her smile for her upcoming wedding. Porcelain veneers on the upper front six teeth will create a stunning, camera-ready smile. Veneers can correct shape, size, color, and minor alignment issues all at once. The process takes 2-3 visits over 2-3 weeks: consultation and design, preparation and temporaries, then final placement. With proper care, veneers last 10-15+ years.",
    },
    {
      id: "c0000001-0000-0000-0000-000000000004",
      patient_id: "a0000001-0000-0000-0000-000000000005", // Lisa Williams
      provider_name: "Dr. Alex",
      title: "Orthodontic Treatment - Clear Aligners",
      status: "presented",
      procedures: [
        { name: "Clear Aligner Treatment (Full)", code: "D8090", cost: 5500, description: "Complete clear aligner therapy to straighten your teeth. Virtually invisible — most people won't even notice you're wearing them.", category: "Orthodontics" },
        { name: "Orthodontic Records", code: "D8660", cost: 300, description: "Digital impressions, photos, and X-rays for precise treatment planning.", category: "Diagnostic" },
        { name: "Retainers (Set of 2)", code: "D8680", cost: 400, description: "Custom retainers to maintain your new smile after treatment is complete.", category: "Orthodontics" },
      ],
      total_cost: 6200,
      insurance_estimate: 1500,
      patient_estimate: 4700,
      ai_summary: "Lisa wants to correct crowding and minor bite issues. Clear aligners offer a discreet, comfortable alternative to traditional braces. Treatment typically takes 12-18 months with aligner changes every 1-2 weeks. You can remove them for eating and brushing. Results are predictable — we can show you a 3D simulation of your treatment outcome before starting.",
    },
  ];

  console.log("Inserting treatment plans...");
  const { error } = await supabase.from("oe_treatment_plans").insert(plans);
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  console.log(`✅ Inserted ${plans.length} treatment plans`);
  plans.forEach((p) => console.log(`   - ${p.title} ($${p.total_cost}) - ${p.status}`));
}

seed().catch(console.error);
