"use client";

import { useState, useEffect } from "react";
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

type Step = "welcome" | "diagnosis" | "procedures" | "costs" | "payment" | "financing" | "thankyou";

const STEPS: Step[] = ["welcome", "diagnosis", "procedures", "costs", "payment"];

export default function TreatmentPresentationPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState<TreatmentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [selectedPayment, setSelectedPayment] = useState<"card" | "financing" | null>(null);
  const [cardSubmitted, setCardSubmitted] = useState(false);
  const [financingSubmitted, setFinancingSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/treatments/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPlan(data.plan);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

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

  const stepIndex = STEPS.indexOf(currentStep);
  const canGoBack = stepIndex > 0 && currentStep !== "financing" && currentStep !== "thankyou";
  const canGoForward = stepIndex < STEPS.length - 1 && currentStep !== "payment" && currentStep !== "financing" && currentStep !== "thankyou";

  function next() {
    if (canGoForward) setCurrentStep(STEPS[stepIndex + 1]);
  }
  function back() {
    if (currentStep === "financing") {
      setCurrentStep("payment");
      return;
    }
    if (canGoBack) setCurrentStep(STEPS[stepIndex - 1]);
  }

  const patient = plan.patient;
  const procedures = plan.procedures || [];
  const billableProcedures = procedures.filter((p) => p.cost > 0);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 text-white overflow-hidden">
      {/* Top Progress Bar */}
      {currentStep !== "thankyou" && (
        <div className="flex items-center justify-between px-8 py-4">
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
                  i <= stepIndex ? "w-12 bg-cyan-400" : "w-8 bg-slate-600"
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
              <p className="text-lg text-slate-400 mb-12">
                by {plan.provider_name} at AK Ultimate Dental
              </p>
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
                    <p className="text-sm font-medium text-cyan-400 mb-2">Dr. Alexandru&apos;s Summary</p>
                    <p className="text-lg leading-relaxed text-slate-200">
                      {plan.ai_summary || "Your treatment plan has been carefully designed to address your dental needs with the best possible outcomes."}
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
                  <div
                    key={i}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
                  >
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
                    <p className="text-sm text-slate-300 leading-relaxed pl-12">
                      {proc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== COSTS / INSURANCE ==================== */}
          {currentStep === "costs" && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">Investment & Insurance</h2>
                <p className="text-lg text-slate-400">Here&apos;s how the costs break down with your coverage</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Cost Breakdown */}
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

                {/* Insurance + Patient Responsibility */}
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

              {/* Monthly payment teaser */}
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
          {currentStep === "payment" && !cardSubmitted && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">Payment Options</h2>
                <p className="text-lg text-slate-400">
                  Your balance: <span className="text-cyan-300 font-bold text-2xl">${plan.patient_estimate.toLocaleString()}</span>
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2 max-w-3xl mx-auto">
                {/* Pay with Card */}
                <button
                  onClick={() => {
                    setSelectedPayment("card");
                  }}
                  className={`group rounded-3xl border-2 p-8 text-left transition-all ${
                    selectedPayment === "card"
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Pay Now</h3>
                  <p className="text-slate-400 mb-4">Pay the full balance with a credit or debit card</p>
                  <p className="text-3xl font-bold text-cyan-300">${plan.patient_estimate.toLocaleString()}</p>
                </button>

                {/* Apply for Financing */}
                <button
                  onClick={() => {
                    setSelectedPayment("financing");
                    setCurrentStep("financing");
                  }}
                  className={`group rounded-3xl border-2 p-8 text-left transition-all ${
                    selectedPayment === "financing"
                      ? "border-emerald-400 bg-emerald-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <Landmark className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Monthly Payments</h3>
                  <p className="text-slate-400 mb-4">Apply for financing — quick approval, low monthly payments</p>
                  <p className="text-3xl font-bold text-emerald-300">
                    ${Math.round(plan.patient_estimate / 24).toLocaleString()}<span className="text-base text-slate-400">/mo</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Est. 24 months, subject to approval</p>
                </button>
              </div>

              {/* Card Payment Form */}
              {selectedPayment === "card" && (
                <div className="mt-8 max-w-lg mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm animate-in fade-in duration-300">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-cyan-400" />
                    Card Payment — ${plan.patient_estimate.toLocaleString()}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Cardholder Name</label>
                      <input
                        type="text"
                        defaultValue={`${patient.first_name} ${patient.last_name}`}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCardSubmitted(true);
                        setCurrentStep("thankyou");
                      }}
                      className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-semibold text-white hover:from-cyan-600 hover:to-blue-700 transition-all"
                    >
                      Pay ${plan.patient_estimate.toLocaleString()}
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== FINANCING APPLICATION ==================== */}
          {currentStep === "financing" && !financingSubmitted && (
            <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Landmark className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Financing Application</h2>
                <p className="text-slate-400">Pre-filled with your information — verify and submit</p>
              </div>

              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-emerald-400 font-medium">Financing Amount</p>
                      <p className="text-2xl font-bold text-white">${plan.patient_estimate.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-emerald-400 font-medium">Est. Monthly</p>
                      <p className="text-2xl font-bold text-emerald-300">${Math.round(plan.patient_estimate / 24).toLocaleString()}/mo</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">First Name</label>
                      <input type="text" defaultValue={patient.first_name} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Last Name</label>
                      <input type="text" defaultValue={patient.last_name} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
                      <input type="email" defaultValue={patient.email || ""} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Phone</label>
                      <input type="tel" defaultValue={patient.phone || ""} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Date of Birth</label>
                    <input type="date" defaultValue={patient.date_of_birth || ""} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Address</label>
                    <input type="text" defaultValue={patient.address || ""} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">City</label>
                      <input type="text" defaultValue={patient.city || ""} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">State</label>
                      <input type="text" defaultValue={patient.state || ""} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">ZIP</label>
                      <input type="text" defaultValue={patient.zip || ""} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Annual Income (approximate)</label>
                    <input type="text" placeholder="$50,000" className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Last 4 of SSN (for credit check)</label>
                    <input type="text" placeholder="••••" maxLength={4} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none" />
                  </div>
                </div>

                <div className="mt-6 text-xs text-slate-500">
                  By submitting, you authorize a soft credit inquiry. This will not affect your credit score.
                  Financing provided by our partner lending network. Terms and approval subject to credit review.
                </div>

                <button
                  onClick={() => {
                    setFinancingSubmitted(true);
                    setCurrentStep("thankyou");
                  }}
                  className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-lg font-semibold text-white hover:from-emerald-600 hover:to-teal-700 transition-all"
                >
                  Submit Application
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* ==================== THANK YOU ==================== */}
          {currentStep === "thankyou" && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl shadow-emerald-500/30">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                {cardSubmitted ? "Payment Received!" : "Application Submitted!"}
              </h1>
              <p className="text-xl text-slate-300 mb-3">
                Thank you, {patient.first_name}!
              </p>
              <p className="text-lg text-slate-400 mb-12 max-w-md mx-auto">
                {cardSubmitted
                  ? "Your payment has been processed. Our team will reach out to schedule your next appointment."
                  : "Your financing application has been submitted. You'll receive a decision shortly, and our team will follow up with next steps."}
              </p>
              <div className="flex flex-col items-center gap-4">
                <a
                  href="/dashboard/treatments"
                  className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-8 py-4 text-lg font-medium hover:bg-white/20 transition-all"
                >
                  Return to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      {currentStep !== "thankyou" && currentStep !== "financing" && !(currentStep === "payment" && selectedPayment === "card") && (
        <div className="flex items-center justify-between px-8 py-6 border-t border-white/10">
          <button
            onClick={back}
            disabled={!canGoBack}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-base font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
          <span className="text-sm text-slate-500">
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          {canGoForward && (
            <button
              onClick={next}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-base font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          {!canGoForward && currentStep !== "payment" && (
            <div className="w-32" />
          )}
        </div>
      )}

      {/* Back button for financing */}
      {currentStep === "financing" && (
        <div className="flex items-center justify-between px-8 py-6 border-t border-white/10">
          <button onClick={back} className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-base font-medium hover:bg-white/20 transition-all">
            <ChevronLeft className="h-5 w-5" />
            Back to Options
          </button>
          <div />
          <div />
        </div>
      )}
    </div>
  );
}
