// Vertical Configuration System
// Master interface for multi-vertical engine support (counseling, dental, etc.)
// Each vertical implements this interface with its own terminology, services, templates, and behavior.

export type VerticalType = "counseling" | "dental" | "stylist" | "chiro" | "vet" | "privatepay-medical" | "home-services";

// ─── Terminology ────────────────────────────────────────────────────

export interface VerticalTerminology {
  customer: string;
  customerPlural: string;
  provider: string;
  providerPlural: string;
  visit: string;
  visitPlural: string;
  treatment: string;
  treatmentPlural: string;
  clinicalNote: string;
  clinicalNotePlural: string;
  chart: string;
  facility: string;
  recall: string;
  codeSystem: string; // "CPT" | "CDT" | "HCPCS" etc.
}

// ─── Note Templates ─────────────────────────────────────────────────

export type NoteType =
  | "soap"
  | "dap"
  | "birp"
  | "dental_soap"
  | "intake"
  | "discharge"
  | "free_form"
  | "dental_charting";

export interface NoteSection {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
}

export interface NoteTemplate {
  type: NoteType;
  label: string;
  description: string;
  sections: NoteSection[];
  defaultForServiceCodes?: string[];
}

// ─── SMS Templates ──────────────────────────────────────────────────

export interface SmsTemplateConfig {
  key: string;
  category: "appointment" | "nurture" | "reactivation" | "recall" | "general" | "clinical";
  body: string;
  variables: string[];
}

// ─── AI Prompts ─────────────────────────────────────────────────────

export interface AiPromptConfig {
  systemPrompt: string;
  noteSummaryPrompt: string;
  patientSummaryPrompt: string;
  leadResponsePrompt: string;
  tone: "warm" | "clinical" | "professional" | "friendly";
}

// ─── Insurance ──────────────────────────────────────────────────────

export interface InsuranceConfig {
  codeSystem: string;
  commonCodes: { code: string; description: string; defaultFee: number }[];
  verificationFields: string[];
  claimTypes: string[];
}

// ─── Scheduling ─────────────────────────────────────────────────────

export interface SchedulingConfig {
  defaultDuration: number; // minutes
  slotIncrement: number; // minutes
  bufferBetween: number; // minutes
  maxDailyPerProvider: number;
  allowOnlineBooking: boolean;
  allowWaitlist: boolean;
  reminderSchedule: { hours: number; channel: "sms" | "email" | "both" }[];
  cancellationPolicy: { hoursNotice: number; fee: number };
}

// ─── Compliance ─────────────────────────────────────────────────────

export interface ComplianceConfig {
  hipaaRequired: boolean;
  consentRequired: boolean;
  noteSignatureRequired: boolean;
  noteLockAfterSign: boolean;
  retentionYears: number;
  requiredTraining: string[];
}

// ─── Assessments ────────────────────────────────────────────────────

export interface AssessmentConfig {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  questionCount: number;
  scoringMethod: "sum" | "average" | "custom";
  severityRanges: { min: number; max: number; label: string; color: string }[];
  frequency: string; // e.g., "every session", "quarterly", "annual"
}

// ─── Intake Forms ───────────────────────────────────────────────────

export interface IntakeFormConfig {
  id: string;
  name: string;
  description: string;
  sections: string[];
  requiredBeforeFirstVisit: boolean;
}

// ─── Navigation ─────────────────────────────────────────────────────

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string;
  module: string;
  badge?: "count" | "dot" | "none";
}

export interface NavigationConfig {
  marketing: { name: string; href: string }[];
  dashboard: DashboardNavItem[];
  ctaLabel: string;
  ctaHref: string;
}

// ─── Roles ──────────────────────────────────────────────────────────

export interface RoleConfig {
  name: string;
  displayName: string;
  description: string;
  isSystem: boolean;
}

// ─── Service Categories ─────────────────────────────────────────────

export interface ServiceCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
}

// ─── Master Vertical Config ─────────────────────────────────────────

export interface VerticalConfig {
  type: VerticalType;
  label: string;
  description: string;

  // Terminology mapping
  terminology: VerticalTerminology;

  // Services offered
  services: {
    code: string;
    name: string;
    category: string;
    defaultDuration: number;
    defaultFee: number;
    onlineBookable: boolean;
  }[];
  serviceCategories: ServiceCategory[];

  // Clinical note templates
  noteTemplates: NoteTemplate[];

  // SMS templates
  smsTemplates: SmsTemplateConfig[];

  // AI behavior
  aiPrompts: AiPromptConfig;

  // Insurance & billing
  insurance: InsuranceConfig;

  // Scheduling behavior
  scheduling: SchedulingConfig;

  // Compliance requirements
  compliance: ComplianceConfig;

  // Assessments (screenings)
  assessments: AssessmentConfig[];

  // Intake forms
  intakeForms: IntakeFormConfig[];

  // Dashboard & navigation
  navigation: NavigationConfig;

  // Roles
  roles: RoleConfig[];
}
