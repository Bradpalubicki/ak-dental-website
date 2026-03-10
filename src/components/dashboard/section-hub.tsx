import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type HubLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: number;
  badgeColor?: string;
};

export function SectionHub({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  links,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  links: HubLink[];
}) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {/* Quick-link grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-cyan-200 hover:bg-cyan-50/50 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBg)}>
                <link.icon className={cn("h-4 w-4", iconColor)} />
              </div>
              {link.badge !== undefined && link.badge > 0 && (
                <span className={cn(
                  "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  link.badgeColor ?? "bg-amber-100 text-amber-700"
                )}>
                  {link.badge}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-cyan-700">{link.label}</p>
            <p className="text-xs text-slate-500 leading-snug">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
