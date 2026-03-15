"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, ChevronLeft, CheckCircle, Loader2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceOption = {
  id: string;
  label: string;
  description: string;
};

const SERVICES: ServiceOption[] = [
  { id: "new_patient_exam", label: "New Patient Exam", description: "Comprehensive exam, X-rays & cleaning for new patients" },
  { id: "cleaning_checkup", label: "Cleaning & Checkup", description: "Routine cleaning and checkup for existing patients" },
  { id: "emergency", label: "Emergency Visit", description: "Tooth pain, broken tooth, swelling or urgent issue" },
  { id: "other", label: "Other / Consultation", description: "Cosmetic, implants, or other dental consultation" },
];

type Slot = {
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  durationMinutes: number;
  available: boolean;
};

type Step = 1 | 2 | 3;

const patientSchema = z.object({
  patientName: z.string().min(2, "Full name is required"),
  patientEmail: z.string().email("Valid email is required"),
  patientPhone: z
    .string()
    .min(10, "Valid phone number is required")
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format"),
  isNewPatient: z.enum(["yes", "no"]),
  notes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const hour12 = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  const utcDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
  return utcDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getNext30Weekdays(): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = new Date(today);
  current.setDate(current.getDate() + 1); // start tomorrow

  while (dates.length < 30) {
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) {
      // weekdays only
      const y = current.getFullYear();
      const mo = (current.getMonth() + 1).toString().padStart(2, "0");
      const d = current.getDate().toString().padStart(2, "0");
      dates.push(`${y}-${mo}-${d}`);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// ─── BookingFlow ──────────────────────────────────────────────────────────────

export default function BookingFlow() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 state
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState<string>("");

  // Step 2 state
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [submitError, setSubmitError] = useState<string>("");

  // Step 3 state
  const [confirmedData, setConfirmedData] = useState<{
    name: string;
    date: string;
    time: string;
    provider: string;
    service: string;
  } | null>(null);

  const weekdays = getNext30Weekdays();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      isNewPatient: "yes",
      notes: "",
    },
  });

  // Fetch availability when date or service changes
  const fetchSlots = useCallback(async (date: string, serviceType: string) => {
    setSlotsLoading(true);
    setSlotsMessage("");
    setSlots([]);
    setSelectedSlot(null);

    try {
      const res = await fetch(
        `/api/booking/availability?date=${date}&type=${encodeURIComponent(serviceType)}`
      );
      const json = await res.json();

      if (!res.ok) {
        setSlotsMessage("Unable to load availability. Please call (702) 935-4395.");
        return;
      }

      setSlots(json.slots || []);
      if (!json.slots || json.slots.length === 0) {
        setSlotsMessage(
          json.message ||
            "No availability on this date — please try another day or call us at (702) 935-4395."
        );
      }
    } catch {
      setSlotsMessage("Unable to load availability. Please call (702) 935-4395.");
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (selectedService && date) {
      fetchSlots(date, selectedService);
    }
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    if (serviceId && selectedDate) {
      fetchSlots(selectedDate, serviceId);
    }
  };

  const goToStep2 = () => {
    if (!selectedService || !selectedDate) return;
    setStep(2);
  };

  const onSubmit = async (data: PatientFormValues) => {
    if (!selectedSlot) {
      setSubmitError("Please select a time slot.");
      return;
    }
    setSubmitError("");

    try {
      const res = await fetch("/api/booking/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          patientPhone: data.patientPhone,
          date: selectedSlot.date,
          time: selectedSlot.time,
          providerId: selectedSlot.providerId,
          serviceType: selectedService,
          isNewPatient: data.isNewPatient === "yes",
          notes: data.notes || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error || "Something went wrong. Please call (702) 935-4395.");
        return;
      }

      const serviceLabel =
        SERVICES.find((s) => s.id === selectedService)?.label || selectedService;

      setConfirmedData({
        name: data.patientName,
        date: selectedSlot.date,
        time: selectedSlot.time,
        provider: selectedSlot.providerName,
        service: serviceLabel,
      });
      setStep(3);
    } catch {
      setSubmitError("Something went wrong. Please try again or call (702) 935-4395.");
    }
  };

  // ─── Step 1 ────────────────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white text-sm font-bold">
              1
            </div>
            <div>
              <h2 className="text-xl font-bold">Choose a Service & Date</h2>
              <p className="text-sm text-muted-foreground">Select your service type and a preferred date</p>
            </div>
          </div>

          {/* Service selector */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block">Select a Service</Label>
            <div className="grid sm:grid-cols-2 gap-3">
              {SERVICES.map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => handleServiceChange(svc.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedService === svc.id
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <p className="font-semibold text-sm">{svc.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{svc.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date picker */}
          <div className="mb-6">
            <Label htmlFor="date-select" className="text-sm font-semibold mb-3 block">
              <Calendar className="inline h-4 w-4 mr-1 text-cyan-500" />
              Select a Date
            </Label>
            <select
              id="date-select"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Choose a date...</option>
              {weekdays.map((d) => (
                <option key={d} value={d}>
                  {formatDate(d)}
                </option>
              ))}
            </select>
          </div>

          {/* Slot preview / loading */}
          {slotsLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking availability...
            </div>
          )}

          {!slotsLoading && slotsMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
              {slotsMessage}
            </div>
          )}

          {!slotsLoading && slots.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-800">
              {slots.length} time slot{slots.length !== 1 ? "s" : ""} available on {formatDate(selectedDate)}
            </div>
          )}

          <Button
            onClick={goToStep2}
            disabled={!selectedService || !selectedDate || slotsLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0"
            size="lg"
          >
            See Available Times
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Need help?{" "}
            <a href="tel:+17029354395" className="text-cyan-600 hover:underline font-medium">
              Call (702) 935-4395
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  // ─── Step 2 ────────────────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white text-sm font-bold">
              2
            </div>
            <div>
              <h2 className="text-xl font-bold">Pick a Time & Enter Your Info</h2>
              <p className="text-sm text-muted-foreground">
                {SERVICES.find((s) => s.id === selectedService)?.label} · {formatDate(selectedDate)}
              </p>
            </div>
          </div>

          {/* Time slot grid */}
          {slotsLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading availability...
            </div>
          ) : slots.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
              <p className="font-medium mb-1">No availability on this date</p>
              <p>
                Please go back and try another day, or call us at{" "}
                <a href="tel:+17029354395" className="font-medium underline">
                  (702) 935-4395
                </a>
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-cyan-500" />
                <Label className="text-sm font-semibold">Available Times</Label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected =
                    selectedSlot?.time === slot.time &&
                    selectedSlot?.providerId === slot.providerId;
                  return (
                    <button
                      key={`${slot.providerId}-${slot.time}`}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                          : "border-gray-200 hover:border-cyan-300 bg-white text-gray-700"
                      }`}
                    >
                      {formatTime(slot.time)}
                    </button>
                  );
                })}
              </div>
              {selectedSlot && (
                <p className="text-xs text-muted-foreground mt-2">
                  With {selectedSlot.providerName} at {formatTime(selectedSlot.time)}
                </p>
              )}
            </div>
          )}

          {/* Patient info form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="border-t pt-4">
              <Label className="text-sm font-semibold block mb-3">Your Information</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientName">Full Name *</Label>
              <Input id="patientName" placeholder="Jane Smith" {...register("patientName")} />
              {errors.patientName && (
                <p className="text-sm text-red-600">{errors.patientName.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientEmail">Email *</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  placeholder="jane@example.com"
                  {...register("patientEmail")}
                />
                {errors.patientEmail && (
                  <p className="text-sm text-red-600">{errors.patientEmail.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientPhone">Phone *</Label>
                <Input
                  id="patientPhone"
                  type="tel"
                  placeholder="(702) 555-0123"
                  {...register("patientPhone")}
                />
                {errors.patientPhone && (
                  <p className="text-sm text-red-600">{errors.patientPhone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isNewPatient">Are you a new patient? *</Label>
              <select
                id="isNewPatient"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("isNewPatient")}
              >
                <option value="yes">Yes, I&apos;m a new patient</option>
                <option value="no">No, I&apos;m an existing patient</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Any details we should know..."
                {...register("notes")}
              />
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !selectedSlot || slots.length === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Appointment"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to be contacted by our office to confirm your appointment.
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }

  // ─── Step 3: Confirmation ──────────────────────────────────────────────────
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6 md:p-8 text-center">
        <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Request Received!</h2>
        <p className="text-muted-foreground mb-6">
          Your appointment request has been received. We&apos;ll confirm within 2 business hours.
        </p>

        {confirmedData && (
          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{confirmedData.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{formatDate(confirmedData.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{formatTime(confirmedData.time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">{confirmedData.provider}</span>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          A confirmation email has been sent. If you need immediate assistance:
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0"
        >
          <a href="tel:+17029354395">
            <Phone className="mr-2 h-4 w-4" />
            Call (702) 935-4395
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
