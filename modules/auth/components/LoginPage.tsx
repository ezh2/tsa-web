import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction, signUpAction } from "@/modules/auth/server/actions";
import { getCurrentUser } from "@/core/rbac/server";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-900";

const tabClass =
  "flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition";

export async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; next?: string }>;
}) {
  const { mode, error, next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(next ?? "/");

  const isSignup = mode === "signup";

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-neutral-50 px-6 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-neutral-600 hover:text-neutral-900"
        >
          ← Back to UIUC TSA
        </Link>

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {isSignup
              ? "Sign up to RSVP for events and stay in touch."
              : "Sign in to your UIUC TSA account."}
          </p>

          <div className="mt-6 flex gap-1 rounded-lg bg-neutral-100 p-1">
            <Link
              href="/login"
              className={
                tabClass +
                " " +
                (!isSignup
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900")
              }
            >
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className={
                tabClass +
                " " +
                (isSignup
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900")
              }
            >
              Sign up
            </Link>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <form
            action={isSignup ? signUpAction : signInAction}
            className="mt-6 space-y-3"
          >
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-neutral-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-neutral-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                minLength={isSignup ? 6 : undefined}
                className={inputClass}
              />
              {isSignup && (
                <p className="text-[11px] text-neutral-500">
                  At least 6 characters.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">
            {isSignup ? "Already have an account? " : "New to UIUC TSA? "}
            <Link
              href={isSignup ? "/login" : "/login?mode=signup"}
              className="font-medium text-neutral-900 hover:underline"
            >
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
