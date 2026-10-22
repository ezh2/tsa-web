import { getContent, requireSiteFeature } from "@/modules/content";
import Image from "next/image";
import Link from "next/link";

const PAGE_INDEX = [
  { label: "新生說明會", href: "#orientation" },
  { label: "簽證 / 護照", href: "#documents" },
  { label: "Legal Info", href: "#legal-info" },
  { label: "出境 / 入境", href: "#flight-customs" },
  { label: "機場到香檳", href: "#arrival" },
  { label: "短期住宿", href: "#temporary-stay" },
  { label: "學校報到", href: "#campus-checkin" },
  { label: "宿舍與餐廳", href: "#campus-living" },
  { label: "學校常用網站", href: "#campus-systems" },
  { label: "家長繳費", href: "#parents" },
  { label: "兵役", href: "#military-service" },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm leading-6 text-neutral-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export async function IncomingStuPage() {
  await requireSiteFeature("incomingStudents");
  const incoming = await getContent("incoming");
  const NEW_STUDENT_ORIENTATION_URL = incoming.orientationUrl;
  const { passportItems: PASSPORT_ITEMS, visaDocuments: VISA_DOCUMENTS, specialDocuments: SPECIAL_DOCUMENTS, orientationDetails: ORIENTATION_DETAILS, departureItems: DEPARTURE_ITEMS, customsItems: CUSTOMS_ITEMS, travelOptions: TRAVEL_OPTIONS, housingOptions: HOUSING_OPTIONS, campusCheckin: CAMPUS_CHECKIN, campusHousing: CAMPUS_HOUSING, schoolWebsites: SCHOOL_WEBSITES, parentPaymentSteps: PARENT_PAYMENT_STEPS, legalInfo: LEGAL_INFO, recommendedSites: RECOMMENDED_SITES, militaryService: MILITARY_SERVICE } = incoming;
  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Incoming Students
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
            {incoming.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
            {incoming.description}
          </p>
          <nav
            aria-label="Incoming students page index"
            className="mt-8 rounded-md border border-neutral-200 bg-neutral-50 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Jump to section
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PAGE_INDEX.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      <section id="orientation" className="scroll-mt-24 border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] sm:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Orientation
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              新生說明會
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              TSA 新生說明會會集中整理出發前、抵達後、家長繳費與校園生活相關提醒。
            </p>
            <Link
              href={NEW_STUDENT_ORIENTATION_URL}
              rel="noopener noreferrer"
              target="_blank"
              className="mt-5 inline-flex rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              View Orientation File
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr] lg:grid-cols-1 xl:grid-cols-[0.95fr_1.05fr]">
            <Link
              href={NEW_STUDENT_ORIENTATION_URL}
              aria-label="Open the 2026 new student orientation file"
              rel="noopener noreferrer"
              target="_blank"
              className="overflow-hidden rounded-md border border-neutral-200 bg-white transition hover:border-neutral-400"
            >
              {incoming.orientationImage && <Image
                src={incoming.orientationImage} unoptimized width={700} height={950}
                alt="2026 TSA UIUC new student orientation flyer"
                className="h-full w-full object-cover"
                priority
              />}
            </Link>
            <article className="rounded-md border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-neutral-900">
                2026 新生說明會 Details
              </h3>
              <BulletList items={ORIENTATION_DETAILS} />
            </article>
          </div>
        </div>
      </section>

      <section id="documents" className="scroll-mt-24 border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Documents
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            簽證 / 護照
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-md border border-neutral-200 p-6">
              <h3 className="text-xl font-semibold text-neutral-900">護照</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                如需換發護照，請由本人或委託人攜帶以下物品至外交部領事事務局或外交部辦事處臨櫃辦理，約需
                4 - 5 個工作天。
              </p>
              <BulletList items={PASSPORT_ITEMS} />
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="https://www.boca.gov.tw/"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-sm font-medium text-neutral-900 underline underline-offset-4"
                >
                  外交部領事事務局
                </Link>
                <Link
                  href="https://www.gov.tw/"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-sm font-medium text-neutral-900 underline underline-offset-4"
                >
                  我的 E 政府
                </Link>
              </div>
            </article>

            <article className="rounded-md border border-neutral-200 p-6">
              <h3 className="text-xl font-semibold text-neutral-900">簽證</h3>
              <p className="mt-3 text-sm font-semibold text-neutral-900">
                一般文件
              </p>
              <BulletList items={VISA_DOCUMENTS} />
              <p className="mt-6 text-sm font-semibold text-neutral-900">
                相片
              </p>
              <BulletList items={["5cm x 5cm 證件照（無配戴眼鏡）"]} />
              <p className="mt-6 text-sm font-semibold text-neutral-900">
                特殊文件
              </p>
              <BulletList items={SPECIAL_DOCUMENTS} />
              <p className="mt-6 text-sm font-semibold text-neutral-900">
                護照
              </p>
              <BulletList
                items={[
                  "一本有效護照",
                  "所有舊護照（若遺失或失竊，必須提出一份歷年出入過日期證明）",
                ]}
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="https://www.ait.org.tw/"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-sm font-medium text-neutral-900 underline underline-offset-4"
                >
                  美國在台協會
                </Link>
                <Link
                  href="https://www.ustraveldocs.com/"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-sm font-medium text-neutral-900 underline underline-offset-4"
                >
                  申請美國簽證
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="legal-info" className="scroll-mt-24 border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Legal and Status
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Legal Info for New Students
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600">
            以下是新生最常遇到的 SSN、visa、I-94 與工作身分提醒。這不是法律建議，實際規定請以
            UIUC ISSS、SSA、CBP 等官方單位最新資訊為準。
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {LEGAL_INFO.map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-neutral-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <BulletList items={item.details} />
                <Link
                  href={item.href}
                  className="mt-5 inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4"
                >
                  {item.hrefLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="flight-customs" className="scroll-mt-24 border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Flight and Customs
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            出境 / 入境
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-md border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-neutral-900">出境</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                出發前請把重要文件放在隨身行李，並確認航空公司與機場的最新規定。
              </p>
              <BulletList items={DEPARTURE_ITEMS} />
              <Link
                href="https://www.evaair.com/"
                rel="noopener noreferrer"
                target="_blank"
                className="mt-5 inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4"
              >
                長榮航空旅遊限制資訊
              </Link>
            </article>

            <article className="rounded-md border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-neutral-900">
                入境 / 海關
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                下機前先準備好海關申報與移民官可能檢查的文件，通關時簡潔且誠實回答即可。
              </p>
              <BulletList items={CUSTOMS_ITEMS} />
              <Link
                href="https://www.cbp.gov/travel/international-visitors/know-before-you-visit"
                rel="noopener noreferrer"
                target="_blank"
                className="mt-5 inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4"
              >
                U.S. Customs and Border Protection
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section id="arrival" className="scroll-mt-24 border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Arrival
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            機場到香檳
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {TRAVEL_OPTIONS.map((option) => (
              <article
                key={option.title}
                className="rounded-md border border-neutral-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {option.href ? (
                    <Link
                      href={option.href}
                      className="underline underline-offset-4"
                    >
                      {option.title}
                    </Link>
                  ) : (
                    option.title
                  )}
                </h3>
                <BulletList items={option.details} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="temporary-stay" className="scroll-mt-24 border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Temporary Stay
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            香檳短期住宿
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {HOUSING_OPTIONS.map((option) => (
              <article
                key={option.title}
                className="rounded-md border border-neutral-200 p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {option.title}
                </h3>
                <BulletList items={option.details} />
                {option.href ? (
                  <Link
                    href={option.href}
                    className="mt-5 inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4"
                  >
                    {option.hrefLabel}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="campus-checkin" className="scroll-mt-24 border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            First Week
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            學校報到
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CAMPUS_CHECKIN.map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-neutral-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <BulletList items={item.details} />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4"
                  >
                    {item.hrefLabel}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="campus-living" className="scroll-mt-24 border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Campus Living
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            宿舍與餐廳
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600">
            大一新生第一年通常需要住學校宿舍或指定的 private housing。以下為 TSA
            整理過、較多學長姐曾經住過的選項，實際申請與費用請以學校網站為準。
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {CAMPUS_HOUSING.map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-neutral-200 p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <BulletList items={item.details} />
                <Link
                  href={item.href}
                  className="mt-5 inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4"
                >
                  {item.hrefLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="campus-systems" className="scroll-mt-24 border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Campus Systems
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            學校常用網站
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SCHOOL_WEBSITES.map((site) => (
              <article
                key={site.title}
                className="rounded-md border border-neutral-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {site.title}
                </h3>
                <BulletList items={site.details} />
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {RECOMMENDED_SITES.map((site) => (
              <Link
                key={site.href}
                href={site.href}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                {site.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="parents" className="scroll-mt-24 border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Parents
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            線上繳費（家長）
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600">
            如果學費要由家長或其他人付款，學生可以在 UI-Pay 設定 authorized
            payer，讓付款人也能進行繳費動作。
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {PARENT_PAYMENT_STEPS.map((step, index) => (
              <article
                key={step.title}
                className="rounded-md border border-neutral-200 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <BulletList items={step.details} />
              </article>
            ))}
          </div>
          <Link
            href="https://www.uiuctsa.com/ui-pay"
            rel="noopener noreferrer"
            target="_blank"
            className="mt-8 inline-flex rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            View old UI-Pay guide
          </Link>
        </div>
      </section>

      <section
        id="military-service"
        className="scroll-mt-24 border-t border-neutral-100 bg-neutral-50"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Taiwan
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            兵役
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {MILITARY_SERVICE.map((section) => (
              <article
                key={section.title}
                className="rounded-md border border-neutral-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-neutral-700">
                  {section.details.map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <Link
            href="https://www.taiwanembassy.org/"
            rel="noopener noreferrer"
            target="_blank"
            className="mt-8 inline-flex rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            內政部役政署參考資訊
          </Link>
        </div>
      </section>
    </main>
  );
}
