import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "AK Ultimate Dental <noreply@akultimatedental.com>";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  if (!resend) {
    console.warn("[Resend] Not configured - email not sent:", { to, subject });
    return { success: false, error: "Resend not configured", id: null };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo: replyTo || "dentalremind@yahoo.com",
    });

    if (error) {
      return { success: false, error: error.message, id: null };
    }

    return { success: true, id: data?.id || null, error: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, id: null, error: msg };
  }
}

// Pre-built email templates
export function appointmentConfirmationEmail(params: {
  patientName: string;
  date: string;
  time: string;
  type: string;
  provider: string;
}) {
  return {
    subject: `Appointment Confirmed - ${params.date} at ${params.time}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0891b2; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">AK Ultimate Dental</h1>
          <p style="margin: 4px 0 0; opacity: 0.9;">Appointment Confirmation</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${params.patientName},</p>
          <p>Your appointment has been confirmed:</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Date:</strong> ${params.date}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${params.time}</p>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${params.type}</p>
            <p style="margin: 4px 0;"><strong>Provider:</strong> ${params.provider}</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> 7480 W Sahara Ave, Las Vegas, NV 89117</p>
          </div>
          <p>Please arrive 10 minutes early. If you need to reschedule, call us at (702) 935-4395.</p>
          <p>See you soon!</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
            AK Ultimate Dental | (702) 935-4395 | 7480 W Sahara Ave, Las Vegas, NV 89117
          </p>
        </div>
      </div>
    `,
  };
}

export function appointmentReminderEmail(params: {
  patientName: string;
  date: string;
  time: string;
  type: string;
  hoursUntil: number;
}) {
  return {
    subject: `Reminder: Your appointment is ${params.hoursUntil <= 2 ? "today" : "tomorrow"} at ${params.time}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0891b2; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">AK Ultimate Dental</h1>
          <p style="margin: 4px 0 0; opacity: 0.9;">Appointment Reminder</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${params.patientName},</p>
          <p>This is a friendly reminder about your upcoming appointment:</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Date:</strong> ${params.date}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${params.time}</p>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${params.type}</p>
          </div>
          <p>Need to reschedule? Call us at (702) 935-4395.</p>
          <p>We look forward to seeing you!</p>
        </div>
      </div>
    `,
  };
}

export function leadResponseEmail(params: {
  patientName: string;
  responseBody: string;
}) {
  return {
    subject: `Thank you for contacting AK Ultimate Dental`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0891b2; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">AK Ultimate Dental</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${params.patientName},</p>
          ${params.responseBody.split("\n").map((line) => `<p>${line}</p>`).join("")}
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
            AK Ultimate Dental | (702) 935-4395 | akultimatedental.com
          </p>
        </div>
      </div>
    `,
  };
}

export function isConfigured(): boolean {
  return resend !== null;
}
