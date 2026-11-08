"use server";

import { getAvailableSlots } from "@/lib/slots";
import { createPatientAppointment } from "@/server/services/appointments";
import { revalidatePath } from "next/cache";

export async function fetchSlotsAction(doctorId: string, dateStr: string) {
  try {
    const slots = await getAvailableSlots(doctorId, dateStr);
    return { success: true, slots };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "FAILED_TO_LOAD_SLOTS",
    };
  }
}

export async function bookAppointmentAction(payload: {
  doctorId: string;
  startsAt: string;
  reason: string;
}) {
  try {
    const res = await createPatientAppointment(payload);
    revalidatePath("/dashboard");
    return { success: true, appointmentId: res.appointmentId };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "BOOKING_FAILED",
    };
  }
}