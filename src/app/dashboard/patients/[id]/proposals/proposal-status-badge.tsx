import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  draft: { label: "Draft", classes: "bg-slate-100 text-slate-600 border-slate-200" },
  sent: { label: "Sent", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  viewed: { label: "Viewed", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  accepted: { label: "Accepted", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined: { label: "Declined", classes: "bg-red-50 text-red-600 border-red-200" },
  expired: { label: "Expired", classes: "bg-slate-100 text-slate-500 border-slate-200" },
};

export function ProposalStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        cfg.classes
      )}
    >
      {cfg.label}
    </span>
  );
}
