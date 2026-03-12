import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy | AK Ultimate Dental",
  description: "Privacy policy for AK Ultimate Dental in Las Vegas, NV. Learn how we collect, use, and safeguard your personal, dental, and health information.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: March 7, 2026</p>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
          <p className="text-slate-600">
            We collect information you provide directly to us when you schedule an appointment, complete intake forms,
            or contact our office. This includes:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
            <li>Full name</li>
            <li>Phone number (including mobile/cell number)</li>
            <li>Email address</li>
            <li>Date of birth</li>
            <li>Mailing address</li>
            <li>Insurance information</li>
            <li>Medical and dental history</li>
          </ul>
          <p className="text-slate-600 mt-3">
            We also collect technical information such as browser type and IP address when you use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">2. HIPAA Notice</h2>
          <p className="text-slate-600">
            As a dental practice, we are covered under the Health Insurance Portability and Accountability Act (HIPAA).
            Your Protected Health Information (PHI) is handled in accordance with our HIPAA Notice of Privacy Practices,
            which is provided to you at your first appointment. We do not sell your health information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">3. How We Use Your Information</h2>
          <p className="text-slate-600">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
            <li>Schedule and manage your dental appointments</li>
            <li>Send appointment reminders and confirmations via text message and email</li>
            <li>Communicate important updates about your care or our practice</li>
            <li>Provide dental care and treatment</li>
            <li>Process insurance claims and billing</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Text Message (SMS) Communications</h2>
          <p className="text-slate-600">
            By providing your mobile phone number and consenting to SMS communications, you agree to receive text
            messages from {siteConfig.name} for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
            <li>Appointment reminders and confirmations</li>
            <li>Recall and recare notifications</li>
            <li>Practice updates and announcements</li>
            <li>Responses to messages you send us</li>
          </ul>
          <p className="text-slate-600 mt-3">
            <strong>Message and data rates may apply.</strong> Message frequency varies based on your appointment
            schedule and communication preferences.
          </p>
          <p className="text-slate-600 mt-3">
            <strong>To opt out:</strong> Reply <strong>STOP</strong> to unsubscribe from text messages at any time.
            After opting out, you will receive one final confirmation message. You will not receive further SMS
            communications unless you re-subscribe.
          </p>
          <p className="text-slate-600 mt-3">
            <strong>For help:</strong> Reply <strong>HELP</strong> for help, or contact us at {siteConfig.phone} or{" "}
            {siteConfig.email}.
          </p>
          <p className="text-slate-600 mt-3">
            We do not sell, share, or rent your phone number or personal information to third parties for marketing
            purposes. Your information is used solely to communicate with you regarding your dental care at{" "}
            {siteConfig.name}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Data Sharing</h2>
          <p className="text-slate-600">
            We do not sell, trade, or rent your personal information to third parties for marketing purposes.
            We may share information only in the following limited circumstances:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
            <li>With your insurance provider to process claims</li>
            <li>With service providers who assist us in operating our website and communications systems (under strict confidentiality agreements)</li>
            <li>As required by law or to protect the rights and safety of our patients and staff</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Data Security</h2>
          <p className="text-slate-600">
            We implement industry-standard security measures to protect your personal and health information, including
            encryption of data in transit and at rest, access controls, and regular security assessments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Cookies</h2>
          <p className="text-slate-600">
            Our website uses cookies to improve your browsing experience and analyze site traffic. You may disable
            cookies in your browser settings, though this may affect certain features of the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Contact Us</h2>
          <p className="text-slate-600">
            If you have questions about this Privacy Policy, our SMS communications, or our data practices, please
            contact us:
          </p>
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
