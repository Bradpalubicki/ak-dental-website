import Link from "next/link";
import { Clock } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  eta?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function ComingSoon({ title, description, eta, actionLabel, actionHref }: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Clock className="h-8 w-8 text-slate-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
          {eta && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
              <Clock className="h-3 w-3" />
              {eta}
            </p>
          )}
        </div>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
