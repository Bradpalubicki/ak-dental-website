"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tag, Plus, Pencil, Trash2, Loader2, Star, Pause, Play, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Special {
  id: string;
  title: string;
  description: string | null;
  fine_print: string | null;
  cta_label: string;
  cta_href: string;
  badge_text: string | null;
  discount_type: string | null;
  discount_display: string | null;
  starts_at: string;
  expires_at: string | null;
  status: "active" | "paused" | "expired" | "archived";
  is_featured: boolean;
  created_at: string;
}

interface Props {
  initialSpecials: Special[];
}

// ─── Form schema ─────────────────────────────────────────────────────────────

const SpecialFormSchema = z.object({
  title: z.string().min(1, "Title required").max(120),
  description: z.string().max(500).optional(),
  fine_print: z.string().max(300).optional(),
  cta_label: z.string().max(60),
  cta_href: z.string().max(200),
  badge_text: z.string().max(40).optional(),
  discount_display: z.string().max(60).optional(),
  expires_at: z.string().optional(),
  is_featured: z.boolean(),
});

type SpecialFormValues = z.infer<typeof SpecialFormSchema>;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active:  { label: "Live",    color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  paused:  { label: "Paused",  color: "bg-amber-50 text-amber-700 border-amber-200" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-500 border-gray-200" },
  archived:{ label: "Archived",color: "bg-gray-100 text-gray-400 border-gray-200" },
} as const;

function formatExpiry(s: string | null) {
  if (!s) return "No expiry";
  const d = new Date(s);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return "Expired";
  if (diff === 0) return "Expires today";
  if (diff === 1) return "Expires tomorrow";
  return `Expires in ${diff} days`;
}

// ─── SpecialCard ─────────────────────────────────────────────────────────────

function SpecialCard({
  special,
  onEdit,
  onToggle,
  onDelete,
}: {
  special: Special;
  onEdit: (s: Special) => void;
  onToggle: (s: Special) => void;
  onDelete: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[special.status] ?? STATUS_CONFIG.paused;
  const isActive = special.status === "active";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 hover:border-amber-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${cfg.color}`}>
              {cfg.label}
            </span>
            {special.badge_text && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2.5 py-0.5">
                {special.badge_text}
              </span>
            )}
            {special.is_featured && (
              <span className="flex items-center gap-1 text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2.5 py-0.5">
                <Star className="h-3 w-3 fill-yellow-500" /> Featured
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900">{special.title}</h3>
          {special.discount_display && (
            <p className="text-lg font-extrabold text-amber-600 mt-0.5">{special.discount_display}</p>
          )}
          {special.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{special.description}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(special)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          {special.status !== "expired" && special.status !== "archived" && (
            <button onClick={() => onToggle(special)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title={isActive ? "Pause" : "Activate"}>
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}
          <button onClick={() => onDelete(special.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
        <span>{formatExpiry(special.expires_at)}</span>
        <Link href="/specials" target="_blank" className="flex items-center gap-1 text-amber-600 hover:underline font-medium">
          <ExternalLink className="h-3 w-3" /> Preview
        </Link>
      </div>
    </div>
  );
}

// ─── Form modal ───────────────────────────────────────────────────────────────

function SpecialFormModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (values: SpecialFormValues, id?: string) => Promise<void>;
  initial?: Special;
}) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<SpecialFormValues>({
    resolver: zodResolver(SpecialFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      fine_print: initial?.fine_print ?? "",
      cta_label: initial?.cta_label ?? "Claim This Offer",
      cta_href: initial?.cta_href ?? "/appointment",
      badge_text: initial?.badge_text ?? "",
      discount_display: initial?.discount_display ?? "",
      expires_at: initial?.expires_at ? new Date(initial.expires_at).toISOString().split("T")[0] : "",
      is_featured: initial?.is_featured ?? false,
    },
  });

  const isFeatured = watch("is_featured");

  async function onSubmit(values: SpecialFormValues) {
    setSaving(true);
    try {
      await onSave(values, initial?.id);
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
          <DialogTitle>{initial ? "Edit Special" : "Create a Special Offer"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Offer Title *</label>
            <Input {...register("title")} placeholder="e.g. New Patient Whitening Special" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Discount Display</label>
            <Input {...register("discount_display")} placeholder="e.g. $99 Whitening  |  Free Exam & X-Rays  |  20% Off Veneers" />
            <p className="text-xs text-gray-400">Shown large in the offer card. Leave blank if no specific discount.</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Textarea {...register("description")} rows={3} placeholder="Brief description of the offer — what's included, who it's for" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Badge Label</label>
              <Input {...register("badge_text")} placeholder="Limited Time" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Expiry Date</label>
              <Input type="date" {...register("expires_at")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Button Label</label>
              <Input {...register("cta_label")} placeholder="Claim This Offer" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Button Link</label>
              <Input {...register("cta_href")} placeholder="/appointment" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Fine Print</label>
            <Input {...register("fine_print")} placeholder="Cannot combine with insurance. Expires 3/31/2026." />
          </div>

          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setValue("is_featured", e.target.checked)}
              className="rounded"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">Feature this offer</p>
              <p className="text-xs text-gray-500">Shown first and highlighted on the Specials page</p>
            </div>
          </label>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-600 border-0 text-white">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : initial ? "Save Changes" : "Create Special"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SpecialsManager({ initialSpecials }: Props) {
  const [specials, setSpecials] = useState<Special[]>(initialSpecials);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Special | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function handleSave(values: SpecialFormValues, id?: string) {
    const payload = {
      ...values,
      expires_at: values.expires_at ? new Date(values.expires_at + "T23:59:59").toISOString() : null,
      badge_text: values.badge_text || null,
      discount_display: values.discount_display || null,
      fine_print: values.fine_print || null,
      description: values.description || null,
    };

    if (id) {
      const res = await fetch(`/api/postings/specials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const { special } = await res.json();
      setSpecials((prev) => prev.map((s) => s.id === id ? { ...s, ...special } : s));
    } else {
      const res = await fetch("/api/postings/specials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const { special } = await res.json();
      setSpecials((prev) => [special, ...prev]);
    }
  }

  async function handleToggle(special: Special) {
    const newStatus = special.status === "active" ? "paused" : "active";
    await fetch(`/api/postings/specials/${special.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setSpecials((prev) => prev.map((s) => s.id === special.id ? { ...s, status: newStatus } : s));
  }

  async function handleDelete(id: string) {
    await fetch(`/api/postings/specials/${id}`, { method: "DELETE" });
    setSpecials((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  }

  const active = specials.filter((s) => s.status === "active");
  const other = specials.filter((s) => s.status !== "active");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Special Offers</h1>
          <p className="mt-1 text-sm text-gray-500">Create promotions that appear on your public <Link href="/specials" target="_blank" className="text-amber-600 hover:underline">Specials page</Link>. Set an expiry and they remove themselves automatically.</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="bg-amber-500 hover:bg-amber-600 border-0 text-white shrink-0">
          <Plus className="h-4 w-4 mr-2" /> New Special
        </Button>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Live on Your Site ({active.length})</h2>
          {active.map((s) => (
            <SpecialCard key={s.id} special={s} onEdit={(s) => { setEditing(s); setModalOpen(true); }} onToggle={handleToggle} onDelete={(id) => setDeleteConfirm(id)} />
          ))}
        </section>
      )}

      {/* Inactive */}
      {other.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Paused / Expired</h2>
          {other.map((s) => (
            <SpecialCard key={s.id} special={s} onEdit={(s) => { setEditing(s); setModalOpen(true); }} onToggle={handleToggle} onDelete={(id) => setDeleteConfirm(id)} />
          ))}
        </section>
      )}

      {/* Empty */}
      {specials.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Tag className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h2 className="font-semibold text-gray-700">No specials yet</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">Create your first special offer — a promotion, discount, or package that shows up on your website automatically.</p>
          <Button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="mt-5 bg-amber-500 hover:bg-amber-600 border-0 text-white">
            <Plus className="h-4 w-4 mr-2" /> Create Your First Special
          </Button>
        </div>
      )}

      {/* Form modal */}
      <SpecialFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(undefined); }} onSave={handleSave} initial={editing} />

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={(o) => !o && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Remove This Special?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">This special will be archived and removed from your website immediately.</p>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
