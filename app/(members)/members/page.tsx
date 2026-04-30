import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/core/rbac/server";

export const metadata: Metadata = {
  title: "Members",
};

export default async function MembersHomePage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Members
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
          Members area
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Welcome back. This area is for verified UIUC TSA members.
        </p>
      </header>

      <section className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-neutral-500">Signed in as</span>
          <span className="truncate font-medium text-neutral-900">
            {user?.email ?? "—"}
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-4">
          <span className="text-neutral-500">Role</span>
          <span className="font-medium text-neutral-900">{user?.role}</span>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          What you can do
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
          <li>
            ·{" "}
            <Link href="/events" className="underline hover:text-neutral-900">
              Browse events and RSVP
            </Link>
          </li>
          <li>· More members-only tools coming soon.</li>
        </ul>
      </section>
    </main>
  );
}
