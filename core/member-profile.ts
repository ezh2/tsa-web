import type { AcademicStage } from "@/core/types";

export interface MemberProfileFields {
  first_name: string | null;
  last_name: string | null;
  netid: string | null;
  phone_number: string | null;
  email: string | null;
  personal_email: string | null;
  academic_stage_start: AcademicStage | null;
  academic_stage_recorded_year: number | null;
}

export function isMemberProfileComplete(user: MemberProfileFields): boolean {
  return Boolean(
    user.first_name &&
      user.last_name &&
      user.netid &&
      user.phone_number &&
      user.email &&
      user.personal_email &&
      user.academic_stage_start &&
      user.academic_stage_recorded_year,
  );
}
