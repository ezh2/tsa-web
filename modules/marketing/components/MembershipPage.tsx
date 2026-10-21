import { getContent, requireSiteFeature } from "@/modules/content";
import Image from "next/image";
import Link from "next/link";
import { MerchIntroVideo } from "./MerchIntroVideo";
import { MerchTranslationButton } from "./MerchTranslationButton";

const CHECKOUT_MESSAGES: Record<string, { tone: "ok" | "err"; text: string }> = {
  cancelled: {
    tone: "ok",
    text: "Checkout was cancelled — you have not been charged.",
  },
  "already-member": {
    tone: "err",
    text: "This account already has TSA membership.",
  },
  "unknown-product": {
    tone: "err",
    text: "That product isn't available. Please try again.",
  },
  error: {
    tone: "err",
    text: "We couldn't start checkout. Please try again in a moment.",
  },
  paused: {
    tone: "ok",
    text: "Online checkout is temporarily paused.",
  },
};

export async function MembershipPage({
  searchParams,
}: {
  searchParams?: Promise<{ checkout?: string }>;
}) {
  await requireSiteFeature("membership");
  const [membership, features] = await Promise.all([getContent("membership"), getContent("features")]);
  const PARTNERS = membership.partners, MEMBERSHIP_FEATURES = membership.features, PRICING_PLANS = membership.pricingPlans;
  const { checkout } = (await searchParams) ?? {};
  const feedback = checkout ? (CHECKOUT_MESSAGES[checkout] ?? null) : null;

  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Membership
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
            {membership.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
            {membership.description}
          </p>
          {features.merch && <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/membership/merch"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              View merch
            </Link>
          </div>}

          {feedback && (
            <div
              role={feedback.tone === "err" ? "alert" : "status"}
              className={
                "mt-6 max-w-3xl rounded-md border px-3 py-2 text-sm " +
                (feedback.tone === "err"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-neutral-200 bg-neutral-50 text-neutral-700")
              }
            >
              {feedback.text}
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_26rem] sm:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Partnerships
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              VIP Card Collaboration Partners
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">
              Enjoy the following benefits with your TSA membership card.
              Additional partner benefits will be announced through TSA channels.
            </p>
            <p className="mt-3 max-w-2xl rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700">
              資訊以 Instagram 為主。
            </p>
            {PARTNERS.some((partner) => partner.confirmed) ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {PARTNERS.filter((partner) => partner.confirmed).map((partner) => (
                  <article
                    key={partner.name}
                    className="rounded-md border border-neutral-200 bg-white p-5"
                  >
                    {partner.logo && (
                      <Image
                        src={partner.logo} unoptimized width={480} height={256}
                        alt={`${partner.name} logo`}
                        className="mb-4 h-32 w-full object-contain object-center"
                        sizes="240px"
                      />
                    )}
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      {partner.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                      {partner.name}
                    </h3>
                    {partner.address && (
                      <p className="mt-2 text-sm leading-6 text-neutral-500">
                        {partner.address}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                      {partner.offer}
                    </p>
                    {partner.additionalOffer && (
                      <p className="mt-3 text-sm leading-6 text-neutral-600">
                        {partner.additionalOffer}
                      </p>
                    )}
                    {partner.href && (
                    <Link
                      href={partner.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="mt-4 inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4"
                    >
                      Location
                    </Link>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
                Partner discount details will be announced once confirmed.
              </p>
            )}
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
            <p className="mt-6 text-xs leading-5 text-neutral-500">
              Online checkout is temporarily paused. Membership and merch
              options are shown for reference.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

export async function MerchPage() {
  await requireSiteFeature("merch");
  const merch = await getContent("merch");
  return (
    <main className="bg-white">
      <MerchIntroVideo src={merch.banner} />
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Membership
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
                {merch.title}
              </h1>
              <div className="mt-4 space-y-4 text-sm leading-6 text-neutral-600">
                <p className="font-semibold text-neutral-900">
                  📢【TSA UIUC 新學期官方周邊登場】
                </p>
                {merch.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                <MerchTranslationButton paragraphs={merch.englishParagraphs} />
              </div>
              <div className="mt-6 grid gap-3 text-sm text-neutral-700 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <p className="font-semibold text-neutral-900">{merch.bundlePrice} Bundle</p>
                  <p className="mt-1 text-neutral-500">
                    Membership + one T-shirt
                  </p>
                  <p className="mt-2 text-xs leading-5 text-neutral-500">
                    Bundle pricing applies to one T-shirt only and cannot be
                    combined with other event discounts.
                  </p>
                  <div className="mt-3">
                    <MerchPurchaseLink href={merch.purchaseUrl} label="Buy bundle" />
                  </div>
                </div>
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <p className="font-semibold text-neutral-900">
                    {merch.membershipPrice} Membership
                  </p>
                  <p className="mt-1 text-neutral-500">
                    Lifetime, non-transferable
                  </p>
                </div>
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <p className="font-semibold text-neutral-900">{merch.shirtPrice} T-shirt</p>
                  <p className="mt-1 text-neutral-500">Semester merch rollout</p>
                  <div className="mt-3">
                    <MerchPurchaseLink href={merch.purchaseUrl} label="Buy T-shirt" />
                  </div>
                </div>
              </div>
            </div>

            <figure>
              <div className="flex aspect-[4/3] items-center justify-center bg-neutral-50 p-6">
                {merch.design && <Image
                  src={merch.design} unoptimized width={900} height={900}
                  alt="TSA T-shirt merch design"
                  className="h-full w-full object-contain"
                />}
              </div>
              <figcaption className="mt-5">
                <h2 className="text-sm font-semibold uppercase text-neutral-900">
                  TSA T-Shirt Merch
                </h2>
                <p className="mt-1 text-sm font-semibold uppercase text-neutral-900">
                  {merch.releaseDate}
                </p>
                <p className="mt-1 text-sm text-neutral-900">{merch.shirtPrice}</p>
              </figcaption>
            </figure>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {merch.posters.filter((poster) => poster.src).map((model) => (
              <figure key={model.label}>
                <div className="flex min-h-[34rem] items-center justify-center bg-neutral-50 p-6 sm:p-10">
                  <Image
                    src={model.src} unoptimized width={800} height={1000}
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

function MerchPurchaseLink({ label, href }: { label: string; href: string }) {
  if (!href) return null;
  return (
    <Link
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className="inline-flex w-full justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
    >
      {label}
    </Link>
  );
}
