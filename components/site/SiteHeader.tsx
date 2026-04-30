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

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Students", href: "/students", children: STUDENT_LINKS },
  { label: "Membership", href: "/membership" },
];

export function SiteHeader({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function updateScrolled() {
      setScrolled(window.scrollY > 12);
    }

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

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
                    <div className="rounded-2xl border border-[rgba(255,255,255,0.16)] bg-neutral-950/95 p-1.5 shadow-lg backdrop-blur-xl">
                      {item.children.map((child) => {
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            aria-current={childActive ? "page" : undefined}
                            className={
                              "block rounded-xl px-3 py-2 text-sm transition " +
                              (childActive
                                ? "bg-[#f5f5f7] font-semibold text-black"
                                : "text-neutral-300 hover:bg-[rgba(255,255,255,0.12)] hover:text-white")
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
            <>
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
            </>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/10 bg-black px-4 py-3 sm:hidden">
        <div className="flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.12)] p-1.5">
          {NAV_ITEMS.flatMap((item) => item.children ?? item).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "shrink-0 rounded-full px-3 py-1 text-sm " +
                  (active
                    ? "bg-[#f5f5f7] font-semibold text-black"
                    : "text-neutral-300")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
