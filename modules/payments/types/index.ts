export type OrderStatus = "processing" | "paid" | "failed" | "refunded";

export interface OrderRecord {
  id: string;
  user_id: string | null;
  product_key: string;
  product_name: string;
  status: OrderStatus;
  amount_total: number;
  currency: string;
  shirt_size: string | null;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderBuyer {
  email: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
}

export interface OrderWithBuyer extends OrderRecord {
  profiles: OrderBuyer | null;
}
