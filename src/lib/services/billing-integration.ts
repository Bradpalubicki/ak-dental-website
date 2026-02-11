// Billing Integration Framework
// Clearinghouse connections for dental insurance claims

import { createServiceSupabase } from "@/lib/supabase/server";

// ─── Types ──────────────────────────────────────────────────────────
export type BillingIntegrationType = "dentalxchange" | "tesia" | "availity" | "change_healthcare" | "manual" | "api_generic";

export interface ClaimSubmission {
  claimId: string;
  patientName: string;
  patientDob: string;
  insuranceProvider: string;
  memberId: string;
  groupNumber?: string;
  providerNpi: string;
  providerTin: string;
  procedures: Array<{
    code: string;
    tooth?: string;
    surface?: string;
    description: string;
    fee: number;
    date: string;
  }>;
  totalAmount: number;
  diagnosisCodes?: string[];
}

export interface ERARecord {
  payerName: string;
  payerId?: string;
  checkNumber?: string;
  checkDate?: string;
  totalPaid: number;
  totalAdjustments: number;
  patientName?: string;
  procedureCodes: Array<{
    code: string;
    charged: number;
    allowed: number;
    paid: number;
    adjustment: number;
    reason?: string;
  }>;
}

export interface EligibilityResponse {
  eligible: boolean;
  planName?: string;
  memberId: string;
  groupNumber?: string;
  deductible?: number;
  deductibleMet?: number;
  annualMax?: number;
  annualUsed?: number;
  preventiveCoverage?: number;
  basicCoverage?: number;
  majorCoverage?: number;
  waitingPeriods?: Record<string, string>;
  errors?: string[];
}

// ─── Adapter Interface ──────────────────────────────────────────────
export interface BillingAdapter {
  type: BillingIntegrationType;
  displayName: string;
  testConnection(): Promise<{ success: boolean; message: string }>;
  submitClaim(claim: ClaimSubmission): Promise<{ success: boolean; trackingNumber?: string; error?: string }>;
  checkEligibility(memberId: string, payerId: string, npi: string): Promise<EligibilityResponse>;
  fetchERAs(since?: Date): Promise<ERARecord[]>;
}

// ─── Manual Billing Adapter ─────────────────────────────────────────
class ManualBillingAdapter implements BillingAdapter {
  type: BillingIntegrationType = "manual";
  displayName = "Manual Claims";

  async testConnection() {
    return { success: true, message: "Manual billing is always available" };
  }

  async submitClaim(claim: ClaimSubmission) {
    // Manual mode: just update status in our DB
    const supabase = createServiceSupabase();
    await supabase
      .from("oe_billing_claims")
      .update({ status: "submitted", submitted_at: new Date().toISOString() })
      .eq("id", claim.claimId);

    return { success: true, trackingNumber: `MAN-${Date.now()}` };
  }

  async checkEligibility() {
    return {
      eligible: false,
      memberId: "",
      errors: ["Manual mode: eligibility must be checked via payer portal"],
    };
  }

  async fetchERAs() {
    return [];
  }
}

// ─── DentalXChange Adapter (placeholder) ────────────────────────────
class DentalXChangeAdapter implements BillingAdapter {
  type: BillingIntegrationType = "dentalxchange";
  displayName = "DentalXChange";

  async testConnection() {
    return { success: false, message: "DentalXChange API integration coming soon. Contact support for early access." };
  }

  async submitClaim() {
    return { success: false, error: "DentalXChange not yet configured" };
  }

  async checkEligibility() {
    return { eligible: false, memberId: "", errors: ["Not configured"] };
  }

  async fetchERAs() {
    return [];
  }
}

// ─── Factory ────────────────────────────────────────────────────────
export function createBillingAdapter(type: BillingIntegrationType): BillingAdapter {
  switch (type) {
    case "dentalxchange":
      return new DentalXChangeAdapter();
    case "manual":
    default:
      return new ManualBillingAdapter();
  }
}

// ─── ERA Auto-Posting ───────────────────────────────────────────────
export async function autoPostERA(eraRecordId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceSupabase();

  const { data: era, error: fetchError } = await supabase
    .from("oe_era_records")
    .select("*")
    .eq("id", eraRecordId)
    .single();

  if (fetchError || !era) {
    return { success: false, error: "ERA record not found" };
  }

  if (!era.claim_id) {
    return { success: false, error: "No matching claim found for auto-posting" };
  }

  // Update the claim with payment info
  const { error: updateError } = await supabase
    .from("oe_billing_claims")
    .update({
      insurance_paid: era.total_paid,
      adjustment: era.total_adjustments,
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", era.claim_id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Mark ERA as posted
  await supabase
    .from("oe_era_records")
    .update({
      status: "posted",
      auto_posted: true,
      posted_at: new Date().toISOString(),
      posted_by: "system",
    })
    .eq("id", eraRecordId);

  return { success: true };
}

// ─── Available Billing Systems ──────────────────────────────────────
export const BILLING_SYSTEMS = [
  {
    type: "dentalxchange" as BillingIntegrationType,
    name: "DentalXChange",
    description: "Leading dental claims clearinghouse. Real-time eligibility + claims.",
    capabilities: ["claims", "eligibility", "era", "attachments"],
    status: "coming_soon" as const,
  },
  {
    type: "tesia" as BillingIntegrationType,
    name: "Tesia Clearinghouse",
    description: "Fast claims processing with real-time tracking.",
    capabilities: ["claims", "eligibility", "era"],
    status: "coming_soon" as const,
  },
  {
    type: "availity" as BillingIntegrationType,
    name: "Availity",
    description: "Multi-payer platform for eligibility and claims.",
    capabilities: ["claims", "eligibility", "era"],
    status: "coming_soon" as const,
  },
  {
    type: "change_healthcare" as BillingIntegrationType,
    name: "Change Healthcare",
    description: "Enterprise clearinghouse with broad payer network.",
    capabilities: ["claims", "eligibility", "era", "attachments"],
    status: "coming_soon" as const,
  },
  {
    type: "manual" as BillingIntegrationType,
    name: "Manual Claims",
    description: "Track claims manually without a clearinghouse connection.",
    capabilities: ["claims"],
    status: "ready" as const,
  },
] as const;
