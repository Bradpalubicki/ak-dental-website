import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy | AK Ultimate Dental",
  description: "Privacy policy for AK Ultimate Dental. Learn how we collect, use, and protect your personal and health information.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: February 27, 2026</p>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
          <p className="text-slate-600">
            We collect information you provide directly to us, such as your name, contact information, date of birth,
            insurance information, and medical/dental history when you schedule an appointment or complete intake forms.
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
            <li>Provide dental care and treatment</li>
            <li>Process insurance claims and billing</li>
            <li>Send appointment reminders and follow-up communications</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Text Message Communications (TCPA)</h2>
          <p className="text-slate-600">
            By providing your mobile phone number, you consent to receive text messages from {siteConfig.name} regarding
            appointment reminders and practice updates. Message and data rates may apply. Reply STOP at any time to
            opt out of text messages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Data Security</h2>
          <p className="text-slate-600">
            We implement industry-standard security measures to protect your personal and health information, including
            encryption of data in transit and at rest, access controls, and regular security assessments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Cookies</h2>
          <p className="text-slate-600">
            Our website uses cookies to improve your browsing experience and analyze site traffic. You may disable
            cookies in your browser settings, though this may affect certain features of the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Contact Us</h2>
          <p className="text-slate-600">
            If you have questions about this Privacy Policy or our data practices, please contact us:
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
