import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Events",
};

export { EventsAdminPage as default } from "@/modules/events";
