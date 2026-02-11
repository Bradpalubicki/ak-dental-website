import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceSupabase } from "@/lib/supabase/server";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await supabase.from("oe_billing_claims").insert({
          stripe_session_id: session.id,
          stripe_customer_id: session.customer as string,
          amount_total: (session.amount_total || 0) / 100,
          currency: session.currency || "usd",
          status: "paid",
          payment_type: "checkout",
          metadata: session.metadata || {},
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await supabase
          .from("oe_billing_claims")
          .upsert(
            {
              stripe_invoice_id: invoice.id,
              stripe_customer_id: invoice.customer as string,
              amount_total: (invoice.amount_paid || 0) / 100,
              currency: invoice.currency || "usd",
              status: "paid",
              payment_type: "invoice",
              metadata: { subscription_id: String((invoice as unknown as { subscription?: string }).subscription ?? "") },
            },
            { onConflict: "stripe_invoice_id" }
          );
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object as Stripe.Invoice;
        await supabase
          .from("oe_billing_claims")
          .upsert(
            {
              stripe_invoice_id: failedInvoice.id,
              stripe_customer_id: failedInvoice.customer as string,
              amount_total: (failedInvoice.amount_due || 0) / 100,
              currency: failedInvoice.currency || "usd",
              status: "failed",
              payment_type: "invoice",
              metadata: { subscription_id: String((failedInvoice as unknown as { subscription?: string }).subscription ?? "") },
            },
            { onConflict: "stripe_invoice_id" }
          );
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object;
        await supabase.from("oe_billing_claims").insert({
          stripe_subscription_id: subscription.id,
          stripe_customer_id: String(subscription.customer ?? ""),
          amount_total: 0,
          currency: "usd",
          status: "active",
          payment_type: "subscription_created",
          metadata: {
            plan_id: (subscription as unknown as { items?: { data?: Array<{ price?: { id?: string } }> } }).items?.data?.[0]?.price?.id ?? "",
            current_period_end: (subscription as unknown as { current_period_end?: number }).current_period_end ?? 0,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const cancelledSub = event.data.object;
        await supabase
          .from("oe_billing_claims")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", cancelledSub.id);
        break;
      }

      default:
        // Unhandled event type - log and continue
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Webhook handler error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
