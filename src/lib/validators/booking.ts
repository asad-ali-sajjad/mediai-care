import { z } from "zod";

export const createBookingSchema = z.object({
  doctorId: z.string().min(1, "Doctor selection is required"),
  startsAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
  reason: z
    .string()
    .min(3, "Reason must be at least 3 characters")
    .max(500, "Reason cannot exceed 500 characters"),
});

export const cancelBookingSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  reason: z
    .string()
    .min(3, "Cancellation reason is required")
    .max(300, "Reason cannot exceed 300 characters"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;