import { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight, CalendarDays, FileText, MessageSquare, CreditCard, ClipboardList, ExternalLink, HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Patient Portal | AK Ultimate Dental",
  description:
    "Access the AK Ultimate Dental patient portal to schedule appointments, complete forms, view treatment plans, and manage billing.",
};

export default function PatientPortalPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Patient Portal", href: "/patient-portal" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Patient Portal
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Dental Care, At Your Fingertips
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Our secure patient portal makes it easy to manage your appointments,
              access your records, and communicate with our team -- all from one
              convenient place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold border-0">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Access Patient Portal
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="lg" className="h-14 px-8 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 font-semibold">
                <a href={siteConfig.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  Need Help? Call Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Portal Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                What You Can Do in the Portal
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Everything you need to stay connected with your dental care team is
                available around the clock through our secure, HIPAA-compliant patient portal.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: CalendarDays,
                  title: "Schedule Appointments",
                  description: "View available time slots, book new appointments, reschedule, or cancel visits at your convenience.",
                  color: "from-cyan-600 to-cyan-800",
                },
                {
                  icon: ClipboardList,
                  title: "Complete Forms Online",
                  description: "Fill out new patient paperwork, medical history, and consent forms digitally before your visit.",
                  color: "from-amber-500 to-amber-600",
                },
                {
                  icon: FileText,
                  title: "View Treatment Plans",
                  description: "Access your treatment plans, review recommended procedures, and track your dental care progress.",
                  color: "from-cyan-600 to-cyan-800",
                },
                {
                  icon: MessageSquare,
                  title: "Message Our Team",
                  description: "Send secure messages to our office for non-urgent questions, appointment requests, or follow-up care.",
                  color: "from-amber-500 to-amber-600",
                },
                {
                  icon: CreditCard,
                  title: "Manage Billing",
                  description: "View statements, make payments, update your payment method, and download receipts for your records.",
                  color: "from-cyan-600 to-cyan-800",
                },
                {
                  icon: FileText,
                  title: "Access Documents",
                  description: "Download important documents such as insurance forms, privacy policies, and treatment consent forms.",
                  color: "from-amber-500 to-amber-600",
                },
              ].map((feature) => (
                <Card key={feature.title} className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* First-Time Setup */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Getting Started
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                First-Time Setup
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Setting up your patient portal account is quick and easy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  step: "1",
                  title: "Receive Your Invitation",
                  description: "After your first visit or appointment booking, you will receive an email invitation to create your portal account.",
                },
                {
                  step: "2",
                  title: "Create Your Account",
                  description: "Click the link in the email, set a secure password, and verify your identity. It takes just a few minutes.",
                },
                {
                  step: "3",
                  title: "Start Using the Portal",
                  description: "Once your account is set up, log in anytime to manage appointments, complete forms, and message our team.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-cyan-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-cyan-400">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Common Questions
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Portal FAQ
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Is the patient portal secure?",
                  answer: "Yes. Our portal is fully HIPAA-compliant and uses encryption to protect your personal health information. Your data is private and secure at all times.",
                },
                {
                  question: "I did not receive an invitation email. What should I do?",
                  answer: "Check your spam or junk folder first. If you still cannot find it, call us at " + siteConfig.phone + " or email us and we will resend your invitation.",
                },
                {
                  question: "Can I use the portal on my phone?",
                  answer: "Yes. The patient portal is mobile-friendly and works on smartphones, tablets, and computers. No app download is required.",
                },
                {
                  question: "What if I forget my password?",
                  answer: "Click the Forgot Password link on the portal login page. You will receive an email with instructions to reset your password securely.",
                },
              ].map((faq) => (
                <Card key={faq.question} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <HelpCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                        <p className="text-slate-600">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Need Help */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 md:p-12 text-center">
                <Mail className="h-12 w-12 text-cyan-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Having Trouble Accessing the Portal?
                </h2>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Our team is happy to help you get set up and answer any questions about
                  using the patient portal. Reach out and we will get you connected.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                    <a href={`mailto:${siteConfig.email}`}>
                      <Mail className="mr-2 h-5 w-5" />
                      Email {siteConfig.email}
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                    <a href={siteConfig.phoneHref}>
                      <Phone className="mr-2 h-5 w-5" />
                      Call {siteConfig.phone}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-r from-slate-900 to-cyan-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_60%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Not a Patient Yet?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            We would love to welcome you to our dental family. Book your first
            appointment today and you will receive portal access shortly after.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-cyan-500 text-white hover:bg-cyan-400 font-semibold">
              <Link href="/appointment">
                Book Your First Visit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
