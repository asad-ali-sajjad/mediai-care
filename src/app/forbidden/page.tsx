import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <h2 className="mt-2 text-xl font-semibold">Access Forbidden</h2>
      <p className="mt-2 text-gray-600">
        You do not have permission to view this page with your current role.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
      >
        Back to Dashboard
      </Link>
    </main>
  );
}