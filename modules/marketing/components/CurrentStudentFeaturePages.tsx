"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type SaleItem = {
  title: string;
  price: string;
  seller: string;
  tag: string;
  description: string;
};

type SubleasePost = {
  type: "Offer" | "Request";
  title: string;
  dateRange: string;
  budget: string;
  contact: string;
  details: string;
};

type CarpoolPost = {
  date: string;
  route: string;
  seats: string;
  contact: string;
  note: string;
};

const TSA_SELLINGS: SaleItem[] = [
  {
    title: "TSA Hoodie",
    price: "$35",
    seller: "TSA Board",
    tag: "Merch",
    description: "Official TSA hoodie. Pickup details will be announced by TSA.",
  },
  {
    title: "TSA Sticker Pack",
    price: "$5",
    seller: "TSA Board",
    tag: "Merch",
    description: "Taiwan and UIUC themed stickers from TSA.",
  },
];

const INITIAL_MARKETPLACE: SaleItem[] = [
  {
    title: "Desk lamp",
    price: "$12",
    seller: "Dummy Seller",
    tag: "Furniture",
    description: "Good for dorm or apartment study desk.",
  },
  {
    title: "Rice cooker",
    price: "$20",
    seller: "Dummy Seller",
    tag: "Kitchen",
    description: "Small rice cooker for one to two people.",
  },
  {
    title: "Monitor",
    price: "$45",
    seller: "Dummy Seller",
    tag: "Electronics",
    description: "24 inch monitor, pickup near County Market.",
  },
];

const INITIAL_SUBLEASES: SubleasePost[] = [
  {
    type: "Offer",
    title: "Summer studio near Green St.",
    dateRange: "May - August",
    budget: "$720 / month",
    contact: "line-id-placeholder",
    details: "Furnished studio, utilities partly included.",
  },
  {
    type: "Request",
    title: "Looking for fall semester room",
    dateRange: "August - December",
    budget: "Up to $850 / month",
    contact: "email@example.com",
    details: "Prefer walking distance to Engineering Quad.",
  },
  {
    type: "Offer",
    title: "Room in 4B2B apartment",
    dateRange: "June - July",
    budget: "$560 / month",
    contact: "line-id-placeholder",
    details: "Female roommate preferred. Close to bus stop.",
  },
];

const INITIAL_CARPOOLS: CarpoolPost[] = [
  {
    date: "2026-08-15",
    route: "ORD to Champaign",
    seats: "2 seats",
    contact: "line-id-placeholder",
    note: "Arriving around noon. Can split gas and toll.",
  },
  {
    date: "2026-08-18",
    route: "Champaign to ORD",
    seats: "1 seat",
    contact: "email@example.com",
    note: "Morning departure preferred.",
  },
  {
    date: "2026-08-20",
    route: "MDW to Champaign",
    seats: "3 seats",
    contact: "line-id-placeholder",
    note: "Flexible after 3 PM.",
  },
];

function getFormValue(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function PageHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="border-b border-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-16">
        <Link
          href="/current-students"
          className="text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
        >
          Back to Current Students
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
          {body}
        </p>
        <p className="mt-4 max-w-3xl rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Demo mode: submissions appear immediately on this page but are not
          saved after refresh.
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={3}
        className="mt-2 w-full resize-none rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
      />
    </label>
  );
}

function SaleCard({
  item,
  pinned = false,
}: {
  item: SaleItem;
  pinned?: boolean;
}) {
  return (
    <article
      className={
        "rounded-md border p-5 " +
        (pinned
          ? "border-neutral-300 bg-neutral-100 text-neutral-900"
          : "border-neutral-200 bg-white text-neutral-900")
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={
              "text-xs font-semibold uppercase tracking-wider " +
              (pinned ? "text-neutral-500" : "text-neutral-500")
            }
          >
            {pinned ? "Pinned · " : ""}
            {item.tag}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
        </div>
        <span className="shrink-0 text-sm font-semibold">{item.price}</span>
      </div>
      <p
        className={
          "mt-3 text-sm leading-6 " +
          (pinned ? "text-neutral-600" : "text-neutral-600")
        }
      >
        {item.description}
      </p>
      <p className="mt-4 text-xs text-neutral-500">
        Contact: {item.seller}
      </p>
    </article>
  );
}

export function MarketplacePage() {
  const [saleItems, setSaleItems] = useState(INITIAL_MARKETPLACE);

  function addSaleItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextItem = {
      title: getFormValue(form, "title"),
      price: getFormValue(form, "price"),
      seller: getFormValue(form, "seller"),
      tag: getFormValue(form, "tag") || "General",
      description: getFormValue(form, "description"),
    };

    if (!nextItem.title || !nextItem.price || !nextItem.seller) return;
    setSaleItems((items) => [nextItem, ...items]);
    event.currentTarget.reset();
  }

  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Marketplace"
        title="二手買賣"
        body="TSA pinned sellings stay at the top, while community listings can grow in the full board below."
      />
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_22rem]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            TSA Sellings Pinned
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {TSA_SELLINGS.map((item) => (
              <SaleCard key={item.title} item={item} pinned />
            ))}
          </div>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Community Listings
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {saleItems.map((item) => (
              <SaleCard
                key={`${item.title}-${item.seller}-${item.price}`}
                item={item}
              />
            ))}
          </div>
        </div>

        <form
          onSubmit={addSaleItem}
          className="h-fit rounded-md border border-neutral-200 bg-neutral-50 p-5"
        >
          <h2 className="text-lg font-semibold text-neutral-900">
            Add selling post
          </h2>
          <div className="mt-5 space-y-4">
            <Field label="Item" name="title" placeholder="Mini fridge" />
            <Field label="Price" name="price" placeholder="$50" />
            <Field label="Seller / Contact" name="seller" placeholder="Line ID" />
            <Field label="Category" name="tag" placeholder="Furniture" />
            <Textarea
              label="Description"
              name="description"
              placeholder="Condition, pickup place, notes"
            />
          </div>
          <button className="mt-5 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700">
            Add listing
          </button>
        </form>
      </section>
    </main>
  );
}

