"use server";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(30),
  preferred_time: z.enum(["Morning", "Afternoon", "Evening"]),
});

export async function submitLead(formData: FormData) {
  const parse = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    preferred_time: formData.get("preferred_time"),
  });

  if (!parse.success) {
    return { success: false, error: "Please fill in all fields." };
  }

  const { name, phone, preferred_time } = parse.data;

  // Write to Supabase using service role (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: dbError } = await supabase
    .from("ak_dental_leads")
    .insert({ name, phone, preferred_time, source: "crowns-lp-v6" });

  if (dbError) {
    console.error("ak_dental_leads insert error:", dbError);
    return { success: false, error: "Something went wrong. Please call us directly." };
  }

  // Fire Resend notification
  const leadEmail = process.env.AK_DENTAL_LEAD_EMAIL;
  if (leadEmail && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "AK Dental Leads <leads@nustack.digital>",
      to: leadEmail,
      subject: `New Crown LP Lead — ${name}`,
      html: `
        <h2>New Founding Patient Lead</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Time:</strong> ${preferred_time}</p>
        <p><strong>Source:</strong> Crown LP V6</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT</p>
      `,
    });
  }

  return { success: true };
}
