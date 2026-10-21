import { redirect } from "next/navigation";
import { ForbiddenError } from "@/core/rbac";
import { requireRole } from "@/core/rbac/server";
import { AppShell } from "@/components/site/AppShell";
import { AdminNavigation } from "@/modules/content";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole("admin");
  } catch (err) {
    if (err instanceof ForbiddenError) {
      redirect(`/?error=forbidden_${err.required}`);
    }
    throw err;
  }

  return <AppShell><AdminNavigation />{children}</AppShell>;
}
