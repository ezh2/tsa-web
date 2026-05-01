"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserMenu } from "./UserMenu";
import type { CurrentUser } from "@/core/types";
import tsaLogo from "../../images/TSA_bear.png";

const STUDENT_LINKS = [
  { label: "Current Students", href: "/current-students" },
  { label: "Incoming Students", href: "/incoming-students" },
];

const MEMBERSHIP_LINKS = [
  { label: "Overview", href: "/membership" },
  { label: "Merch", href: "/membership/merch" },
];

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Students", href: "/students", children: STUDENT_LINKS },
  { label: "Membership", href: "/membership", children: MEMBERSHIP_LINKS },
];

export function SiteHeader({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function updateScrolled() {
      setScrolled(window.scrollY > 12);
    }

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={
        "sticky top-0 z-40 w-full transition-all duration-300 " +
        (scrolled
          ? "border-b border-white/10 bg-black/72 shadow-lg shadow-black/20 backdrop-blur-2xl"
          : "border-b border-black bg-black")
      }
    >
      <div className="mx-auto flex h-24 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold tracking-tight text-white"
        >
          <Image
            src={tsaLogo}
            alt="UIUC TSA logo"
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 object-contain"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-base">UIUC TSA</span>
            <span className="hidden text-xs font-normal text-neutral-500 sm:inline">
              Taiwanese Student Association
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.12)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl sm:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              isActive(item.href) ||
              item.children?.some((child) => isActive(child.href));

            if (item.children) {
              return (
                <div key={item.href} className="group relative">
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    aria-haspopup="menu"
                    className={
                      "rounded-full px-4 py-2 text-sm transition " +
                      (active
                        ? "bg-[#f5f5f7] font-semibold text-black shadow-sm"
                        : "text-neutral-300 hover:bg-[rgba(255,255,255,0.12)] hover:text-white")
                    }
                  >
                    {item.label}
                  </button>
                  <div
                    role="menu"
                    className="invisible absolute left-0 top-full z-50 min-w-44 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
                  >
                    <div className="rounded-2xl border border-[rgba(255,255,255,0.16)] bg-[rgba(23,23,23,0.72)] p-2 shadow-lg shadow-black/20 backdrop-blur-2xl">
                      {item.children.map((child) => {
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            aria-current={childActive ? "page" : undefined}
                            className={
                              "block border-l px-3 py-2 text-sm transition " +
                              (childActive
                                ? "border-white font-semibold text-white"
                                : "border-transparent text-neutral-300 hover:border-white/40 hover:text-white")
                            }
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-full px-4 py-2 text-sm transition " +
                  (active
                    ? "bg-[#f5f5f7] font-semibold text-black shadow-sm"
                    : "text-neutral-300 hover:bg-[rgba(255,255,255,0.12)] hover:text-white")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-[rgba(255,255,255,0.12)] hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/login?mode=signup"
                className="rounded-full border border-[rgba(255,255,255,0.22)] px-4 py-2 text-sm font-semibold text-white hover:bg-[rgba(255,255,255,0.12)]"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-[rgba(255,255,255,0.12)] sm:hidden"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-black sm:hidden"
        >
          <nav className="flex flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                return (
                  <div key={item.href} className="flex flex-col gap-1">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={
                        "rounded-xl px-4 py-2.5 text-sm transition " +
                        (isActive(item.href)
                          ? "bg-[#f5f5f7] font-semibold text-black"
                          : "text-neutral-200 hover:bg-[rgba(255,255,255,0.12)]")
                      }
                    >
                      {item.label}
                    </Link>
                    <div className="ml-3 flex flex-col gap-1 border-l border-white/10 pl-3">
                      {item.children.map((child) => {
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeMenu}
                            aria-current={childActive ? "page" : undefined}
                            className={
                              "rounded-xl px-4 py-2 text-sm transition " +
                              (childActive
                                ? "bg-[#f5f5f7] font-semibold text-black"
                                : "text-neutral-300 hover:bg-[rgba(255,255,255,0.12)]")
                            }
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={
                    "rounded-xl px-4 py-2.5 text-sm transition " +
                    (active
                      ? "bg-[#f5f5f7] font-semibold text-black"
                      : "text-neutral-200 hover:bg-[rgba(255,255,255,0.12)]")
                  }
                >
                  {item.label}
                </Link>
              );
            })}

            {!user && (
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-full px-4 py-2 text-center text-sm font-medium text-neutral-200 hover:bg-[rgba(255,255,255,0.12)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/login?mode=signup"
                  onClick={closeMenu}
                  className="rounded-full border border-[rgba(255,255,255,0.22)] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[rgba(255,255,255,0.12)]"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
