"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Bell,
  Brain,
  CheckCircle,
  Clock,
} from "lucide-react";

export function DashboardPreview() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Browser Chrome Frame */}
      <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
        {/* Title Bar */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-500 border border-gray-200 max-w-xs w-full text-center">
              dashboard.akultimatedental.com
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex">
          {/* Mini Sidebar */}
          <div className="w-48 bg-slate-900 p-4 hidden md:block min-h-[320px]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600" />
              <div>
                <div className="text-[10px] font-bold text-white">
                  AK Ultimate
                </div>
                <div className="text-[8px] text-cyan-400">One Engine AI</div>
              </div>
            </div>
            {[
              { icon: BarChart3, label: "Dashboard", active: true },
              { icon: Brain, label: "AI Advisor", active: false },
              { icon: Users, label: "Patients", active: false },
              { icon: Calendar, label: "Appointments", active: false },
              { icon: Bell, label: "Inbox", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-1 ${
                  item.active
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="text-[10px]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 bg-slate-50 min-h-[320px]">
            {/* AI Greeting */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-cyan-600" />
                <span className="text-[11px] font-semibold text-slate-900">
                  Good morning! Here&apos;s what One Engine did for you today:
                </span>
              </div>
              <div className="text-[10px] text-slate-600 pl-6 space-y-0.5">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>3 appointment reminders sent automatically</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>2 insurance verifications completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  <span>1 lead follow-up awaiting your approval</span>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                {
                  label: "Today's Patients",
                  value: "12",
                  change: "+2",
                  color: "text-cyan-600",
                },
                {
                  label: "Revenue MTD",
                  value: "$47.2K",
                  change: "+18%",
                  color: "text-emerald-600",
                },
                {
                  label: "Open Leads",
                  value: "8",
                  change: "3 new",
                  color: "text-blue-600",
                },
                {
                  label: "Completion Rate",
                  value: "94%",
                  change: "+2%",
                  color: "text-violet-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-lg border border-gray-200 p-3"
                >
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div
                    className={`text-lg font-bold ${stat.color} leading-tight`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-green-600 flex items-center gap-0.5">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Mini Chart Area */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-[10px] font-semibold text-slate-900 mb-2">
                Weekly Revenue Trend
              </div>
              <div className="flex items-end gap-1.5 h-16">
                {[40, 55, 45, 65, 80, 70, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm transition-all duration-500"
                    style={{
                      height: isVisible ? `${h}%` : "0%",
                      transitionDelay: `${i * 100 + 500}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <span key={day} className="text-[8px] text-gray-400 flex-1 text-center">
                      {day}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
