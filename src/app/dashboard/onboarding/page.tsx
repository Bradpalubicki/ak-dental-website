import { ClipboardList, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Client Onboarding | AK Ultimate Dental",
};

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Client Onboarding</h1>
        <p className="text-sm text-slate-500">
          Streamline new patient intake and onboarding workflows
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/50 p-16 text-center">
        <div className="rounded-full bg-cyan-50 p-4 mb-4">
          <ClipboardList className="h-8 w-8 text-cyan-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Onboarding Portal Coming Soon
        </h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Automated new patient onboarding with digital intake forms, insurance
          verification, consent collection, and appointment scheduling — all
          powered by One Engine AI.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl">
          {[
            {
              title: "Digital Intake Forms",
              desc: "Patients complete medical history, insurance info, and consents online before their visit",
            },
            {
              title: "Auto-Verification",
              desc: "Insurance eligibility checked automatically when forms are submitted",
            },
            {
              title: "Smart Scheduling",
              desc: "AI suggests optimal appointment times based on provider availability and treatment needs",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <ArrowRight className="h-3.5 w-3.5 text-cyan-500" />
                <h3 className="text-sm font-medium text-slate-900">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
