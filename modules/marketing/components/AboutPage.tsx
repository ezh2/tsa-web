import Link from "next/link";

const BOARD_MEMBERS = [
  { name: "Tim Chen", role: "President" },
  { name: "Eric Chang", role: "Vice President" },
  { name: "Chloe Lee", role: "Vice President" },
  { name: "Derrick Lin", role: "Treasury Director" },
  { name: "Brandon Tsai", role: "Program Director" },
  { name: "Ulanda Chen", role: "Marketing Director" },
  { name: "Sean Hsiung", role: "Publicity Director" },
  { name: "Sylvia Hou", role: "Secretary Director" },
  { name: "Burton Wang", role: "Technology Director" },
];

const SPONSORS = [
  { name: "Sponsor Name" },
  { name: "Partner Name" },
  { name: "Campus Partner" },
  { name: "Community Partner" },
];

const CONTRIBUTORS = [
  {
    title: "Who made this page",
    body: "This page is maintained by TSA technology and content contributors with support from the board.",
  },
  {
    title: "Why",
    body: "The goal is to keep TSA information visible, organized, and easy for future officers to update.",
  },
  {
    title: "Join as contributor",
    body: "Students can help with writing, translation, photos, design, and code throughout the year.",
  },
];

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-neutral-200 text-xs font-medium uppercase tracking-wider text-neutral-500">
      {label}
    </div>
  );
}

export function AboutPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            About
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
            About TSA
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <p className="text-base leading-8 text-neutral-700">
              Taiwanese Student Association (TSA) is a non-profit student
              organization at University of Illinois at Urbana-Champaign (UIUC)
              dedicated to serve Taiwanese community in Champaign-Urbana region.
              Needless to say, we are also a culture-oriented RSO (registered
              student organization), so we will also promote cultural awareness
              about Taiwan via events and cultural creations. TSA envisions
              itself as a friendly and practical media for Taiwaneses to
              recognize and/or help each other.
            </p>
            <p className="text-base leading-8 text-neutral-700">
              伊利諾大學香檳分校的台灣同學會(TSA)，一直致力於服務UIUC的台灣人社群，並積極宣揚台灣的豐富文化。我們的理想是創造一個互助並交流的平台，讓在香檳的台灣人有家的感覺。TSA以實際行動來援助台灣人社群的需要，並以推廣台灣的文化價值。自從2002年成立以來，我們堅持使命和初衷，為我們的台灣人社群服務，並讓其他群體更加了解台灣。
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Leadership
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Board of Directors
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BOARD_MEMBERS.map((member, index) => (
              <article
                key={`${member.role}-${index}`}
                className="rounded-md border border-neutral-200 bg-white p-4"
              >
                <PhotoPlaceholder label="Photo" />
                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Support
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Sponsors and Partners
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SPONSORS.map((sponsor, index) => (
              <article
                key={`${sponsor.name}-${index}`}
                className="rounded-md border border-neutral-200 bg-white p-4"
              >
                <PhotoPlaceholder label="Logo" />
                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  {sponsor.name}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contributors" className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Contributors
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Built for future TSA teams.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {CONTRIBUTORS.map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-neutral-200 bg-white p-5"
              >
                <h3 className="text-base font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="https://github.com/"
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              GitHub link
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              Join as contributor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
