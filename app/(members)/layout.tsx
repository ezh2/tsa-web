import { redirect } from "next/navigation";
import { ForbiddenError } from "@/core/rbac";
import { requireRole } from "@/core/rbac/server";
import { AppShell } from "@/components/site/AppShell";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole("member");
  } catch (err) {
    if (err instanceof ForbiddenError) {
      redirect(`/?error=forbidden_${err.required}`);
    }
    throw err;
  }

  return <AppShell>{children}</AppShell>;
}
