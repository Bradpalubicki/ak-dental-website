import { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema, FAQSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQs | AK Ultimate Dental | Las Vegas, NV",
  description:
    "Frequently asked questions about dental care at AK Ultimate Dental. Learn about appointments, insurance, treatments, and more.",
  openGraph: {
    title: "Dental FAQs | AK Ultimate Dental Las Vegas",
    description: "Answers to common questions about dental care, insurance, appointments, and treatments at AK Ultimate Dental in Las Vegas.",
    images: [{ url: "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630, alt: "Dental care FAQ" }],
  },
};

const faqs = [
  {
    question: "What should I expect at my first visit?",
    answer:
      "Your first visit includes a comprehensive exam, digital X-rays, and a consultation with our doctor. We will review your dental history, discuss any concerns, and create a personalized treatment plan. Plan for about 60 to 90 minutes so we have plenty of time to get to know you and your smile goals.",
  },
  {
    question: "Do you accept my insurance?",
    answer:
      "We accept most major dental insurance plans including Delta Dental, Cigna, MetLife, Aetna, Guardian, and many more. We are happy to verify your benefits before your appointment so there are no surprises. Call us at (702) 935-4395 and we will check your coverage for free.",
  },
  {
    question: "What are your office hours?",
    answer:
      "We are open Monday through Thursday from 8:00 AM to 5:00 PM. We are closed on Friday, Saturday, and Sunday. For dental emergencies outside of office hours, please call our office and follow the prompts for after-hours care.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes, we understand that dental care is an investment. We offer flexible payment options and can work with you to find a plan that fits your budget. We accept cash, check, and all major credit cards. Ask our team about financing options during your visit.",
  },
  {
    question: "How often should I visit the dentist?",
    answer:
      "We recommend a dental checkup and cleaning every six months for most patients. However, some patients with specific conditions such as gum disease may need more frequent visits. Our team will recommend a schedule tailored to your individual needs.",
  },
  {
    question: "What is a dental emergency?",
    answer:
      "Dental emergencies include severe toothache, a knocked-out tooth, a cracked or broken tooth, swelling in the face or gums, and uncontrolled bleeding. If you are experiencing any of these, call our office immediately. We do our best to see emergency patients the same day.",
  },
  {
    question: "Do you offer cosmetic dentistry?",
    answer:
      "Yes, we offer a full range of cosmetic dental services including teeth whitening, porcelain veneers, dental bonding, and smile makeovers. Our goal is to help you achieve a smile you love with natural-looking, long-lasting results. Schedule a cosmetic consultation to discuss your options.",
  },
  {
    question: "What is CEREC same-day crowns?",
    answer:
      "CEREC technology allows us to design, create, and place a custom dental crown in a single visit -- no temporary crown, no second appointment. Using advanced 3D imaging and in-office milling, your permanent crown is ready in about an hour. It is faster, more convenient, and just as durable as traditional crowns.",
  },
  {
    question: "Are dental implants right for me?",
    answer:
      "Dental implants are an excellent solution for replacing missing teeth. They look, feel, and function like natural teeth. Most healthy adults are good candidates for implants. During your consultation, we will evaluate your bone density, overall health, and goals to determine if implants are the best option for you.",
  },
  {
    question: "What can I do about dental anxiety?",
    answer:
      "We understand that many people feel anxious about visiting the dentist. Our team is trained to provide a calm, supportive environment. We take extra time to explain procedures, answer questions, and make sure you feel comfortable at every step. Let us know about your concerns so we can accommodate your needs.",
  },
];

export default function FAQsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "FAQs", href: "/faqs" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Common Questions
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              We know that choosing a dentist and understanding your dental care
              can bring up a lot of questions. Here are answers to some of the
              most common ones.
            </p>
            <Button
              asChild
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold border-0"
            >
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                Call Us With Questions
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Answers You Need
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                About Care at AK Ultimate Dental
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border-b border-gray-200">
                  <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:text-cyan-700 py-6 hover:no-underline">
                    <span className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-1" />
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-slate-600 leading-relaxed pb-6 pl-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
              We Are Here to Help
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Every smile is unique. If your question was not answered above, we
              would love to hear from you. Call us, send an email, or use our
              contact form and we will get back to you promptly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-cyan-600 text-cyan-600 hover:bg-cyan-50"
              >
                <a href={`mailto:${siteConfig.email}`}>
                  Email Us
                </a>
              </Button>
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
            Ready for a Healthier Smile?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Taking the first step is easy. Book an appointment today, or call us
            to learn more about how we can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-16 px-10 text-lg bg-cyan-500 text-white hover:bg-cyan-400 font-semibold"
            >
              <Link href="/appointment">
                Book Your Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-16 px-10 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10"
            >
              <a href={siteConfig.phoneHref}>
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
