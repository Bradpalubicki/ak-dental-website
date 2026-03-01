// PMS Service — Abstract PMS interface
// Currently returns mock data simulating a real Dentrix day
// Swap implementation to Sikka ONE API or Dentrix direct when ready

import type {
  PmsAppointment,
  PmsPatient,
  PmsProvider,
  PmsSyncResult,
  PmsPatientHistory,
} from "./types";

// ─── Mock Providers ────────────────────────────────────────────────

const MOCK_PROVIDERS: PmsProvider[] = [
  {
    id: "prov-001",
    name: "Dr. Alex Kim",
    role: "dentist",
    credentials: "DDS",
  },
  {
    id: "prov-002",
    name: "Sarah Chen, RDH",
    role: "hygienist",
    credentials: "RDH",
  },
];

// ─── Mock Patients ─────────────────────────────────────────────────

const MOCK_PATIENTS: PmsPatient[] = [
  {
    id: "pat-001",
    pms_id: "DX-10234",
    first_name: "John",
    last_name: "Smith",
    date_of_birth: "1978-03-15",
    last_visit: "2025-08-12",
    medical_alerts: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin"],
    insurance_provider: "Delta Dental",
    insurance_member_id: "DD-8829341",
  },
  {
    id: "pat-002",
    pms_id: "DX-10412",
    first_name: "Maria",
    last_name: "Garcia",
    date_of_birth: "1985-11-22",
    last_visit: "2026-01-28",
    medical_alerts: [],
    allergies: [],
    insurance_provider: "Cigna Dental",
    insurance_member_id: "CIG-5523901",
  },
  {
    id: "pat-003",
    pms_id: "DX-10578",
    first_name: "David",
    last_name: "Chen",
    date_of_birth: "1992-07-08",
    last_visit: undefined,
    medical_alerts: ["Asthma"],
    allergies: ["Latex", "Codeine"],
    insurance_provider: "MetLife Dental",
    insurance_member_id: "ML-7712045",
  },
  {
    id: "pat-004",
    pms_id: "DX-10621",
    first_name: "Sarah",
    last_name: "Johnson",
    date_of_birth: "1990-01-30",
    last_visit: "2025-08-20",
    medical_alerts: [],
    allergies: [],
    insurance_provider: "Delta Dental",
    insurance_member_id: "DD-6651203",
  },
  {
    id: "pat-005",
    pms_id: "DX-10702",
    first_name: "Robert",
    last_name: "Williams",
    date_of_birth: "1965-09-14",
    last_visit: "2025-12-03",
    medical_alerts: [
      "Heart Murmur",
      "Anticoagulant therapy (Warfarin)",
    ],
    allergies: ["Sulfa drugs"],
    insurance_provider: "Aetna Dental",
    insurance_member_id: "AET-3390821",
  },
  {
    id: "pat-006",
    pms_id: "DX-10815",
    first_name: "Emily",
    last_name: "Martinez",
    date_of_birth: "2001-04-18",
    last_visit: "2026-01-10",
    medical_alerts: [],
    allergies: ["Ibuprofen"],
    insurance_provider: "Guardian Dental",
    insurance_member_id: "GD-1143789",
  },
  {
    id: "pat-007",
    pms_id: "DX-10923",
    first_name: "James",
    last_name: "Thompson",
    date_of_birth: "1958-12-02",
    last_visit: "2025-11-18",
    medical_alerts: ["Pace Maker", "Joint Replacement (R. Knee)"],
    allergies: [],
    insurance_provider: "GEHA Dental",
    insurance_member_id: "GH-8857123",
  },
  {
    id: "pat-008",
    pms_id: "DX-11001",
    first_name: "Lisa",
    last_name: "Anderson",
    date_of_birth: "1988-06-25",
    last_visit: "2025-07-30",
    medical_alerts: [],
    allergies: [],
    insurance_provider: "MetLife Dental",
    insurance_member_id: "ML-4467821",
  },
  {
    id: "pat-009",
    pms_id: "DX-11102",
    first_name: "Michael",
    last_name: "Brown",
    date_of_birth: "1975-02-11",
    last_visit: "2026-02-01",
    medical_alerts: ["Sleep Apnea (CPAP)"],
    allergies: ["Amoxicillin"],
    insurance_provider: "Cigna Dental",
    insurance_member_id: "CIG-7731002",
  },
  {
    id: "pat-010",
    pms_id: "DX-11200",
    first_name: "Jennifer",
    last_name: "Davis",
    date_of_birth: "1995-10-07",
    last_visit: "2025-09-15",
    medical_alerts: ["Pregnant (2nd trimester)"],
    allergies: [],
    insurance_provider: "Delta Dental",
    insurance_member_id: "DD-2289534",
  },
];

// ─── Procedure Code Lookup ─────────────────────────────────────────

