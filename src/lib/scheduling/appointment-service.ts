import { createServiceSupabase } from "@/lib/supabase/server";
import type { Appointment } from "@/types/database";

interface CreateAppointmentParams {
  patient_id: string;
  provider_id: string;
  appointment_type_id?: string;
  resource_id?: string;
  appointment_date: string;
  appointment_time: string;
  start_time?: string;
  end_time?: string;
  duration_minutes: number;
  type: string;
  booking_source?: string;
  price?: number;
  notes?: string;
}

interface ListAppointmentsParams {
  date?: string;
  provider_id?: string;
  patient_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const appointmentService = {
  async create(params: CreateAppointmentParams): Promise<Appointment> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_appointments")
      .insert({
        ...params,
        status: "scheduled",
        provider_name: "", // will be set from provider lookup
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create appointment: ${error.message}`);
    return data as unknown as Appointment;
  },

  async get(id: string): Promise<Appointment | null> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_appointments")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data as unknown as Appointment;
  },

  async list(params: ListAppointmentsParams = {}): Promise<Appointment[]> {
    const supabase = createServiceSupabase();
    let query = supabase.from("oe_appointments").select("*");

    if (params.date) query = query.eq("appointment_date", params.date);
    if (params.provider_id) query = query.eq("provider_id", params.provider_id);
    if (params.patient_id) query = query.eq("patient_id", params.patient_id);
    if (params.status) query = query.eq("status", params.status);
    if (params.start_date) query = query.gte("appointment_date", params.start_date);
    if (params.end_date) query = query.lte("appointment_date", params.end_date);

    query = query
      .order("appointment_date")
      .order("appointment_time")
      .limit(params.limit || 100);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to list appointments: ${error.message}`);
    return (data || []) as unknown as Appointment[];
  },

  async updateStatus(id: string, status: string, extras?: Record<string, unknown>): Promise<Appointment> {
    const supabase = createServiceSupabase();
    const updates: Record<string, unknown> = { status, ...extras };

    if (status === "checked_in") updates.checked_in_at = new Date().toISOString();
    if (status === "completed") updates.completed_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("oe_appointments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update appointment: ${error.message}`);
    return data as unknown as Appointment;
  },

  async cancel(id: string, reason?: string): Promise<Appointment> {
    return this.updateStatus(id, "cancelled", { cancellation_reason: reason });
  },

  async checkIn(id: string): Promise<Appointment> {
    return this.updateStatus(id, "checked_in");
  },

  async complete(id: string): Promise<Appointment> {
    return this.updateStatus(id, "completed");
  },

  async getTodayCount(providerId?: string): Promise<number> {
    const supabase = createServiceSupabase();
    const today = new Date().toISOString().split("T")[0];
    let query = supabase
      .from("oe_appointments")
      .select("id", { count: "exact", head: true })
      .eq("appointment_date", today)
      .not("status", "in", '("cancelled","rescheduled")');

    if (providerId) query = query.eq("provider_id", providerId);
    const { count } = await query;
    return count || 0;
  },

  async getUpcoming(patientId: string, limit = 5): Promise<Appointment[]> {
    const supabase = createServiceSupabase();
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("oe_appointments")
      .select("*")
      .eq("patient_id", patientId)
      .gte("appointment_date", today)
      .not("status", "in", '("cancelled","rescheduled")')
      .order("appointment_date")
      .order("appointment_time")
      .limit(limit);
    return (data || []) as unknown as Appointment[];
  },
};
