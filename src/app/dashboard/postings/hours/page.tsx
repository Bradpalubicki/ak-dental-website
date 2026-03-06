export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { HoursManager } from "./hours-manager";

export const metadata = {
  title: "Office Hours | AK Ultimate Dental",
};

export default async function HoursPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("practice_hours_overrides")
    .select("*")
    .eq("practice_id", "ak-ultimate-dental")
    .eq("status", "active")
    .order("starts_at", { ascending: true });

  return <HoursManager initialOverrides={(data ?? []) as Parameters<typeof HoursManager>[0]["initialOverrides"]} />;
}
