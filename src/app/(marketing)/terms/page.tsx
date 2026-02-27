import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service | AK Ultimate Dental",
  description: "Terms of service for AK Ultimate Dental website and patient portal.",
  alternates: { canonical: `${siteConfig.url}/terms` },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: February 27, 2026</p>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-slate-600">
            By accessing and using the {siteConfig.name} website and patient portal, you accept and agree to be bound
            by these Terms of Service. If you do not agree, please do not use our website or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Not a Substitute for Professional Care</h2>
          <p className="text-slate-600">
            The information on this website is provided for general informational purposes only and does not constitute
            dental or medical advice. Always consult a qualified dental professional for diagnosis and treatment of
            dental conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Patient Portal</h2>
          <p className="text-slate-600">
            Access to the patient portal requires registration and is subject to verification. You are responsible for
            maintaining the confidentiality of your login credentials. Notify us immediately of any unauthorized
            access to your account at {siteConfig.phone}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Appointment Scheduling</h2>
          <p className="text-slate-600">
            Online appointment requests are subject to availability and confirmation by our office. Submitting a
            request does not guarantee a scheduled appointment. We will contact you to confirm. Cancellations
            require at least 24 hours notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Intellectual Property</h2>
          <p className="text-slate-600">
            All content on this website, including text, images, graphics, and logos, is the property of{" "}
            {siteConfig.name} and is protected by applicable copyright and trademark laws. Unauthorized use is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Limitation of Liability</h2>
          <p className="text-slate-600">
            {siteConfig.name} shall not be liable for any indirect, incidental, or consequential damages arising from
            your use of this website. Our liability is limited to the maximum extent permitted by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Changes to Terms</h2>
          <p className="text-slate-600">
            We reserve the right to modify these Terms at any time. Continued use of the website following changes
            constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Contact</h2>
          <address className="not-italic text-slate-600">
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
