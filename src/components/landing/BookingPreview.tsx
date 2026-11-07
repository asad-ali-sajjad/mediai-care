"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

const specialties = ["General Physician", "Dermatology", "Pediatrics"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"];

// Deterministic "taken" slots so the preview looks realistic without real data.
function isTaken(s: number, d: number, t: number) {
  return (s * 7 + d * 5 + t * 3) % 4 === 0;
}

export function BookingPreview() {
  const [specialty, setSpecialty] = useState(0);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState<number | null>(null);

  const pickSpecialty = (i: number) => {
    setSpecialty(i);
    setTime(null);
  };
  const pickDay = (i: number) => {
    setDay(i);
    setTime(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/60">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Preview an appointment
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          Sample schedule
        </span>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Specialty
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {specialties.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => pickSpecialty(i)}
              aria-pressed={specialty === i}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                specialty === i
                  ? "border-teal-800 bg-teal-800 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Day
        </legend>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {days.map((d, i) => (
            <button
              key={d}
              type="button"
              onClick={() => pickDay(i)}
              aria-pressed={day === i}
              className={`rounded-lg border py-2 text-sm transition-colors ${
                day === i
                  ? "border-teal-800 bg-teal-50 font-semibold text-teal-900"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Available times
        </legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {times.map((t, i) => {
            const taken = isTaken(specialty, day, i);
            const selected = time === i;
            return (
              <button
                key={t}
                type="button"
                disabled={taken}
                onClick={() => setTime(i)}
                aria-pressed={selected}
                className={`rounded-lg border py-2 text-sm transition-colors ${
                  taken
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through"
                    : selected
                    ? "border-teal-800 bg-teal-800 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-teal-700 hover:bg-teal-50"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div
        className="mt-5 min-h-[3.5rem] rounded-lg bg-slate-50 px-4 py-3 text-sm"
        aria-live="polite"
      >
        {time === null ? (
          <p className="flex items-center gap-2 text-slate-500">
            <Icon name="clock" className="h-4 w-4" />
            Select a time to continue.
          </p>
        ) : (
          <p className="text-slate-700">
            <span className="font-semibold text-slate-900">{specialties[specialty]}</span>
            {" · "}
            {days[day]} at {times[time]}
          </p>
        )}
      </div>

      <Link
        href="/book"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
      >
        Continue to booking
        <Icon name="arrow" className="h-4 w-4" />
      </Link>
      <p className="mt-3 text-center text-xs text-slate-500">
        Illustrative only. Real availability is shown after you choose a clinic.
      </p>
    </div>
  );
}