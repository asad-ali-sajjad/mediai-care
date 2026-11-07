"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#roles", label: "For clinics" },
  { href: "#ai-support", label: "AI support" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800 text-white">
            <Icon name="pulse" className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            MediAI <span className="text-teal-800">Care</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Sign in
          </Link>
          <Link
            href="/book"
            className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
          >
            Book appointment
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-slate-200 bg-white px-6 py-4 md:hidden"
        >
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign in
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="/book"
                className="block rounded-lg bg-teal-800 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Book appointment
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}