export type SubleasePostType = "offer" | "request";

export interface MarketplaceListing {
  id: string;
  user_id: string;
  title: string;
  price: string;
  contact: string;
  tag: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SubleaseListing {
  id: string;
  user_id: string;
  post_type: SubleasePostType;
  title: string;
  date_range: string;
  budget: string;
  contact: string;
  details: string;
  created_at: string;
  updated_at: string;
}

export interface CarpoolListing {
  id: string;
  user_id: string;
  trip_date: string;
  route: string;
  seats: string;
  contact: string;
  note: string;
  created_at: string;
  updated_at: string;
}
