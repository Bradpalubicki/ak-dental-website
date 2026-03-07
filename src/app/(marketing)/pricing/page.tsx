import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  ShieldAlert,
  Share2,
  Bot,
  Calendar,
  FileText,
  Bell,
  DollarSign,
  Users,
  Globe,
  ShieldCheck,
  Clock,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "How We Run Your Practice | AK Ultimate Dental",
  description:
    "See what it costs to run a dental practice with today's tools vs. NuStack. One price. Everything included. We run it for you.",
  alternates: {
    canonical: `${siteConfig.url}/pricing`,
  },
  openGraph: {
    title: "How We Run Your Practice | AK Ultimate Dental",
    description:
      "One price. Every automation category. Already running. See how much a dental practice spends piecing together 9 separate tools.",
    url: `${siteConfig.url}/pricing`,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does NuStack cost for a dental practice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We build a custom proposal after a Live Reveal — a 45-minute call where you see your exact practice engine already configured. No generic tiers. No surprises. Book one and we'll show you exactly what runs for your practice, then give you a number.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to hire someone to maintain this?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We maintain everything. Software updates, integration fixes, workflow changes — that's on us. You don't add a new job to your plate.",
      },
    },
    {
      "@type": "Question",
      name: "Is it HIPAA compliant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every layer. Infrastructure, messaging, storage, business associate agreements — all covered. You don't have to think about it.",
      },
    },
    {
      "@type": "Question",
      name: "How fast can we go live?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most practices are live in 2–4 weeks. 75% of your setup is done before your first onboarding call. You confirm a few details. We flip the switch.",
      },
    },
    {
      "@type": "Question",
      name: "What makes this different from Weave or Dentrix?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Weave is a phone system. Dentrix is a practice management system. NuStack connects and automates all of it — plus adds AI notes, reputation management, HR compliance, and dispute protection. It's the layer on top that makes everything run together.",
      },
    },
  ],
};

const diyVendors = [
  { vendor: "Dentrix / Eaglesoft EHR", what: "Practice management & scheduling", cost: "$300–600/mo" },
  { vendor: "Weave", what: "Patient communication hub", cost: "$499/mo" },
  { vendor: "Birdeye", what: "Reviews & reputation", cost: "$349/mo" },
  { vendor: "ActiveCampaign Enterprise", what: "HIPAA marketing automation", cost: "$284/mo" },
  { vendor: "Accountable HQ", what: "HIPAA compliance tracking", cost: "$149/mo" },
  { vendor: "Upheal / DeepScribe AI", what: "Clinical note drafting", cost: "$59/provider/mo" },
  { vendor: "Buffer / Hootsuite", what: "Social media posting", cost: "$45/mo" },
  { vendor: "Website agency retainer", what: "HIPAA-compliant site + SEO", cost: "$300/mo" },
  { vendor: "Gusto", what: "HR & payroll", cost: "$79/mo" },
];

const nuStackIncludes = [
  "Patient scheduling — self-booking, reminders, confirmations",
  "HIPAA-compliant messaging (patient + staff)",
  "Digital intake forms — completed before they arrive",
  "Insurance eligibility verification",
  "AI-drafted clinical notes — you approve in seconds",
  "Treatment proposal generator (Good/Better/Best)",
  "Patient reactivation & recall campaigns",
  "Reputation management — review requests auto-sent",
  "HIPAA compliance tracking & staff training",
  "HR & payroll integration",
  "Social posting via Fanout — included",
  "Credit card dispute protection",
  "SEO-optimized website, live 24/7",
  "Analytics & production reporting",
];

