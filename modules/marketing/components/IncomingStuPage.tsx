import Image from "next/image";
import Link from "next/link";
import newStudentOrientationFlyer from "../../../images/events/2627/new stud oren 2627.png";

const NEW_STUDENT_ORIENTATION_URL =
  "https://drive.google.com/file/d/1XQUzouvdKBJ9bWFAMBzvMgI-GwMjHEQn/view";

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

const PASSPORT_ITEMS = [
  "簡式護照資料表",
  "證件照兩張（六個月內彩色、光面、白色背景）",
  "舊護照",
  "身分證正本",
  "規費 $1,300 / 本",
];

const VISA_DOCUMENTS = [
  "I-901 付款收據",
  "AIT 面試預約單",
  "DS-160 確認頁面",
  "I-20 文件",
  "成績單",
  "財力證明",
  "入學證明",
  "TOEFL / IELTS / GRE / GMAT",
  "簽證申請手續費繳費收據（郵政劃撥）",
];

const SPECIAL_DOCUMENTS = [
  "台灣戶籍謄本（若改過名）",
  "個人簡歷或履歷表（學士以上 / 有技術或科學背景申請人）",
  "放棄證明（若曾有綠卡）",
];

const ORIENTATION_DETAILS = [
  "日期：2026 年 6 月 27 日",
  "時間：10:00 AM - 12:00 PM",
  "開放入場：9:30 AM",
  "地點：集思北科大會議中心 2F 貝塔廳",
  "建議新生與家長一起參加，現場會整理抵達 UIUC 前後最常遇到的問題。",
];

const DEPARTURE_ITEMS = [
  "護照",
  "I-20 文件",
  "登機證",
  "現金",
  "親友、接機人或住處的地址與電話",
  "起飛前兩小時至機場櫃檯報到",
  "出發前確認航空公司最新旅遊限制與規定",
];

const CUSTOMS_ITEMS = [
  "入境美國前，機上空服員通常會發放海關申報書；請在下飛機前填妥。",
  "不可攜帶肉類、農作物等受限制物品，申報內容建議如實填寫。",
  "若攜帶超過一萬美金現金，應主動向海關申報並填寫 4790 表單。",
  "通關時請備妥護照、學生簽證、I-20 等文件。",
  "移民官可能詢問就讀學校、美國居住地址、來訪目的、攜帶現金及貴重物品，簡潔誠實回答即可。",
];

const TRAVEL_OPTIONS = [
  {
    title: "Shuttle Bus 客運",
    href: "https://peoriacharter.com/",
    details: [
      "行李數量：2 件大型行李，一件隨身（超過每一件多加 $10）",
      "票價：Around $37",
      "通勤時間：3 - 4 小時（會繞去其他地點接送）",
      "可於 ORD 機場國際航廈 Terminal 5 或 Terminal 2 的 Bus Shuttle Center 搭乘",
    ],
  },
  {
    title: "Train 火車",
    href: "https://www.amtrak.com/",
    details: [
      "行李數量：2 件大型行李",
      "票價：Around $39",
      "通勤方式：需先搭乘芝加哥地鐵 CTA 至 Chicago 市中心的 Union Station，再轉乘 Amtrak 到香檳",
    ],
  },
  {
    title: "Automobile 汽車",
    details: [
      "朋友接送：記得請他吃飯，來回會開 4 - 5 個小時",
      "Uber / Lyft：超過一小時的車程較難，轎車通常可放兩件行李，價格大約 $170 - $250",
      "Uber / Lyft 休旅或廂型車：可放至少四件行李，價格大約 $430 - $500",
      "華人包車：價格大約 $250 - $300（可能臨時漲價），廂型車 / 四人可放置 7 - 8 件行李",
    ],
  },
];

const HOUSING_OPTIONS = [
  {
    title: "學校宿舍 Early Arrival",
    details: [
      "若抵達學校時間比宿舍或租屋合約早，可以考慮申請學校宿舍 early arrival。",
      "通常為按天數計算，一天 $40 - $60。",
    ],
    href: "https://housing.illinois.edu/",
    hrefLabel: "UIUC Housing Website",
  },
  {
    title: "學生轉租 Sublease",
    details: [
      "相關資訊可至臉書社團上詢問，或行前與學長姐聯絡。",
      "可留意 Taiwanese at UIUC 等社群資訊。",
    ],
  },
  {
    title: "Airbnb",
    details: [
      "當地屋主或租房的學生會把 sublease 放至 Airbnb 上，比私下聯絡更有保障。",
    ],
  },
  {
    title: "飯店 Hotel",
    details: [
      "Illini Union Hotel",
      "TownePlace Suites by Marriott Champaign Urbana / Campustown",
      "Hampton Inn Champaign / Urbana",
      "Hyatt Place Champaign / Urbana",
      "Hilton Garden Inn Champaign / Urbana",
      "Holiday Inn Express & Suites Urbana-Champaign",
      "Holiday Inn Champaign",
    ],
  },
];

