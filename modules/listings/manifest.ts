export const listingsManifest = {
  name: "listings",
  version: "0.1.0",
  routes: [
    {
      path: "/current-students/marketplace",
      group: "public",
      requiredRole: "customer",
    },
    {
      path: "/current-students/sublease",
      group: "public",
      requiredRole: "customer",
    },
    {
      path: "/current-students/carpool",
      group: "public",
      requiredRole: "customer",
    },
  ],
  navItems: [],
  migrations: ["modules/listings/schemas/0001_init.sql"],
} as const;
