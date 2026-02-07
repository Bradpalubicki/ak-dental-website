"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/config";

export default function AppointmentPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.get("firstName"),
          last_name: data.get("lastName"),
          email: data.get("email"),
          phone: data.get("phone"),
          source: "website",
          inquiry_type: data.get("visitReason"),
          message: data.get("message") || `Preferred date: ${data.get("preferredDate") || "Flexible"}, Time: ${data.get("preferredTime") || "Flexible"}. Patient type: ${data.get("patientType")}.`,
          urgency: data.get("visitReason") === "emergency" || data.get("visitReason") === "toothache" ? "high" : "medium",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Request an Appointment
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Fill out the form below and our team will contact you to confirm
              your appointment. For immediate assistance, please call us directly.
            </p>
            <Button asChild size="lg" variant="outline">
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-5 w-5" />
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {formState === "error" ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="bg-red-100 rounded-full p-4 w-fit mx-auto mb-6">
                      <AlertCircle className="h-12 w-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                      Something Went Wrong
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      We couldn&apos;t submit your request. Please call us directly at{" "}
                      <a href={siteConfig.phoneHref} className="text-primary hover:underline">
                        {siteConfig.phone}
                      </a>
                      .
                    </p>
                    <Button onClick={() => setFormState("idle")}>
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : formState === "success" ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-6">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                      Thank You for Your Request!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      We&apos;ve received your appointment request and will contact you
                      shortly to confirm your visit. If you need immediate
                      assistance, please call us at{" "}
                      <a href={siteConfig.phoneHref} className="text-primary hover:underline">
                        {siteConfig.phone}
                      </a>
                      .
                    </p>
                    <Button asChild>
                      <Link href="/">Return to Home</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Appointment Request Form
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            required
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            required
                            placeholder="Smith"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="(702) 555-0123"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="preferredDate">Preferred Date</Label>
                          <Input
                            id="preferredDate"
                            name="preferredDate"
                            type="date"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferredTime">Preferred Time</Label>
                          <select
                            id="preferredTime"
                            name="preferredTime"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select a time</option>
                            <option value="morning">Morning (8AM - 12PM)</option>
                            <option value="afternoon">Afternoon (12PM - 5PM)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visitReason">Reason for Visit *</Label>
                        <select
                          id="visitReason"
                          name="visitReason"
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select a reason</option>
                          <option value="cleaning">Cleaning & Exam</option>
                          <option value="cosmetic">Cosmetic Consultation</option>
                          <option value="implants">Dental Implants</option>
                          <option value="emergency">Dental Emergency</option>
                          <option value="toothache">Toothache/Pain</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patientType">Patient Type *</Label>
                        <select
                          id="patientType"
                          name="patientType"
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select patient type</option>
                          <option value="new">New Patient</option>
                          <option value="existing">Existing Patient</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Information</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={4}
                          placeholder="Please share any additional details about your dental needs..."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={formState === "submitting"}
                      >
                        {formState === "submitting" ? "Submitting..." : "Request Appointment"}
                      </Button>

                      <p className="text-sm text-muted-foreground text-center">
                        By submitting this form, you agree to be contacted by our
                        office to confirm your appointment.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday</span>
                      <span>{siteConfig.hours.monday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tuesday</span>
                      <span>{siteConfig.hours.tuesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wednesday</span>
                      <span>{siteConfig.hours.wednesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thursday</span>
                      <span>{siteConfig.hours.thursday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Friday</span>
                      <span>{siteConfig.hours.friday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sat - Sun</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a
                          href={siteConfig.phoneHref}
                          className="font-medium hover:text-primary"
                        >
                          {siteConfig.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{siteConfig.address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {siteConfig.address.city}, {siteConfig.address.stateAbbr}{" "}
                          {siteConfig.address.zip}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Dental Emergency?
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    If you&apos;re experiencing severe pain or a dental emergency,
                    please call us immediately.
                  </p>
                  <Button asChild variant="secondary" className="w-full">
                    <a href={siteConfig.phoneHref}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
