import { AppShell } from "@/components/site/AppShell";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
