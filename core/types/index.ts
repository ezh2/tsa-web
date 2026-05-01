export type Role = "customer" | "member" | "director";
export type AcademicStage =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "grad";

export const ROLE_HIERARCHY: Record<Role, number> = {
  customer: 0,
  member: 1,
  director: 2,
};

export const ROLES: readonly Role[] = ["customer", "member", "director"] as const;

export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  netid: string | null;
  phone_number: string | null;
  personal_email: string | null;
  academic_stage_start: AcademicStage | null;
  academic_stage_recorded_year: number | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface CurrentUser {
  id: string;
  email: string | null;
  auth_email: string | null;
  role: Role;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  netid: string | null;
  phone_number: string | null;
  personal_email: string | null;
  academic_stage_start: AcademicStage | null;
  academic_stage_recorded_year: number | null;
}
