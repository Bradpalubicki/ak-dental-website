import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// Vapi webhook event types
interface VapiCallEvent {
  type: string;
  call?: {
    id: string;
    orgId?: string;
    assistantId?: string;
    type?: string;
    status?: string;
    startedAt?: string;
    endedAt?: string;
    endedReason?: string;
    cost?: number;
    phoneNumber?: { number?: string };
    customer?: { number?: string; name?: string };
    transcript?: string;
    summary?: string;
    analysis?: {
      summary?: string;
      structuredData?: {
        intent?: string;
        urgency?: string;
        actionTaken?: string;
        followUpRequired?: boolean;
        patientName?: string;
      };
    };
    recordingUrl?: string;
    duration?: number;
  };
}

function parseIntent(intent?: string): string {
  const validIntents = [
    "appointment", "billing", "emergency", "information",
    "prescription", "follow_up", "cancellation", "insurance", "other",
  ];
  if (intent && validIntents.includes(intent.toLowerCase())) return intent.toLowerCase();
  return "other";
}

function parseUrgency(urgency?: string): string {
  const validUrgencies = ["low", "medium", "high", "emergency"];
  if (urgency && validUrgencies.includes(urgency.toLowerCase())) return urgency.toLowerCase();
  return "low";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VapiCallEvent;
    const supabase = createServiceSupabase();

    // Validate the webhook (Vapi sends a secret header if configured)
    const vapiSecret = process.env.VAPI_WEBHOOK_SECRET;
    if (vapiSecret) {
      const headerSecret = req.headers.get("x-vapi-secret");
      if (headerSecret !== vapiSecret) {
        return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
      }
    }

    const call = body.call;
    if (!call?.id) {
      return NextResponse.json({ received: true, message: "No call data" });
    }

    switch (body.type) {
      case "call.started":
      case "call-started": {
        // Insert a new call record when call starts
        await supabase.from("oe_calls").upsert(
          {
            vapi_call_id: call.id,
            vapi_assistant_id: call.assistantId || null,
            caller_phone: call.customer?.number || null,
            caller_name: call.customer?.name || null,
            direction: call.type === "outboundPhoneCall" ? "outbound" : "inbound",
            status: "answered",
            call_type: "ai",
            ai_handled: true,
            after_hours: isAfterHours(),
            started_at: call.startedAt || new Date().toISOString(),
          },
          { onConflict: "vapi_call_id" }
        );
        break;
      }

      case "call.ended":
      case "call-ended": {
        // Update call with duration, transcript, summary, cost
        const duration = call.duration
          || (call.startedAt && call.endedAt
            ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
            : null);

        const analysis = call.analysis?.structuredData;

        await supabase
          .from("oe_calls")
          .update({
            status: call.endedReason === "customer-did-not-answer" ? "missed"
              : call.endedReason === "voicemail" ? "voicemail"
              : "answered",
            duration_seconds: duration,
            transcription: call.transcript || null,
            ai_summary: call.analysis?.summary || call.summary || null,
            recording_url: call.recordingUrl || null,
            intent: parseIntent(analysis?.intent),
            urgency: parseUrgency(analysis?.urgency),
            action_taken: analysis?.actionTaken || null,
            follow_up_required: analysis?.followUpRequired || false,
            ended_reason: call.endedReason || null,
            cost: call.cost || null,
            ended_at: call.endedAt || new Date().toISOString(),
            call_type: "ai",
          })
          .eq("vapi_call_id", call.id);

        // Try to match caller to a patient
        if (call.customer?.number) {
          const phone = call.customer.number.replace(/\D/g, "").slice(-10);
          const { data: patient } = await supabase
            .from("oe_patients")
            .select("id")
            .or(`phone.ilike.%${phone}%,mobile.ilike.%${phone}%`)
            .limit(1)
            .single();

          if (patient) {
            await supabase
              .from("oe_calls")
              .update({ patient_id: patient.id })
              .eq("vapi_call_id", call.id);
          }
        }
        break;
      }

      case "transcript":
      case "call.transcript": {
        // Partial transcript updates during call
        if (call.transcript) {
          await supabase
            .from("oe_calls")
            .update({ transcription: call.transcript })
            .eq("vapi_call_id", call.id);
        }
        break;
      }

      default:
        // Other event types (function-call, hang, etc.) - log and continue
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Webhook error";
    console.error("Vapi webhook error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function isAfterHours(): boolean {
  const now = new Date();
  // Convert to PT (UTC-8)
  const ptHour = (now.getUTCHours() - 8 + 24) % 24;
  const day = now.getUTCDay();
  // After hours: before 8am or after 5pm Mon-Fri, all day Sat (after 2pm) and Sun
  if (day === 0) return true; // Sunday
  if (day === 6) return ptHour >= 14; // Saturday after 2pm
  return ptHour < 8 || ptHour >= 17;
}
