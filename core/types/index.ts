export type Role = "customer" | "member" | "director";

export const ROLE_HIERARCHY: Record<Role, number> = {
  customer: 0,
  member: 1,
  director: 2,
};

export const ROLES: readonly Role[] = ["customer", "member", "director"] as const;

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface CurrentUser {
  id: string;
  email: string | null;
  role: Role;
  display_name: string | null;
}
