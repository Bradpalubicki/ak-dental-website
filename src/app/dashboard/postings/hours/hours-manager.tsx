"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock3, Plus, Pencil, Trash2, Loader2, AlertTriangle, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HoursOverride {
  id: string;
  label: string;
  note: string | null;
  show_banner: boolean;
  banner_message: string | null;
  starts_at: string;
  ends_at: string;
  mon_hours: string | null;
  tue_hours: string | null;
  wed_hours: string | null;
  thu_hours: string | null;
  fri_hours: string | null;
  sat_hours: string | null;
  sun_hours: string | null;
  status: "active" | "archived";
  created_at: string;
}

interface Props {
  initialOverrides: HoursOverride[];
}

const DAYS = [
  { key: "mon_hours", label: "Monday" },
  { key: "tue_hours", label: "Tuesday" },
  { key: "wed_hours", label: "Wednesday" },
  { key: "thu_hours", label: "Thursday" },
  { key: "fri_hours", label: "Friday" },
  { key: "sat_hours", label: "Saturday" },
  { key: "sun_hours", label: "Sunday" },
] as const;

type DayKey = typeof DAYS[number]["key"];

// ─── Form schema ─────────────────────────────────────────────────────────────

const FormSchema = z.object({
  label: z.string().min(1, "Label required").max(100),
  note: z.string().max(300).optional(),
  show_banner: z.boolean(),
  banner_message: z.string().max(200).optional(),
  starts_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Required"),
  ends_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Required"),
  mon_hours: z.string().max(30).optional(),
  tue_hours: z.string().max(30).optional(),
  wed_hours: z.string().max(30).optional(),
  thu_hours: z.string().max(30).optional(),
  fri_hours: z.string().max(30).optional(),
  sat_hours: z.string().max(30).optional(),
  sun_hours: z.string().max(30).optional(),
});
type FormValues = z.infer<typeof FormSchema>;

