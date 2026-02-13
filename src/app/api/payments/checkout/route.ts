import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to enable payments." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { treatmentPlanId, patientId } = body;

    if (!treatmentPlanId || !patientId) {
      return NextResponse.json(
        { error: "treatmentPlanId and patientId are required" },
        { status: 400 }
      );
    }

    const supabase = createServiceSupabase();

    // Fetch treatment plan
    const { data: plan, error: planError } = await supabase
      .from("oe_treatment_plans")
      .select("*, oe_patients(first_name, last_name, email, phone)")
      .eq("id", treatmentPlanId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: "Treatment plan not found" }, { status: 404 });
    }

    const patient = plan.oe_patients;
    const amount = Math.round((plan.patient_estimate || plan.total_cost || 0) * 100); // cents

    if (amount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    // Build line items from procedures
    const procedures = (plan.procedures || []) as Array<{ name: string; cost: number; code: string }>;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = procedures
      .filter((p) => p.cost > 0)
      .map((proc) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: proc.name,
            description: `Procedure ${proc.code}`,
          },
          unit_amount: Math.round(proc.cost * 100),
        },
        quantity: 1,
      }));

    // If insurance covers some, add a discount line
    const insuranceCoverage = plan.insurance_estimate || 0;
    const coupons: string[] = [];

    if (insuranceCoverage > 0 && lineItems.length > 0) {
      // Create a coupon for insurance coverage
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(insuranceCoverage * 100),
        currency: "usd",
        name: "Insurance Coverage (Estimated)",
        duration: "once",
      });
      coupons.push(coupon.id);
    }

    // Create or find Stripe customer
    let customerId: string | undefined;
    if (patient?.email) {
      const existing = await stripe.customers.list({ email: patient.email, limit: 1 });
      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: patient.email,
          name: `${patient.first_name} ${patient.last_name}`,
          phone: patient.phone || undefined,
          metadata: { patient_id: patientId },
        });
        customerId = customer.id;
      }
    }

    const origin = req.headers.get("origin") || "https://ak-ultimate-dental.vercel.app";

    // Create Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "payment",
      customer: customerId,
      line_items: lineItems.length > 0 ? lineItems : [{
        price_data: {
          currency: "usd",
          product_data: { name: plan.title || "Treatment Plan" },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${origin}/dashboard/treatments/${treatmentPlanId}/present?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/treatments/${treatmentPlanId}/present?payment=cancelled`,
      metadata: {
        treatment_plan_id: treatmentPlanId,
        patient_id: patientId,
      },
      ...(coupons.length > 0 ? {
        discounts: coupons.map((coupon) => ({ coupon })),
      } : {}),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Record pending payment
    await supabase.from("oe_payments").insert({
      patient_id: patientId,
      treatment_plan_id: treatmentPlanId,
      stripe_checkout_session_id: session.id,
      stripe_customer_id: customerId || null,
      amount: (plan.patient_estimate || plan.total_cost || 0),
      status: "pending",
      payment_method: "card",
      description: `Payment for: ${plan.title}`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Checkout failed";
    console.error("Stripe checkout error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
