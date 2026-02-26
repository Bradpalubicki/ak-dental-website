import { Metadata } from "next";
import { Phone, ArrowRight, CheckCircle, Heart, Users, Sparkles, Shield, Clock, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Careers | Join Our Team | AK Ultimate Dental",
  description:
    "Join AK Ultimate Dental in Las Vegas, NV. We are hiring skilled, compassionate dental professionals and support staff.",
  openGraph: {
    title: "Dental Careers in Las Vegas | Join AK Ultimate Dental",
    description: "Join a top-rated dental team in Las Vegas. Competitive pay, great culture, growth opportunities. View open positions at AK Ultimate Dental.",
    images: [{ url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630, alt: "Dental team careers Las Vegas" }],
  },
};

export default function CareersPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Careers", href: "/careers" },
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
              Careers at AK Ultimate Dental
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              We are building a team of skilled, passionate dental professionals
              dedicated to providing exceptional patient care with cutting-edge
              technology in a supportive environment.
            </p>
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold border-0">
              <a href="#openings">
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Work Here */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Why AK Ultimate Dental
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                More Than a Workplace
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                At AK Ultimate Dental, we believe that investing in our team
                leads to better patient outcomes. When our staff thrives, our
                patients receive the best possible care.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Patient-First Culture",
                  description: "Every team member shares our commitment to compassionate, high-quality dental care for every patient who walks through our door.",
                  color: "from-pink-500 to-rose-500",
                },
                {
                  icon: Users,
                  title: "Collaborative Team",
                  description: "Work alongside experienced dental professionals who value mentorship, peer learning, and genuine teamwork.",
                  color: "from-cyan-500 to-cyan-700",
                },
                {
                  icon: Sparkles,
                  title: "Advanced Technology",
                  description: "Work with the latest dental technology including CEREC, digital X-rays, and modern operatory equipment.",
                  color: "from-amber-400 to-amber-600",
                },
                {
                  icon: Shield,
                  title: "Supportive Environment",
                  description: "We prioritize team well-being with manageable schedules, a positive work culture, and open communication.",
                  color: "from-cyan-400 to-cyan-600",
                },
                {
                  icon: Clock,
                  title: "Work-Life Balance",
                  description: "Our Monday through Thursday schedule means three-day weekends every week. We value your time outside the office.",
                  color: "from-teal-500 to-teal-700",
                },
                {
                  icon: Briefcase,
                  title: "Competitive Compensation",
                  description: "Fair pay, benefits, and the resources you need to focus on what matters most -- delivering excellent patient care.",
                  color: "from-purple-500 to-purple-700",
                },
              ].map((item) => (
                <Card key={item.title} className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Our Values
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                What We Stand For
              </h2>
            </div>

            <div className="space-y-4">
              {[
                "Patient comfort and satisfaction come first in everything we do.",
                "We invest in the latest technology and continuing education to stay at the forefront of dentistry.",
                "Every team member -- from front desk to operatory -- is treated with respect and appreciation.",
                "We believe in transparent communication with patients and with each other.",
                "Excellence is not a one-time achievement; it is a daily commitment.",
              ].map((value) => (
                <div key={value} className="flex gap-4 items-start p-4 rounded-lg hover:bg-white transition-colors">
                  <CheckCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section id="openings" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                Open Positions
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Current Openings
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We are always looking for talented, compassionate individuals to join our team.
                See our current openings below, or reach out to express your interest.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Dental Hygienist",
                  type: "Full-Time",
                  description: "Licensed dental hygienist to provide cleanings, periodontal care, and patient education. Experience with digital X-rays and intraoral cameras preferred.",
                  tags: ["RDH Required", "Full Benefits", "Mon-Thu Schedule"],
                },
                {
                  title: "Dental Assistant",
                  type: "Full-Time",
                  description: "Chairside dental assistant to support clinical procedures, take impressions, and maintain sterilization. CEREC experience is a plus.",
                  tags: ["DA Certified", "Chairside", "CEREC Training Available"],
                },
                {
                  title: "Front Office Coordinator",
                  type: "Full-Time",
                  description: "Be the warm, welcoming first point of contact for patients. Manage scheduling, insurance verification, treatment coordination, and front-office operations.",
                  tags: ["Front Office", "Insurance Knowledge", "Patient-Focused"],
                },
                {
                  title: "Treatment Coordinator",
                  type: "Full-Time",
                  description: "Present treatment plans, coordinate financial arrangements, and help patients understand their care options. Dental experience required.",
                  tags: ["Treatment Plans", "Patient Communication", "Financial Coordination"],
                },
              ].map((position) => (
                <Card key={position.title} className="border-0 shadow-lg">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{position.title}</h3>
                        <p className="text-cyan-600 font-medium text-sm mb-3">{position.type} | Las Vegas, NV</p>
                        <p className="text-slate-600 text-sm mb-3">
                          {position.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {position.tags.map((tag) => (
                            <span key={tag} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:flex-shrink-0">
                        <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                          <a href={`mailto:${siteConfig.email}?subject=Application: ${position.title}`}>
                            <Mail className="mr-2 h-4 w-4" />
                            Apply
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">
                How to Apply
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Application Process
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  To apply for any position at AK Ultimate Dental, please email a cover letter
                  and resume to:
                </p>
                <div className="text-center py-4">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-2xl font-bold text-cyan-600 hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                </div>
                <p>
                  Be sure to indicate which position you are applying for in your email subject line.
                </p>
                <p>
                  We review applications on a rolling basis and will respond to qualified candidates
                  within two weeks. Even if we do not have a current opening that matches your profile,
                  we welcome your application for future consideration.
                </p>
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
            Build Your Career With Us
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join a team that is passionate about exceptional dental care, advanced
            technology, and creating smiles every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-16 px-10 text-lg bg-cyan-500 text-white hover:bg-cyan-400 font-semibold">
              <a href={`mailto:${siteConfig.email}?subject=Career Inquiry`}>
                Send Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
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
