"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchSlotsAction, bookAppointmentAction } from "./actions";
import type { AvailableSlot } from "@/lib/slots";

type DoctorProps = {
  doctor: {
    id: string;
    fee: number | null;
    slotMinutes: number;
    qualification: string | null;
    experienceYears: number | null;
    clinic: { name: string; city: string | null };
    specialization: { name: string };
    user?: { name: string } | null;
  };
};

type ConfirmationDetails = {
  date: string;
  time: string;
  reason: string;
};

export function DoctorBookingCard({ doctor }: DoctorProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [reason, setReason] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<ConfirmationDetails | null>(null);

  async function handleLoadSlots(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setLoadingSlots(true);
    setMessage(null);

    const res = await fetchSlotsAction(doctor.id, date);
    setLoadingSlots(false);
    if (res.success && res.slots) {
      setSlots(res.slots);
    } else {
      setMessage({ text: res.error ?? "Could not load slots", isError: true });
    }
  }

  async function handleBook() {
    if (!selectedSlot || !reason.trim()) return;
    setSubmitting(true);
    setMessage(null);

    const res = await bookAppointmentAction({
      doctorId: doctor.id,
      startsAt: selectedSlot.startsAt.toISOString(),
      reason,
    });

    setSubmitting(false);

    if (res.success) {
      setBookingConfirmation({
        date: selectedDate,
        time: selectedSlot.formattedTime,
        reason: reason,
      });
      setSelectedSlot(null);
      setReason("");
      setSlots([]);
    } else {
      const errText =
        res.error === "SLOT_ALREADY_BOOKED"
          ? "This slot was just taken by another patient. Please pick another."
          : res.error === "UNAUTHENTICATED"
          ? "Please sign in to book an appointment."
          : "Booking failed. Please try again.";
      setMessage({ text: errText, isError: true });
    }
  }

  function handleReset() {
    setBookingConfirmation(null);
    handleLoadSlots(selectedDate);
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <div>
        <div className="border-b border-slate-100 pb-4">
          <span className="inline-block rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-800">
            {doctor.specialization.name}
          </span>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900">
            {doctor.qualification || "General Specialist"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {doctor.clinic.name}
            {doctor.clinic.city ? ` • ${doctor.clinic.city}` : ""}
          </p>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
            <span>
              Fee: <strong className="font-semibold text-slate-900">PKR {doctor.fee ?? 0}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Experience: <strong className="font-semibold text-slate-900">{doctor.experienceYears ?? 0} yrs</strong>
            </span>
          </div>
        </div>

        {bookingConfirmation ? (
          <div className="mt-4 space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                ✓
              </span>
              <h3 className="text-sm font-bold">Appointment Confirmed!</h3>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              <p>
                <span className="font-medium text-slate-500">Date:</span>{" "}
                <span className="font-semibold text-slate-900">{bookingConfirmation.date}</span>
              </p>
              <p>
                <span className="font-medium text-slate-500">Time:</span>{" "}
                <span className="font-semibold text-slate-900">{bookingConfirmation.time}</span>
              </p>
              <p>
                <span className="font-medium text-slate-500">Reason:</span>{" "}
                <span className="font-semibold text-slate-900">{bookingConfirmation.reason}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Link
                href="/dashboard"
                className="flex-1 rounded-lg bg-teal-800 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleReset}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Book Another
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={todayStr}
                onChange={(e) => handleLoadSlots(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>

            <div>
              <button
                onClick={() => handleLoadSlots(selectedDate)}
                disabled={loadingSlots}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
              >
                {loadingSlots ? "Checking slots..." : "Check Available Slots"}
              </button>
            </div>

            {slots.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Available Slots
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.startsAt.toString()}
                      onClick={() => setSelectedSlot(s)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none ${
                        selectedSlot?.startsAt === s.startsAt
                          ? "border-teal-800 bg-teal-800 text-white shadow-sm"
                          : "border-slate-300 bg-white text-slate-700 hover:border-teal-700 hover:bg-teal-50/50"
                      }`}
                    >
                      {s.formattedTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSlot && (
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Reason for Visit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Routine checkup, fever..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <button
                  onClick={handleBook}
                  disabled={submitting || !reason.trim()}
                  className="w-full rounded-lg bg-teal-800 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {message && (
        <div
          className={`mt-4 rounded-lg border p-3 text-xs font-medium ${
            message.isError
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}