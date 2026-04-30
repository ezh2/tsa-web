export const marketingManifest = {
  name: "marketing",
  version: "0.1.0",
  routes: [
    { path: "/", group: "public", requiredRole: "customer" },
    { path: "/about", group: "public", requiredRole: "customer" },
  ],
  navItems: [
    { label: "Home", href: "/", requiredRole: "customer", group: "public" },
    { label: "About", href: "/about", requiredRole: "customer", group: "public" },
  ],
  migrations: [],
} as const;
