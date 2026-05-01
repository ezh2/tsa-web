import Image from "next/image";
import Link from "next/link";
import merchModelOne from "../../../images/merch/Merch_Model_1.png";
import merchModelTwo from "../../../images/merch/Merch_Model_2.png";
import rawMerch from "../../../images/merch/Raw Merch.png";

const PARTNERS = [
  {
    category: "Restaurant",
    name: "Golden Harbor 漁滿樓",
    offer: "5% off of all purchases",
    href: "https://goo.gl/maps/",
  },
  {
    category: "Restaurant",
    name: "PHO Noodle Station",
    offer: "10% off on purchases above $15, except lunch special",
    href: "https://goo.gl/maps/",
  },
  {
    category: "Restaurant",
    name: "Paris Super",
    offer: "10% off all purchases above $15 pre-tax",
    href: "https://goo.gl/maps/",
  },
  {
    category: "Beverages",
    name: "HAPPYLEMON",
    offer: "10% off on all purchases",
    href: "https://www.google.com/maps",
  },
  {
    category: "Groceries",
    name: "Weee",
    offer: "To be announced",
    href: "https://www.sayweee.com/",
  },
];

const MEMBERSHIP_FEATURES = [
  "Lifetime TSA membership",
  "Non-transferable membership holder benefits",
  "Partner store discounts",
  "Membership card and Line Announcement System enrollment",
];

const PRICING_PLANS = [
  {
    name: "Bundle",
    price: "$47.99",
    note: "Best value",
    body: "TSA membership plus T-shirt Merch Bundle",
    featured: true,
  },
  {
    name: "TSA Membership",
    price: "$29.99",
    note: "Lifetime, non-transferable",
    body: "Lifetime access to TSA membership benefits, partner discounts, card verification, and announcements for the registered member.",
    featured: false,
  },
];

export function MembershipPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Membership
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
            UIUC TSA Membership
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
            Join TSA to support Taiwanese community programming at UIUC and get
            access to lifetime member benefits, partner discounts, merch
            announcements, and the official Line Announcement System.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/membership/merch"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              View merch
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_26rem] sm:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Partnerships
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              Partner Discounts
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">
              TSA members can use these partner discounts at participating local
              restaurants, shops, and services.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {PARTNERS.map((partner) => (
                <article
                  key={partner.name}
                  className="rounded-md border border-neutral-200 bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {partner.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                    {partner.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {partner.offer}
                  </p>
                  <Link
                    href={partner.href}
                    className="mt-4 inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4"
                  >
                    Location
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-md border border-neutral-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Explore our pricing plan
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              Pricing
            </h2>
            <div className="mt-6 grid gap-4">
              {PRICING_PLANS.map((plan) => (
                <article
                  key={plan.name}
                  className={
                    "rounded-md border p-5 " +
                    (plan.featured
                      ? "border-neutral-900 bg-neutral-900 !text-white"
                      : "border-neutral-200 bg-white text-neutral-900")
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className={
                          "text-lg font-semibold " +
                          (plan.featured ? "!text-white" : "text-neutral-900")
                        }
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={
                          "mt-1 text-xs font-medium " +
                          (plan.featured ? "!text-white/65" : "text-neutral-500")
                        }
                      >
                        {plan.note}
                      </p>
                    </div>
                    <p
                      className={
                        "text-2xl font-semibold " +
                        (plan.featured ? "!text-white" : "text-neutral-900")
                      }
                    >
                      {plan.price}
                    </p>
                  </div>
                  <p
                    className={
                      "mt-4 text-sm leading-6 " +
                      (plan.featured ? "!text-white/75" : "text-neutral-600")
                    }
                  >
                    {plan.body}
                  </p>
                </article>
              ))}
            </div>
            <ul className="mt-6 space-y-3 text-sm text-neutral-700">
              {MEMBERSHIP_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login?mode=signup"
              className="mt-8 inline-flex w-full justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Create account
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function MerchPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Membership
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
                TSA 呆丸囡仔 T-shirt
              </h1>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                TSA will roll out a new T-shirt merch item this semester.
                Students can purchase the shirt on its own or choose the bundle
                for TSA membership plus merch at a lower combined price.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-neutral-700 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <p className="font-semibold text-neutral-900">$47.99 Bundle</p>
                  <p className="mt-1 text-neutral-500">Membership + T-shirt</p>
                </div>
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <p className="font-semibold text-neutral-900">
                    $29.99 Membership
                  </p>
                  <p className="mt-1 text-neutral-500">
                    Lifetime, non-transferable
                  </p>
                </div>
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <p className="font-semibold text-neutral-900">$32.99 T-shirt</p>
                  <p className="mt-1 text-neutral-500">Semester merch rollout</p>
                </div>
              </div>
            </div>

            <figure>
              <div className="flex aspect-[4/3] items-center justify-center bg-neutral-50 p-6">
                <Image
                  src={rawMerch}
                  alt="TSA T-shirt merch design"
                  className="h-full w-full object-contain"
                />
              </div>
              <figcaption className="mt-5">
                <h2 className="text-sm font-semibold uppercase text-neutral-900">
                  TSA T-Shirt Merch
                </h2>
                <p className="mt-1 text-sm font-semibold uppercase text-neutral-900">
                  Release Date To Be Announced
                </p>
                <p className="mt-1 text-sm text-neutral-900">$32.99</p>
              </figcaption>
            </figure>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              { src: merchModelOne, label: "Model Preview 1" },
              { src: merchModelTwo, label: "Model Preview 2" },
            ].map((model) => (
              <figure key={model.label}>
                <div className="flex min-h-[34rem] items-center justify-center bg-neutral-50 p-6 sm:p-10">
                  <Image
                    src={model.src}
                    alt={`TSA T-shirt merch ${model.label.toLowerCase()}`}
                    className="max-h-[46rem] w-full object-contain"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
