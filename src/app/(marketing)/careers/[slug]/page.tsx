import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Clock, DollarSign, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema } from "@/components/schema/local-business";
import { siteConfig } from "@/lib/config";
import { createServiceSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface JobPosting {
  id: string;
  title: string;
  slug: string;
  employment_type: string;
  department: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  nice_to_have: string | null;
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
  apply_url: string | null;
}

function employmentTypeLabel(type: string) {
  const map: Record<string, string> = {
    FULL_TIME: "Full-Time", PART_TIME: "Part-Time",
    CONTRACTOR: "Contract", TEMPORARY: "Temporary", INTERN: "Internship",
  };
  return map[type] ?? type;
}

function salaryLabel(job: JobPosting): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const unit = job.salary_unit === "YEAR" ? " / year" : job.salary_unit === "HOUR" ? " / hour" : "";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)} – ${fmt(job.salary_max)}${unit}`;
  if (job.salary_min) return `From ${fmt(job.salary_min)}${unit}`;
  return `Up to ${fmt(job.salary_max!)}${unit}`;
}

function markdownToHtml(md: string): string {
  // Simple markdown: bullets, bold
  return md
    .split("\n")
    .map((line) => {
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return `<li class="ml-4 mb-1">${line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`;
      }
      if (line.startsWith("## ")) return `<h3 class="text-lg font-semibold text-slate-900 mt-4 mb-2">${line.slice(3)}</h3>`;
      if (line.trim() === "") return "<br />";
      return `<p class="mb-2">${line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
    })
    .join("");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServiceSupabase();
  const { data: job } = await supabase
    .from("oe_job_postings")
    .select("title, description, employment_type")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!job) return { title: "Position Not Found | AK Ultimate Dental" };

  return {
    title: `${job.title} | Careers at AK Ultimate Dental`,
    description: `${employmentTypeLabel(job.employment_type)} position in Las Vegas, NV. ${job.description.slice(0, 150)}`,
    openGraph: {
      title: `${job.title} — AK Ultimate Dental`,
      description: job.description.slice(0, 200),
    },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceSupabase();

  const { data: job } = await supabase
    .from("oe_job_postings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!job) notFound();

  const j = job as JobPosting;
  const salary = salaryLabel(j);

  // Increment view count (fire-and-forget)
  supabase
    .from("oe_job_postings")
    .update({ views: (j as unknown as { views: number }).views + 1 })
    .eq("id", j.id)
    .then(() => {});

  // Google for Jobs JSON-LD
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: j.title,
    description: [j.description, j.requirements, j.responsibilities].filter(Boolean).join("\n\n"),
    datePosted: j.posted_at ? j.posted_at.split("T")[0] : new Date().toISOString().split("T")[0],
    ...(j.expires_at ? { validThrough: j.expires_at.split("T")[0] } : {}),
    employmentType: j.employment_type,
    hiringOrganization: {
      "@type": "Organization",
      name: "AK Ultimate Dental",
      sameAs: siteConfig.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: j.street_address,
        addressLocality: j.city,
        addressRegion: j.state,
        postalCode: j.zip,
        addressCountry: j.country,
      },
    },
    ...(j.remote_possible ? { jobLocationType: "TELECOMMUTE" } : {}),
    ...(j.salary_min || j.salary_max
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: j.salary_currency,
            value: {
              "@type": "QuantitativeValue",
              ...(j.salary_min ? { minValue: j.salary_min } : {}),
              ...(j.salary_max ? { maxValue: j.salary_max } : {}),
              unitText: j.salary_unit,
            },
          },
        }
      : {}),
    applicationContact: {
      "@type": "ContactPoint",
      email: j.apply_email,
      contactType: "hiring",
    },
    identifier: { "@type": "PropertyValue", name: "AK Ultimate Dental", value: j.id },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Careers", href: "/careers" },
          { name: j.title, href: `/careers/${j.slug}` },
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Header bar */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <Link href="/careers" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-cyan-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to all openings
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="md:col-span-2 space-y-8">
              {/* Title block */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {employmentTypeLabel(j.employment_type)}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {j.department}
                  </span>
                  {j.remote_possible && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Remote Possible
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{j.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-cyan-600" />
                    {j.city}, {j.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-cyan-600" />
                    {employmentTypeLabel(j.employment_type)}
                  </span>
                  {salary && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-cyan-600" />
                      {salary}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">About This Role</h2>
                <div className="text-slate-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(j.description) }}
                />
              </div>

              {/* Responsibilities */}
              {j.responsibilities && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Responsibilities</h2>
                  <ul className="text-slate-700 text-sm leading-relaxed space-y-1"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(j.responsibilities) }}
                  />
                </div>
              )}

              {/* Requirements */}
              {j.requirements && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Requirements</h2>
                  <ul className="text-slate-700 text-sm leading-relaxed space-y-1"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(j.requirements) }}
                  />
                </div>
              )}

              {/* Nice to have */}
              {j.nice_to_have && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Nice to Have</h2>
                  <ul className="text-slate-700 text-sm leading-relaxed space-y-1"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(j.nice_to_have) }}
                  />
                </div>
              )}

              {/* Tags */}
              {j.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {j.tags.map((tag) => (
                    <span key={tag} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium border border-cyan-100">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar — Apply card */}
            <div className="md:col-span-1">
              <div className="sticky top-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Apply for This Position</h3>
                <p className="text-sm text-slate-600">
                  Send your resume and cover letter to our hiring team. We review all applications and respond to qualified candidates within two weeks.
                </p>

                {j.apply_url ? (
                  <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                    <a href={j.apply_url} target="_blank" rel="noopener noreferrer">
                      Apply Online
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                    <a href={`mailto:${j.apply_email}?subject=Application: ${j.title}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Apply by Email
                    </a>
                  </Button>
                )}

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Location</p>
                  <p className="text-sm text-slate-700">{j.street_address}<br />{j.city}, {j.state} {j.zip}</p>
                </div>

                {salary && (
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Compensation</p>
                    <p className="text-sm text-slate-700 font-medium">{salary}</p>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400 text-center">
                    AK Ultimate Dental · {siteConfig.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
