// Accounting Integration Framework
// QuickBooks Online, Xero, and generic accounting sync

import { createServiceSupabase } from "@/lib/supabase/server";

// ─── Types ──────────────────────────────────────────────────────────
export type AccountingIntegrationType = "quickbooks_online" | "xero" | "freshbooks" | "manual" | "api_generic";

export interface JournalEntry {
  date: string;
  type: "revenue" | "expense" | "payment" | "adjustment" | "refund" | "payroll" | "insurance_payment";
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  referenceType?: string;
  referenceId?: string;
}

export interface ChartOfAccountsMapping {
  patientPayments: string;
  insurancePayments: string;
  productionRevenue: string;
  adjustments: string;
  refunds: string;
  suppliesTooth: string;
  labFees: string;
  payroll: string;
  rent: string;
  utilities: string;
  marketing: string;
  insurance: string;
  depreciation: string;
  accountsReceivable: string;
  accountsPayable: string;
}

// Default dental chart of accounts mapping
export const DEFAULT_DENTAL_COA: ChartOfAccountsMapping = {
  patientPayments: "1000 - Patient Revenue",
  insurancePayments: "1010 - Insurance Revenue",
  productionRevenue: "1020 - Production Revenue",
  adjustments: "1030 - Adjustments",
  refunds: "1040 - Refunds",
  suppliesTooth: "5000 - Dental Supplies",
  labFees: "5010 - Lab Fees",
  payroll: "5100 - Salaries & Wages",
  rent: "5200 - Rent",
  utilities: "5210 - Utilities",
  marketing: "5300 - Marketing",
  insurance: "5400 - Business Insurance",
  depreciation: "5500 - Depreciation",
  accountsReceivable: "1200 - Accounts Receivable",
  accountsPayable: "2000 - Accounts Payable",
};

// ─── Adapter Interface ──────────────────────────────────────────────
export interface AccountingAdapter {
  type: AccountingIntegrationType;
  displayName: string;
  testConnection(): Promise<{ success: boolean; message: string }>;
  syncEntries(entries: JournalEntry[]): Promise<{ synced: number; failed: number; errors: string[] }>;
  getChartOfAccounts(): Promise<Array<{ id: string; name: string; type: string }>>;
}

// ─── Manual Adapter ─────────────────────────────────────────────────
class ManualAccountingAdapter implements AccountingAdapter {
  type: AccountingIntegrationType = "manual";
  displayName = "Manual Entry";

  async testConnection() {
    return { success: true, message: "Manual accounting mode active. Entries tracked in One Engine." };
  }

  async syncEntries(entries: JournalEntry[]) {
    // In manual mode, just mark entries as synced in our DB
    const supabase = createServiceSupabase();
    let synced = 0;

    for (const entry of entries) {
      const { error } = await supabase.from("oe_accounting_entries").insert({
        entry_date: entry.date,
        entry_type: entry.type,
        description: entry.description,
        debit_account: entry.debitAccount,
        credit_account: entry.creditAccount,
        amount: entry.amount,
        reference_type: entry.referenceType,
        reference_id: entry.referenceId,
        sync_status: "manual",
      });
      if (!error) synced++;
    }

    return { synced, failed: entries.length - synced, errors: [] };
  }

  async getChartOfAccounts() {
    return Object.entries(DEFAULT_DENTAL_COA).map(([key, value]) => ({
      id: key,
      name: value,
      type: key.startsWith("5") ? "expense" : "revenue",
    }));
  }
}

// ─── QuickBooks Online Adapter (placeholder) ────────────────────────
class QuickBooksAdapter implements AccountingAdapter {
  type: AccountingIntegrationType = "quickbooks_online";
  displayName = "QuickBooks Online";

  async testConnection() {
    return {
      success: false,
      message: "QuickBooks Online OAuth integration coming soon. Use manual entry as interim.",
    };
  }