const PROCEDURE_NAMES: Record<string, string> = {
  D0120: "Periodic Oral Evaluation",
  D0150: "Comprehensive Oral Evaluation",
  D0140: "Limited Oral Evaluation (Emergency)",
  D0210: "Full Mouth X-Rays",
  D0220: "Periapical X-Ray",
  D0274: "Bitewing X-Rays (4 films)",
  D0330: "Panoramic X-Ray",
  D1110: "Adult Prophylaxis (Cleaning)",
  D1120: "Child Prophylaxis",
  D1206: "Fluoride Treatment",
  D2140: "Amalgam Filling (1 surface)",
  D2150: "Amalgam Filling (2 surface)",
  D2391: "Composite Filling (1 surface, posterior)",
  D2392: "Composite Filling (2 surface, posterior)",
  D2740: "Crown (porcelain/ceramic)",
  D2750: "Crown (porcelain fused to metal)",
  D3310: "Root Canal (anterior)",
  D3320: "Root Canal (premolar)",
  D3330: "Root Canal (molar)",
  D4341: "Scaling & Root Planing (per quadrant)",
  D4910: "Periodontal Maintenance",
  D7140: "Extraction (erupted tooth)",
  D7210: "Surgical Extraction",
  D9110: "Palliative Treatment (emergency)",
};

function getProcedureNames(codes: string[]): string[] {
  return codes.map((c) => PROCEDURE_NAMES[c] || c);
}

// ─── Mock Appointments (Today's schedule) ──────────────────────────

function generateTodayAppointments(): PmsAppointment[] {
  const today = new Date().toISOString().split("T")[0];

  return [
    {
      id: "appt-001",
      pms_id: "DX-A-50123",
      patient_id: "pat-001",
      patient_name: "John Smith",
      provider_id: "prov-001",
      provider_name: "Dr. Alex Kim",
      date: today,
      time: "08:00",
      duration_minutes: 30,
      procedure_codes: ["D0120", "D0274"],
      procedure_names: getProcedureNames(["D0120", "D0274"]),
      status: "completed",
      note_id: "mock-note-signed-001",
      note_status: "signed",
    },
    {
      id: "appt-002",
      pms_id: "DX-A-50124",
      patient_id: "pat-004",
      patient_name: "Sarah Johnson",
      provider_id: "prov-002",
      provider_name: "Sarah Chen, RDH",
      date: today,
      time: "08:00",
      duration_minutes: 60,
      procedure_codes: ["D1110", "D0274"],
      procedure_names: getProcedureNames(["D1110", "D0274"]),
      status: "completed",
      note_id: "mock-note-signed-002",
      note_status: "signed",
    },
    {
      id: "appt-003",
      pms_id: "DX-A-50125",
      patient_id: "pat-002",
      patient_name: "Maria Garcia",
      provider_id: "prov-001",
      provider_name: "Dr. Alex Kim",
      date: today,
      time: "08:45",
      duration_minutes: 90,
      procedure_codes: ["D2740"],
      procedure_names: getProcedureNames(["D2740"]),
      status: "completed",
      note_id: "mock-note-draft-001",
      note_status: "draft",
    },
    {
      id: "appt-004",
      pms_id: "DX-A-50126",
      patient_id: "pat-003",
      patient_name: "David Chen",
      provider_id: "prov-001",
      provider_name: "Dr. Alex Kim",
      date: today,
      time: "10:30",
      duration_minutes: 45,
      procedure_codes: ["D0150", "D0210"],
      procedure_names: getProcedureNames(["D0150", "D0210"]),
      status: "in_progress",
    },
    {
      id: "appt-005",
      pms_id: "DX-A-50127",
      patient_id: "pat-006",
      patient_name: "Emily Martinez",
      provider_id: "prov-002",
      provider_name: "Sarah Chen, RDH",
      date: today,
      time: "09:15",
      duration_minutes: 60,
      procedure_codes: ["D1110", "D1206"],
      procedure_names: getProcedureNames(["D1110", "D1206"]),
      status: "completed",
      note_id: "mock-note-progress-001",
      note_status: "draft",
    },
    {
      id: "appt-006",
      pms_id: "DX-A-50128",
      patient_id: "pat-005",
      patient_name: "Robert Williams",
      provider_id: "prov-001",
      provider_name: "Dr. Alex Kim",
      date: today,
      time: "11:30",
      duration_minutes: 30,
      procedure_codes: ["D7140"],
      procedure_names: getProcedureNames(["D7140"]),
      status: "scheduled",
    },
    {
      id: "appt-007",
      pms_id: "DX-A-50129",
      patient_id: "pat-008",
      patient_name: "Lisa Anderson",
      provider_id: "prov-002",
      provider_name: "Sarah Chen, RDH",
      date: today,
      time: "10:30",
      duration_minutes: 60,
      procedure_codes: ["D4341"],
      procedure_names: getProcedureNames(["D4341"]),
      status: "in_progress",
    },
    {
      id: "appt-008",
      pms_id: "DX-A-50130",
      patient_id: "pat-007",
      patient_name: "James Thompson",
      provider_id: "prov-001",
      provider_name: "Dr. Alex Kim",
      date: today,
      time: "13:00",
      duration_minutes: 90,
      procedure_codes: ["D3330"],
      procedure_names: getProcedureNames(["D3330"]),
      status: "scheduled",
    },
    {
      id: "appt-009",
      pms_id: "DX-A-50131",
      patient_id: "pat-009",
      patient_name: "Michael Brown",
      provider_id: "prov-001",
      provider_name: "Dr. Alex Kim",
      date: today,
      time: "15:00",
      duration_minutes: 45,
      procedure_codes: ["D2391", "D2392"],
      procedure_names: getProcedureNames(["D2391", "D2392"]),
      status: "scheduled",
    },
    {
      id: "appt-010",
      pms_id: "DX-A-50132",
      patient_id: "pat-010",
      patient_name: "Jennifer Davis",
      provider_id: "prov-002",
      provider_name: "Sarah Chen, RDH",
      date: today,
      time: "13:30",
      duration_minutes: 60,
      procedure_codes: ["D4910"],
      procedure_names: getProcedureNames(["D4910"]),
      status: "scheduled",
    },
  ];
}

