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
                  href="/book"
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
              href="/book"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-teal-900 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900"
            >
              Find a doctor
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div className="max-w-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 text-white">
                  <Icon name="pulse" className="h-4 w-4" />
                </span>
                <span className="font-semibold text-slate-900">MediAI Care</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Appointment and decision-support platform for local medical
                centers.
              </p>
            </div>
            <nav aria-label="Footer" className="flex gap-10 text-sm">
              <ul className="space-y-2">
                <li><Link href="/book" className="text-slate-600 hover:text-teal-800">Book appointment</Link></li>
                <li><Link href="/assistant" className="text-slate-600 hover:text-teal-800">Triage assistant</Link></li>
                <li><Link href="/login" className="text-slate-600 hover:text-teal-800">Sign in</Link></li>
              </ul>
              <ul className="space-y-2">
                <li><Link href="/doctor" className="text-slate-600 hover:text-teal-800">Doctor portal</Link></li>
                <li><Link href="/reception" className="text-slate-600 hover:text-teal-800">Reception</Link></li>
                <li><Link href="/patient" className="text-slate-600 hover:text-teal-800">Patient portal</Link></li>
              </ul>
            </nav>
          </div>
          <div className="mt-8 space-y-2 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
            <p>
              <strong className="font-semibold text-slate-700">In an emergency</strong>, do not
              use this website. Call your local emergency number (for example, Rescue 1122) or go to
              the nearest hospital.
            </p>
            <p>
              © 2026 MediAI Care. Decision-support platform only; it does not provide
              autonomous diagnosis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}