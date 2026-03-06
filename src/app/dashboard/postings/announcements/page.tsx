export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { AnnouncementsManager } from "./announcements-manager";

export const metadata = {
  title: "Announcements | AK Ultimate Dental",
};

export default async function AnnouncementsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("practice_announcements")
    .select("*")
    .eq("practice_id", "ak-ultimate-dental")
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  return <AnnouncementsManager initialAnnouncements={(data ?? []) as Parameters<typeof AnnouncementsManager>[0]["initialAnnouncements"]} />;
}
