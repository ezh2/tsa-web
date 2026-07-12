export const paymentsManifest = {
  name: "payments",
  version: "0.1.0",
  routes: [
    // Stripe checkout confirmation is temporarily paused.
    { path: "/membership/thanks", group: "public", requiredRole: "customer" },
    // { path: "/admin/orders", group: "admin", requiredRole: "director" },
    // { path: "/api/stripe/webhook", group: "public", requiredRole: "customer" },
  ],
  navItems: [
    // Stripe-backed order admin is temporarily paused.
    // {
    //   label: "Orders",
    //   href: "/admin/orders",
    //   requiredRole: "director",
    //   group: "admin",
    // },
  ],
  migrations: ["modules/payments/schemas/0001_init.sql"],
} as const;
