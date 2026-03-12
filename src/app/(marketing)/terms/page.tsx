import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms & Conditions | AK Ultimate Dental",
  description: "Terms and conditions for AK Ultimate Dental website, patient portal, and SMS communications. Review our legal terms for Las Vegas patients.",
  alternates: { canonical: `${siteConfig.url}/terms` },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: March 7, 2026</p>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-slate-600">
            By accessing and using the {siteConfig.name} website, patient portal, or SMS communications, you accept
            and agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our website
            or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">2. SMS / Text Message Program</h2>
          <p className="text-slate-600">
            {siteConfig.name} operates an SMS communications program to help patients manage their dental care. By
            providing your mobile phone number and opting in, you agree to receive text messages including:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
            <li>Appointment reminders and confirmations</li>
            <li>Recall and recare notifications (e.g., time for your 6-month cleaning)</li>
            <li>Responses to messages you initiate with our office</li>
            <li>Practice updates and important announcements</li>
          </ul>

          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-slate-700">
            <p><strong>Message frequency varies</strong> based on your appointment schedule and how often you contact us.</p>
            <p><strong>Msg &amp; Data Rates May Apply.</strong> Standard message and data rates charged by your mobile carrier may apply to messages sent and received.</p>
            <p><strong>To cancel:</strong> Reply <strong>STOP</strong> to cancel. You will receive one final confirmation message, after which no further SMS messages will be sent unless you re-subscribe.</p>
            <p><strong>For help:</strong> Reply <strong>HELP</strong> for help, or contact us at {siteConfig.phone} or {siteConfig.email}.</p>
          </div>

          <p className="text-slate-600 mt-3">
            Supported carriers include but are not limited to: AT&amp;T, T-Mobile, Verizon, Sprint, Boost Mobile,
            US Cellular, and MetroPCS. Carriers are not liable for delayed or undelivered messages. The SMS service
            is not guaranteed to be error-free or uninterrupted.
          </p>
          <p className="text-slate-600 mt-3">
            We do not share your phone number with third parties for their marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Not a Substitute for Professional Care</h2>
          <p className="text-slate-600">
            The information on this website is provided for general informational purposes only and does not constitute
            dental or medical advice. Always consult a qualified dental professional for diagnosis and treatment of
            dental conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Patient Portal</h2>
          <p className="text-slate-600">
            Access to the patient portal requires registration and is subject to verification. You are responsible for
            maintaining the confidentiality of your login credentials. Notify us immediately of any unauthorized
            access to your account at {siteConfig.phone}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Appointment Scheduling</h2>
          <p className="text-slate-600">
            Online appointment requests are subject to availability and confirmation by our office. Submitting a
            request does not guarantee a scheduled appointment. We will contact you to confirm. Cancellations
            require at least 24 hours notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Intellectual Property</h2>
          <p className="text-slate-600">
            All content on this website, including text, images, graphics, and logos, is the property of{" "}
            {siteConfig.name} and is protected by applicable copyright and trademark laws. Unauthorized use is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Disclaimer of Warranties</h2>
          <p className="text-slate-600">
            The website, patient portal, and SMS service are provided &quot;as is&quot; without warranties of any kind,
            express or implied. {siteConfig.name} does not warrant that the services will be uninterrupted, error-free,
            or free of viruses or other harmful components. SMS delivery is subject to your carrier&apos;s network
            availability and is not guaranteed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Limitation of Liability</h2>
          <p className="text-slate-600">
            {siteConfig.name} shall not be liable for any indirect, incidental, or consequential damages arising from
            your use of this website, the patient portal, or our SMS communications. Our liability is limited to the
            maximum extent permitted by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Changes to Terms</h2>
          <p className="text-slate-600">
            We reserve the right to modify these Terms at any time. Continued use of the website or SMS program
            following changes constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Contact</h2>
          <p className="text-slate-600">For questions about these Terms or our SMS program:</p>
          <address className="not-italic mt-2 text-slate-600">
            <strong>{siteConfig.name}</strong><br />
            {siteConfig.address.full}<br />
            Phone: {siteConfig.phone}<br />
            Email: {siteConfig.email}
          </address>
        </section>
      </div>
    </div>
  );
}
