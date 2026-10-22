import { getCurrentUser } from "@/core/rbac/server";
import { BackToTopButton } from "./BackToTopButton";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { getContent } from "@/modules/content";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [user, site, features] = await Promise.all([
    getCurrentUser(), getContent("site"), getContent("features"),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f5f5f7] text-neutral-900">
      <SiteHeader user={user} site={site} features={features} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <BackToTopButton />
    </div>
  );
}
