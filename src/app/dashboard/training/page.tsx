"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Shield,
  Users,
  Calendar,
  CheckCircle2,
  Circle,
  ExternalLink,
  Award,
  AlertTriangle,
  Clock,
  Plus,
  Download,
  Building2,
  Globe,
  Zap,
  Play,
  ChevronRight,
  FileCheck,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────

type TabId = "courses" | "tracker" | "compliance" | "reporting";
type CourseFilter = "All" | "Clinical" | "Compliance" | "Practice Management" | "Podcasts";
type ComplianceStatus = "Complete" | "Overdue" | "Due Soon";

interface CECourse {
  id: string;
  title: string;
  topic: string;
  sponsor: string;
  format: "Webinar" | "On-Demand" | "Podcast";
  credits: number;
  instructor: string;
  duration: string;
  category: CourseFilter;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  required: number | null;
  completed: number | null;
  licenseRenews: string | null;
}

interface ComplianceModule {
  id: string;
  title: string;
  frequency: string;
  lastCompleted: string | null;
  nextDue: string | null;
  status: ComplianceStatus;
  link: string;
}

interface StateBoard {
  id: string;
  state: string;
  board: string;
  status: "Setup Required" | "Not in covered states";
}

// ── Data ───────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: typeof GraduationCap }[] = [
  { id: "courses", label: "CE Courses", icon: GraduationCap },
  { id: "tracker", label: "Staff CE Tracker", icon: Users },
  { id: "compliance", label: "Compliance Training", icon: Shield },
  { id: "reporting", label: "Board Reporting", icon: FileCheck },
];

// Platform training shortcuts (rendered above tabs)
const PLATFORM_TRAINING = [
  { label: "HIPAA Quiz", href: "/dashboard/training/hipaa", color: "bg-blue-50 border-blue-200 text-blue-700", required: true },
  { label: "OSHA Quiz", href: "/dashboard/training/osha", color: "bg-orange-50 border-orange-200 text-orange-700", required: true, clinical: true },
  { label: "Scheduling & Insurance", href: "/dashboard/training/scheduling-insurance", color: "bg-slate-50 border-slate-200 text-slate-700", required: false },
  { label: "Clinical Documentation", href: "/dashboard/training/clinical-documentation", color: "bg-slate-50 border-slate-200 text-slate-700", required: false, clinical: true },
  { label: "Treatment Presentation", href: "/dashboard/training/treatment-presentation", color: "bg-slate-50 border-slate-200 text-slate-700", required: false, clinical: true },
  { label: "Collections & Financials", href: "/dashboard/training/collections-financials", color: "bg-slate-50 border-slate-200 text-slate-700", required: false },
  { label: "Staff Training Tracker", href: "/dashboard/training/staff", color: "bg-emerald-50 border-emerald-200 text-emerald-700", required: false },
];

