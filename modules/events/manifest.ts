export const eventsManifest = {
  name: "events",
  version: "0.1.0",
  routes: [
    { path: "/events", group: "public", requiredRole: "customer" },
    { path: "/events/[id]", group: "public", requiredRole: "customer" },
    { path: "/admin/events", group: "admin", requiredRole: "director" },
    { path: "/admin/events/new", group: "admin", requiredRole: "director" },
    { path: "/admin/events/[id]/edit", group: "admin", requiredRole: "director" },
  ],
  navItems: [
    { label: "Events", href: "/events", requiredRole: "customer", group: "public" },
    { label: "Manage Events", href: "/admin/events", requiredRole: "director", group: "admin" },
  ],
  migrations: ["modules/events/schemas/0001_init.sql"],
} as const;
