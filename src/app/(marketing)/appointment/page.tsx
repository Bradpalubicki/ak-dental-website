"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, CheckCircle, AlertCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/config";
import { curatedImages } from "@/content/images";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const appointmentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  preferredDate: z.string().optional(),
  preferredTime: z.enum(["", "morning", "afternoon"]).optional(),
  visitReason: z.string().min(1, "Please select a reason for your visit"),
  patientType: z.string().min(1, "Please select patient type"),
  message: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function AppointmentPage() {
  const [pageState, setPageState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      visitReason: "",
      patientType: "",
      message: "",
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    setPageState("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          source: "website",
          inquiry_type: data.visitReason,
          message: data.message || `Preferred date: ${data.preferredDate || "Flexible"}, Time: ${data.preferredTime || "Flexible"}. Patient type: ${data.patientType}.`,
          urgency: data.visitReason === "emergency" || data.visitReason === "toothache" ? "high" : "medium",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setPageState("success");
    } catch {
      setPageState("error");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={curatedImages.pages.appointment}
            alt="Smiling patient at AK Ultimate Dental Las Vegas"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-white">128 Five-Star Reviews</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Request an Appointment
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Fill out the form below and our team will contact you to confirm
              your appointment. For immediate assistance, call us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                <a href={siteConfig.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call {siteConfig.phone}
                </a>
              </Button>
              <Button asChild size="lg" className="h-14 px-8 bg-white/10 border border-white/30 text-white hover:bg-white/20">
                <a href="#appointment-form">
                  Fill Out Form
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="appointment-form" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {pageState === "error" ? (
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
                    <Button onClick={() => setPageState("idle")}>
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : pageState === "success" ? (
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
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            {...register("firstName")}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-600">{errors.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Smith"
                            {...register("lastName")}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-600">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-600">{errors.email.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(702) 555-0123"
                            {...register("phone")}
                          />
                          {errors.phone && (
                            <p className="text-sm text-red-600">{errors.phone.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="preferredDate">Preferred Date</Label>
                          <Input
                            id="preferredDate"
                            type="date"
                            {...register("preferredDate")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferredTime">Preferred Time</Label>
                          <select
                            id="preferredTime"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            {...register("preferredTime")}
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
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          {...register("visitReason")}
                        >
                          <option value="">Select a reason</option>
                          <option value="cleaning">Cleaning & Exam</option>
                          <option value="cosmetic">Cosmetic Consultation</option>
                          <option value="implants">Dental Implants</option>
                          <option value="emergency">Dental Emergency</option>
                          <option value="toothache">Toothache/Pain</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.visitReason && (
                          <p className="text-sm text-red-600">{errors.visitReason.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patientType">Patient Type *</Label>
                        <select
                          id="patientType"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          {...register("patientType")}
                        >
                          <option value="">Select patient type</option>
                          <option value="new">New Patient</option>
                          <option value="existing">Existing Patient</option>
                        </select>
                        {errors.patientType && (
                          <p className="text-sm text-red-600">{errors.patientType.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Information</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          placeholder="Please share any additional details about your dental needs..."
                          {...register("message")}
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={pageState === "submitting"}
                      >
                        {pageState === "submitting" ? "Submitting..." : "Request Appointment"}
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
