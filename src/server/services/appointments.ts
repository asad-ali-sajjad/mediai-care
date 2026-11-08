import { db } from "@/lib/db";
import { requireActor } from "@/lib/session";
import { createBookingSchema, cancelBookingSchema } from "@/lib/validators/booking";
import { ApptStatus, ApptSource, Role } from "@prisma/client";
import { addMinutes } from "date-fns";

/**
 * Creates an online appointment for an authenticated PATIENT user.
 * Dynamically links or provisions clinic-scoped Patient record.
 */
export async function createPatientAppointment(rawInput: unknown) {
  const actor = await requireActor([Role.PATIENT]);
  const input = createBookingSchema.parse(rawInput);

  // 1. Verify doctor availability and booking fee settings
  const doctor = await db.doctor.findUnique({
    where: { id: input.doctorId },
    select: {
      clinicId: true,
      fee: true,
      slotMinutes: true,
      isActive: true,
      acceptsOnline: true,
    },
  });

  if (!doctor || !doctor.isActive || !doctor.acceptsOnline) {
    throw new Error("DOCTOR_UNAVAILABLE");
  }

  const startsAt = new Date(input.startsAt);
  const endsAt = addMinutes(startsAt, doctor.slotMinutes);
  const apptDate = new Date(`${startsAt.toISOString().slice(0, 10)}T00:00:00Z`);

  // 2. Fetch or provision patient record scoped to target clinic
  let patient = await db.patient.findFirst({
    where: { userId: actor.id, clinicId: doctor.clinicId },
  });

  if (!patient) {
    const user = await db.user.findUniqueOrThrow({ where: { id: actor.id } });
    patient = await db.patient.create({
      data: {
        clinicId: doctor.clinicId,
        userId: user.id,
        name: user.name,
        phone: user.phone ?? "+923000000000",
        email: user.email,
      },
    });
  }

  // 3. Persist appointment (Database trigger handles concurrent double-booking protection)
  try {
    const appointment = await db.appointment.create({
      data: {
        clinicId: doctor.clinicId,
        doctorId: input.doctorId,
        patientId: patient.id,
        startsAt,
        endsAt,
        apptDate,
        status: ApptStatus.BOOKED,
        source: ApptSource.ONLINE,
        fee: doctor.fee,
        reason: input.reason,
      },
    });

    return { success: true, appointmentId: appointment.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "";
    if (errorMsg.includes("uniq_active_slot") || errorMsg.includes("23505")) {
      throw new Error("SLOT_ALREADY_BOOKED");
    }
    throw err;
  }
}

/**
 * Cancels a booked appointment owned by the authenticated PATIENT.
 */
export async function cancelPatientAppointment(rawInput: unknown) {
  const actor = await requireActor([Role.PATIENT]);
  const input = cancelBookingSchema.parse(rawInput);

  const appt = await db.appointment.findUnique({
    where: { id: input.appointmentId },
    include: { patient: true },
  });

  if (!appt || appt.patient.userId !== actor.id) {
    throw new Error("APPOINTMENT_NOT_FOUND");
  }

  if (appt.status !== ApptStatus.BOOKED) {
    throw new Error("CANNOT_CANCEL");
  }

  await db.appointment.update({
    where: { id: appt.id },
    data: {
      status: ApptStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelledBy: Role.PATIENT,
      cancelReason: input.reason,
    },
  });

  return { success: true };
}