import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { hasRole } from "@/core/rbac";
import { getCurrentUser } from "@/core/rbac/server";
import {
  createSubleaseListingAction,
  deleteSubleaseListingAction,
} from "@/modules/listings/server/actions";
import { listSubleaseListings } from "@/modules/listings/server/queries";
import { formatUsd } from "@/modules/listings/lib/money";
import type { SubleaseListing, SubleasePostType } from "@/modules/listings/types";
import { DeleteListingButton } from "./DeleteListingButton";
import {
  Field,
  PageHeader,
  SignInToPost,
  StatusBanner,
  Textarea,
} from "./ui";

type Filter = "all" | SubleasePostType;

function formatDateRange(value: string): string {
  const match = value.match(
    /^(\d{4}-\d{2}-\d{2})\s*[–-]\s*(\d{4}-\d{2}-\d{2})$/,
  );
  if (!match) return value;

  const format = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return `${format(match[1])} – ${format(match[2])}`;
}

function resolveFilter(value: string | undefined): Filter {
  if (value === "offer" || value === "request") return value;
  return "all";
}

export async function SubleasePage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    posted?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const { type, posted, deleted, error } = await searchParams;
  const filter = resolveFilter(type);
  const user = await getCurrentUser();
  const isDirector = user ? hasRole(user.role, "director") : false;

  const listings = await listSubleaseListings(filter).catch((err) => {
    unstable_rethrow(err);
    console.warn("Unable to load sublease listings", err);
    return [] as SubleaseListing[];
  });

  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Sublease"
        title="轉租"
        body="Separate offers and requests so students can scan housing posts without digging through unrelated listings."
      />
      <StatusBanner posted={posted} deleted={deleted} error={error} />
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="flex w-fit rounded-md border border-neutral-300 bg-white p-1">
            {(
              [
                { key: "all", label: "All" },
                { key: "offer", label: "Offer" },
                { key: "request", label: "Request" },
              ] as const
            ).map((item) => (
              <Link
                key={item.key}
                href={
                  item.key === "all"
                    ? "/current-students/sublease"
                    : `/current-students/sublease?type=${item.key}`
                }
                className={
                  "rounded px-3 py-1.5 text-sm transition " +
                  (filter === item.key
                    ? "bg-neutral-200 font-medium text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          {listings.length === 0 ? (
            <p className="mt-6 rounded-md border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500">
              No sublease posts yet.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {listings.map((post) => (
                <article
                  key={post.id}
                  className="rounded-md border border-neutral-200 bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {post.post_type === "offer" ? "Offer" : "Request"}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-neutral-900">
                    {post.title}
                  </h2>
                  <dl className="mt-4 space-y-2 text-sm text-neutral-600">
                    <div className="flex justify-between gap-4">
                      <dt>Date</dt>
                      <dd className="font-medium text-neutral-900">
                        {formatDateRange(post.date_range)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Budget</dt>
                      <dd className="font-medium text-neutral-900">
                        {post.budget ? `${formatUsd(post.budget)} / month` : "—"}
                      </dd>
                    </div>
                  </dl>
                  {post.details && (
                    <p className="mt-4 text-sm leading-6 text-neutral-600">
                      {post.details}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-neutral-500">
                      Contact: {post.contact}
                    </p>
                    {user &&
                      (post.user_id === user.id || isDirector) && (
                        <DeleteListingButton
                          action={deleteSubleaseListingAction}
                          id={post.id}
                        />
                      )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <form
            action={createSubleaseListingAction}
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
                <option value="Offer">Offer</option>
                <option value="Request">Request</option>
              </select>
            </label>
            <div className="mt-4 space-y-4">
              <Field
                label="Title"
                name="title"
                placeholder="Summer room near campus"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Start date"
                  name="start_date"
                  type="date"
                  required
                />
                <Field
                  label="End date"
                  name="end_date"
                  type="date"
                  required
                />
              </div>
              <Field
                label="Budget / Rent (USD per month)"
                name="budget"
                type="number"
                placeholder="750"
                min={0}
                step="0.01"
                inputMode="decimal"
              />
              <Field
                label="Contact"
                name="contact"
                placeholder="Line ID or email"
                required
              />
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
        ) : (
          <SignInToPost next="/current-students/sublease" />
        )}
      </section>
    </main>
  );
}
