"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Icon } from "@/components/landing/Icon";
import { loginAction } from "./actions";

const serif = "font-[family-name:var(--font-serif)]";

const assurances = [
  "Sign in with your email or phone number",
  "Access is limited to your role in the clinic",
  "Sign-in activity is recorded in a secure audit log",
];

export default function LoginPage() {
  const [error, action, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel (desktop only) */}
      <aside className="hidden flex-col justify-between bg-teal-900 p-12 text-teal-50 lg:flex">
        <Link href="/" className="flex w-fit items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Icon name="pulse" className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            MediAI Care
          </span>
        </Link>

        <div>
          <h2 className={`${serif} text-3xl font-semibold leading-snug text-white`}>
            Welcome back. Your clinic&apos;s day starts here.
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-teal-100">
            {assurances.map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-teal-200">
          Decision-support platform only. It does not provide autonomous diagnosis.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex w-fit items-center gap-2.5 lg:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800 text-white">
              <Icon name="pulse" className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              MediAI <span className="text-teal-800">Care</span>
            </span>
          </Link>

          <h1 className={`${serif} text-3xl font-semibold text-slate-900`}>
            Sign in
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Use the email or phone number registered with your account.
          </p>

          <form action={action} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-slate-700"
              >
                Email or phone number
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="name@example.com or 0300 1234567"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "login-error" : undefined}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "login-error" : undefined}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3.5 pr-16 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-pressed={show}
                  className="absolute inset-y-0 right-0 rounded-r-lg px-3.5 text-xs font-medium text-slate-500 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div aria-live="polite">
              {error && (
                <p
                  id="login-error"
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            For your security, an account is temporarily locked after several
            failed attempts. Forgotten your password? Please contact your clinic
            administrator.
          </p>

          <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <Link href="/" className="font-medium text-teal-800 hover:text-teal-900">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}