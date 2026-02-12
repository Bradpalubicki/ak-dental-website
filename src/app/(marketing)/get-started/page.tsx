import { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight, CheckCircle, CalendarDays, Heart, Sparkles, Shield, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "New Patients | Get Started | AK Ultimate Dental",
  description:
    "New to AK Ultimate Dental? Learn what to expect at your first visit. Step-by-step guide for new dental patients in Las Vegas, NV.",
};

export default function GetStartedPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "New Patients", href: "/get-started" },
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
              Welcome, New Patients
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Smile Journey Starts Here
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              We know that visiting a new dentist can feel uncertain. We want to
              make your experience as comfortable and stress-free as possible.
              Here is exactly what to expect when you join our dental family.
            </p>
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold border-0">
              <Link href="/appointment">
                Book Your First Visit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Your Visit, Step by Step
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                From your very first call to ongoing care, here is what the
                process looks like at AK Ultimate Dental.
              </p>
            </div>

            <div className="space-y-12">
              {[
                {
                  step: "1",
                  icon: Phone,
                  title: "Schedule Your Visit",
                  description: "Contact us by phone, email, or through our online appointment form. Our friendly team will find a time that works for your schedule, answer your questions, and let you know what to bring to your first visit.",
                  color: "from-cyan-600 to-cyan-800",
                },
                {
                  step: "2",
                  icon: MessageSquare,
                  title: "Comprehensive Exam",
                  description: "Your first visit includes a thorough dental examination, digital X-rays, and a one-on-one consultation with the doctor. We take time to understand your dental history, current concerns, and goals for your smile.",
                  color: "from-amber-500 to-amber-600",
                },
                {
                  step: "3",
                  icon: CalendarDays,
                  title: "Personalized Treatment Plan",
                  description: "Based on your exam, we create a customized treatment plan that addresses your needs and fits your budget. We explain every option clearly -- no pressure, no surprises. You make the decisions about your care.",
                  color: "from-cyan-600 to-cyan-800",
                },
                {
                  step: "4",
                  icon: Heart,
                  title: "Ongoing Care",
                  description: "Welcome to the AK Ultimate Dental family. We will schedule your regular checkups and cleanings to keep your smile healthy for years to come. Our team is always here to help with any questions or concerns between visits.",
                  color: "from-amber-500 to-amber-600",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center`}>
                      <item.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-bold text-cyan-600 uppercase tracking-wider">Step {item.step}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                What to Expect
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Your Comfort Is Our Priority
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Modern, Clean Facility",
                  description: "Our office features state-of-the-art equipment, comfortable treatment rooms, and the highest standards of sterilization and safety.",
                },
                {
                  icon: Heart,
                  title: "Gentle, Caring Team",
                  description: "We take extra time to ensure you are comfortable. If you feel anxious about dental visits, let us know -- we are here to help.",
                },
                {
                  icon: Sparkles,
                  title: "Advanced Technology",
                  description: "Digital X-rays, CEREC same-day crowns, and modern treatment methods mean better results with less discomfort and fewer visits.",
                },
                {
                  icon: CalendarDays,
                  title: "Convenient Scheduling",
                  description: "We are open Monday through Thursday with flexible appointment times to accommodate your schedule. Same-day emergency visits available.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                New Patient Questions
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Questions You Might Have
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "What should I bring to my first appointment?",
                  answer: "Please bring a valid photo ID, your dental insurance card (if applicable), a list of any medications you take, and any recent dental X-rays you may have. Arriving 15 minutes early allows time to complete paperwork.",
                },
                {
                  question: "How long will my first visit take?",
                  answer: "Plan for about 60 to 90 minutes for your first visit. This gives us time for a thorough exam, X-rays, cleaning (if appropriate), and a consultation to discuss your treatment options.",
                },
                {
                  question: "What if I have dental anxiety?",
                  answer: "You are not alone -- dental anxiety is very common. Our team is trained to help nervous patients feel at ease. We go at your pace, explain everything before we do it, and stop whenever you need a break.",
                },
                {
                  question: "Do you accept my insurance?",
                  answer: "We accept most major dental insurance plans. Call us at (702) 935-4395 and we will verify your benefits before your appointment so you know exactly what to expect -- no surprises.",
                },
                {
                  question: "What if I need major work done?",
                  answer: "We will create a prioritized treatment plan together. We explain all your options, discuss costs upfront, and can phase treatment over time if needed. Your comfort and budget always come first.",
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

      {/* Insurance */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Insurance & Payment
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  We accept most major dental insurance plans and offer flexible
                  payment options to make dental care accessible for everyone.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Delta Dental",
                  "Cigna",
                  "MetLife",
                  "Aetna",
                  "Guardian",
                  "UnitedHealthcare",
                  "Humana",
                  "Blue Cross Blue Shield",
                ].map((plan) => (
                  <div key={plan} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                    <span className="text-gray-800 font-medium text-sm">{plan}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-slate-600 mb-4">
                  And many more plans accepted. Call to verify your coverage.
                </p>
                <Button asChild variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                  <Link href="/insurance">
                    View All Insurance & Payment Options
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
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
            Ready to Join Our Dental Family?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            We are accepting new patients and would love to welcome you. Book
            your first visit today and experience the AK Ultimate Dental
            difference.
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
