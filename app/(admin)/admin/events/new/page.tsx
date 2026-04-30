import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Event",
};

export { EventCreatePage as default } from "@/modules/events";
