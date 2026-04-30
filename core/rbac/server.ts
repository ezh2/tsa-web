import "server-only";
import { createClient } from "@/core/supabase/server";
import { ForbiddenError, hasRole } from "@/core/rbac";
import type { CurrentUser, Role } from "@/core/types";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name, email")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? profile?.email ?? null,
    role: (profile?.role ?? "customer") as Role,
    display_name: profile?.display_name ?? null,
  };
}

export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new ForbiddenError("customer");
  return user;
}

export async function requireRole(required: Role): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || !hasRole(user.role, required)) {
    throw new ForbiddenError(required);
  }
  return user;
}
