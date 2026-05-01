"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ACADEMIC_STAGES, getAcademicYear } from "@/core/academic-year";
import { isMemberProfileComplete } from "@/core/member-profile";
import { createClient } from "@/core/supabase/server";
import type { AcademicStage } from "@/core/types";

const DISPLAY_NAME_MAX = 100;
const NAME_MAX = 80;
const NETID_PATTERN = /^[a-z][a-z0-9-]{1,31}$/i;
const PHONE_PATTERN = /^[0-9()+\-\s.]{7,24}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function illinoisEmailFromNetid(netid: string): string {
  return `${netid.toLowerCase()}@illinois.edu`;
}

function loginErrorRedirect(
  message: string,
  mode?: "signup",
  next?: string,
): never {
  const params = new URLSearchParams();
  params.set("error", message);
  if (mode) params.set("mode", mode);
  if (next) params.set("next", next);
  redirect(`/login?${params.toString()}`);
}

function accountErrorRedirect(message: string): never {
  redirect(`/account?error=${encodeURIComponent(message)}`);
}

function onboardingErrorRedirect(message: string, next?: string): never {
  const params = new URLSearchParams();
  params.set("error", message);
  if (next) params.set("next", next);
  redirect(`/account/onboarding?${params.toString()}`);
}

function safeRedirectPath(value: FormDataEntryValue | string | null): string {
  const raw = String(value ?? "").trim();
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

function splitName(fullName: string): {
  firstName: string | null;
  lastName: string | null;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: null, lastName: null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function validateMemberProfileFields({
  firstName,
  lastName,
  netid,
  phoneNumber,
  email,
  personalEmail,
  academicStage,
  next,
  destination,
}: {
  firstName: string;
  lastName: string;
  netid: string;
  phoneNumber: string;
  email: string;
  personalEmail: string;
  academicStage: AcademicStage;
  next?: string;
  destination: "login" | "onboarding";
}) {
  const fail =
    destination === "login"
      ? (message: string) => loginErrorRedirect(message, "signup", next)
      : (message: string) => onboardingErrorRedirect(message, next);

  if (
    !firstName ||
    !lastName ||
    !netid ||
    !phoneNumber ||
    !email ||
    !personalEmail ||
    !academicStage
  ) {
    fail("All profile fields are required.");
  }

  if (firstName.length > NAME_MAX || lastName.length > NAME_MAX) {
    fail(`Names must be ${NAME_MAX} characters or fewer.`);
  }

  if (!NETID_PATTERN.test(netid)) {
    fail("Enter a valid NetID.");
  }

  if (!PHONE_PATTERN.test(phoneNumber)) {
    fail("Enter a valid phone number.");
  }

  if (!EMAIL_PATTERN.test(email) || !email.endsWith("@illinois.edu")) {
    fail("Enter a valid NetID.");
  }

  if (!EMAIL_PATTERN.test(personalEmail)) {
    fail("Enter a valid personal email address.");
  }

  if (!ACADEMIC_STAGES.includes(academicStage)) {
    fail("Choose a valid academic year.");
  }
}

export async function signUpAction(formData: FormData): Promise<void> {
  const next = safeRedirectPath(formData.get("next"));
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const netid = String(formData.get("netid") ?? "").trim().toLowerCase();
  const phoneNumber = String(formData.get("phone_number") ?? "").trim();
  const email = illinoisEmailFromNetid(netid);
  const personalEmail = String(formData.get("personal_email") ?? "")
    .trim()
    .toLowerCase();
  const academicStage = String(
    formData.get("academic_stage") ?? "",
  ) as AcademicStage;
  const password = String(formData.get("password") ?? "");

  if (
    !firstName ||
    !lastName ||
    !netid ||
    !phoneNumber ||
    !personalEmail ||
    !academicStage ||
    !password
  ) {
    loginErrorRedirect("All signup fields are required.", "signup", next);
  }

  validateMemberProfileFields({
    firstName,
    lastName,
    netid,
    phoneNumber,
    email,
    personalEmail,
    academicStage,
    next,
    destination: "login",
  });

  if (password.length < 6) {
    loginErrorRedirect("Password must be at least 6 characters.", "signup", next);
  }

  const academicYear = getAcademicYear();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`,
        netid,
        phone_number: phoneNumber,
        personal_email: personalEmail,
        academic_stage_start: academicStage,
        academic_stage_recorded_year: academicYear,
      },
    },
  });

  if (error) loginErrorRedirect(error.message, "signup", next);

  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        email,
        display_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        netid,
        phone_number: phoneNumber,
        personal_email: personalEmail,
        academic_stage_start: academicStage,
        academic_stage_recorded_year: academicYear,
      })
      .eq("id", data.user.id);

    if (profileError) loginErrorRedirect(profileError.message, "signup", next);
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signInAction(formData: FormData): Promise<void> {
  const next = safeRedirectPath(formData.get("next"));
  const netid = String(formData.get("netid") ?? "").trim().toLowerCase();
  const email = illinoisEmailFromNetid(netid);
  const password = String(formData.get("password") ?? "");

  if (!netid || !password) {
    loginErrorRedirect("NetID and password are required.");
  }

  if (!NETID_PATTERN.test(netid)) {
    loginErrorRedirect("Enter a valid NetID.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) loginErrorRedirect(error.message);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "first_name, last_name, netid, phone_number, email, personal_email, academic_stage_start, academic_stage_recorded_year",
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profile && !isMemberProfileComplete(profile)) {
      redirect(`/account/onboarding?next=${encodeURIComponent(next)}`);
    }
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signInWithGoogleAction(formData: FormData): Promise<void> {
  const next = safeRedirectPath(formData.get("next"));
  const origin = (await headers()).get("origin");
  if (!origin) loginErrorRedirect("Could not start Google sign in.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    loginErrorRedirect(error?.message ?? "Could not start Google sign in.");
  }

  redirect(data.url);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateDisplayNameAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const raw = String(formData.get("display_name") ?? "").trim();
  if (raw.length > DISPLAY_NAME_MAX) {
    accountErrorRedirect(
      `Display name must be ${DISPLAY_NAME_MAX} characters or fewer.`,
    );
  }
  const value = raw === "" ? null : raw;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: value })
    .eq("id", user.id);

  if (error) accountErrorRedirect(error.message);

  revalidatePath("/account");
  redirect("/account?account=updated");
}

export async function completeGoogleProfileAction(
  formData: FormData,
): Promise<void> {
  const next = safeRedirectPath(formData.get("next"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/account/onboarding")}`);

  const fullName = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "");
  const fallbackName = splitName(fullName);
  const userEmail = String(user.email ?? "").trim().toLowerCase();

  const firstName =
    String(formData.get("first_name") ?? "").trim() || fallbackName.firstName || "";
  const lastName =
    String(formData.get("last_name") ?? "").trim() || fallbackName.lastName || "";
  const netid = String(formData.get("netid") ?? "").trim().toLowerCase();
  const phoneNumber = String(formData.get("phone_number") ?? "").trim();
  const email = illinoisEmailFromNetid(netid);
  const personalEmail =
    String(formData.get("personal_email") ?? "").trim().toLowerCase() ||
    (userEmail.endsWith("@illinois.edu") ? "" : userEmail);
  const academicStage = String(
    formData.get("academic_stage") ?? "",
  ) as AcademicStage;

  validateMemberProfileFields({
    firstName,
    lastName,
    netid,
    phoneNumber,
    email,
    personalEmail,
    academicStage,
    next,
    destination: "onboarding",
  });

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      display_name: `${firstName} ${lastName}`,
      netid,
      phone_number: phoneNumber,
      email,
      personal_email: personalEmail,
      academic_stage_start: academicStage,
      academic_stage_recorded_year: getAcademicYear(),
    })
    .eq("id", user.id);

  if (error) onboardingErrorRedirect(error.message, next);

  revalidatePath("/", "layout");
  revalidatePath("/account");
  redirect(next);
}
