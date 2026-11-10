import Link from "next/link";
import { Icon } from "@/components/landing/Icon";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { BookingPreview } from "@/components/landing/BookingPreview";
import { RoleTabs } from "@/components/landing/RoleTabs";
import { Faq } from "@/components/landing/Faq";

const serif = "font-[family-name:var(--font-serif)]";

const trust = [
  {
    icon: "lock" as const,
    title: "Separate clinic records",
    text: "Each clinic's data is isolated at the database level.",
  },
  {
    icon: "calendar" as const,
    title: "No double bookings",
    text: "Overlapping appointments are rejected by the database itself.",
  },
  {
    icon: "file" as const,
    title: "Tamper-proof audit trail",
    text: "Security records are append-only and cannot be edited.",
  },
  {
    icon: "eye" as const,
    title: "Clinician-reviewed AI",
    text: "AI supports your doctor. It never diagnoses on its own.",
  },
];

const steps = [
  {
    n: "1",
    title: "Choose a clinic and doctor",
    text: "Browse doctors, see their schedules and pick a time that suits you.",
  },
  {
    n: "2",
    title: "Confirm your appointment",
    text: "Receive a printable ticket with your slot, doctor and clinic details.",
  },
  {
    n: "3",
    title: "Visit with less waiting",
    text: "Reception checks you in and your doctor sees your history in one place.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
                <Icon name="shield" className="h-3.5 w-3.5" />
                Multi-clinic scheduling &amp; decision support
              </p>
              <h1
                className={`${serif} text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl`}
              >
                Care starts with a clinic that runs smoothly.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                Book appointments online, manage walk-in queues at the front
                desk, and give doctors the information they need, all in one
                secure platform built for local medical centers.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/doctors"
                  className="rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                >
                  Book an appointment
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                >
                  Staff &amp; patient sign in
                </Link>
              </div>
              <ul className="mt-8 space-y-2 text-sm text-slate-600">
                {[
                  "One patient account across participating clinics",
                  "Email or phone number sign in",
                  "Your records stay private to each clinic",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4 text-teal-700" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <BookingPreview />
          </div>
        </section>

        {/* Trust strip */}
        <section aria-label="Safety and reliability" className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t) => (
              <div key={t.title} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                  <Icon name={t.icon} className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{t.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
          <div className="max-w-2xl">
            <h2 className={`${serif} text-3xl font-semibold text-slate-900`}>
              How a visit works
            </h2>
            <p className="mt-3 text-slate-600">
              Simple for patients, predictable for the clinic.
            </p>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-800 text-sm font-semibold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Roles */}
        <section id="roles" className="scroll-mt-20 border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className={`${serif} text-3xl font-semibold text-slate-900`}>
                Built for everyone in the clinic
              </h2>
              <p className="mt-3 text-slate-600">
                Each role sees only what it needs, nothing more.
              </p>
            </div>
            <RoleTabs />
          </div>
        </section>

        {/* AI */}
        <section id="ai-support" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className={`${serif} text-3xl font-semibold text-slate-900`}>
                AI that supports your doctor, not replaces them
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Skin-lesion screening is designed as a second opinion for
                clinicians. Images are checked for quality first, results show
                where the model focused, and uncertain cases are routed to a
                doctor for review.
              </p>
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Decision-support only. Results are not a diagnosis and must be
                reviewed by a qualified clinician.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                ["Image quality check", "Blurry or poorly lit photos are flagged before analysis."],
                ["Visual explanation", "Attention maps show which area influenced the result."],
                ["Uncertainty handling", "Low-confidence cases are sent to a doctor instead of guessed."],
                ["Clinician review queue", "Every result can be confirmed or overridden by your doctor."],
              ].map(([title, text]) => (
                <li
                  key={title}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className={`${serif} text-center text-3xl font-semibold text-slate-900`}>
              Common questions
            </h2>
            <Faq />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-teal-900">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
            <div>
              <h2 className={`${serif} text-2xl font-semibold text-white sm:text-3xl`}>
                Ready to book your visit?
              </h2>
              <p className="mt-2 text-teal-100">
                Choose a doctor and a time that works for you.
              </p>
            </div>
            <Link
              href="/doctors"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-teal-900 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900"
            >
              Find a doctor
            </Link>
          </div>
        </section>
      </main>

      {/* Upgraded Modern Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
          {/* Main Footer Grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {/* Brand & System Status */}
            <div className="space-y-4 lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
                  <Icon name="pulse" className="h-5 w-5" />
                </span>
                <span className="text-xl font-bold tracking-tight text-white">
                  MediAI <span className="text-teal-400">Care</span>
                </span>
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                Multi-clinic management and clinician decision-support platform.
                Streamlining patient intake, walk-in queues, and consultation workflows.
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/80 px-3.5 py-1.5 text-xs text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>All Clinic Systems Operational</span>
              </div>
            </div>

            {/* Column 1: Patient Care */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Patient Care
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/doctors" className="transition-colors hover:text-teal-400">
                    Find &amp; Book Doctor
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition-colors hover:text-teal-400">
                    Patient Portal
                  </Link>
                </li>
                <li>
                  <Link href="/assistant" className="transition-colors hover:text-teal-400">
                    Triage Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="transition-colors hover:text-teal-400">
                    Account Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Staff Workspaces */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Staff Workspaces
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/doctor" className="transition-colors hover:text-teal-400">
                    Doctor Workspace
                  </Link>
                </li>
                <li>
                  <Link href="/reception" className="transition-colors hover:text-teal-400">
                    Reception &amp; Queue
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="transition-colors hover:text-teal-400">
                    Clinic Management
                  </Link>
                </li>
                <li>
                  <Link href="/super" className="transition-colors hover:text-teal-400">
                    Platform Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Security & Trust */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Security &amp; Trust
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex items-center gap-2 text-slate-400">
                  <Icon name="lock" className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Isolated Clinic DBs</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Icon name="file" className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Audit Trail Logging</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Icon name="eye" className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Clinician Review Queue</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Icon name="shield" className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Role-Based Access</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Emergency Notice Card */}
          <div className="mt-12 rounded-xl border border-rose-900/50 bg-rose-950/30 p-4 text-xs text-rose-200">
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-600 font-bold text-white text-[10px]">
                !
              </span>
              <p className="leading-relaxed">
                <strong className="font-semibold text-rose-100">Medical Emergency Disclaimer:</strong> If you are experiencing a medical emergency, severe symptoms, or acute pain, do not use this website. Immediately call your local emergency hotline (e.g., <span className="font-semibold underline">Rescue 1122</span>) or proceed directly to the nearest hospital emergency department.
              </p>
            </div>
          </div>

          {/* Legal & Copyright Bottom Bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
            <p>© 2026 MediAI Care. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Decision-support platform only — does not provide autonomous medical diagnosis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}