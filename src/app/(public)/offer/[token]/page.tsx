export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { OfferSignClient } from "./offer-sign-client";
import { siteConfig } from "@/lib/config";

export async function generateMetadata() {
  return { title: "Your Offer Letter | AK Ultimate Dental" };
}

export default async function OfferPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createServiceSupabase();

  const { data: offer } = await supabase
    .from("oe_offer_letters")
    .select("id, candidate_first_name, candidate_last_name, job_title, department, employment_type, start_date, salary_amount, salary_unit, hourly_rate, letter_body, custom_message, status, expires_at, signed_at, signature_name")
    .eq("sign_token", token)
    .single();

  if (!offer) notFound();

  // Mark as viewed
  if (offer.status === "sent") {
    await supabase.from("oe_offer_letters").update({ status: "viewed" }).eq("sign_token", token);
    offer.status = "viewed";
  }

  const expired = offer.expires_at && new Date(offer.expires_at) < new Date();

  return (
    <OfferSignClient
      offer={offer}
      token={token}
      expired={!!expired}
      practicePhone={siteConfig.phone}
      practiceEmail={siteConfig.email}
    />
  );
}
