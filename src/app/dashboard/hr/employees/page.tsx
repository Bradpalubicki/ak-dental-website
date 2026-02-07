export const dynamic = "force-dynamic";

import Link from "next/link";
import { createServiceSupabase } from "@/lib/supabase/server";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  dentist: "Dentist",
  hygienist: "Hygienist",
  assistant: "Dental Assistant",
  front_desk: "Front Desk",
  office_manager: "Office Manager",
  staff: "Staff",
};

const roleColors: Record<string, string> = {
  dentist: "bg-cyan-100 text-cyan-700",
  hygienist: "bg-blue-100 text-blue-700",
  assistant: "bg-purple-100 text-purple-700",
  front_desk: "bg-emerald-100 text-emerald-700",
  office_manager: "bg-amber-100 text-amber-700",
  staff: "bg-slate-100 text-slate-600",
};

export default async function EmployeesPage() {
  const supabase = createServiceSupabase();

  const { data: employees } = await supabase
    .from("oe_employees")
    .select("*")
    .order("first_name", { ascending: true });

  const active = (employees || []).filter(
    (e: { status: string }) => e.status === "active"
  );
  const inactive = (employees || []).filter(
    (e: { status: string }) => e.status !== "active"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/hr"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Team Directory
            </h1>
            <p className="text-sm text-slate-500">
              {active.length} active employee
              {active.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* eslint-disable @typescript-eslint/no-explicit-any */}
        {active.map((emp: any) => (
          <Link
            key={emp.id}
            href={`/dashboard/hr/employees/${emp.id}`}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-cyan-300 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">
                {emp.first_name[0]}
                {emp.last_name[0]}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-cyan-700">
                  {emp.first_name} {emp.last_name}
                </h3>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    roleColors[emp.role] || roleColors.staff
                  }`}
                >
                  {roleLabels[emp.role] || emp.role}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {emp.email && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{emp.email}</span>
                </div>
              )}
              {emp.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{emp.phone}</span>
                </div>
              )}
              {emp.hire_date && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Hired{" "}
                    {new Date(emp.hire_date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
        {/* eslint-enable @typescript-eslint/no-explicit-any */}
      </div>

      {inactive.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-slate-500">Inactive</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* eslint-disable @typescript-eslint/no-explicit-any */}
            {inactive.map((emp: any) => (
              <Link
                key={emp.id}
                href={`/dashboard/hr/employees/${emp.id}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-300 text-white font-bold text-xs">
                    {emp.first_name[0]}
                    {emp.last_name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-700">
                      {emp.first_name} {emp.last_name}
                    </h3>
                    <span className="text-xs text-slate-500 capitalize">
                      {emp.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {/* eslint-enable @typescript-eslint/no-explicit-any */}
          </div>
        </>
      )}

      {(employees || []).length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Users className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-semibold text-slate-900">No Employees</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add team members to get started.
          </p>
        </div>
      )}
    </div>
  );
}
