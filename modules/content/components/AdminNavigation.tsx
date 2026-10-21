import Link from "next/link";

export function AdminNavigation() {
  return <nav aria-label="Administration" className="border-b border-neutral-200 bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-4 text-sm"><Link href="/admin" className="font-semibold">TSA / Admin</Link><Link href="/admin" className="text-neutral-600">Overview</Link><Link href="/admin/events" className="text-neutral-600">Events</Link><Link href="/admin?section=home" className="text-neutral-600">Website content</Link><Link href="/admin?section=features" className="text-neutral-600">Features</Link><Link href="/" target="_blank" className="ml-auto font-medium">View website ↗</Link></div></nav>;
}