export function SubleasePage() {
  const [subleases, setSubleases] = useState(INITIAL_SUBLEASES);
  const [filter, setFilter] = useState<"All" | "Offer" | "Request">("All");

  const filteredSubleases = useMemo(() => {
    if (filter === "All") return subleases;
    return subleases.filter((post) => post.type === filter);
  }, [filter, subleases]);

  function addSublease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextPost: SubleasePost = {
      type: getFormValue(form, "type") === "Request" ? "Request" : "Offer",
      title: getFormValue(form, "title"),
      dateRange: getFormValue(form, "dateRange"),
      budget: getFormValue(form, "budget"),
      contact: getFormValue(form, "contact"),
      details: getFormValue(form, "details"),
    };

    if (!nextPost.title || !nextPost.dateRange || !nextPost.contact) return;
    setSubleases((posts) => [nextPost, ...posts]);
    event.currentTarget.reset();
  }

  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Sublease"
        title="轉租"
        body="Separate offers and requests so students can scan housing posts without digging through unrelated listings."
      />
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="flex rounded-md border border-neutral-300 bg-white p-1 w-fit">
            {(["All", "Offer", "Request"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={
                  "rounded px-3 py-1.5 text-sm transition " +
                  (filter === item
                    ? "bg-neutral-200 font-medium text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100")
                }
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredSubleases.map((post) => (
              <article
                key={`${post.type}-${post.title}-${post.contact}`}
                className="rounded-md border border-neutral-200 bg-white p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {post.type}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-neutral-900">
                  {post.title}
                </h2>
                <dl className="mt-4 space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between gap-4">
                    <dt>Date</dt>
                    <dd className="font-medium text-neutral-900">
                      {post.dateRange}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Budget</dt>
                    <dd className="font-medium text-neutral-900">{post.budget}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  {post.details}
                </p>
                <p className="mt-4 text-xs text-neutral-500">
                  Contact: {post.contact}
                </p>
              </article>
            ))}
          </div>
        </div>

        <form
          onSubmit={addSublease}
          className="h-fit rounded-md border border-neutral-200 bg-neutral-50 p-5"
        >
          <h2 className="text-lg font-semibold text-neutral-900">
            Add sublease post
          </h2>
          <label className="mt-5 block">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Type
            </span>
            <select
              name="type"
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
            >
              <option>Offer</option>
              <option>Request</option>
            </select>
          </label>
          <div className="mt-4 space-y-4">
            <Field label="Title" name="title" placeholder="Summer room near campus" />
            <Field label="Dates" name="dateRange" placeholder="May - August" />
            <Field label="Budget / Rent" name="budget" placeholder="$750 / month" />
            <Field label="Contact" name="contact" placeholder="Line ID or email" />
            <Textarea
              label="Details"
              name="details"
              placeholder="Location, roommates, utilities, preferences"
            />
          </div>
          <button className="mt-5 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700">
            Add sublease post
          </button>
        </form>
      </section>
    </main>
  );
}

export function CarpoolPage() {
  const [carpools, setCarpools] = useState(INITIAL_CARPOOLS);

  function addCarpool(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextPost = {
      date: getFormValue(form, "date"),
      route: getFormValue(form, "route"),
      seats: getFormValue(form, "seats"),
      contact: getFormValue(form, "contact"),
      note: getFormValue(form, "note"),
    };

    if (!nextPost.date || !nextPost.route || !nextPost.contact) return;
    setCarpools((posts) =>
      [nextPost, ...posts].sort((a, b) => a.date.localeCompare(b.date)),
    );
    event.currentTarget.reset();
  }

  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Carpool"
        title="拼車日期登記"
        body="A date-focused list for airport rides, campus departures, and shared trips."
      />
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_22rem]">
        <div className="overflow-hidden rounded-md border border-neutral-200">
          <div className="grid grid-cols-[8rem_1fr_7rem] gap-4 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <span>Date</span>
            <span>Route</span>
            <span>Seats</span>
          </div>
          {carpools.map((post) => (
            <article
              key={`${post.date}-${post.route}-${post.contact}`}
              className="grid gap-3 border-b border-neutral-100 px-4 py-4 last:border-b-0 sm:grid-cols-[8rem_1fr_7rem]"
            >
              <p className="text-sm font-medium text-neutral-900">{post.date}</p>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  {post.route}
                </h2>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  {post.note}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  Contact: {post.contact}
                </p>
              </div>
              <p className="text-sm text-neutral-700">{post.seats}</p>
            </article>
          ))}
        </div>

        <form
          onSubmit={addCarpool}
          className="h-fit rounded-md border border-neutral-200 bg-neutral-50 p-5"
        >
          <h2 className="text-lg font-semibold text-neutral-900">
            Register carpool date
          </h2>
          <div className="mt-5 space-y-4">
            <Field label="Date" name="date" type="date" />
            <Field label="Route" name="route" placeholder="ORD to Champaign" />
            <Field label="Seats" name="seats" placeholder="2 seats" />
            <Field label="Contact" name="contact" placeholder="Line ID or email" />
            <Textarea
              label="Note"
              name="note"
              placeholder="Time, luggage, price split, pickup point"
            />
          </div>
          <button className="mt-5 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700">
            Register date
          </button>
        </form>
      </section>
    </main>
  );
}