const uniqueTools = [
  {
    icon: Bot,
    title: "AI Clinical Note Drafting",
    desc: "After every appointment, AI drafts your SOAP note. You review and approve in seconds instead of spending 5–10 minutes per patient at the end of the day. That's 45 minutes back every shift.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    icon: ShieldAlert,
    title: "Credit Card Dispute Protection",
    desc: "When a patient disputes a charge — especially after a procedure — our dispute tool assembles your signed consent, treatment records, and payment history automatically. You respond before the deadline. You win more.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    icon: Share2,
    title: "Social Posting — Included",
    desc: "Before/after photos, promotions, and patient education posts go out automatically via Fanout — NuStack's own scheduling tool. Competitors charge $45/mo for Buffer. You pay nothing extra.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    icon: FileText,
    title: "Treatment Proposals That Close",
    desc: "Every treatment plan becomes a clear Good/Better/Best proposal — in plain English, no dental jargon. Cherry financing links included. Patients understand what they're deciding. More cases close.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
];

const whatYouStopDoing = [
  { icon: FileText, problem: "Patients filling out paper forms at the front desk", fix: "Intake forms completed on their phone before they walk in." },
  { icon: Bell, problem: "Staff calling to confirm appointments", fix: "Automated reminders sent. Patients confirm by text." },
  { icon: DollarSign, problem: "Chasing insurance verifications manually", fix: "Eligibility checked automatically before every appointment." },
  { icon: Clock, problem: "Spending 45 minutes on notes after hours", fix: "AI drafts your SOAP notes. You approve in seconds." },
  { icon: Users, problem: "Manually requesting Google reviews", fix: "Happy patients get a text asking for a review. Automatically." },
  { icon: Globe, problem: "Paying an agency to update your website", fix: "Your site is live, fast, HIPAA-compliant, and booking patients 24/7." },
  { icon: ShieldCheck, problem: "Tracking HIPAA training spreadsheets", fix: "Staff compliance tracked automatically. Certificates stored." },
  { icon: Share2, problem: "Remembering to post on social media", fix: "Posts go out on schedule. Your account stays active without effort." },
];

export default function PricingPage() {
  const diyTotal = "$1,764–2,064+/mo";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "How We Work", href: "/pricing" },
        ]}
      />

      <div className="min-h-screen bg-white">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-slate-950 px-6 py-28 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.15)_0%,transparent_60%)]" />
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-400">
              How We Run Your Practice
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight sm:text-6xl">
              One price.{" "}
              <span className="text-sky-400">Your whole practice.</span>
            </h1>
            <p className="mt-4 text-xl text-slate-400 font-light">
              We set it up. We run it. You focus on patients.
            </p>
            <p className="mt-3 text-base text-slate-500">
              No tiers. No per-workflow billing. No hiring a consultant.
              One engine, fully running, fully managed — HIPAA compliant.
            </p>
            <div className="mt-8">
              <Link href="/get-started">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-4 text-base">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Live Reveal — See Pricing
                </Button>
              </Link>
              <p className="mt-3 text-xs text-slate-600">Custom proposal after the reveal. 45 minutes. No commitment.</p>
            </div>
          </div>
        </section>

        {/* ── What You Stop Doing ──────────────────────────────────── */}
        <section className="px-6 py-20 border-b border-gray-100">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Here&apos;s what you{" "}
                <span className="text-sky-600">stop doing</span>
              </h2>
              <p className="mt-3 text-base text-gray-500">
                The admin work eating your time. NuStack handles all of it.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whatYouStopDoing.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.problem} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <div className="mb-3 h-9 w-9 rounded-xl bg-sky-100 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="text-xs font-semibold mb-1 line-through text-gray-400">
                      {item.problem}
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                      <span className="text-xs text-gray-700 leading-relaxed">{item.fix}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── DIY Vendor Cost Breakdown ────────────────────────────── */}
        <section className="px-6 py-20 border-b border-gray-100">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                What it costs to{" "}
                <span className="text-red-500">do this yourself</span>
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Real vendor prices. Real time. Real complexity.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* DIY column */}
              <div className="rounded-2xl border border-red-200 bg-red-50/40 p-8">
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-500">
                  The DIY Dental Stack
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  9 vendors. 9 logins. 10+ hrs/week.
                </h3>
                <div className="space-y-2 mb-6">
                  {diyVendors.map((row) => (
                    <div
                      key={row.vendor}
                      className="flex items-center justify-between rounded-lg bg-white border border-red-100 px-3 py-2.5 text-sm"
                    >
                      <div>
                        <span className="font-medium text-gray-800">{row.vendor}</span>
                        <span className="ml-2 text-xs text-gray-400">{row.what}</span>
                      </div>
                      <span className="font-semibold text-red-500 shrink-0 ml-3">{row.cost}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-red-200 bg-red-100/60 px-4 py-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-red-700">DIY Monthly Total</span>
                    <span className="font-bold text-lg text-red-600">{diyTotal}</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <X className="h-3 w-3 shrink-0 text-red-400" />
                    + Setup costs: $10,000–20,000 one-time
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-3 w-3 shrink-0 text-red-400" />
                    + 10+ hours/week managing 9 separate tools
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-3 w-3 shrink-0 text-red-400" />
                    Still missing: AI notes, dispute protection, treatment proposals
                  </div>
                </div>
              </div>

              {/* NuStack column */}
              <div className="rounded-2xl border border-sky-300 bg-sky-50/20 p-8 flex flex-col">
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  NuStack — Done For You
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  One price. All of this. Already running.
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  We build it, configure it, and maintain it. You go live in 2–4 weeks.
                </p>
                <div className="space-y-2.5 mb-8 flex-1">
                  {nuStackIncludes.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-gray-800">
                      <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/get-started">
                  <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-4 text-base">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Live Reveal — See Pricing
                  </Button>
                </Link>
                <p className="mt-3 text-center text-xs text-gray-400">
                  Custom proposal after the reveal. Priced per practice.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">When you add it all up —</span>{" "}
                the tools, the integrations, the staff time maintaining 9 separate systems — DIY costs more
                and you still don&apos;t have AI notes, dispute protection, or treatment proposals.
                NuStack: everything built, one price, we maintain it.
              </p>
            </div>
          </div>
        </section>

        {/* ── Tools Nobody Else Gives You ──────────────────────────── */}
        <section className="px-6 py-20 border-b border-gray-100 bg-slate-950">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">
                Tools{" "}
                <span className="text-sky-400">nobody else gives you</span>
              </h2>
              <p className="mt-3 text-base text-slate-400">
                Not add-ons. Included. Built for dental practices that want to run lean.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {uniqueTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.title}
                    className="rounded-2xl border p-6"
                    style={{ background: tool.bg, borderColor: tool.border }}
                  >
                    <div
                      className="mb-4 h-11 w-11 rounded-xl flex items-center justify-center"
                      style={{ background: tool.bg, border: `1px solid ${tool.border}` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: tool.color }} />
                    </div>
                    <h3 className="text-base font-bold mb-2 text-white">{tool.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{tool.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Stat Strip ───────────────────────────────────────────── */}
        <section className="px-6 py-16 border-b border-gray-100">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Clock, stat: "2–4 wks", label: "Go-live timeline" },
                { icon: Stethoscope, stat: "45 min", label: "Saved per day on notes" },
                { icon: ShieldCheck, stat: "100%", label: "HIPAA compliant" },
                { icon: Users, stat: "75%", label: "Pre-built before onboarding" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-sky-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{item.stat}</div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="px-6 py-20 border-b border-gray-100">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Common Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How much does it cost?",
                  a: "We build a custom proposal after a Live Reveal — a 45-minute call where you see your practice engine already configured. No generic pricing. No surprises. Book one and we'll show you exactly what runs for your practice, then give you a number.",
                },
                {
                  q: "Is it HIPAA compliant?",
                  a: "Yes. Every layer. Infrastructure, messaging, storage, business associate agreements — all covered. You don't have to think about it.",
                },
                {
                  q: "Do I need to hire someone to maintain this?",
                  a: "No. We maintain everything. Software updates, integration fixes, workflow changes — that's on us. You don't add a new job to your plate.",
                },
                {
                  q: "What makes this different from Weave or Dentrix?",
                  a: "Weave is a phone system. Dentrix is a practice management system. NuStack connects and automates all of it — plus adds AI notes, reputation management, HR compliance, and dispute protection. It's the layer that makes everything run together.",
                },
                {
                  q: "How fast can we go live?",
                  a: "Most practices are live in 2–4 weeks. 75% of your setup is done before your first onboarding call. You confirm a few details. We flip the switch.",
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 bg-slate-950 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              See your practice{" "}
              <span className="text-sky-400">already running.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Book a Live Reveal. We show you your practice engine, configured for your specific office.
              Then we tell you the price.
            </p>
            <Link href="/get-started">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-10 py-4 text-base">
                <Calendar className="h-4 w-4 mr-2" />
                Book a Live Reveal
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-slate-600">
              No commitment. No templates. A real proposal for your real practice.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}
