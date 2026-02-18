import type { SupabaseClient } from "@supabase/supabase-js";

export async function seedTreatments(supabase: SupabaseClient) {
  const inserted: Record<string, number> = {};
  const errors: string[] = [];

  // Clear existing
  await supabase.from("oe_treatment_plans").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const plans = [
    {
      id: "c0000001-0000-0000-0000-000000000001",
      patient_id: "a0000001-0000-0000-0000-000000000006",
      provider_name: "Dr. Alex Khachaturian",
      title: "Crown Restoration - Tooth #14",
      status: "presented",
      procedures: [
        { name: "Porcelain Crown", code: "D2740", cost: 1200, description: "Full porcelain crown to restore cracked molar.", category: "Major Restorative" },
        { name: "Core Buildup", code: "D2950", cost: 350, description: "Foundation buildup to support the new crown.", category: "Major Restorative" },
        { name: "Local Anesthesia", code: "D9210", cost: 0, description: "Numbing for your comfort.", category: "Included" },
      ],
      total_cost: 1550,
      insurance_estimate: 775,
      patient_estimate: 775,
      ai_summary: "Michael's upper left first molar (#14) has a significant crack. A porcelain crown will restore full function and protect the tooth for 10-15+ years.",
    },
    {
      id: "c0000001-0000-0000-0000-000000000002",
      patient_id: "a0000001-0000-0000-0000-000000000002",
      provider_name: "Dr. Alex Khachaturian",
      title: "Single Tooth Implant - Tooth #8",
      status: "draft",
      procedures: [
        { name: "Dental Implant", code: "D6010", cost: 2200, description: "Titanium implant post surgically placed in the jawbone.", category: "Implant" },
        { name: "Implant Abutment", code: "D6057", cost: 800, description: "Custom connector piece.", category: "Implant" },
        { name: "Implant Crown (Porcelain)", code: "D6065", cost: 1500, description: "Custom porcelain crown.", category: "Implant" },
        { name: "CT Scan / 3D Imaging", code: "D0367", cost: 350, description: "Advanced 3D imaging.", category: "Diagnostic" },
        { name: "Bone Graft (if needed)", code: "D7953", cost: 650, description: "May be needed for sufficient bone density.", category: "Surgical" },
      ],
      total_cost: 5500,
      insurance_estimate: 1500,
      patient_estimate: 4000,
      ai_summary: "James lost his upper right central incisor (#8). A dental implant is the gold standard replacement with over 97% success rate.",
    },
    {
      id: "c0000001-0000-0000-0000-000000000003",
      patient_id: "a0000001-0000-0000-0000-000000000003",
      provider_name: "Dr. Alex Khachaturian",
      title: "Cosmetic Veneer Package - Upper Front 6",
      status: "presented",
      procedures: [
        { name: "Porcelain Veneers (x6)", code: "D2962", cost: 7200, description: "Six custom porcelain veneers for upper front teeth.", category: "Cosmetic" },
        { name: "Digital Smile Design", code: "D0470", cost: 500, description: "Digital preview of your new smile.", category: "Diagnostic" },
        { name: "Temporary Veneers", code: "D2999", cost: 300, description: "Custom temporaries while permanent set is crafted.", category: "Cosmetic" },
      ],
      total_cost: 8000,
      insurance_estimate: 0,
      patient_estimate: 8000,
      ai_summary: "Sarah is looking to transform her smile. Porcelain veneers on the upper front six teeth will create a stunning, camera-ready smile.",
    },
    {
      id: "c0000001-0000-0000-0000-000000000004",
      patient_id: "a0000001-0000-0000-0000-000000000005",
      provider_name: "Dr. Alex Khachaturian",
      title: "Orthodontic Treatment - Clear Aligners",
      status: "presented",
      procedures: [
        { name: "Clear Aligner Treatment (Full)", code: "D8090", cost: 5500, description: "Complete clear aligner therapy.", category: "Orthodontics" },
        { name: "Orthodontic Records", code: "D8660", cost: 300, description: "Digital impressions, photos, and X-rays.", category: "Diagnostic" },
        { name: "Retainers (Set of 2)", code: "D8680", cost: 400, description: "Custom retainers for after treatment.", category: "Orthodontics" },
      ],
      total_cost: 6200,
      insurance_estimate: 1500,
      patient_estimate: 4700,
      ai_summary: "Lisa wants to correct crowding and minor bite issues. Clear aligners offer a discreet alternative to traditional braces. Treatment typically takes 12-18 months.",
    },
  ];

  const { error } = await supabase.from("oe_treatment_plans").insert(plans);
  if (error) errors.push(`Treatment plans: ${error.message}`);
  else inserted.oe_treatment_plans = plans.length;

  return { inserted, errors };
}
