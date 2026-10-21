import { getContent } from "@/modules/content";
import Image from "next/image";

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-neutral-200 text-xs font-medium uppercase tracking-wider text-neutral-500">
      {label}
    </div>
  );
}

export async function AboutPage() {
  const [about, features] = await Promise.all([getContent("about"), getContent("features")]);
  const BOARD_MEMBERS = about.board, SPONSORS = about.sponsors, CONTRIBUTORS = about.contributors;
  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            About
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
            {about.title}
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <p className="text-base leading-8 text-neutral-700">
              {about.introductionEnglish}
            </p>
            <p className="text-base leading-8 text-neutral-700">
              {about.introductionChinese}
            </p>
          </div>
        </div>
      </section>

      <section id="board" className="scroll-mt-24 border-b border-neutral-100 bg-neutral-50">
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
                {member.photo ? (
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-neutral-100">
                    <Image
                      src={member.photo} unoptimized width={600} height={450}
                      alt={`${member.name}, ${member.role}`}
                      className="h-full w-full object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ) : (
                  <PhotoPlaceholder label="Photo coming soon" />
                )}
                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {features.sponsors && (
      <section id="sponsors" className="scroll-mt-24 border-b border-neutral-100">
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
                {sponsor.logo ? (
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-neutral-50 p-6">
                    <Image
                      src={sponsor.logo} unoptimized width={400} height={300}
                      alt={`${sponsor.name} logo`}
                      className="max-h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <PhotoPlaceholder label="招募中" />
                )}
                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  {sponsor.name}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      <section id="contributors" className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Credit
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Contributors
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
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
        </div>
      </section>
    </main>
  );
}
