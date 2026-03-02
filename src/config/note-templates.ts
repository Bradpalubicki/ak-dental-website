// CDT procedure code → SOAP note template mapping
// When a clinician selects a D-code, these templates pre-fill the SOAP fields.
// Claude AI then refines them based on tooth number + patient context.

export interface SoapTemplate {
  note_type: string;
  chief_complaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const CDT_TEMPLATES: Record<string, SoapTemplate> = {
  // ─── Evaluation & Exam ──────────────────────────────────────────────
  D0120: {
    note_type: "exam",
    chief_complaint: "Periodic oral evaluation",
    subjective: "Patient presents for routine periodic examination. No acute complaints at this time. Patient reports [oral hygiene habits/home care routine].",
    objective: "Oral tissues within normal limits. No soft tissue pathology noted. Dentition examined. Radiographs reviewed. Occlusion evaluated.",
    assessment: "Stable dentition. [Note any findings: caries, periodontal status, existing restorations].",
    plan: "Continue recall schedule. [Recommended treatment if applicable]. Patient instructed on [oral hygiene instructions].",
  },
  D0140: {
    note_type: "exam",
    chief_complaint: "Limited oral evaluation — [chief complaint]",
    subjective: "Patient presents with [specific complaint]. Onset: [duration]. Pain level: [0-10]. Aggravating factors: [hot/cold/pressure/spontaneous].",
    objective: "Examination limited to area of concern. [Tooth #] evaluated. Percussion: [positive/negative]. Palpation: [positive/negative]. Cold test: [responsive/non-responsive/lingering]. Periapical radiograph taken.",
    assessment: "[Diagnosis — e.g., reversible pulpitis, irreversible pulpitis, apical periodontitis, cracked tooth].",
    plan: "[Treatment recommendation]. Patient informed of diagnosis and options. [Referral if indicated].",
  },
  D0150: {
    note_type: "exam",
    chief_complaint: "Comprehensive oral evaluation — new patient",
    subjective: "New patient presents for comprehensive evaluation. Medical history reviewed. [Pertinent medical history, medications, allergies noted]. Chief concern: [patient-reported concerns].",
    objective: "Extraoral examination: [findings — lymph nodes, TMJ, facial symmetry]. Intraoral soft tissue: [findings — mucosa, gingiva, tongue, palate, floor of mouth, oropharynx]. Hard tissue: [dentition charted, occlusion class, wear patterns]. Periodontal: [probing depths, BOP, recession]. Full mouth radiographs/panoramic reviewed.",
    assessment: "[Summary of findings — caries risk, periodontal status, restorative needs, occlusal issues].",
    plan: "Treatment plan presented and discussed with patient. [List priority treatments]. Recall: [3/4/6 months]. Patient questions answered.",
  },
  D0180: {
    note_type: "exam",
    chief_complaint: "Comprehensive periodontal evaluation",
    subjective: "Patient presents for comprehensive periodontal evaluation. [Risk factors: smoking, diabetes, medications, family history]. Bleeding on brushing: [yes/no]. Last periodontal treatment: [date/type].",
    objective: "Full periodontal charting completed. Probing depths: [range]. Bleeding on probing: [%]. Furcation involvement: [grade/locations]. Mobility: [grade/locations]. Recession: [locations/measurements]. Radiographic bone levels reviewed.",
    assessment: "[AAP diagnosis — e.g., Stage II Grade B generalized periodontitis]. [Localized findings].",
    plan: "[SRP quadrants, perio maintenance schedule, systemic considerations]. Patient educated on periodontal disease and home care importance.",
  },

  // ─── Preventive ─────────────────────────────────────────────────────
  D1110: {
    note_type: "progress",
    chief_complaint: "Adult prophylaxis",
    subjective: "Patient presents for routine hygiene appointment. No acute complaints. Home care: [brushing frequency, flossing frequency, adjuncts].",
    objective: "Supragingival and subgingival debridement completed. Calculus deposits: [light/moderate/heavy]. Plaque index: [%]. Bleeding on probing: [sites]. Gingival health: [healthy/inflamed]. Oral cancer screening performed — no suspicious lesions noted.",
    assessment: "Prophylaxis completed. [Periodontal status — within normal limits/mild gingivitis/monitor].",
    plan: "6-month recall recommended. [Fluoride applied if applicable]. Patient instructed on [modified Bass technique / flossing / water flosser]. [Any follow-up recommended].",
  },
  D1120: {
    note_type: "progress",
    chief_complaint: "Child prophylaxis",
    subjective: "Patient presents for routine pediatric hygiene appointment. Parent/guardian present. Cooperation level: [excellent/good/fair]. Home care reviewed with parent.",
    objective: "Supragingival debridement completed. Plaque index noted. Primary/mixed dentition evaluated. Oral tissues within normal limits. Oral cancer screening performed.",
    assessment: "Prophylaxis completed. Dentition appropriate for age. [Any caries risk or concerns noted].",
    plan: "[6-month recall]. Fluoride varnish applied. Parent instructed on [age-appropriate oral hygiene]. [Sealants discussed if applicable].",
  },
  D1208: {
    note_type: "progress",
    chief_complaint: "Topical fluoride application",
    subjective: "Patient presents for fluoride application. [Caries risk: low/moderate/high]. Home fluoride use: [yes/no — type].",
    objective: "Fluoride varnish (5% NaF) applied to all surfaces following prophy. Patient instructed not to eat/drink for 30 minutes.",
    assessment: "Fluoride therapy completed. [Caries risk assessment noted].",
    plan: "Recommend [home fluoride regimen if moderate/high risk]. Return for routine recall.",
  },

  // ─── Restorative ────────────────────────────────────────────────────
  D2140: {
    note_type: "procedure",
    chief_complaint: "Amalgam restoration — tooth [#], [surface(s)]",
    subjective: "Patient presents for amalgam restoration. Informed consent obtained. [Anesthesia administered: 2% Lidocaine 1:100K epinephrine, [X] carpule(s), [block/infiltration]].",
    objective: "Rubber dam placed. Caries excavated. Cavity preparation completed. Amalgam restoration placed and condensed. Occlusion adjusted — patient confirmed comfortable bite. Rubber dam removed.",
    assessment: "Amalgam restoration completed — tooth [#], [surface(s)]. [Any intraoperative findings].",
    plan: "Patient instructed: avoid chewing on restoration for 24 hours, may experience temperature sensitivity for [1-2 weeks], contact office if bite feels high. Follow-up if sensitivity persists beyond 4-6 weeks.",
  },
  D2150: {
    note_type: "procedure",
    chief_complaint: "Amalgam restoration — tooth [#], [surface(s)]",
    subjective: "Patient presents for amalgam restoration. Informed consent obtained. Anesthesia: [type, carpules, technique].",
    objective: "Rubber dam placed. Caries excavated to DEJ. Two-surface cavity preparation. Base/liner placed if indicated. Amalgam condensed and carved. Contacts verified with floss. Occlusion adjusted.",
    assessment: "Two-surface amalgam completed — tooth [#]. [Pulpal proximity noted if applicable].",
    plan: "Patient instructed on post-op care. Follow-up if sensitivity beyond 4-6 weeks.",
  },
  D2330: {
    note_type: "procedure",
    chief_complaint: "Composite resin restoration — tooth [#], [surface(s)]",
    subjective: "Patient presents for composite restoration. Informed consent obtained. Shade selected: [shade]. Anesthesia: [2% Lidocaine 1:100K epi, [X] carpule(s), [block/infiltration]].",
    objective: "Rubber dam placed. Caries excavated. Beveled margins prepared. Etch, bond, and composite placed in increments. Cured per manufacturer protocol. Contacts verified. Occlusion adjusted — patient comfortable.",
    assessment: "Composite restoration completed — tooth [#], [surface]. Shade match satisfactory.",
    plan: "Patient advised: avoid staining foods/beverages for 48 hours. Contact office if bite feels off. 6-month recall.",
  },
  D2740: {
    note_type: "procedure",
    chief_complaint: "Porcelain-fused-to-metal crown — tooth [#]",
    subjective: "Patient presents for [crown preparation / crown delivery]. Informed consent obtained. Anesthesia for preparation: [type, carpules]. Shade selected: [shade].",
    objective: "[PREPARATION: Tooth reduced per manufacturer specifications. Ferrule established. Margins at [supragingival/equigingival/subgingival]. Retraction cord packed. Final impression taken — [material]. Temp crown fabricated and cemented with [temp cement]. Occlusion adjusted.] [DELIVERY: Temp crown removed. Definitive crown tried in — marginal integrity verified, contacts checked with floss, occlusion confirmed. Crown cemented with [cement type]. Excess cement removed. Occlusion rechecked — comfortable.]",
    assessment: "Crown [preparation/delivery] completed — tooth [#]. [Any complications or notes].",
    plan: "[Preparation: Return for crown delivery [date]. Contact office if temp comes off.] [Delivery: Patient instructed on care — floss daily, contact office if sensitivity or bite change. 6-month recall.]",
  },
  D2750: {
    note_type: "procedure",
    chief_complaint: "Porcelain-fused-to-metal crown — tooth [#]",
    subjective: "Patient presents for [crown preparation / crown delivery]. Informed consent obtained. Anesthesia: [type]. Shade: [shade].",
    objective: "[Same as D2740 template per visit type].",
    assessment: "PFM crown [preparation/delivery] — tooth [#].",
    plan: "[Per visit type — see D2740 plan template].",
  },
  D2950: {
    note_type: "procedure",
    chief_complaint: "Core build-up — tooth [#]",
    subjective: "Patient presents for core build-up prior to crown. Anesthesia: [type, carpules].",
    objective: "Existing restoration/decay removed. Core build-up placed with [composite/amalgam/glass ionomer]. Post placement: [yes/no — type if yes]. Adequate ferrule established for crown preparation.",
    assessment: "Core build-up completed — tooth [#]. [Crown preparation scheduled/completed at same visit].",
    plan: "[Crown preparation to follow / Crown impression taken — return for delivery].",
  },

  // ─── Endodontics ────────────────────────────────────────────────────
  D3310: {
    note_type: "procedure",
    chief_complaint: "Root canal therapy — anterior tooth [#]",
    subjective: "Patient presents for root canal therapy. [Pre-op diagnosis: irreversible pulpitis/necrotic pulp]. Informed consent obtained. Anesthesia: [2% Lidocaine 1:100K epi, [X] carpule(s), block/infiltration]. Patient achieved profound anesthesia: [yes/no — supplemental if needed].",
    objective: "Rubber dam placed. Access preparation. Working length established via apex locator — [X] mm. Canal [shape]: [shape]. Instrumentation with [rotary system to size XX/.XX]. Irrigation with [NaOCl/EDTA/CHX]. Canal dried. [Obturation: gutta percha / bioceramic sealer — cold lateral/warm vertical condensation]. Radiograph confirmed fill to working length. Access closed with [composite/IRM].",
    assessment: "Root canal therapy completed — tooth [#], [# canals]. [Post-op radiograph shows fill within [X]mm of apex].",
    plan: "Patient instructed: expect soreness 2-5 days, take [ibuprofen 400-600mg q6h as needed]. Crown required — refer to restorative. Return if pain worsens or swelling develops. Contact office for any concerns.",
  },
  D3320: {
    note_type: "procedure",
    chief_complaint: "Root canal therapy — premolar tooth [#]",
    subjective: "Patient presents for root canal therapy. [Diagnosis]. Informed consent obtained. Anesthesia: [type, carpules]. Profound anesthesia achieved: [yes/no].",
    objective: "Rubber dam placed. Access. Working length: [#] mm. [# canals found: [descriptions]]. Instrumentation, irrigation, drying. Obturation completed. Radiographic confirmation. Access restored.",
    assessment: "RCT completed — tooth [#], [# canals]. [Any variations noted].",
    plan: "Post-op instructions given. Crown required. Return if symptoms worsen.",
  },
  D3330: {
    note_type: "procedure",
    chief_complaint: "Root canal therapy — molar tooth [#]",
    subjective: "Patient presents for root canal therapy — molar. [Diagnosis]. Informed consent obtained. Anesthesia: [inferior alveolar block / palatal / buccal infiltration]. Carpules: [#]. Anesthesia: profound / required supplemental.",
    objective: "Rubber dam placed. Access. [# canals located: MB, MB2, ML, DB, DL, P — as applicable]. Working lengths via apex locator. Instrumentation [rotary system, sizes]. Copious irrigation NaOCl/EDTA. Obturation — [technique]. Periapical film confirms fill. Access restored with [build-up / IRM].",
    assessment: "Molar RCT completed — tooth [#]. [# canals]. [Any calcified canals, separated instruments, procedural notes].",
    plan: "Post-op instructions. Ibuprofen [Rx if needed]. Crown strongly recommended — do not delay. [Referral to endodontist if appropriate].",
  },

  // ─── Periodontics ───────────────────────────────────────────────────
  D4341: {
    note_type: "procedure",
    chief_complaint: "Periodontal scaling and root planing — [quadrant]",
    subjective: "Patient presents for SRP. [Periodontal diagnosis: Stage [X] Grade [X] periodontitis]. Anesthesia: [type, carpules] — [quadrant] anesthetized. Patient tolerated procedure well.",
    objective: "SRP completed — [quadrant]. Subgingival debridement with [ultrasonic + hand instruments]. Calculus deposits removed. Root surfaces planed. [Localized defects noted: [locations]]. No complications. Post-op instructions reviewed.",
    assessment: "SRP completed — [quadrant]. [Clinical attachment level and pocket depth improvements expected at re-evaluation].",
    plan: "Remaining quadrants scheduled: [dates]. Re-evaluation in 4-6 weeks. Patient instructed: [prescription rinse/antibiotics if indicated]. Home care reinforced. Perio maintenance 3-month recall following completion.",
  },
  D4910: {
    note_type: "progress",
    chief_complaint: "Periodontal maintenance",
    subjective: "Patient presents for periodontal maintenance. Compliance with home care: [good/fair/poor]. Last PM: [date]. Any changes in medical history: [yes — details / no].",
    objective: "Periodontal charting updated. Full mouth debridement completed supra- and subgingivally. BOP: [%]. Probing depths compared to baseline: [stable/improving/deteriorating]. [Sites of concern: locations/depths]. Oral cancer screening — no suspicious lesions. Radiographs: [taken/reviewed/not indicated].",
    assessment: "[Stable periodontal condition / Localized areas of concern at [sites] / Disease activity noted — [action required]].",
    plan: "3-month recall maintained. [Active SRP recommended if [sites] ≥5mm with BOP]. Patient reinforced on [home care modification]. [Refer to periodontist if: refractory disease, furcation Grade III, surgical candidate].",
  },

  // ─── Oral Surgery / Extractions ─────────────────────────────────────
  D7140: {
    note_type: "procedure",
    chief_complaint: "Extraction — erupted tooth [#]",
    subjective: "Patient presents for extraction of tooth [#]. [Reason: caries beyond restoration, patient preference, orthodontic]. Informed consent obtained. Anesthesia: [type, carpules, technique]. Profound anesthesia confirmed.",
    objective: "Tooth [#] luxated and extracted with [forceps — type]. Socket inspected — no retained roots, no pathology. [Socket curetted]. Hemostasis achieved with gauze pressure. [Sutures if placed: type, number, site]. Post-extraction radiograph: [taken/not indicated].",
    assessment: "Tooth [#] extracted without complication. [Note any complications: fractured root, dry socket risk factors].",
    plan: "Post-op instructions given verbally and written: bite on gauze 30-60 min, no smoking/spitting/straws 48 hours, soft diet, ice packs 20 min on/off x24h, [ibuprofen 400-600mg + acetaminophen alternating as needed], [antibiotic if prescribed]. Return for suture removal in 7 days if placed. Call if: bleeding not controlled, fever, severe pain, swelling increasing after 48h.",
  },
  D7210: {
    note_type: "procedure",
    chief_complaint: "Surgical extraction — tooth [#]",
    subjective: "Patient presents for surgical extraction of tooth [#]. [Reason: partial bony impaction, root configuration, ankylosis, fractured tooth]. Informed consent obtained. Anesthesia: [type, carpules, technique]. Anesthesia profound — patient comfortable.",
    objective: "Surgical access obtained via [envelope/three-corner flap]. Bone reduction performed with [handpiece and bur] to expose [root(s)/crown]. Sectioning performed: [yes/no — description]. Tooth/roots delivered. Socket inspected and irrigated. [Bone smoothed]. [Gelfoam placed if indicated]. Flap sutured with [suture type, number placed]. Hemostasis achieved. Gauze placed. Post-op instructions reviewed.",
    assessment: "Surgical extraction tooth [#] completed. [Any complications: root tip left intentionally, sinus communication, adjacent tooth involvement].",
    plan: "Post-op instructions reviewed verbally and in writing. [Analgesic prescription: ibuprofen 600mg q6h x3d + hydrocodone/acetaminophen if needed]. [Antibiotic prescription if indicated]. Suture removal in 7-10 days. Follow-up call in 48 hours. Return immediately if: uncontrolled bleeding, fever, swelling spreading to face/neck.",
  },
  D7240: {
    note_type: "procedure",
    chief_complaint: "Extraction — impacted tooth [#]",
    subjective: "Patient presents for removal of impacted tooth [#]. [Impaction type: soft tissue / partial bony / complete bony]. Informed consent including risks (nerve proximity, sinus, adjacent tooth) obtained. Anesthesia: [inferior alveolar block + long buccal + lingual, X carpules]. Anesthesia profound.",
    objective: "Surgical access: [crestal/envelope/three-corner flap]. Bone removal with [handpiece]. Tooth sectioned: [yes — MB/DB/root division]. All sections/roots delivered. Socket irrigated. [Bone smoothed]. [Gelfoam/sutures placed]. Hemostasis achieved. [Postoperative radiograph confirms no retained roots].",
    assessment: "Impacted tooth [#] removed. [Impaction classification: soft tissue/partial bony/complete bony]. [Any complications or anatomical considerations].",
    plan: "[Rx: analgesic + antibiotic]. Ice x24h, warm salt rinses day 2+. Suture removal [date]. Return if fever, trismus, paresthesia, or uncontrolled bleeding. [Referral to oral surgeon if indicated].",
  },

  // ─── Prosthodontics ─────────────────────────────────────────────────
  D5110: {
    note_type: "procedure",
    chief_complaint: "Complete maxillary denture delivery",
    subjective: "Patient presents for complete maxillary denture delivery. [Recall appointment — adjustments, or new denture]. Patient expectations reviewed.",
    objective: "Denture inserted. Occlusion verified with articulating paper. Border seal evaluated. Retention and stability assessed. [Pressure areas identified and relieved with pressure indicator paste]. Patient demonstrated insertion and removal of appliance.",
    assessment: "Maxillary complete denture delivered. [Fit acceptable / minor adjustments made].",
    plan: "Patient instructed: wear denture to adjust, leave out at night to rest tissues, clean daily with denture brush, store in water when not wearing. Follow-up adjustment visit in [1 week]. Contact office if sore spots develop.",
  },
  D6010: {
    note_type: "procedure",
    chief_complaint: "Implant placement — site [#]",
    subjective: "Patient presents for implant placement. [Pre-surgical workup: CBCT reviewed, bone quality/quantity adequate, surgical guide]. Informed consent obtained. Anesthesia: [type, carpules]. Vital signs stable.",
    objective: "Site prepared per surgical protocol. [Guided/freehand placement]. Osteotomy: [final drill size] mm x [depth] mm. Implant [brand/system] [dimension] placed with [insertion torque: X Ncm]. [Cover screw/healing abutment placed]. [PRF/bone graft if used]. Flap closed with [sutures]. Post-op radiograph confirms implant position.",
    assessment: "Implant placed — site [#]. [Torque and stability adequate/ISQ if measured]. [Healing plan: immediate load/standard protocol].",
    plan: "[Antibiotic Rx]. [Analgesic Rx]. Soft diet 2 weeks. No pressure on site. Suture removal [date]. Restorative phase at [3/4/6] months. [Referral to oral surgeon if applicable].",
  },
};

// Procedure categories for grouping in UI
export const CDT_CATEGORIES: Record<string, string[]> = {
  "Evaluation & Exam": ["D0120", "D0140", "D0150", "D0180"],
  "Preventive": ["D1110", "D1120", "D1208"],
  "Restorative": ["D2140", "D2150", "D2330", "D2740", "D2750", "D2950"],
  "Endodontics": ["D3310", "D3320", "D3330"],
  "Periodontics": ["D4341", "D4910"],
  "Oral Surgery": ["D7140", "D7210", "D7240"],
  "Prosthodontics": ["D5110", "D6010"],
};

// Given a D-code string like "D2140 - Amalgam - 1 Surface", extract the code
export function extractDCode(codeString: string): string {
  return (codeString.split(" ")[0] ?? "").toUpperCase();
}

// Get template for a given D-code string (may include description)
export function getTemplateForCode(codeString: string): SoapTemplate | null {
  const code = extractDCode(codeString);
  return CDT_TEMPLATES[code] ?? null;
}
