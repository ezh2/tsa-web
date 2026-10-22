import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { MerchIntroVideo } from "./MerchIntroVideo";
import { MerchTranslationButton } from "./MerchTranslationButton";
import {
  BlackFridayOfferPrice,
  BlackFridaySalePopup,
  MerchPricingCards,
} from "./BlackFridayPromo";
import rawMerch from "../../../images/merch/Raw Merch.png";
import merchPosterOne from "../../../images/merch/TSA_Merch_Poster_1.jpeg";
import merchPosterTwo from "../../../images/merch/TSA_Merch_Poster_2.jpeg";
import lateaLogo from "../../../images/sponsors/latea-logo.png";
import bbqChickenLogo from "../../../images/sponsors/bbq-chicken-logo.png";
import pokeLabLogo from "../../../images/sponsors/pokelab-logo.jpeg";
import soGongDongLogo from "../../../images/sponsors/sgd-logo.jpeg";
import susuruRamenLogo from "../../../images/sponsors/susuru-ramen-logo.jpeg";

const PARTNERS: Array<{
  category: string;
  name: string;
  offer: string;
  additionalOffer?: string;
  address?: string;
  href?: string;
  confirmed: boolean;
  logo?: StaticImageData;
  venues?: Array<{ name: string; address: string; logo: StaticImageData }>;
}> = [
  {
    category: "Restaurant",
    name: "Restaurant Partners",
    offer: "10% off in-person purchases with a subtotal of $20 or more before tax and tip. Available for dine-in and in-store takeout starting October 23, 2026.",
    additionalOffer: "Show a valid physical or digital TSA membership card when requesting the discount. Not valid for delivery apps or online orders. Cannot be combined with other discounts or promotions; limit one discount per bill.",
    confirmed: true,
    venues: [
      {
        name: "SGD Dubu",
        address: "707 S Sixth St, Champaign",
        logo: soGongDongLogo,
      },
      {
        name: "bb.q Chicken",
        address: "700 S Gregory St, Urbana",
        logo: bbqChickenLogo,
      },
      {
        name: "Pokelab",
        address: "605 S Sixth St, Champaign",
        logo: pokeLabLogo,
      },
      {
        name: "Susuru Ramen",
        address: "621 E Green St, Champaign",
        logo: susuruRamenLogo,
      },
    ],
  },
  {
    category: "Beverages",
    name: "LaTea",
    address: "601 S 6th St Apt 105, Champaign, IL 61820",
    offer: "10% off in-store at LaTea (regular-priced drinks only). Cannot be combined with other discounts or promotions.",
    additionalOffer: "Early access to seasonal drinks and new product launches.",
    confirmed: true,
    logo: lateaLogo,
  },
  {
    category: "Restaurant",
    name: "Golden Harbor 漁滿樓",
    confirmed: false,
    offer: "To be announced",
    href: "https://goo.gl/maps/",
  },
  {
    category: "Restaurant",
    name: "PHO Noodle Station",
    confirmed: false,
    offer: "To be announced",
    href: "https://goo.gl/maps/",
  },
  {
    category: "Restaurant",
    name: "Paris Super",
    confirmed: false,
    offer: "To be announced",
    href: "https://goo.gl/maps/",
  },
  {
    category: "Beverages",
    name: "HAPPYLEMON",
    confirmed: false,
    offer: "To be announced",
    href: "https://www.google.com/maps",
  },
  {
    category: "Groceries",
    name: "Weee",
    confirmed: false,
    offer: "To be announced",
    href: "https://www.sayweee.com/",
  },
];

const MEMBERSHIP_FEATURES = [
  "Lifetime TSA membership",
  "Non-transferable membership holder benefits",
  "Partner discounts at LaTea and participating restaurants",
  "Membership card and Line Announcement System enrollment",
  "Membership card discounts cannot be combined with other event discounts",
];

const PRICING_PLANS = [
  {
    name: "Bundle",
    price: "$49.99",
    note: "Best value",
    body: "TSA membership plus one T-shirt Merch Bundle. Bundle price applies to one T-shirt only.",
    featured: true,
    productKey: "bundle",
  },
  {
    name: "TSA Membership",
    price: "$29.99",
    note: "Lifetime, non-transferable",
    body: "Lifetime access to TSA membership benefits, membership card verification, and announcements for the registered member, including partner discounts at LaTea and participating restaurants.",
    featured: false,
    productKey: "membership",
  },
];

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
            TSA UIUC Membership
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
            Join TSA to support Taiwanese community programming at UIUC and get
            access to lifetime member benefits, membership-card updates, merch
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
                        src={partner.logo}
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
                    {partner.venues && (
                      <ul className="mt-4 grid grid-cols-2 gap-3">
                        {partner.venues.map((venue) => (
                          <li
                            key={venue.name}
                            className="flex min-w-0 flex-col items-center rounded-md bg-neutral-50 p-3 text-center"
                          >
                            <Image
                              src={venue.logo}
                              alt={`${venue.name} logo`}
                              className="h-14 w-full object-contain"
                              sizes="(min-width: 768px) 180px, 40vw"
                            />
                            <p className="mt-2 text-sm font-semibold text-neutral-800">
                              {venue.name}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-neutral-500">
                              {venue.address}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
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
                      {plan.productKey === "bundle" ? (
                        <BlackFridayOfferPrice
                          regularPrice={plan.price}
                          salePrice="$42.99"
                          featured={plan.featured}
                        />
                      ) : (
                        plan.price
                      )}
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

export function MerchPage() {
  return (
    <main className="bg-white">
      <BlackFridaySalePopup />
      <MerchIntroVideo />
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
              <div className="mt-4 space-y-4 text-sm leading-6 text-neutral-600">
                <p className="font-semibold text-neutral-900">
                  📢【TSA UIUC 新學期官方周邊登場】
                </p>
                <p>新學期 TSA 官方周邊正式上線啦！</p>
                <p>
                  這次帶來的是 「呆丸囡仔」落肩短 T，把遠在香檳校園的回憶、熱血與歸屬感，穿進日常生活。不論你是即將啟程的新生、努力奮鬥的在校生，還是想念 Alma Mater 的校友，都能用這件 TSA 專屬設計展現屬於我們的 Illini Pride！🧡 💙
                </p>
                <p>
                  最百搭、最耐看的 經典黑白雙色系列，簡約有質感，無論是在圖書館讀書、出門吃早午餐，還是日常穿搭都能輕鬆駕馭。穿上它，不管身在香檳還是台灣，都能一眼認出自己的 TSA 家人！
                </p>
                <p>趕快入手，一起把屬於 UIUC 的回憶穿在身上吧！</p>
                <MerchTranslationButton />
              </div>
              <MerchPricingCards />
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                To purchase or ask about merch, contact TSA on Instagram at{" "}
                <a
                  href="https://www.instagram.com/tsa_uiuc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-neutral-900 underline underline-offset-4"
                >
                  @tsa_uiuc
                </a>{" "}
                or email{" "}
                <a
                  href="mailto:tsauiuc@gmail.com"
                  className="font-medium text-neutral-900 underline underline-offset-4"
                >
                  tsauiuc@gmail.com
                </a>
                .
              </p>
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
                  Released July 10, 2026
                </p>
                <p className="mt-1 text-sm text-neutral-900">
                  <BlackFridayOfferPrice
                    regularPrice="$32.99"
                    salePrice="$23.00"
                  />
                </p>
              </figcaption>
            </figure>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              { src: merchPosterOne, label: "Poster Preview 1" },
              { src: merchPosterTwo, label: "Poster Preview 2" },
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
