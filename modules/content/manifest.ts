export const contentManifest = {
  name: "content",
  version: "0.1.0",
  routes: [{ path: "/admin", group: "admin", requiredRole: "admin" }],
  navItems: [{ label: "Website", href: "/admin", group: "admin", requiredRole: "admin" }],
  migrations: ["modules/content/schemas/0001_init.sql"],
} as const;
