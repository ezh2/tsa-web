import { redirect } from "next/navigation";
import { ForbiddenError } from "@/core/rbac";
import { requireAuth } from "@/core/rbac/server";
import { AppShell } from "@/components/site/AppShell";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAuth();
  } catch (err) {
    if (err instanceof ForbiddenError) {
      redirect("/login?next=/account");
    }
    throw err;
  }

  return <AppShell>{children}</AppShell>;
}
