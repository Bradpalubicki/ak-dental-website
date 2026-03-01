"use client";

import { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Rocket,
  MapPin,
  Phone,
  Users,
  Star,
  Shield,
  Check,
  Sparkles,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WIZARD_STEPS,
  ROLE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  PRIORITY_OPTIONS,
  SETUP_STEPS,
} from "@/config/onboarding-config";
import type { WizardData } from "@/hooks/useOnboarding";

// ─── Prefill types ────────────────────────────────────────────────────────────

interface PrefillData {
  practiceInfo?: {
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    website?: string | null;
    hours?: string[];
    googleMapsUrl?: string | null;
    rating?: number | null;
  };
  contactInfo?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  providers?: Array<{
    npi: string;
    name: string;
    credential?: string | null;
    taxonomy?: string | null;
    license?: string | null;
  }>;
  insurance?: string[];
  staffNames?: string[];
  prefillSource?: {
    nppes: boolean;
    googlePlaces: boolean;
    firecrawl: boolean;
  };
}

// ─── Bar 1 auto-filled items ──────────────────────────────────────────────────

interface Bar1Item {
  id: string;
  label: string;
  value: string | null | undefined;
  source: string;
  approved: boolean;
  edited?: string;
}

function buildBar1Items(prefill: PrefillData, wizData: WizardData): Bar1Item[] {
  const pi = prefill.practiceInfo;
  const ci = prefill.contactInfo;

  return [
    {
      id: "name",
      label: "Practice Name",
      value: pi?.name ?? wizData.practiceName ?? null,
      source: "Agency records",
      approved: false,
    },
    {
      id: "phone",
      label: "Phone Number",
      value: pi?.phone ?? wizData.phone ?? null,
      source: pi?.phone ? "Google Places" : "Agency records",
      approved: false,
    },
    {
      id: "address",
      label: "Address",
      value: pi?.address ?? wizData.address ?? null,
      source: pi?.address ? "Google Places" : "Agency records",
      approved: false,
    },
    {
      id: "website",
      label: "Website",
      value: pi?.website ?? null,
      source: "Google Places",
      approved: false,
    },
    {
      id: "hours",
      label: "Business Hours",
      value:
        pi?.hours && pi.hours.length > 0
          ? pi.hours.slice(0, 3).join(" | ")
          : null,
      source: "Google Places",
      approved: false,
    },
    {
      id: "npi",
      label: "NPI Provider",
      value:
        prefill.providers && prefill.providers.length > 0
          ? `${prefill.providers[0]!.name}${prefill.providers[0]!.credential ? `, ${prefill.providers[0]!.credential}` : ""}`
          : null,
      source: "NPPES Registry (free federal database)",
      approved: false,
    },
    {
      id: "insurance",
      label: "Insurance Carriers",
      value:
        prefill.insurance && prefill.insurance.length > 0
          ? `${prefill.insurance.length} carriers found on your website`
          : null,
      source: "Website scrape",
      approved: false,
    },
  ].filter((item) => item.value != null);
}

// ─── Bar 2 items always shown ─────────────────────────────────────────────────

