"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/core/supabase/server";

const DISPLAY_NAME_MAX = 100;

function loginErrorRedirect(message: string, mode?: "signup"): never {
  const params = new URLSearchParams();
  params.set("error", message);
  if (mode) params.set("mode", mode);
  redirect(`/login?${params.toString()}`);
}

function accountErrorRedirect(message: string): never {
  redirect(`/account?error=${encodeURIComponent(message)}`);
}

export async function signUpAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    loginErrorRedirect("Email and password are required.", "signup");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) loginErrorRedirect(error.message, "signup");

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    loginErrorRedirect("Email and password are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) loginErrorRedirect(error.message);

  revalidatePath("/", "layout");
  redirect("/");
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
