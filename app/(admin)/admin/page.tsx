import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/core/rbac/server";

export const metadata: Metadata = {
  title: "Admin",
};

const TILES = [
  {
    href: "/admin/events",
    title: "Events",
    body: "Create new events and review what's scheduled.",
  },
  {
    href: "/admin/orders",
    title: "Orders",
    body: "Membership and merch payments, with T-shirt sizes for pickup.",
  },
];

export default async function AdminHomePage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Director
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
          Admin dashboard
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Manage UIUC TSA events and operations from here.
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

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Tools
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400 hover:shadow-sm"
            >
              <h3 className="text-lg font-semibold text-neutral-900 group-hover:underline">
                {tile.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">{tile.body}</p>
              <span className="mt-4 inline-block text-sm font-medium text-neutral-900">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
