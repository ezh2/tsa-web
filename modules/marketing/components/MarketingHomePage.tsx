import Link from "next/link";
import Image from "next/image";
import { EventsPreview } from "./EventsPreview";
import tsaTaiwanLogo from "../../../images/TSA _Taiwan_LOGO.png";

const SITE_SECTIONS = [
  {
    title: "About TSA",
    href: "/about",
    label: "Organization",
    body: "Learn about TSA's mission, board of directors, sponsors, partners, and contributors.",
  },
  {
    title: "Incoming Students",
    href: "/incoming-students",
    label: "New Student Guide",
    body: "Find visa, arrival, housing, legal, parent payment, and 新生說明會 information in one guide.",
  },
  {
    title: "Current Students",
    href: "/current-students",
    label: "Student Board",
    body: "Browse previews for second-hand sales, sublease posts, and carpool date registration.",
  },
  {
    title: "Membership",
    href: "/membership",
    label: "Benefits",
    body: "See member discounts, merch information, membership card details, and Line 推播系統 enrollment.",
  },
];

const LIFE_SECTIONS = [
  {
    title: "行前準備",
    href: "/incoming-students#documents",
    body: "簽證 / 護照 | 機場到香檳 | 短期住宿",
    summary: "Start with the essentials before you fly: documents, airport planning, and where to stay when you first arrive.",
    accent: "from-sky-400 to-indigo-500",
    image:
      "https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?auto=format&fit=crop&w=900&q=80",
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

const ORIENTATION_POINTS = [
  { label: "Date", value: "2026 年 6 月 27 日" },
  { label: "Time", value: "8:00 AM - 12:00 PM" },
  { label: "Location", value: "集思北科大會議中心" },
];

const INTERN_WALL = [
  {
    month: "September",
    name: "Best Intern",
    role: "Program Team",
    note: "Recognized for event logistics, volunteer coordination, and strong execution during fall programming.",
  },
  {
    month: "October",
    name: "Best Intern",
    role: "Marketing Team",
    note: "Recognized for campaign planning, event promotion, and consistent support across social channels.",
  },
  {
    month: "November",
    name: "Best Intern",
    role: "Tech Team",
    note: "Recognized for website updates, student tools, and helping keep TSA information organized.",
  },
  {
    month: "December",
    name: "Best Intern",
    role: "Operations Team",
    note: "Recognized for dependable check-in support, event preparation, and team communication.",
  },
  {
    month: "January",
    name: "Best Intern",
    role: "Design Team",
    note: "Recognized for visual assets, merch support, and thoughtful creative direction.",
  },
  {
    month: "February",
    name: "Best Intern",
    role: "Culture Team",
    note: "Recognized for supporting cultural programming and creating welcoming event experiences.",
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/uiuctsa/" },
  { label: "Facebook", href: "https://www.facebook.com/UIUCTSA/" },
  {
    label: "Taiwanese at UIUC",
    href: "https://www.facebook.com/groups/taiwaneseatuiuc/",
  },
  { label: "Linktree", href: "https://linktr.ee/uiuctsa" },
];

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
                  className="text-lg font-medium text-black transition hover:opacity-70"
                >
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

      <section className="border-b border-neutral-100 bg-[#f5c84c]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-start sm:py-28">
          <h2 className="text-5xl font-medium leading-tight tracking-tight text-black sm:text-6xl">
            Our Mission,
            <br />
            Our Work
          </h2>
          <p className="text-xl leading-9 text-black">
            UIUC Taiwanese Student Association (UIUC TSA)&apos;s mission and
            work can be condensed into two main categories - service and
            culture. As a non-profit RSO, we focus on service as voluntary deeds
            that feed back to Taiwanese community in Champaign-Urbana; as a
            cultural RSO, we aim to help people know Taiwan more and let
            Taiwanese people know each other more!
          </p>
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

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <Link
              href={LIFE_SECTIONS[0].href}
              className="group relative min-h-[34rem] overflow-hidden rounded-md border border-black/10 bg-white p-8 shadow-2xl"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-75 transition duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${LIFE_SECTIONS[0].image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                    Featured guide
                  </p>
                  <h3 className="mt-3 max-w-xl text-5xl font-semibold tracking-tight text-white">
                    {LIFE_SECTIONS[0].title}
                  </h3>
                  <p className="mt-5 max-w-xl text-lg leading-8 text-white/82">
                    {LIFE_SECTIONS[0].summary}
                  </p>
                </div>
                <div className="flex items-end justify-between gap-6">
                  <p className="max-w-md text-lg text-white/86">
                    {LIFE_SECTIONS[0].body}
                  </p>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f5f5f7] text-2xl text-black transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>

            <div className="grid gap-5">
              {LIFE_SECTIONS.slice(1).map((section) => (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group relative overflow-hidden rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-neutral-300"
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${section.accent}`}
                  />
                  <div className="grid gap-5 sm:grid-cols-[7rem_1fr] sm:items-center">
                    <div
                      className="h-28 rounded-md bg-cover bg-center opacity-80"
                      style={{ backgroundImage: `url(${section.image})` }}
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-500">
                        {section.body}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                        {section.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-neutral-600">
                        {section.summary}
                      </p>
                    </div>
                  </div>
                  <span className="absolute right-5 top-5 text-2xl text-neutral-500 transition group-hover:translate-x-1 group-hover:text-neutral-900">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EventsPreview />

      <section className="border-y border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center sm:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Incoming Students
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              2026 新生說明會
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              A focused orientation for new students and parents covering
              arrival logistics, campus setup, housing, payments, and everyday
              life at UIUC.
            </p>
          </div>
          <div className="rounded-md border border-black/10 bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {ORIENTATION_POINTS.map((point) => (
                <div
                  key={point.label}
                  className="border-l border-neutral-200 pl-4 first:border-l-0 first:pl-0"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {point.label}
                  </p>
                  <p className="mt-2 text-base font-semibold leading-7 text-neutral-900">
                    {point.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-neutral-600">
                Orientation details, family resources, and legal checklist are
                collected in the incoming student guide.
              </p>
              <Link
                href="/incoming-students#orientation"
                className="inline-flex shrink-0 justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                View guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Explore
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-900">
            Preview each section of the website.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {SITE_SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-md border border-black/10 bg-white/80 p-6 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {section.label}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900 group-hover:underline">
                  {section.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {section.body}
                </p>
              </Link>
            ))}
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
                href="/membership"
                className="rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e8e8ed]"
              >
                Become a member
              </Link>
              <Link
                href="/about#contributors"
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Contribute to TSA
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
                  <div className="flex aspect-square items-center justify-center rounded-md bg-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Photo
                  </div>
                  <h4 className="mt-4 text-base font-semibold text-neutral-900">
                    {intern.name}
                  </h4>
                  <p className="mt-1 text-sm text-neutral-500">{intern.role}</p>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {intern.note}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
