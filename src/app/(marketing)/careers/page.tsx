import { Metadata } from "next";
import { Phone, ArrowRight, CheckCircle, Heart, Users, Sparkles, Shield, Clock, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";
import { createServiceSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

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

interface JobPosting {
  id: string;
  title: string;
  slug: string;
  employment_type: string;
  department: string;
  description: string;
  requirements: string | null;
  tags: string[];
  salary_min: number | null;
  salary_max: number | null;
  salary_unit: string;
  salary_currency: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  remote_possible: boolean;
  posted_at: string | null;
  expires_at: string | null;
  apply_email: string;
}

function employmentTypeLabel(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: "Full-Time",
    PART_TIME: "Part-Time",
    CONTRACTOR: "Contract",
    TEMPORARY: "Temporary",
    INTERN: "Internship",
  };
  return map[type] ?? type;
}

function salaryLabel(job: JobPosting): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const unit = job.salary_unit === "YEAR" ? "/yr" : job.salary_unit === "HOUR" ? "/hr" : "";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)} – ${fmt(job.salary_max)}${unit}`;
  if (job.salary_min) return `From ${fmt(job.salary_min)}${unit}`;
  return `Up to ${fmt(job.salary_max!)}${unit}`;
}

export default async function CareersPage() {
  const supabase = createServiceSupabase();
  const { data: jobs } = await supabase
    .from("oe_job_postings")
    .select("*")
    .eq("status", "active")
    .order("posted_at", { ascending: false, nullsFirst: false });

  const activeJobs: JobPosting[] = jobs || [];

  // Build JSON-LD for all active jobs (Google for Jobs)
  const jobsJsonLd = activeJobs.map((job) => ({
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: [job.description, job.requirements].filter(Boolean).join("\n\n"),
    datePosted: job.posted_at ? job.posted_at.split("T")[0] : new Date().toISOString().split("T")[0],
    ...(job.expires_at ? { validThrough: job.expires_at.split("T")[0] } : {}),
    employmentType: job.employment_type,
    hiringOrganization: {
      "@type": "Organization",
      name: "AK Ultimate Dental",
      sameAs: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.street_address,
        addressLocality: job.city,
        addressRegion: job.state,
        postalCode: job.zip,
        addressCountry: job.country,
      },
    },
    ...(job.remote_possible ? { jobLocationType: "TELECOMMUTE" } : {}),
    ...(job.salary_min || job.salary_max
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary_currency,
            value: {
              "@type": "QuantitativeValue",
              ...(job.salary_min ? { minValue: job.salary_min } : {}),
              ...(job.salary_max ? { maxValue: job.salary_max } : {}),
              unitText: job.salary_unit,
            },
          },
        }
      : {}),
    applicationContact: {
      "@type": "ContactPoint",
      email: job.apply_email,
      contactType: "hiring",
    },
    identifier: {
      "@type": "PropertyValue",
      name: "AK Ultimate Dental",
      value: job.id,
    },
  }));

  return (
    <>
      {/* Google for Jobs — JSON-LD for every active job posting */}
      {jobsJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Careers", href: "/careers" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Careers at AK Ultimate Dental
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              We are building a team of skilled, passionate dental professionals dedicated to providing
              exceptional patient care with cutting-edge technology in a supportive environment.
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
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">Why AK Ultimate Dental</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">More Than a Workplace</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                At AK Ultimate Dental, we believe that investing in our team leads to better patient outcomes.
                When our staff thrives, our patients receive the best possible care.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: "Patient-First Culture", description: "Every team member shares our commitment to compassionate, high-quality dental care for every patient who walks through our door.", color: "from-pink-500 to-rose-500" },
                { icon: Users, title: "Collaborative Team", description: "Work alongside experienced dental professionals who value mentorship, peer learning, and genuine teamwork.", color: "from-cyan-500 to-cyan-700" },
                { icon: Sparkles, title: "Advanced Technology", description: "Work with the latest dental technology including CEREC, digital X-rays, and modern operatory equipment.", color: "from-amber-400 to-amber-600" },
                { icon: Shield, title: "Supportive Environment", description: "We prioritize team well-being with manageable schedules, a positive work culture, and open communication.", color: "from-cyan-400 to-cyan-600" },
                { icon: Clock, title: "Work-Life Balance", description: "Our Monday through Thursday schedule means three-day weekends every week. We value your time outside the office.", color: "from-teal-500 to-teal-700" },
                { icon: Briefcase, title: "Competitive Compensation", description: "Fair pay, benefits, and the resources you need to focus on what matters most — delivering excellent patient care.", color: "from-purple-500 to-purple-700" },
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

      {/* Values */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">Our Values</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">What We Stand For</h2>
            </div>
            <div className="space-y-4">
              {[
                "Patient comfort and satisfaction come first in everything we do.",
                "We invest in the latest technology and continuing education to stay at the forefront of dentistry.",
                "Every team member — from front desk to operatory — is treated with respect and appreciation.",
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

      {/* Current Openings — DB-driven */}
      <section id="openings" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-4">Open Positions</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Current Openings</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We are always looking for talented, compassionate individuals to join our team.
              </p>
            </div>

            {activeJobs.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-lg">No open positions at this time.</p>
                <p className="mt-2">Send your resume to <a href={`mailto:${siteConfig.email}`} className="text-cyan-600 hover:underline">{siteConfig.email}</a> and we will keep you in mind for future openings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.map((job) => {
                  const salary = salaryLabel(job);
                  return (
                    <Card key={job.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                            <p className="text-cyan-600 font-medium text-sm mb-3">
                              {employmentTypeLabel(job.employment_type)} · Las Vegas, NV
                              {job.remote_possible && " · Remote Possible"}
                              {salary && ` · ${salary}`}
                            </p>
                            <p className="text-slate-600 text-sm mb-3 line-clamp-2">{job.description}</p>
                            {job.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {job.tags.map((tag) => (
                                  <span key={tag} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="md:flex-shrink-0 flex gap-2">
                            <Button asChild variant="outline" size="sm" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                              <Link href={`/careers/${job.slug}`}>View Details</Link>
                            </Button>
                            <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                              <a href={`mailto:${job.apply_email}?subject=Application: ${job.title}`}>Apply</a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-r from-slate-900 to-cyan-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_60%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Build Your Career With Us</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join a team passionate about exceptional dental care, advanced technology, and creating smiles every day.
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
