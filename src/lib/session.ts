import type { Role } from "@prisma/client";
import { auth } from "@/auth";

export type Actor = { id: string; role: Role; clinicId: string | null };

/**
 * Use at the top of every server action and service entry point.
 * Verifies that the request is authenticated and optionally checks authorized roles.
 */
export async function requireActor(roles?: Role[]): Promise<Actor> {
  const s = await auth();
  if (!s?.user) throw new Error("UNAUTHENTICATED");
  if (roles && !roles.includes(s.user.role)) throw new Error("FORBIDDEN");
  return { id: s.user.id, role: s.user.role, clinicId: s.user.clinicId };
}