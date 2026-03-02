"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, Mail, CheckCircle, AlertTriangle, Clock, RefreshCw } from "lucide-react";

interface SourceEmail {
  id: string;
  from_email: string;
  from_name: string | null;
  subject: string | null;
}

interface Bill {
  id: string;
  vendor: string;
  description: string | null;
  amount: number;
  due_date: string;
  status: string;
  paid_date: string | null;
  notes: string | null;
  invoice_number: string | null;
  extraction_confidence: number | null;
  source_email_id: string | null;
  created_at: string;
  source_email: SourceEmail | null;
}

const statusConfig: Record<string, { label: string; classes: string; icon: typeof Clock }> = {
  upcoming: { label: "Upcoming", classes: "bg-slate-100 text-slate-600", icon: Clock },
  due_soon: { label: "Due Soon", classes: "bg-amber-100 text-amber-700", icon: AlertTriangle },
  overdue: { label: "Overdue", classes: "bg-red-100 text-red-700", icon: AlertTriangle },
  paid: { label: "Paid", classes: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BillsFromEmail() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  const loadBills = useCallback(async () => {
    try {
      const res = await fetch("/api/accounts-payable?source=email");
      const data = await res.json();
      setBills(data.bills ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  async function markPaid(id: string) {
    setMarkingPaid(id);
    try {
      const res = await fetch(`/api/accounts-payable/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      if (res.ok) {
        setBills((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: "paid", paid_date: new Date().toISOString().split("T")[0] }
              : b
          )
        );
      }
    } finally {
      setMarkingPaid(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Loading bills...
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-sm">
        <DollarSign className="h-8 w-8 mb-2" />
        <p className="font-medium text-slate-600">No bills from email yet</p>
        <p>Bills detected in incoming emails will appear here</p>
      </div>
    );
  }

  const unpaid = bills.filter((b) => b.status !== "paid");
  const totalUnpaid = unpaid.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Total Bills</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{bills.length}</p>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-amber-600">Unpaid</p>
          <p className="text-xl font-bold text-amber-700 mt-1">{formatCurrency(totalUnpaid)}</p>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-red-600">Overdue</p>
          <p className="text-xl font-bold text-red-700 mt-1">
            {bills.filter((b) => b.status === "overdue").length}
          </p>
        </div>
      </div>

      {/* Bill rows */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Vendor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Source</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map((bill) => {
              const cfg = statusConfig[bill.status] || statusConfig.upcoming;
              const StatusIcon = cfg.icon;
              return (
                <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{bill.vendor}</p>
                    {bill.invoice_number && (
                      <p className="text-xs text-slate-400">#{bill.invoice_number}</p>
                    )}
                    {bill.extraction_confidence !== null && bill.extraction_confidence < 0.7 && (
                      <p className="text-[10px] text-amber-500">Low confidence extraction</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatCurrency(bill.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {bill.status === "paid" && bill.paid_date
                      ? <span className="text-emerald-600">Paid {formatDate(bill.paid_date)}</span>
                      : formatDate(bill.due_date)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}>
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {bill.source_email ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {bill.source_email.from_name || bill.source_email.from_email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">Manual</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {bill.status !== "paid" && (
                      <button
                        onClick={() => markPaid(bill.id)}
                        disabled={markingPaid === bill.id}
                        className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                      >
                        {markingPaid === bill.id ? "..." : "Mark Paid"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
