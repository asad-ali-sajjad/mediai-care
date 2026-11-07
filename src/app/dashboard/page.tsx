import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Icon, type IconName } from "@/components/landing/Icon";

const serif = "font-[family-name:var(--font-serif)]";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Platform administrator",
  CLINIC_ADMIN: "Clinic administrator",
  RECEPTIONIST: "Receptionist",
  DOCTOR: "Doctor",
  PATIENT: "Patient",
};

// Mirrors the RBAC matrix in the README.
const workspaces: {
  href: string;
  title: string;
  text: string;
  icon: IconName;
  roles: string[];
}[] = [
  {
    href: "/super",
    title: "Platform management",
    text: "Manage clinics and platform-wide settings.",
    icon: "shield",
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/admin",
    title: "Clinic admin",
    text: "Manage staff, roles and clinic settings.",
    icon: "users",
    roles: ["SUPER_ADMIN", "CLINIC_ADMIN"],
  },
  {
    href: "/reception",
    title: "Reception & queue",
    text: "Register walk-ins and manage today's queue.",
    icon: "clipboard",
    roles: ["SUPER_ADMIN", "CLINIC_ADMIN", "RECEPTIONIST"],
  },
  {
    href: "/doctor",
    title: "Clinical workspace",
    text: "Schedules, patient history and consultation notes.",
    icon: "pulse",
    roles: ["DOCTOR"],
  },
  {
    href: "/patient",
    title: "Patient portal",
    text: "Your appointments, visits and files.",
    icon: "calendar",
    roles: ["PATIENT"],
  },
];

function initials(name?: string | null, fallback?: string | null) {
  const source = (name || fallback || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;
  const role = String(user.role ?? "");
  const roleLabel = roleLabels[role] ?? "Staff";
  const available = workspaces.filter((w) => w.roles.includes(role));

  const details: [string, string][] = [
    ["Name", user.name || "Not set"],
    ["Email", user.email || "Not set"],
    ["Role", roleLabel],
    ["Clinic", user.clinicId ? String(user.clinicId) : "All clinics"],
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800 text-white">
              <Icon name="pulse" className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              MediAI <span className="text-teal-800">Care</span>
            </span>
          </Link>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-800 text-lg font-semibold text-white"
          >
            {initials(user.name, user.email)}
          </span>
          <div className="min-w-0">
            <h1 className={`${serif} truncate text-3xl font-semibold text-slate-900`}>
              Welcome{user.name ? `, ${user.name}` : ""}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Signed in as {roleLabel.toLowerCase()}.
            </p>
          </div>
        </div>

        <section aria-labelledby="workspaces" className="mt-12">
          <h2 id="workspaces" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Your workspaces
          </h2>

          {available.length > 0 ? (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {available.map((w) => (
                <li key={w.href}>
                  <Link
                    href={w.href}
                    className="group flex h-full gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                      <Icon name={w.icon} className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-slate-900">{w.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                        {w.text}
                      </span>
                    </span>
                    <Icon
                      name="arrow"
                      className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-teal-800"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              No workspaces are available for your account yet. Please contact
              your clinic administrator.
            </p>
          )}
        </section>

        <section aria-labelledby="account" className="mt-12">
          <h2 id="account" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Account
          </h2>
          <dl className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {details.map(([label, value]) => (
              <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="break-all text-sm font-medium text-slate-900 sm:col-span-2">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Your access is limited to your role. Sign-in activity is recorded in
            a secure audit log.
          </p>
        </section>
      </main>
    </div>
  );
}