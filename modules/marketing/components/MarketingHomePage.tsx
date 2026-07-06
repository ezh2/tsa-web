import Link from "next/link";
import Image from "next/image";
import { EventsPreview } from "./EventsPreview";
import merchModelOne from "../../../images/merch/Merch_Model_1.png";
import merchModelTwo from "../../../images/merch/Merch_Model_2.png";
import rawMerch from "../../../images/merch/Raw Merch.png";
import prepImage from "../../../images/prep.png";
import stevePhoto from "../../../images/Steve.png";
import tsaTaiwanLogo from "../../../images/TSA _Taiwan_LOGO.png";

const LIFE_SECTIONS = [
  {
    title: "行前準備",
    href: "/incoming-students#documents",
    body: "簽證 / 護照 | 機場到香檳 | 短期住宿",
    summary: "Start with the essentials before you fly: documents, airport planning, and where to stay when you first arrive.",
    accent: "from-sky-400 to-indigo-500",
    image: prepImage.src,
  },
  {
    title: "出境 / 入境",
    href: "/incoming-students#flight-customs",
    body: "出境 | 入境 | 海關",
    summary: "Know what to carry, what to declare, and how to move through immigration with confidence.",
    accent: "from-blue-400 to-cyan-300",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "新生專區",
    href: "/incoming-students#campus-checkin",
    body: "學校報到 | 宿舍 | 選課",
    summary: "Get oriented with ISSS check-in, I-Card, health requirements, NetID, housing, and school systems.",
    accent: "from-emerald-300 to-lime-300",
    image:
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "香檳生活",
    href: "/current-students",
    body: "電信申辦 | 銀行開戶 | 住宿 | 交通 | 醫療 | 餐廳",
    summary: "Settle into daily life with student tools for housing, rides, marketplace listings, and community resources.",
    accent: "from-amber-300 to-orange-300",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  },
];

const INTERN_WALL = [
  {
    month: "September",
    name: "Steve",
    role: "Program Department",
    note: "",
  },
  {
    month: "October",
    name: "Steve",
    role: "Marketing Department",
    note: "",
  },
  {
    month: "November",
    name: "Steve",
    role: "Technology Department",
    note: "",
  },
  {
    month: "December",
    name: "Steve",
    role: "Treasury Department",
    note: "",
  },
  {
    month: "January",
    name: "Steve",
    role: "Publicity Department",
    note: "",
  },
  {
    month: "February",
    name: "Steve",
    role: "Secretary Department",
    note: "",
  },
];

type FontAwesomeIconName =
  | "instagram"
  | "facebook"
  | "arrow-down-to-people";

const SOCIAL_LINKS: Array<{
  label: string;
  href: string;
  icon: FontAwesomeIconName | null;
}> = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/uiuctsa/",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/UIUCTSA/",
    icon: "facebook",
  },
  {
    label: "Taiwanese at UIUC",
    href: "https://www.facebook.com/groups/taiwaneseatuiuc/",
    icon: "arrow-down-to-people",
  },
  { label: "Linktree", href: "https://linktr.ee/uiuctsa", icon: null },
];

const FONT_AWESOME_ICONS = {
  instagram: {
    viewBox: "0 0 448 512",
    path: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9S352.4 35.1 316.5 33.4c-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S3.3 127.5 1.6 163.4c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.5 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2s34.5-58 36.2-93.9c2.1-37 2.1-147.8-.1-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
  },
  facebook: {
    viewBox: "0 0 512 512",
    path: "M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256z",
  },
  "arrow-down-to-people": {
    viewBox: "0 0 640 512",
    path: "M160 64c0-17.7 14.3-32 32-32H320V16c0-6.5 3.9-12.3 9.9-14.8s12.9-1.1 17.4 3.5l48 48c6.2 6.2 6.2 16.4 0 22.6l-48 48c-4.6 4.6-11.5 5.9-17.4 3.5S320 118.5 320 112V96H224v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V64zM96 320a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm448 0a64 64 0 1 0 0-128 64 64 0 1 0 0 128zM0 480c0 17.7 14.3 32 32 32H192c17.7 0 32-14.3 32-32 0-53-43-96-96-96H96c-53 0-96 43-96 96zm416 32H608c17.7 0 32-14.3 32-32 0-53-43-96-96-96H512c-53 0-96 43-96 96 0 17.7 14.3 32 32 32zm-96-96a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm-128 64c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32 0-61.9-50.1-112-112-112H304c-61.9 0-112 50.1-112 112z",
  },
} as const;

