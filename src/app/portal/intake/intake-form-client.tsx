"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ClipboardList, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  insurance_provider: string;
  insurance_member_id: string;
  insurance_group_number: string;
}

interface IntakeFormClientProps {
  patient: PatientData;
  alreadySubmitted: boolean;
  submittedAt: string | null;
}

const STEPS = ["Personal Info", "Medical History", "Insurance", "Consent"];

const MEDICAL_CONDITIONS = [
  "Heart disease or heart attack",
  "High blood pressure",
  "Diabetes",
  "Blood disorders / anemia",
  "Kidney disease",
  "Liver disease / hepatitis",
  "Thyroid problems",
  "Respiratory issues / asthma",
  "Arthritis or joint replacement",
  "Cancer or cancer treatment",
  "HIV / AIDS",
  "Epilepsy / seizures",
  "Osteoporosis",
  "Pregnancy or nursing",
];

export function IntakeFormClient({ patient, alreadySubmitted, submittedAt }: IntakeFormClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — Personal info
  const [personalInfo, setPersonalInfo] = useState({
    phone: patient.phone,
    date_of_birth: patient.date_of_birth,
    address: patient.address,
    city: patient.city,
    state: patient.state,
    zip: patient.zip,
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
  });

  // Step 2 — Medical history
  const [medicalHistory, setMedicalHistory] = useState({
    conditions: [] as string[],
    medications: "",
    allergies: "",
    previous_dental_work: "",
    last_dental_visit: "",
    dental_anxiety: "none" as "none" | "mild" | "moderate" | "severe",
    reason_for_visit: "",
    referred_by: "",
  });

  // Step 3 — Insurance
  const [insuranceInfo, setInsuranceInfo] = useState({
    insurance_provider: patient.insurance_provider,
    insurance_member_id: patient.insurance_member_id,
    insurance_group_number: patient.insurance_group_number,
    insurance_subscriber_name: "",
    insurance_subscriber_dob: "",
    secondary_insurance: false,
    secondary_provider: "",
    secondary_member_id: "",
  });

  // Step 4 — Consent
  const [consent, setConsent] = useState({
    treatment_consent: false,
    hipaa_acknowledgment: false,
    financial_responsibility: false,
    sms_consent: false,
  });

  const toggleCondition = (condition: string) => {
    setMedicalHistory((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const canAdvance = () => {
    if (step === 0) return personalInfo.phone && personalInfo.date_of_birth;
    if (step === 1) return medicalHistory.reason_for_visit.length > 0;
    if (step === 2) return true; // Insurance is optional for uninsured
    if (step === 3) return consent.treatment_consent && consent.hipaa_acknowledgment && consent.financial_responsibility;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/portal/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo,
          medicalHistory,
          insuranceInfo,
          consent,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadySubmitted && !done) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center space-y-4 p-6">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Intake Forms Complete</h2>
        <p className="text-sm text-slate-500">
          You submitted your intake forms on{" "}
          {submittedAt
            ? new Date(submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : "a previous visit"}
          . Nothing else needed before your appointment.
        </p>
        <button
          onClick={() => router.push("/portal")}
          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center space-y-4 p-6">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Forms Submitted!</h2>
        <p className="text-sm text-slate-500">
          Thank you, {patient.first_name}. Your intake forms have been received. Our team will review them before your appointment.
        </p>
        <button
          onClick={() => router.push("/portal")}
          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-cyan-600" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">New Patient Intake Forms</h1>
          <p className="text-sm text-slate-500">Complete before your first visit — takes about 5 minutes</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold shrink-0 ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden sm:block ml-1 text-xs ${i === step ? "text-slate-700 font-medium" : "text-slate-400"}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-emerald-300" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <>
            <h2 className="text-sm font-semibold text-slate-800">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
                <input value={patient.first_name} disabled className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
                <input value={patient.last_name} disabled className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Phone *</label>
                <input value={personalInfo.phone} onChange={(e) => setPersonalInfo((p) => ({ ...p, phone: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="(702) 555-0100" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth *</label>
                <input type="date" value={personalInfo.date_of_birth} onChange={(e) => setPersonalInfo((p) => ({ ...p, date_of_birth: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Street Address</label>
                <input value={personalInfo.address} onChange={(e) => setPersonalInfo((p) => ({ ...p, address: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="123 Main St" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
                <input value={personalInfo.city} onChange={(e) => setPersonalInfo((p) => ({ ...p, city: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Las Vegas" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">State</label>
                  <input value={personalInfo.state} onChange={(e) => setPersonalInfo((p) => ({ ...p, state: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="NV" maxLength={2} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">ZIP</label>
                  <input value={personalInfo.zip} onChange={(e) => setPersonalInfo((p) => ({ ...p, zip: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="89117" />
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-medium text-slate-600 mb-3">Emergency Contact</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Name</label>
                  <input value={personalInfo.emergency_contact_name} onChange={(e) => setPersonalInfo((p) => ({ ...p, emergency_contact_name: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Relationship</label>
                  <input value={personalInfo.emergency_contact_relation} onChange={(e) => setPersonalInfo((p) => ({ ...p, emergency_contact_relation: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Spouse" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-slate-500 mb-1">Phone</label>
                  <input value={personalInfo.emergency_contact_phone} onChange={(e) => setPersonalInfo((p) => ({ ...p, emergency_contact_phone: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="(702) 555-0101" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 1: Medical History */}
        {step === 1 && (
          <>
            <h2 className="text-sm font-semibold text-slate-800">Medical History</h2>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Reason for Visit Today *</label>
              <textarea value={medicalHistory.reason_for_visit} onChange={(e) => setMedicalHistory((p) => ({ ...p, reason_for_visit: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Routine cleaning, tooth pain, chipped tooth..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-3">Do you have any of the following conditions? (check all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MEDICAL_CONDITIONS.map((condition) => (
                  <label key={condition} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={medicalHistory.conditions.includes(condition)}
                      onChange={() => toggleCondition(condition)}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-slate-600 group-hover:text-slate-900">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Current Medications</label>
                <textarea value={medicalHistory.medications} onChange={(e) => setMedicalHistory((p) => ({ ...p, medications: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="List medications, or write None" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Known Allergies</label>
                <textarea value={medicalHistory.allergies} onChange={(e) => setMedicalHistory((p) => ({ ...p, allergies: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Latex, penicillin, anesthetics, etc." />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Previous Dental Work</label>
                <textarea value={medicalHistory.previous_dental_work} onChange={(e) => setMedicalHistory((p) => ({ ...p, previous_dental_work: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Crowns, implants, root canals, braces..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Last Dental Visit</label>
                <input type="date" value={medicalHistory.last_dental_visit} onChange={(e) => setMedicalHistory((p) => ({ ...p, last_dental_visit: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Dental Anxiety Level</label>
              <div className="flex gap-3">
                {(["none", "mild", "moderate", "severe"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setMedicalHistory((p) => ({ ...p, dental_anxiety: level }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${medicalHistory.dental_anxiety === level ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">How did you hear about us?</label>
              <input value={medicalHistory.referred_by} onChange={(e) => setMedicalHistory((p) => ({ ...p, referred_by: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Google, friend referral, insurance directory..." />
            </div>
          </>
        )}

        {/* Step 2: Insurance */}
        {step === 2 && (
          <>
            <h2 className="text-sm font-semibold text-slate-800">Insurance Information</h2>
            <p className="text-xs text-slate-500">If you don&apos;t have dental insurance, leave these fields blank.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Insurance Provider</label>
                <input value={insuranceInfo.insurance_provider} onChange={(e) => setInsuranceInfo((p) => ({ ...p, insurance_provider: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Delta Dental, Cigna, MetLife..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Member ID</label>
                <input value={insuranceInfo.insurance_member_id} onChange={(e) => setInsuranceInfo((p) => ({ ...p, insurance_member_id: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="123456789" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Group Number</label>
                <input value={insuranceInfo.insurance_group_number} onChange={(e) => setInsuranceInfo((p) => ({ ...p, insurance_group_number: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="GRP-001" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Subscriber Name (if different from you)</label>
                <input value={insuranceInfo.insurance_subscriber_name} onChange={(e) => setInsuranceInfo((p) => ({ ...p, insurance_subscriber_name: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Name on the policy" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Subscriber Date of Birth</label>
                <input type="date" value={insuranceInfo.insurance_subscriber_dob} onChange={(e) => setInsuranceInfo((p) => ({ ...p, insurance_subscriber_dob: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={insuranceInfo.secondary_insurance} onChange={(e) => setInsuranceInfo((p) => ({ ...p, secondary_insurance: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-cyan-600" />
                <span className="text-xs text-slate-600 font-medium">I have secondary dental insurance</span>
              </label>
            </div>
            {insuranceInfo.secondary_insurance && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Secondary Provider</label>
                  <input value={insuranceInfo.secondary_provider} onChange={(e) => setInsuranceInfo((p) => ({ ...p, secondary_provider: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Secondary Member ID</label>
                  <input value={insuranceInfo.secondary_member_id} onChange={(e) => setInsuranceInfo((p) => ({ ...p, secondary_member_id: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 3: Consent */}
        {step === 3 && (
          <>
            <h2 className="text-sm font-semibold text-slate-800">Consent & Acknowledgments</h2>
            <div className="space-y-4">
              {[
                {
                  key: "treatment_consent" as const,
                  label: "Consent to Treatment *",
                  text: "I authorize AK Ultimate Dental and its staff to perform necessary dental examinations and treatments as deemed appropriate by the treating dentist. I understand that dentistry is not an exact science and that results cannot be guaranteed.",
                },
                {
                  key: "hipaa_acknowledgment" as const,
                  label: "HIPAA Privacy Notice *",
                  text: "I acknowledge that I have been provided with AK Ultimate Dental's Notice of Privacy Practices, which describes how my health information may be used and disclosed, and how I can access this information.",
                },
                {
                  key: "financial_responsibility" as const,
                  label: "Financial Responsibility *",
                  text: "I understand that payment is due at the time of service for any amounts not covered by insurance. I accept responsibility for all charges incurred during my treatment, regardless of insurance coverage.",
                },
                {
                  key: "sms_consent" as const,
                  label: "SMS / Text Consent (Optional)",
                  text: "I consent to receive appointment reminders, recall notices, and other dental care communications via text message (SMS). Message and data rates may apply. Reply STOP to opt out at any time.",
                },
              ].map(({ key, label, text }) => (
                <label key={key} className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${consent[key] ? "border-cyan-200 bg-cyan-50" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                  <input
                    type="checkbox"
                    checked={consent[key]}
                    onChange={(e) => setConsent((p) => ({ ...p, [key]: e.target.checked }))}
                    className="h-4 w-4 mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 mb-1">{label}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
                  </div>
                </label>
              ))}
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !canAdvance()}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            {submitting ? "Submitting..." : "Submit Forms"}
          </button>
        )}
      </div>
    </div>
  );
}
