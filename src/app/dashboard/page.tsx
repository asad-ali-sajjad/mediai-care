import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;

  return (
    <main className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="rounded border bg-gray-50 p-4">
        <h2 className="font-semibold text-gray-700">User Session Details</h2>
        <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              clinicId: user.clinicId,
            },
            null,
            2
          )}
        </pre>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button className="rounded border bg-white px-4 py-2 font-medium hover:bg-gray-50">
          Sign out
        </button>
      </form>
    </main>
  );
}