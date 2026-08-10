import { unstable_rethrow } from "next/navigation";
import { hasRole } from "@/core/rbac";
import { getCurrentUser } from "@/core/rbac/server";
import {
  createCarpoolListingAction,
  deleteCarpoolListingAction,
} from "@/modules/listings/server/actions";
import { listCarpoolListings } from "@/modules/listings/server/queries";
import type { CarpoolListing } from "@/modules/listings/types";
import { DeleteListingButton } from "./DeleteListingButton";
import {
  Field,
  PageHeader,
  SignInToPost,
  StatusBanner,
  Textarea,
} from "./ui";

export async function CarpoolPage({
  searchParams,
}: {
  searchParams: Promise<{ posted?: string; deleted?: string; error?: string }>;
}) {
  const { posted, deleted, error } = await searchParams;
  const user = await getCurrentUser();
  const isDirector = user ? hasRole(user.role, "director") : false;

  const listings = await listCarpoolListings().catch((err) => {
    unstable_rethrow(err);
    console.warn("Unable to load carpool listings", err);
    return [] as CarpoolListing[];
  });

  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Carpool"
        title="拼車日期登記"
        body="A date-focused list for airport rides, campus departures, and shared trips."
      />
      <StatusBanner posted={posted} deleted={deleted} error={error} />
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_22rem]">
        <div className="overflow-hidden rounded-md border border-neutral-200">
          <div className="grid grid-cols-[8rem_1fr_7rem] gap-4 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <span>Date</span>
            <span>Route</span>
            <span>Seats</span>
          </div>
          {listings.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-neutral-500">
              No carpool dates registered yet.
            </p>
          ) : (
            listings.map((post) => (
              <article
                key={post.id}
                className="grid gap-3 border-b border-neutral-100 px-4 py-4 last:border-b-0 sm:grid-cols-[8rem_1fr_7rem]"
              >
                <p className="text-sm font-medium text-neutral-900">
                  {post.trip_date}
                </p>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900">
                    {post.route}
                  </h2>
                  {post.note && (
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      {post.note}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-neutral-500">
                      Contact: {post.contact}
                    </p>
                    {user &&
                      (post.user_id === user.id || isDirector) && (
                        <DeleteListingButton
                          action={deleteCarpoolListingAction}
                          id={post.id}
                        />
                      )}
                  </div>
                </div>
                <p className="text-sm text-neutral-700">{post.seats || "—"}</p>
              </article>
            ))
          )}
        </div>

        {user ? (
          <form
            action={createCarpoolListingAction}
            className="h-fit rounded-md border border-neutral-200 bg-neutral-50 p-5"
          >
            <h2 className="text-lg font-semibold text-neutral-900">
              Register carpool date
            </h2>
            <div className="mt-5 space-y-4">
              <Field label="Date" name="date" type="date" required />
              <Field
                label="Route"
                name="route"
                placeholder="ORD to Champaign"
                required
              />
              <Field label="Seats" name="seats" placeholder="2 seats" />
              <Field
                label="Contact"
                name="contact"
                placeholder="Line ID or email"
                required
              />
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
        ) : (
          <SignInToPost next="/current-students/carpool" />
        )}
      </section>
    </main>
  );
}
