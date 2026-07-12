import Image from "next/image";
import Link from "next/link";
import tsaLogo from "../../images/TSA_bear.png";

const FOOTER_SECTIONS = [
  {
    title: "Organization",
    links: [
      { label: "About", href: "/about" },
      { label: "Board of Directors", href: "/about#board" },
      { label: "Sponsors & Partners", href: "/about#sponsors" },
      { label: "Membership", href: "/membership" },
      { label: "Merch", href: "/membership/merch" },
    ],
  },
  {
    title: "Students",
    links: [
      { label: "Incoming Students", href: "/incoming-students" },
      { label: "Current Students", href: "/current-students" },
      { label: "Marketplace", href: "/current-students/marketplace" },
      { label: "Sublease", href: "/current-students/sublease" },
      { label: "Carpool", href: "/current-students/carpool" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Events", href: "/events" },
      { label: "Instagram", href: "https://www.instagram.com/uiuctsa/" },
      { label: "Facebook", href: "https://www.facebook.com/UIUCTSA/" },
      { label: "Linktree", href: "https://linktr.ee/uiuctsa" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-black text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.15fr_2fr] sm:py-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-4">
            <Image
              src={tsaLogo}
              alt="UIUC TSA logo"
              width={76}
              height={76}
              className="h-16 w-16 object-contain"
            />
            <div>
              <p className="text-2xl font-semibold tracking-tight">UIUC TSA</p>
              <p className="mt-1 text-sm text-white/50">
                Taiwanese Student Association
              </p>
            </div>
          </Link>
          <p className="mt-8 max-w-xs text-sm leading-6 text-white/55">
            A student-run community at the University of Illinois
            Urbana-Champaign.
          </p>
          <p className="mt-6 text-sm text-white/45">Champaign, IL</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="text-base font-semibold !text-white">
                {section.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => {
                  const isExternal = link.href.startsWith("http");

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        target={isExternal ? "_blank" : undefined}
                        className="text-sm text-white/55 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-6 py-5 text-xs text-white/35">
          © 2026 UIUC Taiwanese Student Association
        </p>
      </div>
    </footer>
  );
}