export function MarketingHomePage() {
  return (
    <>
      <section className="overflow-hidden border-b border-neutral-100 bg-[linear-gradient(115deg,#edf5f0_0%,#f7f7f7_48%,#d8ddff_100%)]">
        <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center sm:py-24">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl lg:text-6xl">
              University of Illinois Urbana-Champaign
            </h1>
            <h2 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
              Taiwanese Student Association
            </h2>
            <p className="mt-10 max-w-2xl text-xl leading-9 text-black">
              這個網站彙集了有關香檳的生活建議，學術分享，甚至文化以及其他討論。UIUC
              TSA希望能讓此站在復古地以類似部落格形式的同時，能讓大家能溫馨地、有效地找到自己需要的資訊。如果內容有什麼疏漏，歡迎聯繫我們。有想要分享的文章、照片、或者其他創作，我們也非常歡迎投稿！
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="rounded-md border border-black bg-black px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-neutral-800"
              >
                About Us
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {SOCIAL_LINKS.slice(0, 3).map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="inline-flex items-center gap-2 text-lg font-medium text-black transition hover:opacity-70"
                >
                  {social.icon && <FontAwesomeIcon icon={social.icon} />}
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[32rem] flex-col items-center justify-center">
            <Image
              src={tsaTaiwanLogo}
              alt="TSA Taiwan logo"
              width={520}
              height={520}
              priority
              className="h-auto w-[min(82vw,34rem)] translate-x-4 object-contain drop-shadow-2xl sm:translate-x-8 lg:translate-x-12"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <h2 className="text-5xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-7xl">
              Life in
              <br />
              Champaign
            </h2>
            <p className="max-w-xl text-2xl font-medium leading-10 text-neutral-700">
              幫助你在香檳生存的教戰手冊。從抵達美國到日常生活，把重要資訊收進一個清楚、好讀的入口。
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {LIFE_SECTIONS.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group relative flex min-h-[24rem] overflow-hidden rounded-md border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-75 transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${section.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                <div className="relative z-10 flex h-full w-full flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/72">
                      {section.body}
                    </p>
                    <h3 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                      {section.title}
                    </h3>
                  </div>
                  <div className="flex items-end justify-end">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f5f5f7] text-xl text-black transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <EventsPreview />

      <section className="border-y border-neutral-100 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center sm:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Merch
            </p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
              TSA 呆丸囡仔 T-shirt
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              Preview this semester&apos;s TSA T-shirt design and model shots.
              Members can purchase the shirt separately or choose the membership
              bundle.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-neutral-700 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <p className="font-semibold text-neutral-900">$47.99 Bundle</p>
                <p className="mt-1 text-neutral-500">Membership + T-shirt</p>
              </div>
              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <p className="font-semibold text-neutral-900">$32.99 T-shirt</p>
                <p className="mt-1 text-neutral-500">Release date TBA</p>
              </div>
            </div>
            <Link
              href="/membership/merch"
              className="mt-8 inline-flex rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              View merch
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_0.82fr]">
            <figure className="flex min-h-[22rem] items-center justify-center rounded-md border border-black/10 bg-neutral-50 p-6">
              <Image
                src={rawMerch}
                alt="TSA T-shirt merch design"
                className="h-full max-h-[28rem] w-full object-contain"
              />
            </figure>
            <div className="grid gap-4">
              {[
                { src: merchModelOne, label: "Model Preview 1" },
                { src: merchModelTwo, label: "Model Preview 2" },
              ].map((model) => (
                <figure
                  key={model.label}
                  className="flex min-h-[13rem] items-center justify-center rounded-md border border-black/10 bg-neutral-50 p-4"
                >
                  <Image
                    src={model.src}
                    alt={`TSA T-shirt merch ${model.label.toLowerCase()}`}
                    className="max-h-[18rem] w-full object-contain"
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr] sm:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Joining TSA
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              Join the team behind the events.
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              TSA welcomes students interested in event planning, culture,
              marketing, design, technology, photography, translation, and
              community service. Interns help turn ideas into real campus
              experiences.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="mailto:tsauiuc@gmail.com"
                className="rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e8e8ed]"
              >
                Become an intern
              </Link>
              <Link
                href="/about#sponsors"
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Partner with TSA
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-neutral-900">
              Best Intern Wall
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Monthly recognition for interns who help make TSA events and
              projects possible.
            </p>
            <div
              aria-label="Best Intern Wall by month"
              className="mt-4 flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:thin]"
            >
              {INTERN_WALL.map((intern, index) => (
                <article
                  key={`${intern.month}-${intern.role}-${index}`}
                  className="w-[16rem] shrink-0 snap-start rounded-md border border-black/10 bg-white/85 p-5 backdrop-blur-xl sm:w-[18rem]"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {intern.month}
                  </p>
                  <div className="aspect-square overflow-hidden rounded-md bg-neutral-200">
                    <Image
                      src={stevePhoto}
                      alt={`${intern.name}, ${intern.role}`}
                      className="h-full w-full object-cover"
                      sizes="18rem"
                    />
                  </div>
                  <h4 className="mt-4 text-base font-semibold text-neutral-900">
                    {intern.name}
                  </h4>
                  <p className="mt-1 text-sm text-neutral-500">{intern.role}</p>
                  {intern.note && (
                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                      {intern.note}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

function FontAwesomeIcon({
  icon,
}: {
  icon: FontAwesomeIconName;
}) {
  const data = FONT_AWESOME_ICONS[icon];

  return (
    <svg
      aria-hidden="true"
      viewBox={data.viewBox}
      className="h-5 w-5 shrink-0 fill-current"
    >
      <path d={data.path} />
    </svg>
  );
}
