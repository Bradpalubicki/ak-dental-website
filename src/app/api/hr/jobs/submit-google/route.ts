import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const schema = z.object({
  jobId: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { jobId, title, slug } = parsed.data;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://akultimatedental.com";
  const webhookUrl = process.env.KERAGON_WEBHOOK_URL;

  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "google_for_jobs_submit",
        job_id: jobId,
        title,
        url: `${baseUrl}/careers/${slug}`,
      }),
    }).catch(() => null);
  }

  return NextResponse.json({ submitted: true, jobId });
}
