export const eventsManifest = {
  name: "events",
  version: "0.1.0",
  routes: [
    { path: "/events", group: "public", requiredRole: "customer" },
    { path: "/events/[id]", group: "public", requiredRole: "customer" },
    { path: "/admin/events", group: "admin", requiredRole: "admin" },
    { path: "/admin/events/new", group: "admin", requiredRole: "admin" },
    { path: "/admin/events/[id]/edit", group: "admin", requiredRole: "admin" },
  ],
  navItems: [
    { label: "Events", href: "/events", requiredRole: "customer", group: "public" },
    { label: "Manage Events", href: "/admin/events", requiredRole: "admin", group: "admin" },
  ],
  migrations: ["modules/events/schemas/0001_init.sql", "modules/events/schemas/0002_content_management.sql", "modules/events/schemas/0003_preserve_main_calendar.sql"],
} as const;