const CE_COURSES: CECourse[] = [
  {
    id: "c1",
    title: "Advanced Composite Restorations: Hands-On Techniques",
    topic: "D2391",
    sponsor: "Ivoclar Vivadent",
    format: "Webinar",
    credits: 2,
    instructor: "Dr. Michael Rouse",
    duration: "2h 00m",
    category: "Clinical",
  },
  {
    id: "c2",
    title: "Implant Placement & Immediate Loading Protocols",
    topic: "D6010",
    sponsor: "Nobel Biocare",
    format: "On-Demand",
    credits: 3,
    instructor: "Dr. Steven Rasner",
    duration: "3h 15m",
    category: "Clinical",
  },
  {
    id: "c3",
    title: "Orthodontic Essentials for the General Dentist",
    topic: "D8010",
    sponsor: "Align Technology",
    format: "Webinar",
    credits: 2,
    instructor: "Dr. Lee Ann Brady",
    duration: "2h 00m",
    category: "Clinical",
  },
  {
    id: "c4",
    title: "HIPAA Dental Compliance: 2026 Update",
    topic: "HIPAA",
    sponsor: "Dental Compliance Specialists",
    format: "On-Demand",
    credits: 1,
    instructor: "Amber Crawford, JD",
    duration: "1h 00m",
    category: "Compliance",
  },
  {
    id: "c5",
    title: "OSHA Infection Control Annual Refresher",
    topic: "OSHA",
    sponsor: "360training",
    format: "On-Demand",
    credits: 1,
    instructor: "Sharon Boyd, RDH",
    duration: "1h 00m",
    category: "Compliance",
  },
  {
    id: "c6",
    title: "Dental Coding Mastery: CDT 2026 Changes",
    topic: "Billing/Coding",
    sponsor: "ADA",
    format: "Webinar",
    credits: 2,
    instructor: "Dr. Charles Blair",
    duration: "2h 00m",
    category: "Practice Management",
  },
  {
    id: "c7",
    title: "Conscious Sedation in the Dental Office",
    topic: "D9930",
    sponsor: "Septodont",
    format: "On-Demand",
    credits: 4,
    instructor: "Dr. Peter Nkansah",
    duration: "4h 00m",
    category: "Clinical",
  },
  {
    id: "c8",
    title: "Pediatric Behavior Management Strategies",
    topic: "D9920",
    sponsor: "Dentsply Sirona",
    format: "Podcast",
    credits: 1,
    instructor: "Dr. Travis Nelson",
    duration: "45m",
    category: "Podcasts",
  },
  {
    id: "c9",
    title: "Endodontic Retreatment: Current Protocols",
    topic: "D3346",
    sponsor: "Dentsply Tulsa",
    format: "On-Demand",
    credits: 2,
    instructor: "Dr. John Rhodes",
    duration: "2h 30m",
    category: "Clinical",
  },
  {
    id: "c10",
    title: "Periodontal-Systemic Connection: 2026 Evidence",
    topic: "D4341",
    sponsor: "Colgate Oral Health",
    format: "Webinar",
    credits: 2,
    instructor: "Dr. Robert Genco",
    duration: "2h 00m",
    category: "Clinical",
  },
  {
    id: "c11",
    title: "Practice Financial Performance & KPI Management",
    topic: "Business",
    sponsor: "Henry Schein",
    format: "On-Demand",
    credits: 2,
    instructor: "Roger Levin, DDS",
    duration: "2h 00m",
    category: "Practice Management",
  },
  {
    id: "c12",
    title: "Dental Business Podcast: Hiring & Retention",
    topic: "HR",
    sponsor: "Patterson Dental",
    format: "Podcast",
    credits: 1,
    instructor: "Kirk Behrendt",
    duration: "50m",
    category: "Podcasts",
  },
];

const STAFF_MEMBERS: StaffMember[] = [
  {
    id: "s1",
    name: "Dr. Alex Chireau",
    role: "Dentist",
    required: 40,
    completed: 28,
    licenseRenews: "Dec 2025",
  },
  {
    id: "s2",
    name: "Sarah Mitchell",
    role: "Hygienist",
    required: 30,
    completed: 22,
    licenseRenews: "Dec 2025",
  },
  {
    id: "s3",
    name: "Jennifer Walsh",
    role: "Dental Assistant",
    required: 20,
    completed: 20,
    licenseRenews: "Jun 2026",
  },
  {
    id: "s4",
    name: "Robert Chen",
    role: "Office Manager",
    required: null,
    completed: null,
    licenseRenews: null,
  },
  {
    id: "s5",
    name: "Maria Gonzalez",
    role: "Front Desk",
    required: null,
    completed: null,
    licenseRenews: null,
  },
];

const COMPLIANCE_MODULES: ComplianceModule[] = [
  {
    id: "cm1",
    title: "HIPAA Privacy Rule",
    frequency: "Annual",
    lastCompleted: "Jan 15, 2026",
    nextDue: "Jan 15, 2027",
    status: "Complete",
    link: "https://www.360training.com",
  },
  {
    id: "cm2",
    title: "HIPAA Security Rule",
    frequency: "Annual",
    lastCompleted: "Jan 15, 2026",
    nextDue: "Jan 15, 2027",
    status: "Complete",
    link: "https://www.360training.com",
  },
  {
    id: "cm3",
    title: "OSHA Bloodborne Pathogens",
    frequency: "Annual",
    lastCompleted: "Feb 1, 2026",
    nextDue: "Feb 1, 2027",
    status: "Complete",
    link: "https://www.360training.com",
  },
  {
    id: "cm4",
    title: "OSHA Hazard Communication",
    frequency: "Annual",
    lastCompleted: "Feb 1, 2026",
    nextDue: "Feb 1, 2027",
    status: "Complete",
    link: "https://www.360training.com",
  },
  {
    id: "cm5",
    title: "Infection Control & Sterilization",
    frequency: "Annual",
    lastCompleted: "Feb 1, 2026",
    nextDue: "Feb 1, 2027",
    status: "Complete",
    link: "https://www.360training.com",
  },
  {
    id: "cm6",
    title: "Dental Radiography Safety",
    frequency: "Annual",
    lastCompleted: "Mar 1, 2026",
    nextDue: "Mar 1, 2027",
    status: "Complete",
    link: "https://www.360training.com",
  },
  {
    id: "cm7",
    title: "DEA / Controlled Substance Awareness",
    frequency: "Annual",
    lastCompleted: null,
    nextDue: null,
    status: "Overdue",
    link: "https://www.360training.com",
  },
  {
    id: "cm8",
    title: "Emergency Preparedness (CPR/AED review)",
    frequency: "Annual",
    lastCompleted: "Nov 10, 2025",
    nextDue: "Nov 10, 2026",
    status: "Due Soon",
    link: "https://www.360training.com",
  },
];

