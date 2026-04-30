import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export { AccountPage as default } from "@/modules/auth";
