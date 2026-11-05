import type { Role } from "@prisma/client";

/**
 * URL prefix -> Allowed roles.
 * Used by Next.js middleware to restrict page routes.
 */
export const ROUTE_ROLES: Record<string, Role[]> = {
  "/dashboard": ["SUPER_ADMIN", "CLINIC_ADMIN", "RECEPTIONIST", "DOCTOR", "PATIENT"],
  "/super": ["SUPER_ADMIN"],
  "/admin": ["SUPER_ADMIN", "CLINIC_ADMIN"],
  "/reception": ["CLINIC_ADMIN", "RECEPTIONIST"],
  "/doctor": ["DOCTOR"],
  "/patient": ["PATIENT"],
};