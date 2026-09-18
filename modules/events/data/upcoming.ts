import type { StaticImageData } from "next/image";
import newStudentOrientationFlyer from "@/images/events/2627/new stud oren 2627.png";

export interface StaticUpcomingEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  href?: string;
  image?: {
    src: StaticImageData;
    alt: string;
  };
}

const NEW_STUDENT_ORIENTATION_URL =
  "https://drive.google.com/file/d/1XQUzouvdKBJ9bWFAMBzvMgI-GwMjHEQn/view";

export const STATIC_UPCOMING_EVENTS: readonly StaticUpcomingEvent[] = [
  {
    title: "2026 新生說明會",
    date: "June 27, 2026",
    time: "10:00 - 12:00",
    location: "集思北科大會議中心 2F 貝塔廳",
    description:
      "A focused orientation for new students and parents covering arrival logistics, campus setup, housing, payments, and everyday life at UIUC. Doors open at 9:30.",
    href: NEW_STUDENT_ORIENTATION_URL,
    image: {
      src: newStudentOrientationFlyer,
      alt: "2026 UIUC TSA new student orientation flyer",
    },
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
    title: "New Student Welcome Event",
    date: "August 29, 2026",
    time: "20:00 - 22:00",
    location: "Chili Bistro",
    description:
      "Kick off the semester over dinner at Chili Bistro! Meet fellow new students, connect with TSA members, and enjoy a relaxed evening of good food and conversation as you settle into life at UIUC.",
  },
  {
    title: "General Meeting",
    date: "September 20, 2026",
    time: "TBA",
    location: "AACC",
    description:
      "An interns-only TSA general meeting. Please bring your i-card. Follow Instagram for the latest details.",
  },
  {
    title: "超可盃 籃球",
    date: "September 26, 2026",
    time: "11:30 - 16:30",
    location: "ARC Gym 1, Court 5-6",
    description:
      "A TSA basketball activity. Follow Instagram for the latest schedule and sign-up details.",
  },
  {
    title: "中秋烤肉",
    date: "September 27, 2026",
    time: "11:30",
    location: "Crystal Lake Park",
    description:
      "A Mid-Autumn Festival barbecue gathering. Follow Instagram for the latest ticket details.",
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
    date: "October 9, 2026",
    time: "TBA",
    location: "TBA",
    description:
      "A community celebration for Double Ten Day with social activities, cultural touches, and a festive space for students to gather. Follow Instagram for details.",
  },
  {
    title: "TASC 10/10 Night Market",
    date: "October 10, 2026",
    time: "TBA",
    location: "TASC Night Market, booth location TBA",
    description:
      "A 10/10 night activity with TASC. Follow Instagram for the latest details.",
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

function eventDateTimestamp(event: StaticUpcomingEvent): number {
  const timestamp = Date.parse(event.date);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function startOfToday(now: Date): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function getStaticUpcomingEvents(
  now: Date = new Date(),
): StaticUpcomingEvent[] {
  const today = startOfToday(now);
  return STATIC_UPCOMING_EVENTS.filter(
    (event) => eventDateTimestamp(event) >= today,
  ).sort((a, b) => eventDateTimestamp(a) - eventDateTimestamp(b));
}

export function getStaticPastEvents(
  now: Date = new Date(),
): StaticUpcomingEvent[] {
  const today = startOfToday(now);
  return STATIC_UPCOMING_EVENTS.filter(
    (event) =>
      event.title !== "Welcome Picnic" && eventDateTimestamp(event) < today,
  ).sort((a, b) => eventDateTimestamp(b) - eventDateTimestamp(a));
}
