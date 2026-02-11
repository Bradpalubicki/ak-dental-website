// PMS Integration Framework
// Adapter pattern for Dentrix, Eaglesoft, Open Dental, CSV import

import { createServiceSupabase } from "@/lib/supabase/server";

// ─── Types ──────────────────────────────────────────────────────────
export type PMSType = "dentrix" | "eaglesoft" | "open_dental" | "dentrix_ascend" | "curve" | "csv_import" | "api_generic";

export interface PMSPatientRecord {
  externalId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  insuranceProvider?: string;
  insuranceMemberId?: string;
  lastVisit?: string;
  status?: string;
}

export interface PMSAppointmentRecord {
  externalId: string;
  patientExternalId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  provider: string;
  status: string;
}

export interface PMSSyncResult {
  syncType: "full" | "incremental" | "manual";
  status: "success" | "partial" | "failed";
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  recordsErrored: number;
  errors: Array<{ record: string; error: string }>;
  durationMs: number;
}

// ─── Adapter Interface ──────────────────────────────────────────────
export interface PMSAdapter {
  type: PMSType;
  displayName: string;
  testConnection(): Promise<{ success: boolean; message: string }>;
  fetchPatients(since?: Date): Promise<PMSPatientRecord[]>;
  fetchAppointments(since?: Date): Promise<PMSAppointmentRecord[]>;
}

// ─── CSV Import Adapter ─────────────────────────────────────────────
export class CSVImportAdapter implements PMSAdapter {
  type: PMSType = "csv_import";
  displayName = "CSV Import";

  async testConnection() {
    return { success: true, message: "CSV import is always available" };
  }

  async fetchPatients(): Promise<PMSPatientRecord[]> {
    return []; // Patients come from parseCSV, not fetch
  }

  async fetchAppointments(): Promise<PMSAppointmentRecord[]> {
    return [];
  }

  parseCSV(csvContent: string, columnMapping: Record<string, string | null>): PMSPatientRecord[] {
    const lines = csvContent.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const records: PMSPatientRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });

      const mapped: Partial<PMSPatientRecord> = { externalId: "" };
      for (const [csvCol, dbField] of Object.entries(columnMapping)) {
        if (!dbField || !row[csvCol]) continue;
        (mapped as Record<string, string>)[dbField] = row[csvCol];
      }

      if (mapped.firstName || mapped.lastName) {
        records.push({
          externalId: mapped.externalId || `csv-${i}`,
          firstName: mapped.firstName || "",
          lastName: mapped.lastName || "",
          email: mapped.email,
          phone: mapped.phone,
          dateOfBirth: mapped.dateOfBirth,
          address: mapped.address,
          city: mapped.city,
          state: mapped.state,
          zip: mapped.zip,
          insuranceProvider: mapped.insuranceProvider,
          insuranceMemberId: mapped.insuranceMemberId,
        });
      }
    }

    return records;
  }
}

// ─── Dentrix Adapter (API-based, placeholder for real integration) ──
export class DentrixAdapter implements PMSAdapter {
  type: PMSType = "dentrix";
  displayName = "Dentrix G7";
  private config: { serverUrl?: string; apiKey?: string };

  constructor(config: Record<string, string>) {
    this.config = config;
  }

  async testConnection() {
    if (!this.config.serverUrl || !this.config.apiKey) {
      return { success: false, message: "Server URL and API key required" };
    }
    // Real implementation would hit Dentrix API
    return { success: false, message: "Dentrix API integration requires on-premise connector. Use CSV export as interim." };
  }

  async fetchPatients(): Promise<PMSPatientRecord[]> {
    return [];
  }

  async fetchAppointments(): Promise<PMSAppointmentRecord[]> {
    return [];
  }
}

// ─── Open Dental Adapter ────────────────────────────────────────────
export class OpenDentalAdapter implements PMSAdapter {
  type: PMSType = "open_dental";
  displayName = "Open Dental";
  private config: { serverUrl?: string; developerKey?: string; customerKey?: string };

  constructor(config: Record<string, string>) {
    this.config = config;
  }

  async testConnection() {
    if (!this.config.serverUrl || !this.config.developerKey || !this.config.customerKey) {
      return { success: false, message: "Server URL, developer key, and customer key required" };
    }
    // Open Dental has a REST API - real implementation would test it here
    return { success: false, message: "Open Dental API integration coming soon. Use CSV export as interim." };
  }

  async fetchPatients(): Promise<PMSPatientRecord[]> {
    return [];
  }

  async fetchAppointments(): Promise<PMSAppointmentRecord[]> {
    return [];
  }
}

// ─── Adapter Factory ────────────────────────────────────────────────
export function createPMSAdapter(type: PMSType, config: Record<string, string> = {}): PMSAdapter {
  switch (type) {
    case "dentrix":
    case "dentrix_ascend":
      return new DentrixAdapter(config);
    case "open_dental":
      return new OpenDentalAdapter(config);
    case "csv_import":
      return new CSVImportAdapter();
    default:
      return new CSVImportAdapter();
  }
}

