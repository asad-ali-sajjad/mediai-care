"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "./Icon";

const roles: {
  id: string;
  label: string;
  icon: IconName;
  heading: string;
  points: string[];
  href: string;
  cta: string;
}[] = [
  {
    id: "patients",
    label: "Patients",
    icon: "users",
    heading: "Book and manage visits on your own time",
    points: [
      "One account across participating clinics",
      "Choose a doctor and see real time slots",
      "Printable appointment tickets",
      "View your own visit history and files",
    ],
    href: "/patient",
    cta: "Patient portal",
  },
  {
    id: "reception",
    label: "Reception",
    icon: "clipboard",
    heading: "Keep the front desk calm and organized",
    points: [
      "Register walk-in patients quickly",
      "Daily token numbers issued without duplicates",
      "Track consultation fees at check-in",
      "Live queue display for the waiting area",
    ],
    href: "/reception",
    cta: "Reception counter",
  },
  {
    id: "doctors",
    label: "Doctors",
    icon: "pulse",
    heading: "A clear clinical workspace",
    points: [
      "Set weekly availability and request leave",
      "Review patient history before the visit",
      "Write consultation notes and prescriptions",
      "Review AI screening results with full context",
    ],
    href: "/doctor",
    cta: "Doctor portal",
  },
  {
    id: "admins",
    label: "Clinic admins",
    icon: "shield",
    heading: "Control your clinic, and only your clinic",
    points: [
      "Manage staff accounts and roles",
      "Configure clinic hours and settings",
      "Data is scoped to your clinic at the database level",
      "Audit records cannot be altered or deleted",
    ],
    href: "/admin",
    cta: "Clinic admin",
  },
];

export function RoleTabs() {
  const [active, setActive] = useState(0);
  const role = roles[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") setActive((i + 1) % roles.length);
    if (e.key === "ArrowLeft") setActive((i - 1 + roles.length) % roles.length);
  };

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Roles"
        className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1"
      >
        {roles.map((r, i) => (
          <button
            key={r.id}
            role="tab"
            id={`tab-${r.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${r.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active === i
                ? "bg-white text-teal-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon name={r.icon} className="h-4 w-4" />
            {r.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${role.id}`}
        aria-labelledby={`tab-${role.id}`}
        className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8"
      >
        <h3 className="text-xl font-semibold text-slate-900">{role.heading}</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {role.points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              {p}
            </li>
          ))}
        </ul>
        <Link
          href={role.href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-900"
        >
          {role.cta}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}