"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOutAction } from "@/modules/auth/server/actions";
import { hasRole } from "@/core/rbac";
import type { CurrentUser } from "@/core/types";

export function UserMenu({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initial = (user.email?.[0] ?? "?").toUpperCase();
  const isMember = hasRole(user.role, "member");
  const isDirector = hasRole(user.role, "director");

  function close() {
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
        className={
          "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white transition " +
          (open
            ? "bg-neutral-700 ring-2 ring-neutral-300"
            : "bg-neutral-900 hover:bg-neutral-700")
        }
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg ring-1 ring-black/5"
        >
          <div className="border-b border-neutral-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-neutral-900">
              {user.email ?? "Account"}
            </p>
            <span className="mt-1.5 inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-600">
              {user.role}
            </span>
          </div>

          <div className="py-1">
            <MenuLink href="/account" onClick={close}>
              My account
            </MenuLink>
            {isMember && (
              <MenuLink href="/members" onClick={close}>
                Members area
              </MenuLink>
            )}
            {isDirector && (
              <MenuLink href="/admin" onClick={close}>
                Admin dashboard
              </MenuLink>
            )}
          </div>

          <div className="border-t border-neutral-100 py-1">
            <form action={signOutAction}>
              <button
                type="submit"
                role="menuitem"
                className="block w-full px-4 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="block px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
    >
      {children}
    </Link>
  );
}
