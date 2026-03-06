export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { SpecialsManager } from "./specials-manager";

export const metadata = {
  title: "Special Offers | AK Ultimate Dental",
};

export default async function SpecialsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("practice_specials")
    .select("*")
    .eq("practice_id", "ak-ultimate-dental")
    .neq("status", "archived")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return <SpecialsManager initialSpecials={(data ?? []) as Parameters<typeof SpecialsManager>[0]["initialSpecials"]} />;
}
