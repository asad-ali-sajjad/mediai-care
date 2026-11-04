import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/30">
              M
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              MediAI <span className="text-indigo-400">Care</span>
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800"
            >
              Sign In
            </Link>
            <Link
              href="/book"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-600/20 transition-all"
            >
              Book Appointment
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Multi-Clinic Platform & AI Decision Support
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Next-Gen Clinic Operations & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI Telemedicine</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-8">
            Empowering local clinics with multi-tenant online scheduling, front-desk walk-in token queues, and calibrated human-in-the-loop AI skin-lesion risk screening.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              Explore Doctors
            </Link>
            <Link
              href="/assistant"
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Triage Assistant
            </Link>
          </div>
        </section>

        {/* System Roles Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Role-Based Ecosystem</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                👨‍⚕️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Doctor Workspace</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Manage weekly availability, approve leaves, review patient histories, write consultation notes, and inspect AI screening reports.
              </p>
              <Link href="/doctor" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                Doctor Portal →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">
                📋
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Front Desk & Walk-Ins</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Register walk-in patients, issue atomic daily token queue numbers, collect consultation fees, and control live queue displays.
              </p>
              <Link href="/reception" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                Reception Counter →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                🧪
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Decision Support</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Upload skin lesion images for quality-gated risk assessment, Grad-CAM attention maps, and uncertainty-based clinician routing.
              </p>
              <Link href="/patient/skin" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                Skin Screening →
              </Link>
            </div>
          </div>
        </section>

        {/* Core Architecture Badges */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Monorepo Tech Stack</h3>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-6">
            Built on Next.js 15 App Router, TypeScript, Prisma ORM, Supabase PostgreSQL, and FastAPI PyTorch microservices.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-medium text-slate-300">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Next.js 15 (App Router)</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">TypeScript</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Prisma 6 ORM</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Supabase PostgreSQL</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Auth.js v5</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">FastAPI & PyTorch</span>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© 2026 MediAI Care. Decision-support platform only. Autonomous diagnosis prohibited.</p>
      </footer>
    </div>
  );
}