function formatDateRange(starts: string, ends: string) {
  const s = new Date(starts + "T00:00:00");
  const e = new Date(ends + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (s.getTime() === e.getTime()) return s.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

function isCurrentOrUpcoming(override: HoursOverride) {
  const today = new Date().toISOString().split("T")[0];
  return override.ends_at >= today;
}

// ─── Day Hours Row ────────────────────────────────────────────────────────────

function DayRow({ label, fieldKey, register, closedValue, onClosed }: {
  label: string;
  fieldKey: DayKey;
  register: ReturnType<typeof useForm<FormValues>>["register"];
  closedValue: boolean;
  onClosed: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="w-24 text-sm font-medium text-gray-600 shrink-0">{label}</label>
      <label className="flex items-center gap-2 cursor-pointer shrink-0">
        <input type="checkbox" checked={closedValue} onChange={(e) => onClosed(e.target.checked)} className="rounded" />
        <span className="text-sm text-gray-500">Closed</span>
      </label>
      {!closedValue && (
        <Input
          {...register(fieldKey)}
          placeholder="8:00 AM – 5:00 PM"
          className="text-sm h-8"
        />
      )}
    </div>
  );
}

// ─── Form Modal ───────────────────────────────────────────────────────────────

function HoursFormModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (v: FormValues, id?: string) => Promise<void>;
  initial?: HoursOverride;
}) {
  const [saving, setSaving] = useState(false);
  const [closedDays, setClosedDays] = useState<Record<DayKey, boolean>>({
    mon_hours: initial?.mon_hours === null,
    tue_hours: initial?.tue_hours === null,
    wed_hours: initial?.wed_hours === null,
    thu_hours: initial?.thu_hours === null,
    fri_hours: initial?.fri_hours === null,
    sat_hours: initial?.sat_hours === null,
    sun_hours: initial?.sun_hours === null,
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: initial?.label ?? "",
      note: initial?.note ?? "",
      show_banner: initial?.show_banner ?? true,
      banner_message: initial?.banner_message ?? "",
      starts_at: initial?.starts_at ?? "",
      ends_at: initial?.ends_at ?? "",
      mon_hours: initial?.mon_hours ?? "",
      tue_hours: initial?.tue_hours ?? "",
      wed_hours: initial?.wed_hours ?? "",
      thu_hours: initial?.thu_hours ?? "",
      fri_hours: initial?.fri_hours ?? "",
      sat_hours: initial?.sat_hours ?? "",
      sun_hours: initial?.sun_hours ?? "",
    },
  });

  const showBanner = watch("show_banner");

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      // Null out closed days
      const payload: FormValues = { ...values };
      for (const day of DAYS) {
        if (closedDays[day.key]) {
          (payload as Record<string, unknown>)[day.key] = null;
        }
      }
      await onSave(payload, initial?.id);
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Hours Override" : "Add Hours Override"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Label *</label>
            <Input {...register("label")} placeholder="e.g. Holiday Hours — Christmas Week" />
            {errors.label && <p className="text-xs text-red-500">{errors.label.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Start Date *</label>
              <Input type="date" {...register("starts_at")} />
              {errors.starts_at && <p className="text-xs text-red-500">{errors.starts_at.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">End Date *</label>
              <Input type="date" {...register("ends_at")} />
              {errors.ends_at && <p className="text-xs text-red-500">{errors.ends_at.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Override Hours <span className="text-gray-400 font-normal">(leave blank = normal hours)</span></label>
            <div className="rounded-lg border border-gray-200 p-3 space-y-2.5 bg-gray-50">
              {DAYS.map((day) => (
                <DayRow
                  key={day.key}
                  label={day.label}
                  fieldKey={day.key}
                  register={register}
                  closedValue={closedDays[day.key]}
                  onClosed={(v) => setClosedDays((prev) => ({ ...prev, [day.key]: v }))}
                />
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
            <input type="checkbox" checked={showBanner} onChange={(e) => setValue("show_banner", e.target.checked)} className="rounded" />
            <div>
              <p className="text-sm font-medium text-gray-800">Show a sitewide banner</p>
              <p className="text-xs text-gray-500">Displays a notice at the top of your website during this period</p>
            </div>
          </label>

          {showBanner && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Banner Message <span className="text-gray-400 font-normal">(optional — auto-generated if blank)</span></label>
              <Input {...register("banner_message")} placeholder="e.g. Our office is closed Dec 24–26. Happy Holidays!" />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Internal Note</label>
            <Textarea {...register("note")} rows={2} placeholder="Internal reminder — not shown to patients" />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 border-0 text-white">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : initial ? "Save Changes" : "Add Override"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function OverrideCard({
  override,
  onEdit,
  onDelete,
}: {
  override: HoursOverride;
  onEdit: (o: HoursOverride) => void;
  onDelete: (id: string) => void;
}) {
  const isCurrent = isCurrentOrUpcoming(override);
  const today = new Date().toISOString().split("T")[0];
  const isLiveNow = override.starts_at <= today && override.ends_at >= today;

  return (
    <div className={`rounded-xl border bg-white p-5 space-y-3 transition-colors ${isCurrent ? "border-emerald-200 hover:border-emerald-300" : "border-gray-100 opacity-60"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isLiveNow && (
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5">Live Now</span>
            )}
            {!isLiveNow && isCurrent && (
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5">Upcoming</span>
            )}
            {!isCurrent && (
              <span className="text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-2.5 py-0.5">Past</span>
            )}
          </div>
          <h3 className="font-bold text-gray-900">{override.label}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <CalendarRange className="h-3.5 w-3.5" /> {formatDateRange(override.starts_at, override.ends_at)}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(override)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(override.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hours grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
        {DAYS.map((day) => {
          const hours = override[day.key];
          return (
            <div key={day.key} className="rounded-md bg-gray-50 border border-gray-100 px-2 py-1.5">
              <p className="font-semibold text-gray-500 mb-0.5">{day.label.slice(0, 3)}</p>
              <p className={hours ? "text-gray-800" : "text-red-500 font-medium"}>
                {hours ?? "Closed"}
              </p>
            </div>
          );
        })}
      </div>

      {override.show_banner && (
        <div className="rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-800">
          <span className="font-semibold">Banner: </span>
          {override.banner_message || `${override.label} — hours shown above`}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HoursManager({ initialOverrides }: Props) {
  const [overrides, setOverrides] = useState<HoursOverride[]>(initialOverrides);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HoursOverride | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function handleSave(values: FormValues, id?: string) {
    if (id) {
      const res = await fetch(`/api/postings/hours/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const { override } = await res.json();
      setOverrides((prev) => prev.map((o) => o.id === id ? { ...o, ...override } : o));
    } else {
      const res = await fetch("/api/postings/hours", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const { override } = await res.json();
      setOverrides((prev) => [override, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/postings/hours/${id}`, { method: "DELETE" });
    setOverrides((prev) => prev.filter((o) => o.id !== id));
    setDeleteConfirm(null);
  }

  const today = new Date().toISOString().split("T")[0];
  const upcoming = overrides.filter((o) => o.ends_at >= today);
  const past = overrides.filter((o) => o.ends_at < today);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Office Hours Overrides</h1>
          <p className="mt-1 text-sm text-gray-500">Set temporary hours for holidays, closures, or schedule changes. Overrides apply only for the date range you set.</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 border-0 text-white shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Add Override
        </Button>
      </div>

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Current & Upcoming ({upcoming.length})</h2>
          {upcoming.map((o) => (
            <OverrideCard key={o.id} override={o} onEdit={(o) => { setEditing(o); setModalOpen(true); }} onDelete={(id) => setDeleteConfirm(id)} />
          ))}
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Past Overrides</h2>
          {past.map((o) => (
            <OverrideCard key={o.id} override={o} onEdit={(o) => { setEditing(o); setModalOpen(true); }} onDelete={(id) => setDeleteConfirm(id)} />
          ))}
        </section>
      )}

      {overrides.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Clock3 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h2 className="font-semibold text-gray-700">No hours overrides</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">Your regular hours are showing. Add an override for holidays, closures, or temporary schedule changes.</p>
          <Button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="mt-5 bg-emerald-600 hover:bg-emerald-700 border-0 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Your First Override
          </Button>
        </div>
      )}

      <HoursFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(undefined); }} onSave={handleSave} initial={editing} />

      <Dialog open={!!deleteConfirm} onOpenChange={(o) => !o && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Remove This Override?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">The hours override and any associated banner will be removed immediately.</p>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
