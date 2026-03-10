import { CalendarDays, Calendar, Clock } from "lucide-react";
import { SectionHub } from "@/components/dashboard/section-hub";
import { CalendarView } from "@/components/scheduling/calendar-view";

export const metadata = { title: "Schedule | AK Ultimate Dental" };

export default function SchedulePage() {
  return (
    <div>
      <SectionHub
        title="Schedule"
        description="Calendar, appointments, and waitlist management"
        icon={CalendarDays}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
        links={[
          {
            label: "Calendar",
            href: "/dashboard/schedule",
            icon: CalendarDays,
            description: "Day and week appointment calendar",
          },
          {
            label: "Appointments",
            href: "/dashboard/appointments",
            icon: Calendar,
            description: "All appointments — search and filter",
          },
          {
            label: "Waitlist",
            href: "/dashboard/waitlist",
            icon: Clock,
            description: "Patients waiting for earlier openings",
          },
        ]}
      />
      <CalendarView />
    </div>
  );
}
