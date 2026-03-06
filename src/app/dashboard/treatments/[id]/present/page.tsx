"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Shield,
  CreditCard,
  Landmark,
  CheckCircle,
  Heart,
  Sparkles,
  Loader2,
  ArrowRight,
  X,
  FileText,
  DollarSign,
  MessageSquare,
  Phone,
} from "lucide-react";

interface Procedure {
  name: string;
  code: string;
  cost: number;
  description: string;
  category: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  insurance_provider: string | null;
}

interface TreatmentPlan {
  id: string;
  title: string;
  provider_name: string;
  procedures: Procedure[];
  total_cost: number;
  insurance_estimate: number;
  patient_estimate: number;
  ai_summary: string | null;
  status: string;
  patient: Patient;
}

type Step = "welcome" | "diagnosis" | "procedures" | "costs" | "payment" | "card" | "cherry-iframe" | "cherry-sms" | "thankyou";

const STEPS: Step[] = ["welcome", "diagnosis", "procedures", "costs", "payment"];

// Square Web Payments SDK types
declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<SquarePayments>;
    };
  }
}
interface SquarePayments {
  card: () => Promise<SquareCard>;
}
interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
}

export default function TreatmentPresentationPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState<TreatmentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>("welcome");

  // Square card state
  const squareCardRef = useRef<SquareCard | null>(null);
  const [squareReady, setSquareReady] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Cherry SMS state
  const [smsPhone, setSmsPhone] = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

  // Thank-you variant
  const [thankYouVariant, setThankYouVariant] = useState<"card" | "cherry-sms" | "cherry-iframe">("card");

  useEffect(() => {
    fetch(`/api/treatments/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPlan(data.plan);
        setSmsPhone(data.plan?.patient?.phone ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Load Square Web Payments SDK when card step is active
  useEffect(() => {
    if (currentStep !== "card" || squareReady) return;
    if (!process.env.NEXT_PUBLIC_SQUARE_APP_ID || !process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) return;

    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js";
    script.onload = async () => {
      if (!window.Square) return;
      const payments = await window.Square.payments(
        process.env.NEXT_PUBLIC_SQUARE_APP_ID!,
        process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!
      );
      const card = await payments.card();
      await card.attach("#square-card-container");
      squareCardRef.current = card;
      setSquareReady(true);
    };
    document.head.appendChild(script);
  }, [currentStep, squareReady]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <p className="text-white text-lg">Treatment plan not found.</p>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(currentStep as typeof STEPS[number]);
  const isMainFlow = STEPS.includes(currentStep as typeof STEPS[number]);
  const canGoBack = isMainFlow && stepIndex > 0 && currentStep !== "thankyou";
  const canGoForward = isMainFlow && stepIndex < STEPS.length - 1;

  function next() { if (canGoForward) setCurrentStep(STEPS[stepIndex + 1]); }
  function back() { if (canGoBack) setCurrentStep(STEPS[stepIndex - 1]); }

  const patient = plan.patient;
  const procedures = plan.procedures || [];
  const billableProcedures = procedures.filter((p) => p.cost > 0);

  async function handleSquarePayment() {
    if (!squareCardRef.current || !plan) return;
    setPaymentLoading(true);
    setPaymentError(null);
    const result = await squareCardRef.current.tokenize();
    if (result.status !== "OK" || !result.token) {
      setPaymentError(result.errors?.[0]?.message ?? "Card error. Please try again.");
      setPaymentLoading(false);
      return;
    }
    const res = await fetch("/api/payments/square", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceId: result.token,
        treatmentPlanId: plan.id,
        amountCents: Math.round(plan.patient_estimate * 100),
        patientEmail: patient.email,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setPaymentError(data.error ?? "Payment failed. Please try again.");
      setPaymentLoading(false);
      return;
    }
    setPaymentSuccess(true);
    setPaymentLoading(false);
    setThankYouVariant("card");
    setTimeout(() => setCurrentStep("thankyou"), 1200);
  }

  async function handleCherrySms() {
    if (!plan) return;
    setSmsSending(true);
    setSmsError(null);
    const res = await fetch("/api/payments/cherry-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: smsPhone,
        firstName: patient.first_name,
        lastName: patient.last_name,
        amountDollars: plan.patient_estimate,
        treatmentPlanId: plan.id,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setSmsError(data.error ?? "Could not send SMS. Please try again.");
      setSmsSending(false);
      return;
    }
    setSmsSent(true);
    setSmsSending(false);
    setThankYouVariant("cherry-sms");
    setTimeout(() => setCurrentStep("thankyou"), 2500);
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 text-white overflow-hidden">

      {/* Top bar */}
      {currentStep !== "thankyou" && (
        <div className="flex items-center justify-between px-8 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-cyan-300">AK Ultimate Dental</span>
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i <= Math.max(stepIndex, 0) ? "w-12 bg-cyan-400" : "w-8 bg-slate-600"
                }`}
              />
            ))}
          </div>
          <a
            href="/dashboard/treatments"
            className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/20"
          >
            <X className="h-3.5 w-3.5" />
            Exit
          </a>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-4 overflow-y-auto">
        <div className="w-full max-w-4xl">

          {/* ==================== WELCOME ==================== */}
          {currentStep === "welcome" && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-2xl shadow-cyan-500/30">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Your Treatment Plan
              </h1>
              <p className="text-xl text-slate-300 mb-3">
                Prepared for <span className="text-cyan-300 font-semibold">{patient.first_name} {patient.last_name}</span>
              </p>
              <p className="text-lg text-slate-400 mb-12">by {plan.provider_name} at AK Ultimate Dental</p>
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-8 py-5 backdrop-blur-sm">
                <FileText className="h-6 w-6 text-cyan-400" />
                <div className="text-left">
                  <p className="text-lg font-semibold">{plan.title}</p>
                  <p className="text-sm text-slate-400">{billableProcedures.length} procedure{billableProcedures.length !== 1 ? "s" : ""} recommended</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== DIAGNOSIS ==================== */}
          {currentStep === "diagnosis" && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold mb-3">Understanding Your Treatment</h2>
                <p className="text-lg text-slate-400">Here&apos;s what we found and why we recommend this plan</p>
              </div>
              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cyan-400 mb-2">Dr. Alex&apos;s Summary</p>
                    <p className="text-lg leading-relaxed text-slate-200">
                      {plan.ai_summary ?? "Your treatment plan has been carefully designed to address your dental needs with the best possible outcomes."}
                    </p>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-white/5 p-5 text-center">
                    <p className="text-3xl font-bold text-cyan-300">{billableProcedures.length}</p>
                    <p className="text-sm text-slate-400 mt-1">Procedures</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-5 text-center">
                    <p className="text-3xl font-bold text-emerald-300">97%+</p>
                    <p className="text-sm text-slate-400 mt-1">Success Rate</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-5 text-center">
                    <p className="text-3xl font-bold text-amber-300">10-15+</p>
                    <p className="text-sm text-slate-400 mt-1">Years Durability</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== PROCEDURES ==================== */}
          {currentStep === "procedures" && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">Your Procedures</h2>
                <p className="text-lg text-slate-400">A detailed look at each step of your treatment</p>
              </div>
              <div className="space-y-4">
                {procedures.map((proc, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-sm font-bold text-cyan-300">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{proc.name}</h3>
                          <span className="text-xs text-slate-500">{proc.code} &middot; {proc.category}</span>
                        </div>
                      </div>
                      {proc.cost > 0 ? (
                        <span className="text-lg font-bold text-cyan-300">${proc.cost.toLocaleString()}</span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">Included</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed pl-12">{proc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== COSTS ==================== */}
          {currentStep === "costs" && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">Investment & Insurance</h2>
                <p className="text-lg text-slate-400">Here&apos;s how the costs break down with your coverage</p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-cyan-400" />
                    Cost Breakdown
                  </h3>
                  <div className="space-y-3">
                    {billableProcedures.map((proc, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-slate-300">{proc.name}</span>
                        <span className="text-sm font-medium">${proc.cost.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-white/20">
                      <span className="text-base font-semibold">Total Treatment</span>
                      <span className="text-xl font-bold">${plan.total_cost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    Insurance Coverage
                  </h3>
                  {patient.insurance_provider ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                        <p className="text-xs text-emerald-400 font-medium mb-1">Your Insurance</p>
                        <p className="text-lg font-semibold text-emerald-300">{patient.insurance_provider}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-sm text-slate-300">Total Treatment</span>
                          <span className="text-sm">${plan.total_cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-sm text-emerald-400">Insurance Covers (est.)</span>
                          <span className="text-sm font-medium text-emerald-400">-${plan.insurance_estimate.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/20">
                          <span className="text-base font-semibold">Your Responsibility</span>
                          <span className="text-3xl font-bold text-cyan-300">${plan.patient_estimate.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
                        <p className="text-sm text-amber-300">No insurance on file</p>
                        <p className="text-xs text-amber-400/60 mt-1">Self-pay pricing applies</p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/20">
                        <span className="text-base font-semibold">Your Responsibility</span>
                        <span className="text-3xl font-bold text-cyan-300">${plan.total_cost.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-5 text-center">
                <p className="text-sm text-cyan-300">
                  Financing available — as low as{" "}
                  <span className="text-2xl font-bold text-white">
                    ${Math.round(plan.patient_estimate / 24).toLocaleString()}/mo
                  </span>{" "}
                  with approved credit
                </p>
              </div>
            </div>
          )}

          {/* ==================== PAYMENT OPTIONS ==================== */}
          {currentStep === "payment" && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">How Would You Like to Pay?</h2>
                <p className="text-lg text-slate-400">
                  Your balance today:{" "}
                  <span className="text-cyan-300 font-bold text-2xl">${plan.patient_estimate.toLocaleString()}</span>
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3 max-w-4xl mx-auto">
                {/* Option 1: Pay with Card */}
                <button
                  onClick={() => setCurrentStep("card")}
                  className="group rounded-3xl border-2 border-white/10 bg-white/5 p-7 text-left hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
                    <CreditCard className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pay with Card</h3>
                  <p className="text-slate-400 text-sm mb-4">Credit or debit — processed here in the office. Done in 30 seconds.</p>
                  <p className="text-2xl font-bold text-cyan-300">${plan.patient_estimate.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">Powered by Square</p>
                </button>

                {/* Option 2: Cherry SMS */}
                <button
                  onClick={() => setCurrentStep("cherry-sms")}
                  className="group rounded-3xl border-2 border-white/10 bg-white/5 p-7 text-left hover:border-emerald-400 hover:bg-emerald-500/10 transition-all"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <MessageSquare className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Text Me the Link</h3>
                  <p className="text-slate-400 text-sm mb-4">We&apos;ll text your phone a financing application. Apply from your own device in 60 seconds.</p>
                  <p className="text-2xl font-bold text-emerald-300">
                    ${Math.round(plan.patient_estimate / 24).toLocaleString()}
                    <span className="text-sm text-slate-400">/mo</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Powered by Cherry · 80%+ approval</p>
                </button>

                {/* Option 3: Apply on this device */}
                <button
                  onClick={() => {
                    setThankYouVariant("cherry-iframe");
                    setCurrentStep("cherry-iframe");
                  }}
                  className="group rounded-3xl border-2 border-white/10 bg-white/5 p-7 text-left hover:border-violet-400 hover:bg-violet-500/10 transition-all"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
                    <Landmark className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Apply on This Device</h3>
                  <p className="text-slate-400 text-sm mb-4">Open the Cherry application right here on the tablet. Soft credit check — no score impact to apply.</p>
                  <p className="text-2xl font-bold text-violet-300">
                    ${Math.round(plan.patient_estimate / 24).toLocaleString()}
                    <span className="text-sm text-slate-400">/mo</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Powered by Cherry · decisions in seconds</p>
                </button>
              </div>
            </div>
          )}

          {/* ==================== PAY WITH CARD (SQUARE) ==================== */}
          {currentStep === "card" && (
            <div className="animate-in fade-in duration-500 max-w-lg mx-auto">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Secure Payment</h2>
                <p className="text-slate-400">Your balance: <span className="text-cyan-300 font-bold text-xl">${plan.patient_estimate.toLocaleString()}</span></p>
              </div>

              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                {/* Trust badges */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                    <CreditCard className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-slate-300">Visa · MC · Amex · Discover</span>
                  </div>
                </div>

                {/* Square card form */}
                {!process.env.NEXT_PUBLIC_SQUARE_APP_ID ? (
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-6 text-center">
                    <p className="text-amber-300 font-medium mb-1">Square Keys Not Configured</p>
                    <p className="text-sm text-amber-400/70">Add NEXT_PUBLIC_SQUARE_APP_ID, NEXT_PUBLIC_SQUARE_LOCATION_ID, SQUARE_ACCESS_TOKEN to your environment variables.</p>
                  </div>
                ) : (
                  <>
                    <div id="square-card-container" className="mb-6 min-h-[90px]">
                      {!squareReady && (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                          <span className="ml-2 text-sm text-slate-400">Loading secure card form...</span>
                        </div>
                      )}
                    </div>

                    {paymentError && (
                      <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                        <p className="text-sm text-red-300">{paymentError}</p>
                      </div>
                    )}

                    {paymentSuccess && (
                      <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <p className="text-sm text-emerald-300">Payment successful — redirecting...</p>
                      </div>
                    )}

                    <button
                      onClick={handleSquarePayment}
                      disabled={!squareReady || paymentLoading || paymentSuccess}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-semibold text-white hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {paymentLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : paymentSuccess ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <>
                          Pay ${plan.patient_estimate.toLocaleString()}
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setCurrentStep("payment")}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm text-slate-400 hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to payment options
              </button>
            </div>
          )}

          {/* ==================== CHERRY SMS ==================== */}
          {currentStep === "cherry-sms" && (
            <div className="animate-in fade-in duration-500 max-w-lg mx-auto">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Send Financing Link</h2>
                <p className="text-slate-400">We&apos;ll text {patient.first_name} a Cherry application link</p>
              </div>

              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                {/* Amount */}
                <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide mb-1">Financing Amount</p>
                      <p className="text-2xl font-bold">${plan.patient_estimate.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide mb-1">Est. Monthly</p>
                      <p className="text-2xl font-bold text-emerald-300">${Math.round(plan.patient_estimate / 24).toLocaleString()}<span className="text-sm text-slate-400">/mo</span></p>
                    </div>
                  </div>
                </div>

                {/* Cherry stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-300">80%+</p>
                    <p className="text-xs text-slate-400">Approval Rate</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-cyan-300">Soft</p>
                    <p className="text-xs text-slate-400">Credit Check</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-amber-300">60s</p>
                    <p className="text-xs text-slate-400">Decision Time</p>
                  </div>
                </div>

                {/* Phone input */}
                {!smsSent ? (
                  <>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wide">
                      <Phone className="inline h-3.5 w-3.5 mr-1" />
                      Patient&apos;s Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      placeholder="(702) 555-0000"
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white text-lg placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none mb-4"
                    />

                    {smsError && (
                      <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                        <p className="text-sm text-red-300">{smsError}</p>
                      </div>
                    )}

                    <button
                      onClick={handleCherrySms}
                      disabled={smsSending || !smsPhone}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-lg font-semibold text-white hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {smsSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Send Application Link
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <p className="text-lg font-semibold text-emerald-300 mb-1">Link Sent!</p>
                    <p className="text-sm text-slate-400">Application sent to {smsPhone} — redirecting...</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCurrentStep("payment")}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm text-slate-400 hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to payment options
              </button>
            </div>
          )}

          {/* ==================== CHERRY ON-DEVICE IFRAME ==================== */}
          {currentStep === "cherry-iframe" && (
            <div className="animate-in fade-in duration-500 w-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Cherry Financing Application</h2>
                  <p className="text-slate-400 text-sm mt-1">Hand the tablet to {patient.first_name} to complete privately</p>
                </div>
                <button
                  onClick={() => setCurrentStep("payment")}
                  className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/20"
                >
                  <X className="h-3.5 w-3.5" />
                  Back
                </button>
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white" style={{ height: "calc(100vh - 220px)" }}>
                <iframe
                  src={`https://www.withcherry.com/apply?amount=${plan.patient_estimate}&practice_name=AK+Ultimate+Dental&first_name=${encodeURIComponent(patient.first_name)}&last_name=${encodeURIComponent(patient.last_name)}&email=${encodeURIComponent(patient.email ?? "")}&phone=${encodeURIComponent(patient.phone ?? "")}`}
                  className="w-full h-full"
                  title="Cherry Financing Application"
                  allow="payment"
                />
              </div>
              <button
                onClick={() => {
                  setThankYouVariant("cherry-iframe");
                  setCurrentStep("thankyou");
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-6 py-3 text-sm text-emerald-300 hover:bg-emerald-500/30 transition-all"
              >
                <CheckCircle className="h-4 w-4" />
                Application submitted — continue
              </button>
            </div>
          )}

          {/* ==================== THANK YOU ==================== */}
          {currentStep === "thankyou" && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl shadow-emerald-500/30">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                {thankYouVariant === "card" ? "Payment Received!" : "Application Submitted!"}
              </h1>
              <p className="text-xl text-slate-300 mb-3">Thank you, {patient.first_name}!</p>
              <p className="text-lg text-slate-400 mb-12 max-w-md mx-auto">
                {thankYouVariant === "card"
                  ? "Your payment has been processed. Our team will reach out to schedule your next appointment."
                  : thankYouVariant === "cherry-sms"
                  ? "Your Cherry application link was sent to your phone. Complete it anytime — our team will follow up once you're approved."
                  : "Your Cherry application has been submitted. Our team will follow up with next steps once you receive a decision."}
              </p>
              <a
                href="/dashboard/treatments"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-8 py-4 text-lg font-medium hover:bg-white/20 transition-all"
              >
                Return to Dashboard
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          )}

        </div>
      </div>

      {/* Bottom navigation — main flow only */}
      {isMainFlow && currentStep !== "thankyou" && (
        <div className="flex items-center justify-between px-8 py-6 border-t border-white/10 shrink-0">
          <button
            onClick={back}
            disabled={!canGoBack}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-base font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
          <span className="text-sm text-slate-500">Step {stepIndex + 1} of {STEPS.length}</span>
          {canGoForward && (
            <button
              onClick={next}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-base font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          {!canGoForward && <div className="w-32" />}
        </div>
      )}
    </div>
  );
}
