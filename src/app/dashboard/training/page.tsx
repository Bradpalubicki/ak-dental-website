"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  Play,
  Clock,
  Shield,
  Users,
  Calendar,
  Wallet,
  Sparkles,
  MessageSquare,
  Phone,
  Award,
  Rocket,
  HelpCircle,
  Stethoscope,
  ClipboardList,
  UserCog,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: typeof Rocket;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface ComplianceItem {
  id: string;
  label: string;
  description: string;
}

// ── Data ───────────────────────────────────────────────────────────

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "profile",
    label: "Set up practice profile",
    description: "Configure practice name, address, hours, and contact info",
    href: "/dashboard/settings",
    icon: GraduationCap,
  },
  {
    id: "providers",
    label: "Add providers",
    description: "Create provider profiles, set availability and specialties",
    href: "/dashboard/providers",
    icon: UserCog,
  },
  {
    id: "first-patient",
    label: "Add your first patient",
    description: "Create a patient record with demographics and insurance",
    href: "/dashboard/patients",
    icon: Users,
  },
  {
    id: "first-appointment",
    label: "Schedule an appointment",
    description: "Book an appointment and set up reminders",
    href: "/dashboard/schedule",
    icon: Calendar,
  },
  {
    id: "insurance",
    label: "Set up insurance",
    description: "Add payer information and configure verification",
    href: "/dashboard/insurance",
    icon: Shield,
  },
  {
    id: "compliance",
    label: "Review compliance requirements",
    description: "Ensure HIPAA training and certifications are current",
    href: "/dashboard/compliance",
    icon: ClipboardList,
  },
];

const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "patient-management",
    title: "Patient Management",
    description:
      "Managing patients, leads, and your waitlist. Covers intake, demographics, insurance, and treatment history.",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    duration: "5 min read",
    difficulty: "Beginner",
  },
  {
    id: "appointments-scheduling",
    title: "Appointments & Scheduling",
    description:
      "Booking, confirming, and managing appointments. Day/week calendar view and provider scheduling.",
    icon: Calendar,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    duration: "6 min read",
    difficulty: "Beginner",
  },
  {
    id: "clinical-notes",
    title: "Clinical Notes",
    description:
      "SOAP documentation, templates, AI-assisted notes, and electronic signing for dental procedures.",
    icon: Stethoscope,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    duration: "8 min read",
    difficulty: "Beginner",
  },
  {
    id: "financial-operations",
    title: "Financial Operations",
    description:
      "Billing, insurance claims, Stripe checkout for treatment payments, and financial reporting.",
    icon: Wallet,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    duration: "10 min read",
    difficulty: "Intermediate",
  },
  {
    id: "ai-features",
    title: "AI Features",
    description:
      "AI Business Advisor, automated lead responses, clinical note assist, and AI-powered workflows.",
    icon: Sparkles,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    duration: "7 min read",
    difficulty: "Intermediate",
  },
  {
    id: "compliance-hr",
    title: "Compliance & HR",
    description:
      "HIPAA compliance, OSHA requirements, licensing management, HR documents, and staff certifications.",
    icon: Shield,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    duration: "12 min read",
    difficulty: "Advanced",
  },
  {
    id: "communication",
    title: "Communication",
    description:
      "Inbox management, outreach campaigns, AI call handling, and multi-channel patient communication.",
    icon: MessageSquare,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    duration: "6 min read",
    difficulty: "Beginner",
  },
  {
    id: "insurance-benefits",
    title: "Insurance & Benefits",
    description:
      "Eligibility verification, carrier setup, benefits breakdown, and automated insurance workflows.",
    icon: Shield,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    duration: "9 min read",
    difficulty: "Intermediate",
  },
];

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: "hipaa-privacy",
    label: "HIPAA Privacy Rule",
    description: "Protected health information, patient rights, and privacy notices",
  },
  {
    id: "hipaa-security",
    label: "HIPAA Security Rule",
    description: "Technical safeguards, access controls, and breach notification protocols",
  },
  {
    id: "osha-bloodborne",
    label: "OSHA Bloodborne Pathogens",
    description: "Exposure control, PPE use, and post-exposure procedures",
  },
  {
    id: "osha-hazcom",
    label: "OSHA Hazard Communication",
    description: "Chemical safety, SDS sheets, and dental office hazardous materials",
  },
  {
    id: "infection-control",
    label: "Infection Control & Sterilization",
    description: "CDC guidelines for dental infection prevention and instrument sterilization",
  },
  {
    id: "dental-radiography",
    label: "Dental Radiography Safety",
    description: "Radiation safety, ALARA principles, and state radiograph requirements",
  },
];

const DIFFICULTY_COLORS = {
  Beginner: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Intermediate: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Advanced: "bg-red-50 text-red-700 ring-red-600/20",
};

