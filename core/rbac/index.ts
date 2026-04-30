import { ROLE_HIERARCHY, type Role } from "@/core/types";

export function hasRole(
  userRole: Role | null | undefined,
  required: Role,
): boolean {
  const effective: Role = userRole ?? "customer";
  return ROLE_HIERARCHY[effective] >= ROLE_HIERARCHY[required];
}

export class ForbiddenError extends Error {
  constructor(public required: Role) {
    super(`Forbidden: requires role '${required}'`);
    this.name = "ForbiddenError";
  }
}
