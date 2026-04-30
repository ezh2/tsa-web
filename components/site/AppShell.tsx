import { getCurrentUser } from "@/core/rbac/server";
import { BackToTopButton } from "./BackToTopButton";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f5f5f7] text-neutral-900">
      <SiteHeader user={user} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <BackToTopButton />
    </div>
  );
}
