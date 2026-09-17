export type ProductKey = "membership" | "bundle" | "tshirt";

export const SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export interface PaymentProduct {
  key: ProductKey;
  name: string;
  description: string;
  /** Price in USD cents. The single source of truth — never accept a price from the client. */
  amountCents: number;
  /** Successful payment promotes the buyer from 'customer' to 'member'. */
  grantsMembership: boolean;
  /** Checkout collects a T-shirt size via a Stripe custom field. */
  collectsShirtSize: boolean;
}

export const PRODUCT_CATALOG: Record<ProductKey, PaymentProduct> = {
  membership: {
    key: "membership",
    name: "TSA Membership",
    description:
      "Lifetime, non-transferable UIUC TSA membership with membership card verification and Line Announcement System enrollment. Partner discounts are to be announced.",
    amountCents: 2999,
    grantsMembership: true,
    collectsShirtSize: false,
  },
  bundle: {
    key: "bundle",
    name: "TSA Membership + T-shirt Bundle",
    description:
      "Lifetime UIUC TSA membership plus one TSA 呆丸囡仔 T-shirt. Bundle pricing applies to one T-shirt only and cannot be combined with other event discounts.",
    amountCents: 4999,
    grantsMembership: true,
    collectsShirtSize: true,
  },
  tshirt: {
    key: "tshirt",
    name: "TSA 呆丸囡仔 T-shirt",
    description: "Official TSA 呆丸囡仔 T-shirt. Campus pickup details announced via TSA channels.",
    amountCents: 3299,
    grantsMembership: false,
    collectsShirtSize: true,
  },
};

export function getProduct(key: string): PaymentProduct | null {
  if (key !== "membership" && key !== "bundle" && key !== "tshirt") return null;
  return PRODUCT_CATALOG[key];
}
