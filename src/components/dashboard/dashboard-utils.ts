export function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${minutes} ${ampm}`;
}

export function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export const statusConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  scheduled: {
    label: "Scheduled",
    color: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  checked_in: {
    label: "Checked In",
    color: "bg-purple-50 text-purple-700 ring-purple-600/20",
    dot: "bg-purple-500",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
    dot: "bg-cyan-500",
  },
  completed: {
    label: "Completed",
    color: "bg-green-50 text-green-700 ring-green-600/20",
    dot: "bg-green-500",
  },
  no_show: {
    label: "No Show",
    color: "bg-red-50 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
  },
};

export const MODULE_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  leads: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  appointments: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  insurance: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  billing: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  outreach: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  recall: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  default: { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" },
};
