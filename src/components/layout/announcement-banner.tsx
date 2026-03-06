import Link from "next/link";
import { createServiceSupabase } from "@/lib/supabase/server";

const STYLE_CONFIG = {
  info:    { bg: "bg-blue-600",     text: "text-white", link: "text-white underline hover:text-blue-100" },
  warning: { bg: "bg-amber-500",    text: "text-white", link: "text-white underline hover:text-amber-100" },
  success: { bg: "bg-emerald-600",  text: "text-white", link: "text-white underline hover:text-emerald-100" },
  urgent:  { bg: "bg-red-600",      text: "text-white", link: "text-white underline hover:text-red-100" },
} as const;

export async function AnnouncementBanner() {
  const supabase = createServiceSupabase();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("practice_announcements")
    .select("id, message, link_label, link_href, style")
    .eq("practice_id", "ak-ultimate-dental")
    .eq("status", "active")
    .lte("starts_at", now)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const style = (data.style as keyof typeof STYLE_CONFIG) ?? "info";
  const cfg = STYLE_CONFIG[style];

  return (
    <div className={`${cfg.bg} ${cfg.text} py-2.5 px-4 text-center text-sm font-medium`}>
      <span>{data.message}</span>
      {data.link_label && data.link_href && (
        <>
          {" "}
          <Link href={data.link_href} className={cfg.link}>
            {data.link_label} →
          </Link>
        </>
      )}
    </div>
  );
}
