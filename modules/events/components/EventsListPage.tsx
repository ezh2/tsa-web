import Link from "next/link";
import { listUpcomingEvents } from "@/modules/events/server/queries";
import { fmtDateRange } from "@/modules/events/lib/format";

const DEMO_UPCOMING_EVENTS = [
  {
    title: "Merch Presale",
    date: "July 10, 2026",
    time: "12:00 - 23:59",
    location: "Online",
    description:
      "Reserve TSA apparel and community merchandise before the fall semester. Presale details, sizing information, and pickup windows will be shared through TSA channels.",
  },
  {
    title: "Welcome Picnic",
    date: "August 22, 2026",
    time: "16:00 - 18:30",
    location: "Main Quad",
    description:
      "A relaxed welcome event for new and returning students with organized games, conversation, and a chance to meet the TSA board before classes get busy.",
  },
  {
    title: "Water Balloon Social",
    date: "August 29, 2026",
    time: "15:00 - 17:00",
    location: "South Quad",
    description:
      "An outdoor social built around casual team games and water balloon activities. Designed as an easy way to meet friends early in the semester.",
  },
  {
    title: "Night Market",
    date: "September 12, 2026",
    time: "18:00 - 21:00",
    location: "Illini Union",
    description:
      "TSA's signature night-market experience featuring Taiwanese food, student activities, performances, and community booths inspired by Taiwan's local markets.",
  },
  {
    title: "Mid-Autumn BBQ",
    date: "September 19, 2026",
    time: "17:00 - 20:00",
    location: "Crystal Lake Park",
    description:
      "A Mid-Autumn Festival gathering with barbecue, seasonal snacks, and outdoor community time for Taiwanese students and friends of Taiwan.",
  },
  {
    title: "Fall Merch Sale",
    date: "September 26, 2026",
    time: "13:00 - 16:00",
    location: "Anniversary Plaza",
    description:
      "A campus pickup and sale window for TSA merchandise, including remaining presale items and limited fall inventory while supplies last.",
  },
  {
    title: "Internal Bonding",
    date: "October 3, 2026",
    time: "18:00 - 20:00",
    location: "TBA",
    description:
      "A board and volunteer bonding session focused on team connection, planning alignment, and strengthening the people behind TSA events.",
  },
  {
    title: "1010 Party",
    date: "October 10, 2026",
    time: "19:00 - 22:00",
    location: "TBA",
    description:
      "A community celebration for Double Ten Day with social activities, cultural touches, and a festive space for students to gather.",
  },
  {
    title: "Singing Contest",
    date: "November 14, 2026",
    time: "20:00 - 22:30",
    location: "Illini Union",
    description:
      "TSA's annual performance event for student singers, featuring prepared performances, audience energy, and a supportive stage for campus talent.",
  },
  {
    title: "Hot Choco Sale",
    date: "November 20, 2026",
    time: "12:00 - 16:00",
    location: "Main Quad",
    description:
      "A seasonal fundraiser offering warm drinks on campus as the weather turns cold, with proceeds supporting TSA programming.",
  },
  {
    title: "Game Day",
    date: "December 5, 2026",
    time: "18:00 - 21:00",
    location: "TBA",
    description:
      "A low-pressure end-of-semester hangout with board games, party games, and time to unwind before finals.",
  },
  {
    title: "RUFF",
    date: "January 23, 2027",
    time: "18:00 - 20:00",
    location: "TBA",
    description:
      "A spring welcome-back event to reconnect after winter break and ease into the new semester with TSA friends.",
  },
  {
    title: "New Year Banquet",
    date: "February 13, 2027",
    time: "18:00 - 21:00",
    location: "Golden Harbor / 漁滿樓",
    description:
      "TSA's Lunar New Year banquet with Taiwanese cuisine, raffle prizes, and a formal community celebration for the new year.",
  },
  {
    title: "Spring Internal Bonding",
    date: "February 27, 2027",
    time: "18:00 - 20:00",
    location: "TBA",
    description:
      "A second-semester bonding and planning session for TSA board members, interns, and contributors.",
  },
  {
    title: "Taiwanese Breakfast Pop-Up",
    date: "March 13, 2027",
    time: "10:00 - 13:00",
    location: "TBA",
    description:
      "A food-centered event inspired by Taiwanese breakfast shops, featuring items such as rice balls, zongzi, and classic breakfast flavors.",
  },
  {
    title: "Taiwanese Bento",
    date: "April 17, 2027",
    time: "13:30 - 16:00",
    location: "Anniversary Plaza",
    description:
      "A campus bento pickup event bringing familiar Taiwanese flavors to UIUC students through preordered meal boxes.",
  },
  {
    title: "Taichella",
    date: "April 24, 2027",
    time: "19:00 - 22:00",
    location: "TBA",
    description:
      "A TSA music party celebrating student performers, music, and community energy near the end of the academic year.",
  },
  {
    title: "End-of-Year Gathering",
    date: "May 1, 2027",
    time: "17:00 - 19:00",
    location: "TBA",
    description:
      "A closing event for the academic year with time to reflect, celebrate contributors, and send off graduating members.",
  },
];

const PAST_EVENTS = [
  {
    title: "Taiwanese Bento",
    date: "April 18, 2026",
    time: "13:30 - 16:00",
    location: "Anniversary Plaza",
    description:
      "Enjoy a familiar Taiwanese bento on campus. Pick up your preorder at Anniversary Plaza on the Illini Union Main Quad side and bring a taste of Taiwan into your weekend.",
  },
  {
    title: "Lunar New Year Banquet",
    date: "February 14, 2026",
    time: "Time announced through TSA Linktree",
    location: "Golden Harbor / 漁滿樓",
    description:
      "Celebrate Lunar New Year with TSA at Golden Harbor. Join us for Taiwanese cuisine, time with friends, and our annual raffle draw.",
  },
  {
    title: "TSA Singing Contest",
    date: "November 15, 2025",
    time: "20:30",
    location: "Illini Room A",
    description:
      "Showcase your voice at the TSA Singing Contest. We are excited to welcome performers and friends for a night of music, stage energy, and community support.",
  },
];

export async function EventsListPage() {
  const events = await listUpcomingEvents();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <header className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          What&apos;s coming up
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-6xl font-semibold tracking-tight text-neutral-900 sm:text-7xl">
          Events
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
          Browse UIUC TSA events, from campus traditions and cultural gatherings
          to student-led socials, fundraisers, and performance nights.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <li key={event.id}>
            <Link
              href={`/events/${event.id}`}
              className="block h-full rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {fmtDateRange(event.starts_at, event.ends_at)}
              </p>
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {event.title}
                </h2>
                {event.location && (
                  <span className="shrink-0 text-xs text-neutral-500">
                    📍 {event.location}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}

        {DEMO_UPCOMING_EVENTS.map((event) => (
          <li key={`${event.date}-${event.title}`}>
            <article className="h-full rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {event.date} · {event.time}
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {event.title}
                </h2>
                <span className="shrink-0 rounded-md bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {event.location}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                {event.description}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <section className="mt-20 border-t border-neutral-100 pt-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Archive
        </p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
          Past Events
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          A quick record of recent TSA events, announcements, and community
          gatherings.
        </p>

        <div className="mt-8 space-y-4">
          {PAST_EVENTS.map((event) => (
            <article
              key={event.title}
              className="rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    {event.date}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-neutral-900">
                    {event.title}
                  </h3>
                </div>
                <span className="shrink-0 rounded-md bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {event.location}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                {event.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
