"use client";

interface AppointmentCardProps {
  id: string;
  patientName: string;
  providerName: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  onClick?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  checked_in: "bg-purple-100 text-purple-800 border-purple-200",
  in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  no_show: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-400 border-gray-200 line-through",
};

export function AppointmentCard({ id, patientName, providerName, time, duration, type, status, onClick }: AppointmentCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className={`w-full text-left rounded-md border p-2 text-xs transition-colors hover:shadow-sm ${statusColors[status] || "bg-white border-border"}`}
    >
      <div className="font-medium truncate">{patientName}</div>
      <div className="text-[10px] opacity-75 truncate">{time} &middot; {duration}min &middot; {type}</div>
      <div className="text-[10px] opacity-60 truncate">{providerName}</div>
    </button>
  );
}
