"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, Loader2, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/portal`,
        },
      });

      if (authError) throw authError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send login link. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link href="/" className="mb-10">
            <Image
              src="/ak-logo-gold.jpg"
              alt="AK Ultimate Dental"
              width={60}
              height={60}
              className="rounded-xl"
            />
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Dental Care,<br />At Your Fingertips
          </h1>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-md">
            Access your appointments, treatment plans, billing, and more through our secure patient portal.
          </p>
          <div className="space-y-4">
            {[
              "View & manage appointments",
              "Review treatment plans",
              "Access billing & payments",
              "Message our team securely",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden text-center">
            <Link href="/">
              <Image
                src="/ak-logo-gold.jpg"
                alt="AK Ultimate Dental"
                width={48}
                height={48}
                className="rounded-xl mx-auto mb-4"
              />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Patient Portal</h1>
          </div>

          {!sent ? (
            <>
              <div className="mb-8 hidden lg:block">
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Enter the email address associated with your patient account to receive a secure login link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || !email.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    <>
                      Send Login Link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>First time?</strong> If you are an existing patient, enter the email on file with us.
                  You will receive a secure magic link — no password needed. If you do not have an account yet,{" "}
                  <Link href="/appointment" className="text-cyan-600 font-medium hover:underline">
                    book your first appointment
                  </Link>{" "}
                  and we will set you up.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Check Your Email</h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                We sent a secure login link to{" "}
                <span className="font-semibold text-slate-900">{email}</span>.
                Click the link in the email to access your patient portal.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="w-full rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Try a different email
                </button>
              </div>
              <p className="mt-6 text-xs text-slate-500">
                Did not receive the email? Check your spam folder or call us at{" "}
                <a href={siteConfig.phoneHref} className="text-cyan-600 font-medium">{siteConfig.phone}</a>
              </p>
            </div>
          )}

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Need help?{" "}
              <a href={siteConfig.phoneHref} className="text-cyan-600 font-medium hover:underline inline-flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {siteConfig.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
