type Appt = {
  id: string;
  startsAt: Date | string;
  status: string;
  reason: string | null;
  patient: { name: string; phone: string | null };
};

export function DoctorView({ appointments }: { appointments: Appt[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Today&apos;s Patient Schedule
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage and review scheduled consultations for today
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm font-medium text-slate-600">
            No appointments scheduled for today.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            New appointments will appear here automatically when booked.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {a.patient.name}
                </h3>
                <p className="flex items-center gap-1 text-sm text-slate-500">
                  <span>📞</span> {a.patient.phone || "No phone provided"}
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-medium text-slate-700">Reason:</span>{" "}
                  {a.reason || "Checkup"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                <span
                  className="text-sm font-semibold text-teal-800"
                  suppressHydrationWarning
                >
                  {new Date(a.startsAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    a.status === "BOOKED"
                      ? "border border-sky-200 bg-sky-50 text-sky-700"
                      : a.status === "COMPLETED"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-slate-200 bg-slate-100 text-slate-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}