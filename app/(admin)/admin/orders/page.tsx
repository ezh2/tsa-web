import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Orders",
};

export { OrdersAdminPage as default } from "@/modules/payments";
