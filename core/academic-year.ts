import type { AcademicStage } from "@/core/types";

export const ACADEMIC_STAGES: readonly AcademicStage[] = [
  "freshman",
  "sophomore",
  "junior",
  "senior",
  "grad",
] as const;

export const ACADEMIC_STAGE_LABELS: Record<AcademicStage, string> = {
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
  grad: "Grad",
};

export function getAcademicYear(date = new Date()): number {
  const month = date.getMonth();
  const year = date.getFullYear();

  return month >= 7 ? year : year - 1;
}

export function getCurrentAcademicStage(
  startingStage: AcademicStage | null | undefined,
  recordedAcademicYear: number | null | undefined,
  date = new Date(),
): AcademicStage | null {
  if (!startingStage || !recordedAcademicYear) return null;

  const startIndex = ACADEMIC_STAGES.indexOf(startingStage);
  if (startIndex < 0) return null;

  const elapsedYears = Math.max(0, getAcademicYear(date) - recordedAcademicYear);
  const currentIndex = Math.min(
    ACADEMIC_STAGES.length - 1,
    startIndex + elapsedYears,
  );

  return ACADEMIC_STAGES[currentIndex];
}