const BAR2_ITEMS = [
  { id: "hipaa", label: "HIPAA Acknowledgment", done: false },
  { id: "tcpa", label: "TCPA Consent Acknowledgment", done: false },
  { id: "team-emails", label: "Team Member Emails", done: false },
  { id: "payment", label: "Payment Processing Setup", done: false },
  { id: "insurance-doc", label: "Malpractice Insurance Upload", done: false },
  { id: "sms-verify", label: "Twilio SMS Verification", done: false },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SetupWizardProps {
  onComplete: (data: WizardData) => void;
  onDismiss: () => void;
  initialData?: WizardData;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SetupWizard({
  onComplete,
  onDismiss,
  initialData = {},
}: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    practiceName: "AK Ultimate Dental",
    phone: "(702) 935-4395",
    address: "Las Vegas, NV 89117",
    ...initialData,
  });

  // Prefill state
  const [prefill, setPrefill] = useState<PrefillData | null>(null);
  const [prefillLoading, setPrefillLoading] = useState(true);
  const [bar1Items, setBar1Items] = useState<Bar1Item[]>([]);
  const [bar2Checked, setBar2Checked] = useState<Record<string, boolean>>({
    hipaa: false,
    tcpa: false,
  });

  // Load prefill data from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadPrefill() {
      try {
        const res = await fetch("/api/agency/prefill-state", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as { prefillData?: PrefillData };
        if (!cancelled && json.prefillData) {
          setPrefill(json.prefillData);
        }
      } catch {
        // Silently fail — wizard works without prefill
      } finally {
        if (!cancelled) setPrefillLoading(false);
      }
    }

    void loadPrefill();
    return () => {
      cancelled = true;
    };
  }, []);

  // Rebuild bar1 whenever prefill or wizardData changes
  useEffect(() => {
    if (prefill) {
      const items = buildBar1Items(prefill, data);
      setBar1Items(items);
      // Pre-populate form fields from prefill
      const pi = prefill.practiceInfo;
      if (pi?.name && !initialData.practiceName) {
        setData((prev) => ({ ...prev, practiceName: pi.name ?? prev.practiceName }));
      }
      if (pi?.phone && !initialData.phone) {
        setData((prev) => ({ ...prev, phone: pi.phone ?? prev.phone }));
      }
      if (pi?.address && !initialData.address) {
        setData((prev) => ({ ...prev, address: pi.address ?? prev.address }));
      }
    }
  }, [prefill]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = WIZARD_STEPS.length;
  const current = WIZARD_STEPS[step];
  const isLast = step === total - 1;
  const isFirst = step === 0;

  function update(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function next() {
    if (isLast) {
      onComplete(data);
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (!isFirst) setStep((s) => s - 1);
  }

  function canAdvance(): boolean {
    if (step === 0) return !!(data.practiceName && data.phone);
    if (step === 1) return !!data.role;
    if (step === 2) return !!data.teamSize;
    if (step === 3) return (data.priorities?.length ?? 0) > 0;
    if (step === 4) return !!(data.hipaaAcknowledged && data.tcpaAcknowledged);
    return true;
  }

  function togglePriority(value: string) {
    const cur = data.priorities || [];
    const next = cur.includes(value)
      ? cur.filter((p) => p !== value)
      : [...cur, value];
    update({ priorities: next });
  }

  function approveBar1Item(id: string) {
    setBar1Items((prev) =>
      prev.map((item) => (item.id === id ? { ...item, approved: true } : item)),
    );
  }

  function editBar1Item(id: string, value: string) {
    setBar1Items((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, edited: value, approved: true } : item,
      ),
    );
  }

  const approvedBar1Count = bar1Items.filter((i) => i.approved).length;
  const bar1Percent = bar1Items.length > 0
    ? Math.round((approvedBar1Count / bar1Items.length) * 100)
    : 0;

  const bar2Total = BAR2_ITEMS.length;
  const bar2DoneCount = Object.values(bar2Checked).filter(Boolean).length
    + (data.hipaaAcknowledged ? 0 : 0) // counted via bar2Checked
    + (data.tcpaAcknowledged ? 0 : 0);
  const bar2Percent = Math.round((bar2DoneCount / bar2Total) * 100);

  const hasPrefill = prefill !== null && bar1Items.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Progress bar (step) */}
        <div className="h-1 bg-slate-100 shrink-0">
          <div
            className="h-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500 flex items-center justify-center shrink-0">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Step {step + 1} of {total}
              </p>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {current?.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dual progress bars — shown when prefill available and on step 0 */}
        {hasPrefill && step === 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-cyan-50 to-indigo-50 border-b border-slate-100 shrink-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Onboarding Progress
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Bar 1 */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-xs font-semibold text-cyan-700">
                    We filled this — approve it
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-cyan-100">
                  <div
                    className="h-2 rounded-full bg-cyan-500 transition-all duration-500"
                    style={{ width: `${bar1Percent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {approvedBar1Count}/{bar1Items.length} approved
                </p>
              </div>

              {/* Bar 2 */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <ClipboardList className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs font-semibold text-indigo-700">
                    Your turn to provide
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-indigo-100">
                  <div
                    className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${bar2Percent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {bar2DoneCount}/{bar2Total} done
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content — scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          <p className="text-sm text-slate-500 mb-5">{current?.subtitle}</p>

          {/* Step 0 — Practice Profile + prefill review */}
          {step === 0 && (
            <div className="space-y-5">
              {/* Prefill review section */}
              {prefillLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking for pre-filled data...
                </div>
              )}

              {hasPrefill && !prefillLoading && (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-cyan-100/60 border-b border-cyan-200">
                    <Sparkles className="h-4 w-4 text-cyan-600" />
                    <p className="text-sm font-semibold text-cyan-800">
                      NuStack pre-filled {bar1Items.length} fields for you — review & approve
                    </p>
                  </div>
                  <div className="divide-y divide-cyan-100">
                    {bar1Items.map((item) => (
                      <PrefillItem
                        key={item.id}
                        item={item}
                        onApprove={() => approveBar1Item(item.id)}
                        onEdit={(val) => editBar1Item(item.id, val)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Standard practice info fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  {hasPrefill ? "Confirm your details" : "Enter your practice details"}
                </h3>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Practice Name
                  </label>
                  <input
                    type="text"
                    value={data.practiceName || ""}
                    onChange={(e) => update({ practiceName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="AK Ultimate Dental"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={data.phone || ""}
                    onChange={(e) => update({ phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="(702) 935-4395"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Address
                  </label>
                  <input
                    type="text"
                    value={data.address || ""}
                    onChange={(e) => update({ address: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Las Vegas, NV 89117"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  You can update these any time in Settings.
                </p>
              </div>

              {/* Bar 2 preview */}
              {hasPrefill && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-100/60 border-b border-indigo-200">
                    <ClipboardList className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-semibold text-indigo-800">
                      Still needed from you ({BAR2_ITEMS.length} items)
                    </p>
                  </div>
                  <div className="px-4 py-3 space-y-1.5">
                    {BAR2_ITEMS.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <div
                          className={`h-4 w-4 rounded-full border-2 shrink-0 ${
                            bar2Checked[item.id]
                              ? "bg-indigo-500 border-indigo-500"
                              : "border-indigo-300"
                          }`}
                        >
                          {bar2Checked[item.id] && (
                            <Check className="h-2.5 w-2.5 text-white m-auto" />
                          )}
                        </div>
                        <span className={bar2Checked[item.id] ? "text-slate-400 line-through" : "text-slate-700"}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-indigo-500 mt-2">
                      These will be completed in the following steps or via email.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1 — Role */}
          {step === 1 && (
            <div className="space-y-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ role: opt.value })}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                    data.role === opt.value
                      ? "border-cyan-400 bg-cyan-50 ring-1 ring-cyan-400"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.description}</p>
                  </div>
                  {data.role === opt.value && (
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2 — Team Size */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-600">
                  This helps us set up the right access levels and notifications.
                </p>
              </div>
              {TEAM_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ teamSize: opt.value })}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all ${
                    data.teamSize === opt.value
                      ? "border-cyan-400 bg-cyan-50 ring-1 ring-cyan-400"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.description}</p>
                  </div>
                  {data.teamSize === opt.value && (
                    <CheckCircle2 className="h-4 w-4 text-cyan-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 3 — Priorities */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-600">
                  Select all that apply — we&apos;ll highlight these features first.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITY_OPTIONS.map((opt) => {
                  const selected = (data.priorities || []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => togglePriority(opt.value)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        selected
                          ? "border-cyan-400 bg-cyan-50 ring-1 ring-cyan-400"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span className="text-xs font-medium text-slate-800">{opt.label}</span>
                      {selected && <Check className="h-3 w-3 text-cyan-500 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 — Compliance (Bar 2 items: HIPAA + TCPA) */}
          {step === 4 && (
            <div className="space-y-4">
              {hasPrefill && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100">
                  <ClipboardList className="h-4 w-4 text-indigo-500 shrink-0" />
                  <p className="text-xs text-indigo-700">
                    This completes 2 of your {BAR2_ITEMS.length} remaining items.
                  </p>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">
                  These acknowledgments are required for HIPAA compliance and patient
                  communication. They&apos;re stored with your account for audit purposes.
                </p>
              </div>

              <label
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  data.hipaaAcknowledged
                    ? "border-cyan-400 bg-cyan-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!data.hipaaAcknowledged}
                  onChange={(e) => {
                    update({ hipaaAcknowledged: e.target.checked });
                    setBar2Checked((prev) => ({ ...prev, hipaa: e.target.checked }));
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">HIPAA Privacy Acknowledgment</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    I confirm this platform will be used in compliance with HIPAA Privacy and
                    Security Rules. Patient data will not be shared without authorization.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  data.tcpaAcknowledged
                    ? "border-cyan-400 bg-cyan-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!data.tcpaAcknowledged}
                  onChange={(e) => {
                    update({ tcpaAcknowledged: e.target.checked });
                    setBar2Checked((prev) => ({ ...prev, tcpa: e.target.checked }));
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">TCPA Consent Acknowledgment</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    I confirm that patients who receive SMS messages via this platform have provided
                    written consent in accordance with TCPA requirements.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Step 5 — Launch */}
          {step === 5 && (
            <div className="text-center py-2">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                You&apos;re all set, {data.role === "owner-dentist" ? "Dr. Alex" : "welcome"}!
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                Your dashboard is configured. Here&apos;s what to do next:
              </p>
              <div className="space-y-2 text-left">
                {SETUP_STEPS.filter((s) => s.category === "essential").map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5"
                  >
                    <div className="h-5 w-5 rounded-full border-2 border-slate-200 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">{s.label}</p>
                      <p className="text-xs text-slate-400">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {hasPrefill && (
                <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-left">
                  <p className="text-xs font-semibold text-indigo-700 mb-2">
                    Still on your checklist:
                  </p>
                  {BAR2_ITEMS.filter((i) => !bar2Checked[i.id]).slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs text-indigo-600 py-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {item.label}
                    </div>
                  ))}
                  <p className="text-xs text-indigo-400 mt-2">
                    You&apos;ll find these in Settings or via the onboarding email.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={back}
            disabled={isFirst}
            className="gap-1.5 text-slate-500"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-1.5">
            {WIZARD_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step
                    ? "w-4 bg-cyan-500"
                    : i < step
                      ? "w-1.5 bg-cyan-300"
                      : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={next}
            disabled={!canAdvance()}
            className="gap-1.5 bg-cyan-500 hover:bg-cyan-600"
          >
            {isLast ? "Go to Dashboard" : "Continue"}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── PrefillItem sub-component ────────────────────────────────────────────────

function PrefillItem({
  item,
  onApprove,
  onEdit,
}: {
  item: Bar1Item;
  onApprove: () => void;
  onEdit: (val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(item.value ?? "");

  return (
    <div className="px-4 py-3 flex items-start gap-3">
      <div className="mt-0.5 shrink-0">
        {item.approved ? (
          <CheckCircle2 className="h-4 w-4 text-cyan-500" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-600">{item.label}</p>
        {editing ? (
          <div className="flex gap-2 mt-1">
            <input
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              autoFocus
            />
            <button
              onClick={() => {
                onEdit(editVal);
                setEditing(false);
              }}
              className="text-xs text-cyan-600 font-medium"
            >
              Save
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {item.edited ?? item.value}
          </p>
        )}
        <p className="text-[10px] text-slate-400 mt-0.5">Source: {item.source}</p>
      </div>
      {!item.approved && (
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={onApprove}
            className="text-xs bg-cyan-500 text-white rounded px-2 py-0.5 hover:bg-cyan-600 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => {
              setEditing(true);
              setEditVal(item.value ?? "");
            }}
            className="text-xs text-slate-500 border border-slate-200 rounded px-2 py-0.5 hover:bg-slate-50 transition-colors"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