const CAMPUS_CHECKIN = [
  {
    title: "ISSS 報到",
    details: [
      "Complete Online Check-in E-Form。",
      "F-1 與 J-1 學生須準備護照、入境簽證、I-20、I-94。",
      "Complete New International Student Checklist。",
      "Check-in 日期與時間每年可能不同，請以 ISSS 官方資訊為準。",
    ],
    href: "https://isss.illinois.edu/",
    hrefLabel: "International Student Check-In",
  },
  {
    title: "宿舍 / 系上報到",
    details: [
      "註冊搬進宿舍時間。",
      "到指定地點領取鑰匙以及新生包；每個系的地點不一樣。",
      "宿舍沒有限制幫忙 move-in 人數，但是幫忙的人不能過夜。",
    ],
  },
  {
    title: "領取學生證 I-Card",
    details: [
      "可以在抵達學校前先上傳照片，或到現場拍照。",
      "辦理時請攜帶護照或相關身分證明文件。",
      "在 Illini Union Bookstore 領取學生證。",
      "建議先領取學生證再到宿舍報到；出示學生證可免費搭乘校內公車。",
    ],
    href: "https://icard.uillinois.edu/",
    hrefLabel: "I-Card Office",
  },
  {
    title: "McKinley 健康檢查",
    details: [
      "建議在台灣完成所需疫苗接種與相關健康檢查，通常較便宜。",
      "到 MyMcKinley 上傳 Covid-19 Vaccine Card、TB Screening Result、Medical History。",
      "TB Screening 可在台灣家醫科 / 旅遊科完成；若到 MyMcKinley 做，開學第一週可能排隊較久。",
      "若在 McKinley 做相關健檢，請攜帶護照、I-Card、相關文件、現金或 Debit / Credit Card。",
    ],
    href: "https://mymckinley.illinois.edu/",
    hrefLabel: "MyMcKinley",
  },
  {
    title: "社會安全碼 SSN",
    details: [
      "SSN 類似在美國的身分證號碼。",
      "SSN 可降低買車、租車、考駕照、申請信用卡的門檻。",
      "通常需要工作證明、immigration status 文件（I-20、I-94），再至 Social Security Administration Office 辦理。",
    ],
  },
  {
    title: "設定 NetID 帳號",
    details: [
      "NetID 用於校內網路資源、選課、線上圖書館、學校信箱等服務。",
      "請至 NetID Claim 網站設定帳號。",
      "若有問題可以聯繫 UIUC Technology Services。",
    ],
    href: "https://netidclaim.illinois.edu/",
    hrefLabel: "NetID Claim",
  },
];

const CAMPUS_HOUSING = [
  {
    title: "University Residence Hall",
    details: [
      "Urbana North：Allen Hall、Busey-Evans、Illinois Street Residence Halls (ISR)、Lincoln Avenue Residence Halls (LAR)。",
      "Urbana South：Florida Avenue Residence Halls (FAR)、Pennsylvania Avenue Residence Halls (PAR)。",
      "Ikenberry Commons North：Barton and Lundgren、Hopkins、Nugent、Wassaja、Weston。",
      "Ikenberry Commons South：Bousfield、Scott、Snyder、Taft-Van Doren。",
    ],
    href: "https://housing.illinois.edu/",
    hrefLabel: "University Residence Hall",
  },
  {
    title: "Private Certified Housing",
    details: [
      "選項包含 Armory House、Bromley Hall、Brown House on Coler、Evans Scholarship House、Hendrick House、Illini Chabad、Illini Tower、Koinonia、Nabor House、Newman Hall、Presby Hall、Stratford House、Sutton House。",
      "大一新生通常需住學校宿舍或指定 private housing；收到通知後建議盡快登記，以免錯過想要的宿舍。",
    ],
    href: "https://certified.housing.illinois.edu/",
    hrefLabel: "Private Certified Housing",
  },
  {
    title: "Dining Hall 宿舍餐廳",
    details: [
      "住在 University Housing 通常必須搭配 Meal Plan。",
      "一個 Meal 代表 Dining Hall 一餐，Credit 可在宿舍便利商店使用，也可用在 Dining Hall。",
      "Meals 沒用完會在一個星期結束後重新計算，不會累計；Credit 則可以延期一個星期。",
    ],
    href: "https://housing.illinois.edu/dining",
    hrefLabel: "Dining",
  },
];

