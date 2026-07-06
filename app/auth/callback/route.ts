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

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const authEmail = authUser?.email?.toLowerCase() ?? "";
  if (authUser && authEmail && !authEmail.endsWith("@illinois.edu")) {
    await supabase.auth.signOut();
    const params = new URLSearchParams();
    params.set(
      "error",
      "UIUC TSA accounts require an @illinois.edu email. Sign in with your University Google account.",
    );
    return NextResponse.redirect(
      new URL(`/login?${params.toString()}`, requestUrl),
    );
  }

  const user = await getCurrentUser();
  if (user && !isMemberProfileComplete(user)) {
    return NextResponse.redirect(
      new URL(`/account/onboarding?next=${encodeURIComponent(next)}`, requestUrl),
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl));
}