// ── localStorage helpers ───────────────────────────────────────────

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function loadDateMap(key: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveDateMap(key: string, map: Record<string, string>) {
  localStorage.setItem(key, JSON.stringify(map));
}

// ── Component ──────────────────────────────────────────────────────

export default function TrainingPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() =>
    loadSet("akdental-training-onboarding")
  );
  const [completedModules, setCompletedModules] = useState<Set<string>>(() =>
    loadSet("akdental-training-modules")
  );
  const [completedCompliance, setCompletedCompliance] = useState<Set<string>>(() =>
    loadSet("akdental-training-compliance")
  );
  const [complianceDates, setComplianceDates] = useState<Record<string, string>>(() =>
    loadDateMap("akdental-training-compliance-dates")
  );

  const mounted = typeof window !== "undefined";

  const toggleStep = useCallback((id: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      saveSet("akdental-training-onboarding", next);
      return next;
    });
  }, []);

  const toggleModule = useCallback((id: string) => {
    setCompletedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      saveSet("akdental-training-modules", next);
      return next;
    });
  }, []);

  const toggleCompliance = useCallback((id: string) => {
    setCompletedCompliance((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setComplianceDates((d) => {
          const updated = { ...d };
          delete updated[id];
          saveDateMap("akdental-training-compliance-dates", updated);
          return updated;
        });
      } else {
        next.add(id);
        setComplianceDates((d) => {
          const updated = { ...d, [id]: new Date().toISOString() };
          saveDateMap("akdental-training-compliance-dates", updated);
          return updated;
        });
      }
      saveSet("akdental-training-compliance", next);
      return next;
    });
  }, []);

  const onboardingProgress = mounted ? Math.round((completedSteps.size / ONBOARDING_STEPS.length) * 100) : 0;
  const complianceProgress = mounted ? Math.round((completedCompliance.size / COMPLIANCE_ITEMS.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Training &amp; Onboarding Center</h1>
          <p className="text-sm text-slate-500">Get up to speed with One Engine&apos;s platform features and compliance requirements</p>
        </div>
      </div>

      {/* Getting Started Wizard */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
              <Rocket className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Getting Started</h2>
              <p className="text-[11px] text-slate-400">Complete these steps to set up your practice</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">{completedSteps.size}/{ONBOARDING_STEPS.length} completed</span>
            <span className="text-xs font-bold text-cyan-600">{onboardingProgress}%</span>
          </div>
        </div>

        <div className="px-6 pt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${onboardingProgress}%` }}
            />
          </div>
        </div>

        <div className="divide-y divide-slate-50 px-6 pb-2 pt-3">
          {ONBOARDING_STEPS.map((step, index) => {
            const done = completedSteps.has(step.id);
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex items-center gap-4 py-3.5 transition-colors hover:bg-slate-50/50">
                <button onClick={() => toggleStep(step.id)} className="shrink-0 focus:outline-none" aria-label={`Mark "${step.label}" as ${done ? "incomplete" : "complete"}`}>
                  {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                </button>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{index + 1}</div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                  <StepIcon className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${done ? "text-slate-400 line-through" : "text-slate-900"}`}>{step.label}</p>
                  <p className="text-[11px] text-slate-400">{step.description}</p>
                </div>
                <Link href={step.href} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700">
                  Go <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Training Modules */}
      <div>
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
            <BookOpen className="h-4 w-4 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Feature Training Modules</h2>
            <p className="text-[11px] text-slate-400">Learn each area of the platform at your own pace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TRAINING_MODULES.map((mod) => {
            const done = completedModules.has(mod.id);
            const ModIcon = mod.icon;
            return (
              <div key={mod.id} className={`group relative rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${done ? "border-emerald-200/80" : "border-slate-200/80"}`}>
                {done && (
                  <div className="absolute right-3 top-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${mod.iconBg}`}>
                      <ModIcon className={`h-5 w-5 ${mod.iconColor}`} />
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${DIFFICULTY_COLORS[mod.difficulty]}`}>
                      {mod.difficulty}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{mod.description}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{mod.duration}</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 px-5 py-3">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${done ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"}`}
                  >
                    {done ? <><CheckCircle2 className="h-3.5 w-3.5" /> Completed</> : <><Play className="h-3.5 w-3.5" /> Start Module</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance Training */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <Award className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Required Compliance Training</h2>
              <p className="text-[11px] text-slate-400">All staff must complete these modules annually</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">{completedCompliance.size}/{COMPLIANCE_ITEMS.length} completed</span>
            <span className="text-xs font-bold text-red-600">{complianceProgress}%</span>
          </div>
        </div>

        <div className="px-6 pt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
              style={{ width: `${complianceProgress}%` }}
            />
          </div>
        </div>

        <div className="divide-y divide-slate-50 px-6 pb-2 pt-3">
          {COMPLIANCE_ITEMS.map((item) => {
            const done = completedCompliance.has(item.id);
            const dateStr = complianceDates[item.id];
            return (
              <div key={item.id} className="flex items-center gap-4 py-3.5 transition-colors hover:bg-slate-50/50">
                <button onClick={() => toggleCompliance(item.id)} className="shrink-0 focus:outline-none" aria-label={`Mark "${item.label}" as ${done ? "incomplete" : "complete"}`}>
                  {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                </button>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50/60">
                  <Shield className="h-4 w-4 text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${done ? "text-slate-400 line-through" : "text-slate-900"}`}>{item.label}</p>
                  <p className="text-[11px] text-slate-400">{item.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  {done && dateStr ? (
                    <div>
                      <p className="text-[11px] font-medium text-emerald-600">Completed</p>
                      <p className="text-[10px] text-slate-400">{new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">Required</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Help */}
      <div>
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <HelpCircle className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Quick Help</h2>
            <p className="text-[11px] text-slate-400">Need assistance? We&apos;re here to help</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/dashboard/advisor" className="group flex items-center gap-4 rounded-xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 p-5 transition-all hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">Ask the AI Assistant</p>
              <p className="text-[11px] text-slate-500">Get instant answers about the platform, compliance, or operations</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-cyan-500" />
          </Link>

          <a href={`mailto:support@nustack.digital`} className="group flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <Phone className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">Contact Support</p>
              <p className="text-[11px] text-slate-500">support@nustack.digital</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
          </a>

          <div className="group flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-5 opacity-75">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <BookOpen className="h-5 w-5 text-slate-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">Documentation</p>
              <p className="text-[11px] text-slate-500">Detailed guides and reference docs — coming soon</p>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