// ─── Previous Visit Mock Data ──────────────────────────────────────

function generatePatientHistory(patientId: string): PmsAppointment[] {
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId);
  if (!patient || !patient.last_visit) return [];

  // Generate 2-3 past visits
  return [
    {
      id: `hist-${patientId}-1`,
      pms_id: `DX-H-${patientId}-1`,
      patient_id: patientId,
      patient_name: `${patient.first_name} ${patient.last_name}`,
      provider_id: "prov-001",
      provider_name: "Dr. Alex Kim",
      date: patient.last_visit,
      time: "09:00",
      duration_minutes: 30,
      procedure_codes: ["D0120", "D0274"],
      procedure_names: getProcedureNames(["D0120", "D0274"]),
      status: "completed",
      note_id: `hist-note-${patientId}-1`,
      note_status: "signed",
    },
    {
      id: `hist-${patientId}-2`,
      pms_id: `DX-H-${patientId}-2`,
      patient_id: patientId,
      patient_name: `${patient.first_name} ${patient.last_name}`,
      provider_id: "prov-002",
      provider_name: "Sarah Chen, RDH",
      date: "2025-06-15",
      time: "10:00",
      duration_minutes: 60,
      procedure_codes: ["D1110"],
      procedure_names: getProcedureNames(["D1110"]),
      status: "completed",
      note_id: `hist-note-${patientId}-2`,
      note_status: "signed",
    },
  ];
}

// ─── Public API ────────────────────────────────────────────────────

/**
 * Get today's schedule from PMS
 * @param providerId Optional filter by provider
 * @param date Optional specific date (defaults to today)
 */
export async function getTodaysSchedule(
  providerId?: string,
  date?: string
): Promise<PmsSyncResult> {
  // Mock implementation — replace with Sikka ONE API call
  let appointments = generateTodayAppointments();

  if (date) {
    appointments = appointments.map((a) => ({ ...a, date }));
  }

  if (providerId) {
    appointments = appointments.filter((a) => a.provider_id === providerId);
  }

  // Sort by time
  appointments.sort((a, b) => a.time.localeCompare(b.time));

  return {
    appointments,
    synced_at: new Date().toISOString(),
    source: "mock",
  };
}

/**
 * Get a patient's appointment history
 */
export async function getPatientHistory(
  patientId: string
): Promise<PmsPatientHistory> {
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId);
  if (!patient) {
    return {
      patient: {
        id: patientId,
        pms_id: "unknown",
        first_name: "Unknown",
        last_name: "Patient",
      },
      appointments: [],
      last_procedures: [],
    };
  }

  const history = generatePatientHistory(patientId);

  return {
    patient,
    appointments: history,
    last_procedures: history.flatMap((a) =>
      a.procedure_codes.map((code, i) => ({
        code,
        name: a.procedure_names[i] || code,
        date: a.date,
      }))
    ),
  };
}

/**
 * Get patient details by ID
 */
export async function getPatient(
  patientId: string
): Promise<PmsPatient | null> {
  return MOCK_PATIENTS.find((p) => p.id === patientId) || null;
}

/**
 * Get all providers
 */
export async function getProviders(): Promise<PmsProvider[]> {
  return MOCK_PROVIDERS;
}

/**
 * Push a clinical note back to PMS
 * @returns success status
 */
export async function pushNoteToPms(
  noteId: string
): Promise<{ success: boolean; error?: string }> {
  // Mock implementation — in production, this would call Sikka ONE API
  // to push the note content back to Dentrix
  void noteId; // mock — Sikka ONE API integration pending
  return { success: true };
}

/**
 * Get procedure name from CDT code
 */
export function getProcedureName(code: string): string {
  return PROCEDURE_NAMES[code] || code;
}

/**
 * Get all available procedure names
 */
export function getAllProcedureNames(): Record<string, string> {
  return { ...PROCEDURE_NAMES };
}
