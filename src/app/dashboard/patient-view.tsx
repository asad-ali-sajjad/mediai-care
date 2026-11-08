"use client";

import { useState } from "react";
import Link from "next/link";
import { cancelAppointmentAction } from "./actions";

type Appt = {
  id: string;
  startsAt: Date | string;
  endsAt: Date | string;
  status: string;
  reason: string | null;
  fee: number | null;
  doctor: {
    qualification: string | null;
    clinic: { name: string };
    specialization: { name: string };
  };
};

export function PatientView({ appointments }: { appointments: Appt[] }) {
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCancel(id: string) {
    if (!reason.trim()) return;
    setLoading(true);
    const res = await cancelAppointmentAction(id, reason);
    setLoading(false);
    if (res?.success) {
      setCancelingId(null);
      setReason("");
    } else {
      alert("Could not cancel appointment.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            My Appointments
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage your scheduled consultations and medical visits
          </p>
        </div>
        <Link
          href="/doctors"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          <span className="text-base leading-none">+</span> Book New Appointment
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm font-medium text-slate-600">
            You have no active appointments.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Book your first appointment with a specialist above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-800">
                    {a.doctor.specialization.name}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {a.doctor.qualification || "General Specialist"}
                  </h3>
                  <p className="text-sm text-slate-500">{a.doctor.clinic.name}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    a.status === "BOOKED"
                      ? "border border-sky-200 bg-sky-50 text-sky-700"
                      : a.status === "COMPLETED"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <div className="grid gap-3 rounded-lg bg-slate-50/70 p-3.5 text-sm sm:grid-cols-3">
                <div>
                  <span className="block text-xs font-medium text-slate-500">
                    Date & Time
                  </span>
                  <span
                    className="font-medium text-slate-900"
                    suppressHydrationWarning
                  >
                    {new Date(a.startsAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500">
                    Reason
                  </span>
                  <span className="font-medium text-slate-900">
                    {a.reason || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500">
                    Fee
                  </span>
                  <span className="font-medium text-slate-900">
                    {a.fee !== null && a.fee !== undefined ? `PKR ${a.fee}` : "N/A"}
                  </span>
                </div>
              </div>

              {a.status === "BOOKED" && (
                <div className="border-t border-slate-100 pt-3">
                  {cancelingId === a.id ? (
                    <div className="space-y-3 rounded-lg bg-slate-50 p-3">
                      <input
                        type="text"
                        placeholder="Reason for cancellation..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCancel(a.id)}
                          disabled={loading || !reason.trim()}
                          className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
                        >
                          {loading ? "Canceling..." : "Confirm Cancel"}
                        </button>
                        <button
                          onClick={() => {
                            setCancelingId(null);
                            setReason("");
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCancelingId(a.id)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}