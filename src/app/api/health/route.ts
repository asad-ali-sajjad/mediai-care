import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    const [clinics, users] = await Promise.all([
      db.clinic.count(),
      db.user.count(),
    ]);
    return Response.json({ ok: true, clinics, users });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}