const STATE_BOARDS: StateBoard[] = [
  { id: "nv", state: "Nevada (NV)", board: "NV Board of Dental Examiners", status: "Setup Required" },
  { id: "fl", state: "Florida (FL)", board: "FL Board of Dentistry", status: "Not in covered states" },
  { id: "ga", state: "Georgia (GA)", board: "GA Board of Dentistry", status: "Not in covered states" },
  { id: "ky", state: "Kentucky (KY)", board: "KY Board of Dentistry", status: "Not in covered states" },
  { id: "va", state: "Virginia (VA)", board: "VA Board of Dentistry", status: "Not in covered states" },
  { id: "tn", state: "Tennessee (TN)", board: "TN Board of Dentistry", status: "Not in covered states" },
];

// ── Helpers ────────────────────────────────────────────────────────

const COURSE_FILTER_OPTIONS: CourseFilter[] = [
  "All",
  "Clinical",
  "Compliance",
  "Practice Management",
  "Podcasts",
];

function formatBadge(format: CECourse["format"]) {
  const map: Record<CECourse["format"], string> = {
    Webinar: "bg-blue-50 text-blue-700 ring-blue-600/20",
    "On-Demand": "bg-purple-50 text-purple-700 ring-purple-600/20",
    Podcast: "bg-amber-50 text-amber-700 ring-amber-600/20",
  };
  return map[format];
}

function staffProgressColor(required: number, completed: number): string {
  const pct = (completed / required) * 100;
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 60) return "bg-amber-400";
  return "bg-red-500";
}

function complianceStatusBadge(status: ComplianceStatus): string {
  if (status === "Complete") return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  if (status === "Overdue") return "bg-red-50 text-red-700 ring-red-600/20";
  return "bg-amber-50 text-amber-700 ring-amber-600/20";
}

function complianceIcon(status: ComplianceStatus) {
  if (status === "Complete") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "Overdue") return <AlertTriangle className="h-4 w-4 text-red-500" />;
  return <Clock className="h-4 w-4 text-amber-500" />;
}