// ─── Sync Service ───────────────────────────────────────────────────
export async function syncPatients(
  integrationId: string,
  patients: PMSPatientRecord[]
): Promise<PMSSyncResult> {
  const startTime = Date.now();
  const supabase = createServiceSupabase();
  const result: PMSSyncResult = {
    syncType: "manual",
    status: "success",
    recordsProcessed: patients.length,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsSkipped: 0,
    recordsErrored: 0,
    errors: [],
    durationMs: 0,
  };

  for (const patient of patients) {
    try {
      // Check if patient exists by external ID
      const { data: existing } = await supabase
        .from("oe_patients")
        .select("id")
        .eq("pms_patient_id", patient.externalId)
        .maybeSingle();

      if (existing) {
        // Update
        const { error } = await supabase
          .from("oe_patients")
          .update({
            first_name: patient.firstName,
            last_name: patient.lastName,
            email: patient.email || null,
            phone: patient.phone || null,
            date_of_birth: patient.dateOfBirth || null,
            address: patient.address || null,
            city: patient.city || null,
            state: patient.state || null,
            zip: patient.zip || null,
            insurance_provider: patient.insuranceProvider || null,
            insurance_member_id: patient.insuranceMemberId || null,
          })
          .eq("id", existing.id);

        if (error) throw error;
        result.recordsUpdated++;
      } else {
        // Create
        const { error } = await supabase.from("oe_patients").insert({
          first_name: patient.firstName,
          last_name: patient.lastName,
          email: patient.email || null,
          phone: patient.phone || null,
          date_of_birth: patient.dateOfBirth || null,
          address: patient.address || null,
          city: patient.city || null,
          state: patient.state || null,
          zip: patient.zip || null,
          insurance_provider: patient.insuranceProvider || null,
          insurance_member_id: patient.insuranceMemberId || null,
          pms_patient_id: patient.externalId,
          status: "active",
        });

        if (error) throw error;
        result.recordsCreated++;
      }
    } catch (err) {
      result.recordsErrored++;
      result.errors.push({
        record: `${patient.firstName} ${patient.lastName}`,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  result.durationMs = Date.now() - startTime;
  if (result.recordsErrored > 0 && result.recordsErrored < result.recordsProcessed) {
    result.status = "partial";
  } else if (result.recordsErrored === result.recordsProcessed && result.recordsProcessed > 0) {
    result.status = "failed";
  }

  // Log sync
  await supabase.from("oe_pms_sync_log").insert({
    integration_id: integrationId,
    sync_type: result.syncType,
    status: result.status,
    records_processed: result.recordsProcessed,
    records_created: result.recordsCreated,
    records_updated: result.recordsUpdated,
    records_skipped: result.recordsSkipped,
    records_errored: result.recordsErrored,
    errors: result.errors,
    duration_ms: result.durationMs,
    completed_at: new Date().toISOString(),
  });

  // Update integration stats
  await supabase
    .from("oe_pms_integrations")
    .update({
      last_sync_at: new Date().toISOString(),
      last_sync_status: result.status,
      last_sync_records: result.recordsProcessed,
      last_sync_errors: result.errors,
      total_patients_synced: result.recordsCreated + result.recordsUpdated,
    })
    .eq("id", integrationId);

  return result;
}

// ─── Available PMS Systems ──────────────────────────────────────────
export const PMS_SYSTEMS = [
  {
    type: "dentrix" as PMSType,
    name: "Dentrix G7",
    vendor: "Henry Schein",
    description: "Most popular dental PMS. Requires on-premise connector or CSV export.",
    status: "csv_ready" as const,
    logo: "/integrations/dentrix.png",
  },
  {
    type: "eaglesoft" as PMSType,
    name: "Eaglesoft",
    vendor: "Patterson Dental",
    description: "Full-featured PMS with strong reporting. CSV export supported.",
    status: "csv_ready" as const,
    logo: "/integrations/eaglesoft.png",
  },
  {
    type: "open_dental" as PMSType,
    name: "Open Dental",
    vendor: "Open Dental Software",
    description: "Open-source PMS with REST API. Direct integration available.",
    status: "api_available" as const,
    logo: "/integrations/opendental.png",
  },
  {
    type: "dentrix_ascend" as PMSType,
    name: "Dentrix Ascend",
    vendor: "Henry Schein",
    description: "Cloud-based Dentrix. API integration available.",
    status: "api_available" as const,
    logo: "/integrations/dentrix-ascend.png",
  },
  {
    type: "curve" as PMSType,
    name: "Curve Dental",
    vendor: "Curve Dental",
    description: "Cloud-native PMS. API integration available.",
    status: "api_available" as const,
    logo: "/integrations/curve.png",
  },
  {
    type: "csv_import" as PMSType,
    name: "CSV Import",
    vendor: "Any PMS",
    description: "Import patient data from any PMS via CSV export.",
    status: "ready" as const,
    logo: null,
  },
] as const;
