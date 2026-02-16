import { Clock, Users, Bell, Calendar } from "lucide-react";

export const metadata = {
  title: "Waitlist | AK Ultimate Dental",
};

export default function WaitlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Waitlist Management</h1>
        <p className="text-sm text-slate-500">
          Track patients waiting for appointments and manage cancellation fill-ins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "On Waitlist",
            value: "0",
            icon: Users,
            color: "text-cyan-600 bg-cyan-50",
          },
          {
            label: "Notified Today",
            value: "0",
            icon: Bell,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "Filled This Week",
            value: "0",
            icon: Calendar,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Avg Wait Time",
            value: "—",
            icon: Clock,
            color: "text-violet-600 bg-violet-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <Clock className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          No Patients on Waitlist
        </h2>
        <p className="text-sm text-slate-500 max-w-md">
          When patients request earlier appointments or cancellation fill-ins,
          they&apos;ll appear here. One Engine will automatically notify waitlisted
          patients when slots open up.
        </p>
      </div>
    </div>
  );
}
