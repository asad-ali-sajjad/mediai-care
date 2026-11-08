import { db } from "@/lib/db";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { addMinutes, isAfter } from "date-fns";

export type AvailableSlot = {
  startsAt: Date;
  endsAt: Date;
  formattedTime: string; // e.g., "09:15 AM"
};

/**
 * Calculates open appointment slots for a doctor on a specific clinic-local date.
 * 
 * @param doctorId - Target doctor ID
 * @param dateStr - Clinic-local calendar date in "YYYY-MM-DD" format
 */
export async function getAvailableSlots(
  doctorId: string,
  dateStr: string
): Promise<AvailableSlot[]> {
  // 1. Fetch Doctor along with Clinic timezone and active schedules
  const doctor = await db.doctor.findUnique({
    where: { id: doctorId },
    include: {
      clinic: true,
      schedules: { where: { isActive: true } },
    },
  });

  if (!doctor || !doctor.isActive || !doctor.acceptsOnline) {
    return [];
  }

  const tz = doctor.clinic.timezone;
  const targetDateUtc = new Date(`${dateStr}T00:00:00Z`);

  // 2. Check if doctor is on leave for the requested date
  const leave = await db.doctorLeave.findFirst({
    where: {
      doctorId,
      startDate: { lte: targetDateUtc },
      endDate: { gte: targetDateUtc },
    },
  });

  if (leave) {
    return [];
  }

  // 3. Find working schedule windows for the day of the week (0 = Sun, 6 = Sat)
  const dayOfWeek = targetDateUtc.getUTCDay();
  const daySchedules = doctor.schedules.filter((s) => s.weekday === dayOfWeek);

  if (daySchedules.length === 0) {
    return [];
  }

  // 4. Fetch existing active appointments for this doctor on this day
  const dayStartUtc = fromZonedTime(`${dateStr}T00:00:00`, tz);
  const dayEndUtc = fromZonedTime(`${dateStr}T23:59:59`, tz);

  const existingAppointments = await db.appointment.findMany({
    where: {
      doctorId,
      startsAt: { gte: dayStartUtc, lte: dayEndUtc },
      status: { in: ["BOOKED", "CHECKED_IN", "IN_PROGRESS"] },
      source: { not: "WALK_IN" }, // Scheduled slots only
    },
    select: { startsAt: true },
  });

  const bookedTimesSet = new Set(
    existingAppointments.map((a) => a.startsAt.getTime())
  );

  // 5. Calculate minimum lead-time cutoff (now + clinic lead minutes)
  const minLeadCutoff = addMinutes(new Date(), doctor.clinic.minLeadMinutes);
  const slots: AvailableSlot[] = [];

  // 6. Generate slot intervals across operating schedule windows
  for (const sched of daySchedules) {
    let slotStart = fromZonedTime(`${dateStr}T${sched.startTime}:00`, tz);
    const windowEnd = fromZonedTime(`${dateStr}T${sched.endTime}:00`, tz);

    while (addMinutes(slotStart, doctor.slotMinutes) <= windowEnd) {
      const slotEnd = addMinutes(slotStart, doctor.slotMinutes);
      const slotStartMs = slotStart.getTime();

      // Keep slot if unbooked AND beyond minimum lead cutoff
      if (!bookedTimesSet.has(slotStartMs) && isAfter(slotStart, minLeadCutoff)) {
        slots.push({
          startsAt: slotStart,
          endsAt: slotEnd,
          formattedTime: formatInTimeZone(slotStart, tz, "hh:mm a"),
        });
      }

      slotStart = slotEnd;
    }
  }

  return slots;
}