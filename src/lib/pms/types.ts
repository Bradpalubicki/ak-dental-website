// PMS (Practice Management System) Abstraction Types
// Designed to work with Dentrix (via Sikka ONE API) or any other PMS
// Currently using mock data — swap implementation when Sikka integration is ready

export interface PmsAppointment {
  id: string;
  pms_id: string; // External PMS appointment ID
  patient_id: string;
  patient_name: string;
  provider_id: string;
  provider_name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration_minutes: number;
  procedure_codes: string[]; // CDT codes
  procedure_names: string[];
  status:
    | "scheduled"
    | "checked_in"
    | "in_progress"
    | "completed"
    | "no_show"
    | "cancelled";
  note_id?: string; // Linked clinical note ID (if exists)
  note_status?: string;
}

export interface PmsPatient {
  id: string;
  pms_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  last_visit?: string;
  medical_alerts?: string[];
  allergies?: string[];
  insurance_provider?: string;
  insurance_member_id?: string;
}

export interface PmsProvider {
  id: string;
  name: string;
  role: "dentist" | "hygienist" | "assistant";
  credentials?: string;
}

export interface PmsSyncResult {
  appointments: PmsAppointment[];
  synced_at: string;
  source: "dentrix" | "sikka" | "nexhealth" | "mock";
}

export interface PmsPatientHistory {
  patient: PmsPatient;
  appointments: PmsAppointment[];
  last_procedures: { code: string; name: string; date: string }[];
}
