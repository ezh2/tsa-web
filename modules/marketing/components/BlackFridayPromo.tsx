"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import blackFridayDeals from "../../../images/merch/2026 Black Friday/black-friday-2.png";

const TSA_INSTAGRAM_URL = "https://www.instagram.com/tsa_uiuc/";
const POPUP_SESSION_KEY = "tsa-black-friday-2026-popup-shown";
const PURCHASE_HINT = "To purchase, contact TSA on Instagram at @tsa_uiuc";

function isSaleActive(now: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(now)
    .reduce<Record<string, number>>((values, part) => {
      if (part.type !== "literal") values[part.type] = Number(part.value);
      return values;
    }, {});

  const chicagoTime = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const saleStarts = Date.UTC(2026, 10, 1, 0, 0, 0);
  const saleEnds = Date.UTC(2026, 10, 21, 0, 1, 0);

  return chicagoTime >= saleStarts && chicagoTime < saleEnds;
}

function useBlackFridaySale() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const updateSaleState = () => setActive(isSaleActive(new Date()));
    updateSaleState();
    const interval = window.setInterval(updateSaleState, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  return active;
}

export function BlackFridayOfferPrice({
  regularPrice,
  salePrice,
  featured = false,
}: {
  regularPrice: string;
  salePrice: string;
  featured?: boolean;
}) {
  const active = useBlackFridaySale();

  if (!active) return <>{regularPrice}</>;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span>{salePrice}</span>
      <span
        className={
          "text-sm line-through " +
          (featured ? "text-white/55" : "text-neutral-400")
        }
      >
        {regularPrice}
      </span>
    </span>
  );
}

export function MerchPricingCards() {
  const active = useBlackFridaySale();

  return (
    <div className="mt-6 grid gap-3 text-sm text-neutral-700 sm:grid-cols-3 lg:grid-cols-1">
      <article className="rounded-md border border-neutral-200 bg-white p-4">
        <p className="font-semibold text-neutral-900">
          {active ? "$42.99 Bundle" : "$49.99 Bundle"}
        </p>
        {active && (
          <p className="text-xs text-neutral-500 line-through">$49.99</p>
        )}
        <p className="mt-1 text-neutral-500">Membership + one T-shirt</p>
        <p className="mt-2 text-xs leading-5 text-neutral-500">
          Bundle pricing applies to one T-shirt only and cannot be combined
          with other event discounts.
        </p>
        <div className="mt-3">
          <PurchaseButton label="Buy bundle" />
        </div>
      </article>

      <article className="rounded-md border border-neutral-200 bg-white p-4">
        <p className="font-semibold text-neutral-900">$29.99 Membership</p>
        <p className="mt-1 text-neutral-500">Lifetime, non-transferable</p>
      </article>

      <article className="rounded-md border border-neutral-200 bg-white p-4">
        <p className="font-semibold text-neutral-900">
          {active ? "$23.00 T-shirt" : "$32.99 T-shirt"}
        </p>
        {active && (
          <p className="text-xs text-neutral-500 line-through">$32.99</p>
        )}
        <p className="mt-1 text-neutral-500">Semester merch rollout</p>
        <div className="mt-3">
          <PurchaseButton label="Buy T-shirt" />
        </div>
      </article>
    </div>
  );
}

function PurchaseButton({
  label,
  sale = false,
}: {
  label: string;
  sale?: boolean;
}) {
  return (
    <span className="group relative inline-flex w-full">
      <Link
        href={TSA_INSTAGRAM_URL}
        aria-label={`${label}. ${PURCHASE_HINT}`}
        title={PURCHASE_HINT}
        rel="noopener noreferrer"
        target="_blank"
        className={
          "inline-flex min-h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition " +
          (sale
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-neutral-900 hover:bg-neutral-700")
        }
      >
        {label}
      </Link>
      <span
        role="tooltip"
        className="invisible absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md bg-neutral-950 px-3 py-2 text-center text-xs font-normal leading-5 text-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        To purchase, contact TSA on Instagram at{" "}
        <Link
          href={TSA_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          @tsa_uiuc
        </Link>
      </span>
    </span>
  );
}

export function BlackFridaySalePopup() {
  const active = useBlackFridaySale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!active || window.sessionStorage.getItem(POPUP_SESSION_KEY)) return;
    window.sessionStorage.setItem(POPUP_SESSION_KEY, "true");
    setOpen(true);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (!active || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
      onClick={() => setOpen(false)}
    >
      <section
        aria-labelledby="black-friday-title"
        aria-modal="true"
        className="relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-md bg-neutral-950 p-3 text-white shadow-2xl"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close Black Friday sale popup"
          onClick={() => setOpen(false)}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-2xl text-white transition hover:bg-black"
        >
          ×
        </button>
        <h2 id="black-friday-title" className="sr-only">
          TSA UIUC Black Friday merch deals
        </h2>
        <Image
          src={blackFridayDeals}
          alt="TSA merch Black Friday deals: $42.99 for the merch and VIP bundle, and $23 for merch"
          className="mx-auto max-h-[70vh] w-auto object-contain"
          sizes="(max-width: 540px) 94vw, 500px"
          priority
        />
        <div className="mt-3">
          <PurchaseButton label="Shop the Black Friday sale" sale />
        </div>
      </section>
    </div>
  );
}
