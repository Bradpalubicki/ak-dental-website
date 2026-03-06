"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Megaphone, Plus, Pencil, Trash2, Loader2, Pause, Play, AlertTriangle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Announcement {
  id: string;
  message: string;
  link_label: string | null;
  link_href: string | null;
  style: "info" | "warning" | "success" | "urgent";
  starts_at: string;
  expires_at: string | null;
  status: "active" | "paused" | "expired" | "archived";
  created_at: string;
}

interface Props {
  initialAnnouncements: Announcement[];
}

// ─── Style config ─────────────────────────────────────────────────────────────

const STYLE_CONFIG = {
  info:    { label: "Info",    bannerBg: "bg-blue-600",   bannerText: "text-white", previewBg: "bg-blue-50 border-blue-200 text-blue-900" },
  warning: { label: "Warning", bannerBg: "bg-amber-500",  bannerText: "text-white", previewBg: "bg-amber-50 border-amber-200 text-amber-900" },
  success: { label: "Good News", bannerBg: "bg-emerald-600", bannerText: "text-white", previewBg: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  urgent:  { label: "Urgent",  bannerBg: "bg-red-600",    bannerText: "text-white", previewBg: "bg-red-50 border-red-200 text-red-900" },
} as const;

const STATUS_CONFIG = {
  active:  { label: "Live",    color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  paused:  { label: "Paused",  color: "bg-amber-50 text-amber-700 border-amber-200" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-500 border-gray-200" },
  archived:{ label: "Archived",color: "bg-gray-100 text-gray-400 border-gray-200" },
} as const;

// ─── Form schema ─────────────────────────────────────────────────────────────

const FormSchema = z.object({
  message: z.string().min(1, "Message required").max(280),
  link_label: z.string().max(60).optional(),
  link_href: z.string().max(200).optional(),
  style: z.enum(["info", "warning", "success", "urgent"]),
  expires_at: z.string().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

function formatExpiry(s: string | null) {
  if (!s) return "No expiry";
  const d = new Date(s);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return "Expired";
  if (diff === 0) return "Expires today";
  return `Expires in ${diff} day${diff === 1 ? "" : "s"}`;
}

// ─── Banner Preview ───────────────────────────────────────────────────────────

function BannerPreview({ announcement }: { announcement: Announcement }) {
  const cfg = STYLE_CONFIG[announcement.style];
  return (
    <div className={`${cfg.bannerBg} ${cfg.bannerText} px-4 py-2.5 text-sm font-medium text-center rounded-lg flex items-center justify-center gap-3`}>
      <span>{announcement.message}</span>
      {announcement.link_label && announcement.link_href && (
        <span className="underline underline-offset-2 font-bold cursor-pointer">{announcement.link_label} →</span>
      )}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function AnnouncementCard({
  ann,
  onEdit,
  onToggle,
  onDelete,
}: {
  ann: Announcement;
  onEdit: (a: Announcement) => void;
  onToggle: (a: Announcement) => void;
  onDelete: (id: string) => void;
}) {
  const statusCfg = STATUS_CONFIG[ann.status] ?? STATUS_CONFIG.paused;
  const isActive = ann.status === "active";

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-violet-300 transition-colors">
      {/* Banner preview strip */}
      <div className="p-3 bg-gray-50 border-b border-gray-100">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1"><Eye className="h-3 w-3" /> Sitewide Banner Preview</p>
        <BannerPreview announcement={ann} />
      </div>

      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 shrink-0 ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
          <span className="text-xs text-gray-400">{formatExpiry(ann.expires_at)}</span>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(ann)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          {ann.status !== "expired" && ann.status !== "archived" && (
            <button onClick={() => onToggle(ann)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title={isActive ? "Pause" : "Activate"}>
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}
          <button onClick={() => onDelete(ann.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Form modal ───────────────────────────────────────────────────────────────

function AnnouncementFormModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (v: FormValues, id?: string) => Promise<void>;
  initial?: Announcement;
}) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: initial?.message ?? "",
      link_label: initial?.link_label ?? "",
      link_href: initial?.link_href ?? "",
      style: initial?.style ?? "info",
      expires_at: initial?.expires_at ? new Date(initial.expires_at).toISOString().split("T")[0] : "",
    },
  });

  const style = watch("style");
  const message = watch("message");
  const linkLabel = watch("link_label");

  // Live preview data
  const previewAnn: Announcement = {
    id: "preview",
    message: message || "Your announcement text will appear here",
    link_label: linkLabel || null,
    link_href: "#",
    style,
    starts_at: new Date().toISOString(),
    expires_at: null,
    status: "active",
    created_at: new Date().toISOString(),
  };

  async function onSubmit(values: FormValues) {
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
          <DialogTitle>{initial ? "Edit Announcement" : "Create an Announcement"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">

          {/* Live preview */}
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1"><Eye className="h-3 w-3" /> Live Preview</p>
            <BannerPreview announcement={previewAnn} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Banner Message *</label>
            <Textarea {...register("message")} rows={2} placeholder="e.g. We're closed Dec 24–26 for the holidays. Happy to see you when we're back!" />
            <p className="text-xs text-gray-400">{(message ?? "").length}/280 characters</p>
            {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Style</label>
            <Select value={style} onValueChange={(v) => setValue("style", v as FormValues["style"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info (Blue) — general news</SelectItem>
                <SelectItem value="success">Good News (Green) — awards, new services</SelectItem>
                <SelectItem value="warning">Warning (Amber) — closures, schedule changes</SelectItem>
                <SelectItem value="urgent">Urgent (Red) — emergency, same-day only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">CTA Label (optional)</label>
              <Input {...register("link_label")} placeholder="Learn More" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">CTA Link</label>
              <Input {...register("link_href")} placeholder="/appointment" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Expiry Date (optional)</label>
            <Input type="date" {...register("expires_at")} />
            <p className="text-xs text-gray-400">Banner disappears automatically after this date.</p>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 border-0 text-white">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : initial ? "Save Changes" : "Post Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AnnouncementsManager({ initialAnnouncements }: Props) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function handleSave(values: FormValues, id?: string) {
    const payload = {
      ...values,
      expires_at: values.expires_at ? new Date(values.expires_at + "T23:59:59").toISOString() : null,
      link_label: values.link_label || null,
      link_href: values.link_href || null,
    };
    if (id) {
      const res = await fetch(`/api/postings/announcements/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const { announcement } = await res.json();
      setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, ...announcement } : a));
    } else {
      const res = await fetch("/api/postings/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const { announcement } = await res.json();
      setAnnouncements((prev) => [announcement, ...prev]);
    }
  }

  async function handleToggle(ann: Announcement) {
    const newStatus = ann.status === "active" ? "paused" : "active";
    await fetch(`/api/postings/announcements/${ann.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setAnnouncements((prev) => prev.map((a) => a.id === ann.id ? { ...a, status: newStatus } : a));
  }

  async function handleDelete(id: string) {
    await fetch(`/api/postings/announcements/${id}`, { method: "DELETE" });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  }

  const active = announcements.filter((a) => a.status === "active");
  const other = announcements.filter((a) => a.status !== "active");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-1 text-sm text-gray-500">Post a temporary banner at the top of your website. Great for holiday hours, closures, or news. Disappears automatically.</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="bg-violet-600 hover:bg-violet-700 border-0 text-white shrink-0">
          <Plus className="h-4 w-4 mr-2" /> New Announcement
        </Button>
      </div>

      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Live on Your Site ({active.length})</h2>
          {active.map((a) => (
            <AnnouncementCard key={a.id} ann={a} onEdit={(a) => { setEditing(a); setModalOpen(true); }} onToggle={handleToggle} onDelete={(id) => setDeleteConfirm(id)} />
          ))}
        </section>
      )}

      {other.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Paused / Expired</h2>
          {other.map((a) => (
            <AnnouncementCard key={a.id} ann={a} onEdit={(a) => { setEditing(a); setModalOpen(true); }} onToggle={handleToggle} onDelete={(id) => setDeleteConfirm(id)} />
          ))}
        </section>
      )}

      {announcements.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Megaphone className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h2 className="font-semibold text-gray-700">No announcements yet</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">Post a sitewide banner for holiday hours, closures, new services, or any important news.</p>
          <Button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="mt-5 bg-violet-600 hover:bg-violet-700 border-0 text-white">
            <Plus className="h-4 w-4 mr-2" /> Post Your First Announcement
          </Button>
        </div>
      )}

      <AnnouncementFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(undefined); }} onSave={handleSave} initial={editing} />

      <Dialog open={!!deleteConfirm} onOpenChange={(o) => !o && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Remove This Announcement?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">The banner will be removed from your website immediately.</p>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
