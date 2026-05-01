import Image, { type StaticImageData } from "next/image";
import brandonPhoto from "../../../images/Board2627/Brandon.png";
import burtonPhoto from "../../../images/Board2627/Burton.png";
import chloePhoto from "../../../images/Board2627/Chloe.png";
import derrickPhoto from "../../../images/Board2627/Derrick.png";
import ericPhoto from "../../../images/Board2627/Eric.png";
import seanPhoto from "../../../images/Board2627/Sean.png";
import sylviaPhoto from "../../../images/Board2627/Sylvia.png";
import timPhoto from "../../../images/Board2627/Tim.png";
import ulandaPhoto from "../../../images/Board2627/Ulanda.png";
import tsmcLogo from "../../../images/tsmc-logo.png";

const BOARD_MEMBERS: Array<{
  name: string;
  role: string;
  photo: StaticImageData;
}> = [
  { name: "Tim Chen", role: "President", photo: timPhoto },
  { name: "Eric Chang", role: "Vice President", photo: ericPhoto },
  { name: "Chloe Lee", role: "Vice President", photo: chloePhoto },
  { name: "Derrick Lin", role: "Treasury Director", photo: derrickPhoto },
  { name: "Brandon Tsai", role: "Program Director", photo: brandonPhoto },
  { name: "Ulanda Chen", role: "Marketing Director", photo: ulandaPhoto },
  { name: "Sean Hsiung", role: "Publicity Director", photo: seanPhoto },
  { name: "Sylvia Hou", role: "Secretary Director", photo: sylviaPhoto },
  { name: "Burton Wang", role: "Technology Director", photo: burtonPhoto },
];

const SPONSORS: Array<{ name: string; logo?: StaticImageData }> = [
  { name: "TSMC (台灣積體電路製造)", logo: tsmcLogo },
  { name: "招募中" },
  { name: "招募中" },
  { name: "招募中" },
];

const CONTRIBUTORS = [
  {
    title: "Who made this page?",
    body: "This website was developed in 2026 by Eric Chang Burton Wang. Ongoing maintenance is managed by the TSA Technology Department.",
  },
  {
    title: "Join as contributor:",
    body: "We manage contributions through GitHub. If you would like to contribute, please open a pull request by following the instructions provided in the repository’s README and direct message UIUC TSA via Instagram, Facebook, or email.",
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
                <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-neutral-100">
                  <Image
                    src={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
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
                {sponsor.logo ? (
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-neutral-50 p-6">
                    <Image
                      src={sponsor.logo}
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
