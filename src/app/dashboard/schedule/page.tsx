import { CalendarView } from "@/components/scheduling/calendar-view";
import { CalendarDays } from "lucide-react";

export const metadata = { title: "Schedule | AK Ultimate Dental" };

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
          <CalendarDays className="h-5 w-5 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
          <p className="text-sm text-slate-500">Day and week view of all appointments</p>
        </div>
      </div>
      <CalendarView />
    </div>
  );
}
