import Link from "next/link";
import {
  Sun, Calendar, Users, FileText, ClipboardCheck,
  DollarSign, MessageSquare, UserPlus,
  ArrowRight, CheckCircle2, Phone,
} from "lucide-react";

const MORNING_HABITS = [
  { icon: Calendar, text: "Check today's schedule — any gaps to fill or confirmations still pending?" },
  { icon: Sun, text: "Review outstanding insurance claims — anything 30+ days without response?" },
  { icon: UserPlus, text: "Check new leads — any referrals or new patient inquiries to respond to?" },
  { icon: Phone, text: "Review missed calls or unread messages from yesterday" },
  { icon: DollarSign, text: "Check aging A/R — who is 60+ days past due?" },
];

const WORKFLOWS = [
  {
    icon: Calendar,
    title: "Book an Appointment",
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    href: "/dashboard/appointments",
    steps: [
      "Go to Schedule → New Appointment",
      "Search for existing patient or create new patient record",
      "Select provider, treatment type, and duration",
      "Confirm appointment — system sends SMS/email reminder automatically",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "New Patient Intake",
    color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    href: "/dashboard/patients",
    steps: [
      "Go to Patients → Add New Patient",
      "Enter name, DOB, contact info, and insurance details",
      "Send consent forms via SMS (they sign on their phone)",
      "Once signed, intake is complete — ready for first appointment",
    ],
  },
  {
    icon: UserPlus,
    title: "Respond to a Lead",
    color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    href: "/dashboard/leads",
    steps: [
      "Go to Leads — new inquiries are marked with a blue dot",
      "Review AI-drafted response, edit if needed",
      "Send via SMS or email — patient receives it immediately",
      "Once they book, convert lead to patient record",
    ],
  },
  {
    icon: FileText,
    title: "Submit an Insurance Claim",
    color: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    href: "/dashboard/insurance",
    steps: [
      "Go to Insurance → New Claim",
      "Select the appointment and treatment codes (CDT)",
      "Attach any required X-rays or documentation",
      "Submit — track status in the claims pipeline",
    ],
  },
  {
    icon: MessageSquare,
    title: "Send a Recall Message",
    color: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    href: "/dashboard/outreach",
    steps: [
      "Go to Outreach → Recall Campaigns",
      "Filter patients due for 6-month recall or incomplete treatment",
      "Select a message template (or customize)",
      "Send — patients get a direct booking link in their text",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Help & Quick Reference</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your Monday morning routine and step-by-step workflows for daily operations.
        </p>
      </div>

      {/* Morning Routine */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sun className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Monday Morning (5 minutes)</h2>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5 space-y-3">
          {MORNING_HABITS.map((habit, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <habit.icon className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-sm text-amber-900 dark:text-amber-100">{habit.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Common Workflows</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {WORKFLOWS.map((workflow) => (
            <div
              key={workflow.title}
              className={`rounded-xl border p-5 space-y-3 ${workflow.color}`}
            >
              <div className="flex items-center gap-2">
                <workflow.icon className={`h-5 w-5 ${workflow.iconColor}`} />
                <h3 className="font-semibold text-sm">{workflow.title}</h3>
              </div>
              <ol className="space-y-1.5">
                {workflow.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`font-bold shrink-0 ${workflow.iconColor}`}>{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={workflow.href}
                className={`inline-flex items-center gap-1 text-xs font-medium ${workflow.iconColor} hover:underline`}
              >
                Go there <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="bg-muted/40 rounded-xl border p-5">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-sm">Need help from NuStack?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Email <a href="mailto:brad@nustack.digital" className="underline font-medium">brad@nustack.digital</a> or
              text <span className="font-medium">(702) 900-0000</span> — typically respond within a few hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
