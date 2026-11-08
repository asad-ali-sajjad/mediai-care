"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "./Icon";

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
        
        {/* Header Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-95"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:bg-teal-900 group-hover:shadow-lg group-hover:shadow-teal-600/30">
            <svg
              className="h-6 w-6 stroke-white transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 12h3.5l2.5-5 3.5 10 3-7 2 4h4.5" />
              <circle cx="12" cy="17" r="1.2" className="fill-emerald-300 stroke-none" />
            </svg>
            <span className="absolute inset-0 -z-10 rounded-xl bg-teal-500/30 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-100" />
          </div>

          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Medi<span className="text-teal-700">AI</span>{" "}
              <span className="font-medium text-slate-600">Care</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu Dropdown */}
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