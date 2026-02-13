import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function GET(req: NextRequest) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "session_id required" }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ verified: false, error: "Stripe not configured" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const supabase = createServiceSupabase();

    if (session.payment_status === "paid") {
      // Update payment record
      await supabase
        .from("oe_payments")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent as string,
          receipt_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_checkout_session_id", sessionId);

      // Update treatment plan status
      if (session.metadata?.treatment_plan_id) {
        await supabase
          .from("oe_treatment_plans")
          .update({
            status: "accepted",
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.metadata.treatment_plan_id);
      }

      return NextResponse.json({
        verified: true,
        amount: (session.amount_total || 0) / 100,
        status: session.payment_status,
      });
    }

    return NextResponse.json({
      verified: false,
      status: session.payment_status,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