const SCHOOL_WEBSITES = [
  {
    title: "MyIllini",
    details: [
      "Account balance",
      "Course schedule",
      "Reminders from UIUC",
      "Grades",
      "Midterm / final schedule",
    ],
  },
  {
    title: "Self-Service",
    details: [
      "Enhanced registration：prepare for registration、register for class、plan ahead、view schedule generator。",
      "繳費：payment is due on the 28th，可使用 UI Pay online with e-check, credit card, or international wire。",
      "Records and transcripts：查看 midterm and final grades、成績單。",
    ],
  },
  {
    title: "Course Explorer",
    details: [
      "Class schedule、description、credit hours。",
      "Course status、restriction、location、instructor。",
      "Gen-Ed requirement。",
      "Registration resources。",
    ],
  },
  {
    title: "Degree Audit",
    details: [
      "可以看到自己 fulfill 了幾個學分，以及還缺哪些學分。",
      "如果要轉系，可以選取其他科系並透過檢驗系統查看之後需要哪些學分。",
    ],
  },
];

const PARENT_PAYMENT_STEPS = [
  {
    title: "Self-Service",
    details: [
      "登入學生的 UIUC Self-Service account。",
      "選取 Account Billing Information。",
    ],
  },
  {
    title: "UI-Pay",
    details: ["點選 UI-Pay 進入線上繳費相關介面。"],
  },
  {
    title: "Account Billing Information",
    details: [
      "閱讀重要須知。",
      "勾選 payment alert acknowledgement 旁的 check box。",
      "點擊 continue。",
    ],
  },
  {
    title: "Payment Plans",
    details: ["點選要繳交的項目。"],
  },
  {
    title: "Authorize Payers",
    details: [
      "如果要由父母或其他人付款，請在此處進行設定。",
      "填寫 authorized payer 相關資訊即可完成。",
    ],
  },
];

const LEGAL_INFO = [
  {
    title: "SSN",
    details: [
      "SSN 類似在美國的身分識別號碼，但不是所有新生一抵達就需要申請。",
      "通常需要校內工作、助教研究助理職位，或其他符合資格的工作證明，才適合申請。",
      "申請時通常會用到護照、I-20、I-94、工作證明，以及到 Social Security Administration Office 辦理。",
    ],
    href: "https://www.ssa.gov/number-card",
    hrefLabel: "Social Security Administration",
  },
  {
    title: "Visa and F-1 Status",
    details: [
      "簽證是入境美國用，F-1 status 則是在美期間要維持的學生身分。",
      "請保管護照、簽證、I-20、I-94 等文件，並確認 I-20 上的資訊正確。",
      "選課學分、校外工作、CPT / OPT、休學或轉學等問題，應以 ISSS 官方說明為準。",
    ],
    href: "https://isss.illinois.edu/students/incoming-students/",
    hrefLabel: "ISSS Incoming Students",
  },
  {
    title: "I-94 and Immigration Records",
    details: [
      "入境後可至官方 I-94 網站確認入境紀錄是否正確。",
      "若姓名、入境日期、class of admission 或 admit until 資訊有誤，請盡快詢問 ISSS。",
      "未來辦理 SSN、駕照、工作或身分相關事項時，I-94 常會被要求提供。",
    ],
    href: "https://i94.cbp.dhs.gov/",
    hrefLabel: "I-94 Official Website",
  },
  {
    title: "Work Authorization",
    details: [
      "F-1 學生工作規定很嚴格，請不要在未確認規則前接受校外 paid work。",
      "On-campus employment、CPT、OPT 等類型規定不同，開始工作前務必確認資格與流程。",
      "若不確定某個機會是否允許，先問 ISSS 或系上國際學生負責窗口。",
    ],
    href: "https://isss.illinois.edu/students/employment/",
    hrefLabel: "ISSS Employment",
  },
];

const RECOMMENDED_SITES = [
  { label: "Grade Disparity", href: "https://waf.cs.illinois.edu/discovery/grade_disparity_between_sections_at_uiuc/" },
  { label: "Rate My Professor", href: "https://www.ratemyprofessors.com/" },
  { label: "UIUC Reddit", href: "https://www.reddit.com/r/UIUC/" },
];

const MILITARY_SERVICE = [
  {
    title: "役齡前出境",
    details: [
      "於 Office of the Registrar 申請在學證明（Student Enrollment Verification）",
      "將護照影本、申請表、申請費、回郵信封、在學證明寄至駐芝加哥辦事處驗證",
      "返台後攜帶護照及驗證過的在學證明至內政部移民署辦理",
    ],
  },
  {
    title: "役齡後出境",
    details: ["19 歲之年 1 月 1 日後出境需事先申請出境核准"],
  },
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

export function IncomingStuPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Incoming Students
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
            行前準備
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
            給即將前往 UIUC 的新生與家長：這裡整理簽證護照、抵達香檳、短期住宿與兵役相關資訊，幫助你把出發前的準備一次確認好。
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
              <Image
                src={newStudentOrientationFlyer}
                alt="2026 UIUC TSA new student orientation flyer"
                className="h-full w-full object-cover"
                priority
              />
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
