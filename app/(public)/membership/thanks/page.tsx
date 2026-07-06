import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation",
};

export { CheckoutSuccessPage as default } from "@/modules/payments";