// ── Component ──────────────────────────────────────────────────────

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<TabId>("courses");
  const [courseFilter, setCourseFilter] = useState<CourseFilter>("All");
  const [addCEModal, setAddCEModal] = useState<string | null>(null);
  const [addCEHours, setAddCEHours] = useState("");
  const [staffHours, setStaffHours] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("akdental-compliance-v2");
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return {};
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("akdental-compliance-v2", JSON.stringify(staffHours));
    }
  }, [staffHours]);

  const filteredCourses =
    courseFilter === "All"
      ? CE_COURSES
      : CE_COURSES.filter((c) => c.category === courseFilter);

  function handleAddCE(staffId: string) {
    const hrs = parseFloat(addCEHours);
    if (!isNaN(hrs) && hrs > 0) {
      setStaffHours((prev) => ({ ...prev, [staffId]: (prev[staffId] ?? 0) + hrs }));
    }
    setAddCEModal(null);
    setAddCEHours("");
  }

  const staffWithHours = STAFF_MEMBERS.map((s) => ({
    ...s,
    completed: s.completed !== null ? s.completed + (staffHours[s.id] ?? 0) : null,
  }));

  const trackedCount = staffWithHours.filter((s) => s.required !== null).length;
  const avgCompletion =
    trackedCount > 0
      ? Math.round(
          staffWithHours
            .filter((s) => s.required !== null && s.completed !== null)
            .reduce((acc, s) => acc + Math.min(100, ((s.completed ?? 0) / (s.required ?? 1)) * 100), 0) /
            trackedCount
        )
      : 0;
  const expiringSoon = staffWithHours.filter(
    (s) => s.licenseRenews && s.licenseRenews.includes("2025")
  ).length;
  const overdueItems = staffWithHours.filter(
    (s) => s.required !== null && s.completed !== null && s.completed < (s.required ?? 0)
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CE &amp; Training Center</h1>
          <p className="text-sm text-slate-500">
            Continuing education, staff tracking, compliance training &amp; board reporting
          </p>
        </div>
      </div>

      {/* Platform Training Quick Links */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Platform & Compliance Training</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {PLATFORM_TRAINING.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className={`flex items-center justify-between border rounded-lg px-3 py-2 text-xs font-medium hover:opacity-80 transition-opacity ${t.color}`}
            >
              <span>{t.label}</span>
              {t.required && <span className="ml-1 text-[10px] bg-white/70 rounded px-1 py-0.5">Required</span>}
            </a>
          ))}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab 1: CE Courses ── */}
      {activeTab === "courses" && (
        <div className="space-y-5">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">CE Course Discovery</h2>
              <p className="text-xs text-slate-500">Browse dental-specific CE courses powered by Viva Learning</p>
            </div>
          </div>

          {/* Viva Learning Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-cyan-600" />
              <div>
                <p className="text-sm font-bold text-cyan-900">
                  Powered by Viva Learning · 460K+ dental professionals · AGD PACE Accredited
                </p>
                <p className="text-xs text-cyan-700">
                  The #1 dental CE platform — clinical, compliance, and practice management
                </p>
              </div>
            </div>
            <a
              href="https://vivalearning.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-700"
            >
              Browse All on Viva Learning
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Coming Soon Overlay Note */}
          <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Clock className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Coming Soon:</span> Live course data via Viva Learning API — integration in progress. Showing demo data.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {COURSE_FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setCourseFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  courseFilter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex-1 p-5">
                  {/* Topic + Format badges */}
                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-600/20">
                      {course.topic}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${formatBadge(course.format)}`}
                    >
                      {course.format}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold leading-snug text-slate-900">{course.title}</h3>

                  <p className="mt-1.5 text-[11px] text-slate-500">
                    {course.instructor} · {course.sponsor}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-cyan-500" />
                      {course.credits} CE credit{course.credits !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* AGD PACE badge */}
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-[10px] font-semibold text-emerald-700">AGD PACE Accredited</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-5 py-3">
                  <a
                    href="https://vivalearning.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 transition-colors hover:bg-cyan-100"
                  >
                    <Play className="h-3 w-3" />
                    View on Viva Learning
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 2: Staff CE Tracker ── */}
      {activeTab === "tracker" && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Staff Continuing Education Tracker</h2>
              <p className="text-xs text-slate-500">Track CE hours and license renewal deadlines per team member</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Staff Tracked", value: staffWithHours.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Avg Completion", value: `${avgCompletion}%`, icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Licenses Expiring < 90d", value: expiringSoon, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Overdue CE Items", value: overdueItems, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            ].map((card) => {
              const CardIcon = card.icon;
              return (
                <div key={card.label} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                    <CardIcon className={`h-4 w-4 ${card.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                  <p className="text-[11px] text-slate-500">{card.label}</p>
                </div>
              );
            })}
          </div>

          {/* Staff Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold text-slate-500">
                  <th className="px-5 py-3">Staff Member</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Progress</th>
                  <th className="px-5 py-3">Required / Biennium</th>
                  <th className="px-5 py-3">License Renews</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staffWithHours.map((s) => {
                  const hasRequirement = s.required !== null && s.completed !== null;
                  const pct = hasRequirement
                    ? Math.min(100, Math.round(((s.completed ?? 0) / (s.required ?? 1)) * 100))
                    : null;
                  const remaining = hasRequirement
                    ? Math.max(0, (s.required ?? 0) - (s.completed ?? 0))
                    : null;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {s.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {pct !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full transition-all ${staffProgressColor(s.required!, s.completed!)}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-700">{pct}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        {hasRequirement ? (
                          <span>
                            {s.completed} / {s.required} hrs
                            {remaining! > 0 && (
                              <span className="ml-1 text-amber-600">({remaining} remaining)</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400">None required</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        {s.licenseRenews ?? <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setAddCEModal(s.id)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Plus className="h-3 w-3" />
                          Add CE Credit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* CE Zoom note */}
          <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <Zap className="h-4 w-4 shrink-0 text-blue-600" />
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Powered by CE Zoom enterprise tracking</span> — upgrade to sync CE hours automatically from approved providers.
            </p>
          </div>

          {/* Add CE Modal */}
          {addCEModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="mb-1 text-base font-bold text-slate-900">Add CE Credit</h3>
                <p className="mb-4 text-xs text-slate-500">
                  Adding credits for{" "}
                  <span className="font-semibold text-slate-700">
                    {staffWithHours.find((s) => s.id === addCEModal)?.name}
                  </span>
                </p>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="Enter CE hours (e.g. 2.0)"
                  value={addCEHours}
                  onChange={(e) => setAddCEHours(e.target.value)}
                  className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddCE(addCEModal)}
                    className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
                  >
                    Add Hours
                  </button>
                  <button
                    onClick={() => { setAddCEModal(null); setAddCEHours(""); }}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Compliance Training ── */}
      {activeTab === "compliance" && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <Shield className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Required Annual Compliance Training</h2>
              <p className="text-xs text-slate-500">OSHA, HIPAA, and dental-specific compliance modules for your team</p>
            </div>
          </div>

          {/* Module Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold text-slate-500">
                  <th className="px-5 py-3">Module</th>
                  <th className="px-5 py-3">Frequency</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Last Completed</th>
                  <th className="px-5 py-3">Next Due</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {COMPLIANCE_MODULES.map((mod) => (
                  <tr key={mod.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {complianceIcon(mod.status)}
                        <span className="text-sm font-semibold text-slate-900">{mod.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{mod.frequency}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${complianceStatusBadge(mod.status)}`}
                      >
                        {mod.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {mod.lastCompleted ?? <span className="text-red-500 font-medium">Never completed</span>}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {mod.nextDue ?? <span className="text-red-500 font-medium">Overdue</span>}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={mod.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        Buy Course
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 360training banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-slate-600" />
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Mandatory compliance CE powered by 360training
                </p>
                <p className="text-xs text-slate-500">
                  OSHA/HIPAA Dental Bundle · Renews annually per staff member
                </p>
              </div>
            </div>
            <a
              href="https://www.360training.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-900"
            >
              Buy Compliance Bundle
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}

      {/* ── Tab 4: Board Reporting ── */}
      {activeTab === "reporting" && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
              <FileCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">State Board CE Reporting</h2>
              <p className="text-xs text-slate-500">
                Auto-submit completed CE hours to your state dental board via CE Broker
              </p>
            </div>
          </div>

          {/* CE Broker Explanation */}
          <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/60 to-blue-50/60 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                <Globe className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">CE Broker Integration</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Once your practice is registered as a CE provider with CE Broker, all completed CE hours will
                  auto-report directly to your state dental board at renewal. No manual submission, no missed
                  credits.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Step 1", desc: "Register as CE Provider on CE Broker", icon: Building2 },
                    { label: "Step 2", desc: "Connect your Nevada board account", icon: FileCheck },
                    { label: "Step 3", desc: "CE hours auto-report at renewal", icon: CheckCircle2 },
                  ].map((step) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.label} className="flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-white p-3">
                        <StepIcon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                        <div>
                          <p className="text-[11px] font-bold text-indigo-700">{step.label}</p>
                          <p className="text-[11px] text-slate-500">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CE Broker Provider Status Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">CE Broker Provider Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <Circle className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">Not Registered</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Register to enable auto-reporting to state dental boards
                </p>
              </div>
              <a
                href="https://providers.cebroker.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Register as CE Provider
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Supported States Table */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">Supported States</h3>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold text-slate-500">
                    <th className="px-5 py-3">State</th>
                    <th className="px-5 py-3">Board</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {STATE_BOARDS.map((sb) => (
                    <tr key={sb.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">{sb.state}</td>
                      <td className="px-5 py-4 text-xs text-slate-600">{sb.board}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                            sb.status === "Setup Required"
                              ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                              : "bg-slate-100 text-slate-500 ring-slate-200"
                          }`}
                        >
                          {sb.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {sb.status === "Setup Required" ? (
                          <a
                            href="https://providers.cebroker.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
                          >
                            Set up <ChevronRight className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expansion Note */}
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            <p className="text-xs text-slate-600">
              <span className="font-semibold">CE Broker is expanding</span> — check back for Nevada board integration.
              Once registered, completed CE courses auto-report to the board — no manual submission at renewal.
            </p>
          </div>

          {/* Export Option */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-900">Export CE Records</p>
              <p className="text-xs text-slate-500">Download a CE transcript for manual board submission</p>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
              <Download className="h-3.5 w-3.5" />
              Export Transcript
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
