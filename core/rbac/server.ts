import "server-only";
import { createClient } from "@/core/supabase/server";
import { ForbiddenError, hasRole } from "@/core/rbac";
import type { AcademicStage, CurrentUser, Role } from "@/core/types";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "role, display_name, email, first_name, last_name, netid, phone_number, personal_email, academic_stage_start, academic_stage_recorded_year",
    )
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? null,
    auth_email: user.email ?? null,
    role: (profile?.role ?? "customer") as Role,
    display_name: profile?.display_name ?? null,
    first_name: profile?.first_name ?? null,
    last_name: profile?.last_name ?? null,
    netid: profile?.netid ?? null,
    phone_number: profile?.phone_number ?? null,
    personal_email: profile?.personal_email ?? null,
    academic_stage_start:
      (profile?.academic_stage_start as AcademicStage | null | undefined) ??
      null,
    academic_stage_recorded_year: profile?.academic_stage_recorded_year ?? null,
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
