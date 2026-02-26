"use client";

import {
  CreditCard,
  DollarSign,
  Shield,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Treatment {
  id: string;
  title: string;
  status: string;
  total_cost: number;
  insurance_estimate: number;
  patient_estimate: number;
  created_at: string;
  accepted_at: string | null;
}

interface BillingSummary {
  totalCharges: number;
  insurancePaid: number;
  patientResponsibility: number;
  amountPaid: number;
  balance: number;
}

export function BillingClient({
  treatments,
  summary,
}: {
  treatments: Treatment[];
  summary: BillingSummary;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Payments</h1>
        <p className="mt-1 text-sm text-slate-500">
          View your billing history and account balance
        </p>
      </div>

      {/* Balance Card */}
      <div className={cn(
        "rounded-xl border-2 p-6",
        summary.balance > 0
          ? "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50"
          : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Balance</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              ${summary.balance.toLocaleString()}
            </p>
            {summary.balance > 0 ? (
              <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Payment due — contact us to make a payment
              </p>
            ) : (
              <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                No balance due — your account is current
              </p>
            )}
          </div>
          {summary.balance > 0 && (
            <button
              className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
              onClick={() => {
                // Stripe payment flow will be wired here
                toast.info("Online payments coming soon! Please call the office to make a payment.");
              }}
            >
              <CreditCard className="inline h-4 w-4 mr-2" />
              Make Payment
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <DollarSign className="h-5 w-5 text-slate-400 mb-2" />
          <p className="text-lg font-bold text-slate-900">${summary.totalCharges.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Total Charges</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Shield className="h-5 w-5 text-blue-600 mb-2" />
          <p className="text-lg font-bold text-slate-900">${summary.insurancePaid.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Insurance Covered</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <CreditCard className="h-5 w-5 text-emerald-600 mb-2" />
          <p className="text-lg font-bold text-slate-900">${summary.amountPaid.toLocaleString()}</p>
          <p className="text-xs text-slate-500">You Paid</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <FileText className="h-5 w-5 text-purple-600 mb-2" />
          <p className="text-lg font-bold text-slate-900">{treatments.length}</p>
          <p className="text-xs text-slate-500">Treatment Plans</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Billing History</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {treatments.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No billing records yet</p>
            </div>
          ) : (
            treatments
              .filter((t) => t.status !== "draft" && t.status !== "declined")
              .map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      t.status === "completed" ? "bg-emerald-50" : "bg-amber-50"
                    )}>
                      {t.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {t.accepted_at && ` • Accepted ${new Date(t.accepted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${t.patient_estimate.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500">
                      Ins: ${t.insurance_estimate.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Payment Info */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Payment Options</p>
            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
              We accept cash, checks, Visa, Mastercard, Discover, and American Express.
              Online payments via the portal will be available soon. For questions about your
              balance or to set up a payment plan, please contact our billing department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
