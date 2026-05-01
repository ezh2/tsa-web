import { NextResponse } from "next/server";
import { isMemberProfileComplete } from "@/core/member-profile";
import { getCurrentUser } from "@/core/rbac/server";
import { createClient } from "@/core/supabase/server";

function safeNext(value: string | null): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNext(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const user = await getCurrentUser();
  if (user && !isMemberProfileComplete(user)) {
    return NextResponse.redirect(
      new URL(`/account/onboarding?next=${encodeURIComponent(next)}`, requestUrl),
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl));
}