  async syncEntries() {
    return { synced: 0, failed: 0, errors: ["QuickBooks not yet connected"] };
  }

  async getChartOfAccounts() {
    return [];
  }
}

// ─── Xero Adapter (placeholder) ─────────────────────────────────────
class XeroAdapter implements AccountingAdapter {
  type: AccountingIntegrationType = "xero";
  displayName = "Xero";

  async testConnection() {
    return {
      success: false,
      message: "Xero OAuth integration coming soon.",
    };
  }

  async syncEntries() {
    return { synced: 0, failed: 0, errors: ["Xero not yet connected"] };
  }

  async getChartOfAccounts() {
    return [];
  }
}

// ─── Factory ────────────────────────────────────────────────────────
export function createAccountingAdapter(type: AccountingIntegrationType): AccountingAdapter {
  switch (type) {
    case "quickbooks_online":
      return new QuickBooksAdapter();
    case "xero":
      return new XeroAdapter();
    case "manual":
    default:
      return new ManualAccountingAdapter();
  }
}

// ─── Auto-create journal entries from claims ────────────────────────
export async function createEntriesFromClaim(claimId: string): Promise<void> {
  const supabase = createServiceSupabase();

  const { data: claim } = await supabase
    .from("oe_billing_claims")
    .select("*, patient:oe_patients(first_name, last_name)")
    .eq("id", claimId)
    .single();

  if (!claim) return;

  const patientName = claim.patient
    ? `${claim.patient.first_name} ${claim.patient.last_name}`
    : "Unknown Patient";

  const entries: Array<Record<string, unknown>> = [];

  if (claim.status === "submitted") {
    entries.push({
      entry_date: claim.submitted_at || new Date().toISOString(),
      entry_type: "revenue",
      description: `Claim ${claim.claim_number || claim.id} - ${patientName} - Billed`,
      debit_account: DEFAULT_DENTAL_COA.accountsReceivable,
      credit_account: DEFAULT_DENTAL_COA.productionRevenue,
      amount: claim.billed_amount,
      reference_type: "claim",
      reference_id: claim.id,
      sync_status: "pending",
    });
  }

  if (claim.status === "paid" && claim.insurance_paid > 0) {
    entries.push({
      entry_date: claim.paid_at || new Date().toISOString(),
      entry_type: "insurance_payment",
      description: `Insurance Payment - ${claim.insurance_provider} - ${patientName}`,
      debit_account: "Cash",
      credit_account: DEFAULT_DENTAL_COA.accountsReceivable,
      amount: claim.insurance_paid,
      reference_type: "claim",
      reference_id: claim.id,
      sync_status: "pending",
    });
  }

  if (entries.length > 0) {
    await supabase.from("oe_accounting_entries").insert(entries);
  }
}

// ─── Available Accounting Systems ───────────────────────────────────
export const ACCOUNTING_SYSTEMS = [
  {
    type: "quickbooks_online" as AccountingIntegrationType,
    name: "QuickBooks Online",
    description: "Most popular small business accounting. OAuth-based sync.",
    features: ["revenue_sync", "expense_sync", "payroll_sync", "bank_reconciliation"],
    status: "coming_soon" as const,
  },
  {
    type: "xero" as AccountingIntegrationType,
    name: "Xero",
    description: "Cloud accounting with strong API. Great for multi-location.",
    features: ["revenue_sync", "expense_sync", "bank_reconciliation"],
    status: "coming_soon" as const,
  },
  {
    type: "freshbooks" as AccountingIntegrationType,
    name: "FreshBooks",
    description: "Simple invoicing and accounting.",
    features: ["revenue_sync", "expense_sync"],
    status: "coming_soon" as const,
  },
  {
    type: "manual" as AccountingIntegrationType,
    name: "Manual Entry",
    description: "Track revenue and expenses manually within One Engine.",
    features: ["revenue_sync", "expense_sync"],
    status: "ready" as const,
  },
] as const;
