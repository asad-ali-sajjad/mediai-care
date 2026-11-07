"use client";

import { useState } from "react";
import { Icon } from "./Icon";

const items = [
  {
    q: "Do I need a separate account for each clinic?",
    a: "No. You have one patient account. Each clinic keeps its own records and visits for you, and clinics cannot see each other's data.",
  },
  {
    q: "Can I sign in with my phone number?",
    a: "Yes. You can sign in with your email or your phone number, in local or international format.",
  },
  {
    q: "Is the AI skin screening a diagnosis?",
    a: "No. It is a decision-support tool. Results are reviewed by a qualified doctor, and uncertain cases are routed to a clinician rather than guessed.",
  },
  {
    q: "How is my information protected?",
    a: "Clinic data is isolated at the database level, access depends on your role, accounts are temporarily locked after repeated failed sign-ins, and security records are kept in an append-only audit log.",
  },
  {
    q: "What if I need urgent care?",
    a: "Do not use this website for emergencies. Call your local emergency number or go to the nearest hospital.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-10 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                {item.q}
                <Icon
                  name="chevron"
                  className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={`faq-${i}`}
              role="region"
              hidden={!isOpen}
              className="px-5 pb-5 text-sm leading-relaxed text-slate-600"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}