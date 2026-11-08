import Link from "next/link";
import { db } from "@/lib/db";
import { DoctorBookingCard } from "./booking-card";
import { Icon } from "@/components/landing/Icon";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const doctors = await db.doctor.findMany({
    where: { isActive: true, acceptsOnline: true },
    include: {
      clinic: { select: { name: true, city: true } },
      specialization: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800 text-white">
              <Icon name="pulse" className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              MediAI <span className="text-teal-800">Care</span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Find & Book a Doctor
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a specialist and pick an available time slot for your consultation.
          </p>
        </div>

        {doctors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-sm font-medium text-slate-600">
              No doctors currently available for online booking.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Please check back later or contact your clinic administrator.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {doctors.map((doc) => (
              <DoctorBookingCard key={doc.id} doctor={doc} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}