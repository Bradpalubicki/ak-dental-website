import { createServiceSupabase } from "@/lib/supabase/server";
import type { ProviderV2 as Provider, ProviderAvailability, ProviderTimeOff } from "@/types/database";

export const providerService = {
  async list(status?: string): Promise<Provider[]> {
    const supabase = createServiceSupabase();
    let query = supabase.from("oe_providers").select("*").order("last_name");
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw new Error(`Failed to list providers: ${error.message}`);
    return (data || []) as Provider[];
  },

  async get(id: string): Promise<Provider | null> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_providers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data as Provider;
  },

  async create(params: Omit<Provider, "id" | "created_at" | "updated_at">): Promise<Provider> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_providers")
      .insert(params)
      .select()
      .single();
    if (error) throw new Error(`Failed to create provider: ${error.message}`);
    return data as Provider;
  },

  async update(id: string, params: Partial<Provider>): Promise<Provider> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_providers")
      .update(params)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update provider: ${error.message}`);
    return data as Provider;
  },

  async getAvailability(providerId: string): Promise<ProviderAvailability[]> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_provider_availability")
      .select("*")
      .eq("provider_id", providerId)
      .order("day_of_week")
      .order("start_time");
    if (error) throw new Error(`Failed to get availability: ${error.message}`);
    return (data || []) as ProviderAvailability[];
  },

  async setAvailability(providerId: string, slots: Omit<ProviderAvailability, "id" | "created_at">[]): Promise<ProviderAvailability[]> {
    const supabase = createServiceSupabase();
    // Delete existing then insert new
    await supabase.from("oe_provider_availability").delete().eq("provider_id", providerId);
    const { data, error } = await supabase
      .from("oe_provider_availability")
      .insert(slots.map((s) => ({ ...s, provider_id: providerId })))
      .select();
    if (error) throw new Error(`Failed to set availability: ${error.message}`);
    return (data || []) as ProviderAvailability[];
  },

  async getTimeOff(providerId: string, startDate?: string, endDate?: string): Promise<ProviderTimeOff[]> {
    const supabase = createServiceSupabase();
    let query = supabase
      .from("oe_provider_time_off")
      .select("*")
      .eq("provider_id", providerId)
      .order("start_datetime");

    if (startDate) query = query.gte("end_datetime", startDate);
    if (endDate) query = query.lte("start_datetime", endDate);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to get time off: ${error.message}`);
    return (data || []) as ProviderTimeOff[];
  },

  async addTimeOff(params: Omit<ProviderTimeOff, "id" | "created_at">): Promise<ProviderTimeOff> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_provider_time_off")
      .insert(params)
      .select()
      .single();
    if (error) throw new Error(`Failed to add time off: ${error.message}`);
    return data as ProviderTimeOff;
  },

  async getActiveCount(): Promise<{ active: number; on_leave: number; inactive: number }> {
    const supabase = createServiceSupabase();
    const { data } = await supabase.from("oe_providers").select("status");
    const providers = data || [];
    return {
      active: providers.filter((p) => p.status === "active").length,
      on_leave: providers.filter((p) => p.status === "on_leave").length,
      inactive: providers.filter((p) => p.status === "inactive").length,
    };
  },
};
