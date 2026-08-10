import { unstable_rethrow } from "next/navigation";
import { hasRole } from "@/core/rbac";
import { getCurrentUser } from "@/core/rbac/server";
import {
  createMarketplaceListingAction,
  deleteMarketplaceListingAction,
} from "@/modules/listings/server/actions";
import { listMarketplaceListings } from "@/modules/listings/server/queries";
import { formatUsd } from "@/modules/listings/lib/money";
import type { MarketplaceListing } from "@/modules/listings/types";
import { DeleteListingButton } from "./DeleteListingButton";
import {
  Field,
  PageHeader,
  SignInToPost,
  StatusBanner,
  Textarea,
} from "./ui";

const TSA_SELLINGS = [
  {
    title: "TSA Hoodie",
    price: "35",
    contact: "TSA Board",
    tag: "Merch",
    description:
      "Official TSA hoodie. Pickup details will be announced by TSA.",
  },
  {
    title: "TSA Sticker Pack",
    price: "5",
    contact: "TSA Board",
    tag: "Merch",
    description: "Taiwan and UIUC themed stickers from TSA.",
  },
] as const;

function SaleCard({
  item,
  pinned = false,
  canDelete = false,
}: {
  item: {
    id?: string;
    title: string;
    price: string;
    contact: string;
    tag: string;
    description: string;
  };
  pinned?: boolean;
  canDelete?: boolean;
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
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {pinned ? "Pinned · " : ""}
            {item.tag}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
        </div>
        <span className="shrink-0 text-sm font-semibold">
          {formatUsd(item.price)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        {item.description}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">Contact: {item.contact}</p>
        {canDelete && item.id && (
          <DeleteListingButton
            action={deleteMarketplaceListingAction}
            id={item.id}
          />
        )}
      </div>
    </article>
  );
}

export async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ posted?: string; deleted?: string; error?: string }>;
}) {
  const { posted, deleted, error } = await searchParams;
  const user = await getCurrentUser();
  const isDirector = user ? hasRole(user.role, "director") : false;

  const listings = await listMarketplaceListings().catch((err) => {
    unstable_rethrow(err);
    console.warn("Unable to load marketplace listings", err);
    return [] as MarketplaceListing[];
  });

  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Marketplace"
        title="二手買賣"
        body="TSA pinned sellings stay at the top, while community listings can grow in the full board below."
      />
      <StatusBanner posted={posted} deleted={deleted} error={error} />
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
          {listings.length === 0 ? (
            <p className="mt-4 rounded-md border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500">
              No community listings yet. Be the first to post.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {listings.map((item) => (
                <SaleCard
                  key={item.id}
                  item={item}
                  canDelete={
                    !!user && (item.user_id === user.id || isDirector)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {user ? (
          <form
            action={createMarketplaceListingAction}
            className="h-fit rounded-md border border-neutral-200 bg-neutral-50 p-5"
          >
            <h2 className="text-lg font-semibold text-neutral-900">
              Add selling post
            </h2>
            <div className="mt-5 space-y-4">
              <Field label="Item" name="title" placeholder="Mini fridge" required />
              <Field
                label="Price (USD)"
                name="price"
                type="number"
                placeholder="50"
                required
                min={0}
                step="0.01"
                inputMode="decimal"
              />
              <Field
                label="Seller / Contact"
                name="seller"
                placeholder="Line ID"
                required
              />
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
        ) : (
          <SignInToPost next="/current-students/marketplace" />
        )}
      </section>
    </main>
  );
}
