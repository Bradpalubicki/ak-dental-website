"use client";

import { Shield, ShieldCheck, ShieldX, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsentBadgeProps {
  consents?: Array<{
    consent_type: string;
    status: string;
  }>;
  compact?: boolean;
}

const CHANNEL_LABELS: Record<string, string> = {
  sms_marketing: "SMS Mktg",
  sms_transactional: "SMS",
  email_marketing: "Email Mktg",
  email_transactional: "Email",
  voice_automated: "Voice",
  voice_ai: "AI Voice",
  hipaa_treatment: "HIPAA Tx",
  hipaa_payment: "HIPAA Pay",
  hipaa_operations: "HIPAA Ops",
};

const STATUS_STYLES: Record<string, { icon: typeof Shield; color: string }> = {
  granted: { icon: ShieldCheck, color: "text-emerald-500" },
  denied: { icon: ShieldX, color: "text-red-500" },
  revoked: { icon: ShieldX, color: "text-red-400" },
  pending: { icon: ShieldAlert, color: "text-amber-500" },
};

export function ConsentBadge({ consents, compact }: ConsentBadgeProps) {
  if (!consents || consents.length === 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Shield className="h-3 w-3" />
        {!compact && <span>No consents</span>}
      </div>
    );
  }

  if (compact) {
    const granted = consents.filter(c => c.status === "granted").length;
    const total = consents.length;
    const allGranted = granted === total;

    return (
      <div className={cn(
        "flex items-center gap-1 text-xs",
        allGranted ? "text-emerald-500" : "text-amber-500"
      )}>
        {allGranted
          ? <ShieldCheck className="h-3.5 w-3.5" />
          : <ShieldAlert className="h-3.5 w-3.5" />
        }
        <span>{granted}/{total}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {consents.map((consent) => {
        const style = STATUS_STYLES[consent.status] || STATUS_STYLES.pending;
        const Icon = style.icon;
        const label = CHANNEL_LABELS[consent.consent_type] || consent.consent_type;

        return (
          <span
            key={consent.consent_type}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border",
              consent.status === "granted" ? "border-emerald-500/20 bg-emerald-500/10" :
              consent.status === "denied" || consent.status === "revoked" ? "border-red-500/20 bg-red-500/10" :
              "border-amber-500/20 bg-amber-500/10"
            )}
          >
            <Icon className={cn("h-2.5 w-2.5", style.color)} />
            <span className={style.color}>{label}</span>
          </span>
        );
      })}
    </div>
  );
}
