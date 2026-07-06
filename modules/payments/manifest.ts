export const paymentsManifest = {
  name: "payments",
  version: "0.1.0",
  routes: [
    { path: "/membership/thanks", group: "public", requiredRole: "customer" },
    { path: "/admin/orders", group: "admin", requiredRole: "director" },
    { path: "/api/stripe/webhook", group: "public", requiredRole: "customer" },
  ],
  navItems: [
    {
      label: "Orders",
      href: "/admin/orders",
      requiredRole: "director",
      group: "admin",
    },
  ],
  migrations: ["modules/payments/schemas/0001_init.sql"],
} as const;
