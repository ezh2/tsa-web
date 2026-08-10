import "server-only";
import { createClient } from "@/core/supabase/server";
import type {
  CarpoolListing,
  MarketplaceListing,
  SubleaseListing,
  SubleasePostType,
} from "@/modules/listings/types";

export async function listMarketplaceListings(): Promise<MarketplaceListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings_marketplace")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MarketplaceListing[];
}

export async function listSubleaseListings(
  postType?: SubleasePostType | "all",
): Promise<SubleaseListing[]> {
  const supabase = await createClient();
  let query = supabase
    .from("listings_sublease")
    .select("*")
    .order("created_at", { ascending: false });

  if (postType === "offer" || postType === "request") {
    query = query.eq("post_type", postType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SubleaseListing[];
}

export async function listCarpoolListings(): Promise<CarpoolListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings_carpool")
    .select("*")
    .order("trip_date", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CarpoolListing[];
}
