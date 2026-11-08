"use server";

import { cancelPatientAppointment } from "@/server/services/appointments";
import { revalidatePath } from "next/cache";

export async function cancelAppointmentAction(appointmentId: string, reason: string) {
  try {
    await cancelPatientAppointment({ appointmentId, reason });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "CANCELLATION_FAILED",
    };
  }
}