import Link from "next/link";

const PREVIEWS = [
  {
    title: "二手買賣",
    eyebrow: "Marketplace",
    href: "/current-students/marketplace",
    body: "Browse TSA pinned sellings and community second-hand listings.",
    items: ["TSA Hoodie · $35", "TSA Sticker Pack · $5", "Desk lamp · $12"],
  },
  {
    title: "轉租",
    eyebrow: "Sublease",
    href: "/current-students/sublease",
    body: "Find apartment offers and requests without mixing them into every other student post.",
    items: [
      "Offer · Summer studio near Green St.",
      "Request · Fall semester room",
    ],
  },
  {
    title: "拼車日期登記",
    eyebrow: "Carpool",
    href: "/current-students/carpool",
    body: "Register rides by date, route, available seats, and contact info.",
    items: ["2026-08-15 · ORD to Champaign", "2026-08-18 · Champaign to ORD"],
  },
];

export function CurrentStuPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Current Students
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
            Student Exchange Board
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
            二手買賣、轉租、拼車日期登記集中在這裡。這一頁只顯示預覽，完整列表與表單請進入各功能頁面。
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-16 md:grid-cols-3 sm:py-20">
          {PREVIEWS.map((preview) => (
            <Link
              key={preview.href}
              href={preview.href}
              className="group flex min-h-80 flex-col rounded-md border border-neutral-200 p-6 transition hover:border-neutral-400 hover:shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {preview.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                {preview.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {preview.body}
              </p>
              <div className="mt-6 space-y-2">
                {preview.items.map((item) => (
                  <p
                    key={item}
                    className="rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
                  >
                    {item}
                  </p>
                ))}
              </div>
              <span className="mt-auto pt-8 text-sm font-medium text-neutral-900 group-hover:underline">
                Open {preview.eyebrow}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
