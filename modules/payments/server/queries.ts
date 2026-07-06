import "server-only";
import { createClient } from "@/core/supabase/server";
import type { OrderRecord, OrderWithBuyer } from "@/modules/payments/types";

export async function listMyOrders(): Promise<OrderRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments_order")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as OrderRecord[];
}

// Directors only (enforced by RLS — non-directors get back only their own rows,
// and the admin layout gates the page server-side).
export async function listAllOrders(): Promise<OrderWithBuyer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments_order")
    .select("*, profiles(email, display_name, first_name, last_name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as OrderWithBuyer[];
}
