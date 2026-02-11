import { NextRequest, NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic =
  process.env.ANTHROPIC_API_KEY &&
  process.env.ANTHROPIC_API_KEY !== "PLACEHOLDER_ADD_ANTHROPIC_KEY"
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

const ASSISTANT_SYSTEM = `You are One Engine AI, the intelligent assistant for AK Ultimate Dental's operations platform.
You help dental office staff with:
- Pulling reports and analyzing practice data
- Navigating the One Engine dashboard
- Answering operational questions about HR, billing, insurance, scheduling
- Explaining how to use features in the system
- Providing step-by-step instructions for common tasks

Dashboard navigation reference:
- Command Center (Overview): /dashboard
- Business Advisor (AI chat): /dashboard/advisor
- Approvals: /dashboard/approvals
- Leads: /dashboard/leads
- Patients: /dashboard/patients
- Appointments: /dashboard/appointments
- Treatments: /dashboard/treatments
- Insurance: /dashboard/insurance
- Financials: /dashboard/financials
- Billing: /dashboard/billing
- HR & Payroll: /dashboard/hr
- Licensing: /dashboard/licensing
- Inbox: /dashboard/inbox
- Analytics: /dashboard/analytics
- Calls: /dashboard/calls
- Outreach: /dashboard/outreach
- Settings: /dashboard/settings

Be concise but helpful. If asked about data you don't have, suggest where in the dashboard they can find it.
When giving navigation help, include the page path so users can click through.
Format responses in clean, readable markdown with bullet points and headers when appropriate.`;

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  if (!anthropic) {
    return NextResponse.json(
      { error: "AI not configured", content: "AI assistant is not configured yet. Please add your Anthropic API key." },
      { status: 200 }
    );
  }

  const body = await req.json();
  const { message } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: ASSISTANT_SYSTEM,
      messages: [{ role: "user", content: message }],
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ content });
  } catch (err) {
    console.error("[AI Assistant]", err);
    return NextResponse.json(
      { error: "AI request failed", content: "Sorry, I encountered an error. Please try again." },
      { status: 200 }
    );
  }
}
