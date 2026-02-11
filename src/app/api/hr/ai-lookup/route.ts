import { NextRequest, NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const body = await req.json();
  const { category, title, credentialType, employeeName, employeeRole, state } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  const isTraining = category === "training_record";
  const isCertificate = category === "certificate";

  let prompt: string;

  if (isTraining) {
    prompt = `You are an HR compliance assistant for a dental practice in ${state || "Nevada"}.

The practice needs information about the following training requirement:
- Training: ${title}
- Employee: ${employeeName} (${employeeRole})

Please provide:
1. A clear title for this training record
2. The typical training provider/organization
3. A brief description of what this training covers and why it's required
4. Typical renewal/expiration period (e.g., "Renews every 2 years")
5. Any ${state || "Nevada"}-specific requirements

Respond in JSON format:
{
  "title": "clear training title",
  "trainingProvider": "typical provider name",
  "content": "description of training requirements and what it covers",
  "expirationInfo": "renewal period and any important deadlines"
}`;
  } else if (isCertificate) {
    prompt = `You are an HR compliance assistant for a dental practice in ${state || "Nevada"}.

The practice needs information about the following credential:
- Credential: ${credentialType || title}
- Employee: ${employeeName} (${employeeRole})

Please provide:
1. The official issuing body for this credential in ${state || "Nevada"}
2. A brief description of requirements and scope
3. Typical validity period and renewal process
4. Any ${state || "Nevada"}-specific requirements or board details
5. The official website or lookup URL if available

Respond in JSON format:
{
  "title": "official credential name",
  "issuingBody": "official issuing organization",
  "content": "description of credential requirements, scope, and renewal process",
  "expirationInfo": "typical validity period and renewal deadlines"
}`;
  } else {
    return NextResponse.json({ error: "AI lookup not supported for this category" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.content?.[0]?.text || "";

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        content: text,
        expirationInfo: null,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI lookup error:", error);
    return NextResponse.json(
      { error: "AI lookup failed. Please enter information manually." },
      { status: 500 }
    );
  }
}
