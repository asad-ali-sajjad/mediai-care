import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { Icon } from "@/components/landing/Icon";
import { PatientView } from "./patient-view";
import { DoctorView } from "./doctor-view";

export const dynamic = "force-dynamic";

type PatientAppointment = Prisma.AppointmentGetPayload<{
  include: {
    doctor: {
      select: {
        qualification: true;
        clinic: { select: { name: true } };
        specialization: { select: { name: true } };
      };
    };
  };
}>;

type DoctorAppointment = Prisma.AppointmentGetPayload<{
  include: {
    patient: { select: { name: true; phone: true } };
  };
}>;

function initials(name?: string | null, fallback?: string | null) {
  const source = (name || fallback || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;

  let patientAppointments: PatientAppointment[] = [];
  let doctorAppointments: DoctorAppointment[] = [];

  if (user.role === "PATIENT") {
    const patient = await db.patient.findFirst({
      where: { userId: user.id },
    });

    if (patient) {
      patientAppointments = await db.appointment.findMany({
        where: { patientId: patient.id },
        include: {
          doctor: {
            select: {
              qualification: true,
              clinic: { select: { name: true } },
              specialization: { select: { name: true } },
            },
          },
        },
        orderBy: { startsAt: "desc" },
      });
    }
  } else if (user.role === "DOCTOR") {
    const doctor = await db.doctor.findFirst({
      where: { userId: user.id },
    });

    if (doctor) {
      doctorAppointments = await db.appointment.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: { select: { name: true, phone: true } },
        },
        orderBy: { startsAt: "asc" },
      });
    }
  }

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

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-800 text-lg font-semibold text-white"
          >
            {initials(user.name, user.email)}
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              MediAI Care Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Logged in as <span className="font-semibold text-slate-800">{user.name || "User"}</span> ({user.role})
            </p>
          </div>
        </div>

        {user.role === "PATIENT" && <PatientView appointments={patientAppointments} />}
        {user.role === "DOCTOR" && <DoctorView appointments={doctorAppointments} />}

        {user.role !== "PATIENT" && user.role !== "DOCTOR" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Administrative Overview</h2>
            <p className="mt-1 text-sm text-slate-600">
              Clinic and platform settings can be managed via high-level admin portals.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}