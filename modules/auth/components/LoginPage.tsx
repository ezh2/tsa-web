import Link from "next/link";
import { redirect } from "next/navigation";
import { ACADEMIC_STAGE_LABELS, ACADEMIC_STAGES } from "@/core/academic-year";
import {
  signInAction,
  signInWithGoogleAction,
  signUpAction,
} from "@/modules/auth/server/actions";
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
      <div className="w-full max-w-2xl">
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
              ? "Create your TSA member profile with your student contact info."
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
            <input type="hidden" name="next" value={next ?? "/"} />
            {isSignup && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="First name"
                  name="first_name"
                  autoComplete="given-name"
                />
                <Field
                  label="Last name"
                  name="last_name"
                  autoComplete="family-name"
                />
                <Field
                  label="NetID"
                  name="netid"
                  autoComplete="username"
                  placeholder="netid"
                />
                <Field
                  label="Phone number"
                  name="phone_number"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(217) 555-0123"
                />
              </div>
            )}
            {!isSignup && (
              <Field
                label="NetID"
                name="netid"
                autoComplete="username"
                placeholder="netid"
              />
            )}
            {isSignup && (
              <>
                <div className="space-y-1">
                  <label
                    htmlFor="personal_email"
                    className="block text-xs font-medium text-neutral-700"
                  >
                    Personal email
                  </label>
                  <input
                    id="personal_email"
                    name="personal_email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="academic_stage"
                    className="block text-xs font-medium text-neutral-700"
                  >
                    Year in school
                  </label>
                  <select
                    id="academic_stage"
                    name="academic_stage"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select your current year
                    </option>
                    {ACADEMIC_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {ACADEMIC_STAGE_LABELS[stage]}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-neutral-500">
                    This advances automatically each academic year until grad.
                  </p>
                </div>
              </>
            )}
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

          <div className="my-6 flex items-center gap-3 text-xs text-neutral-400">
            <div className="h-px flex-1 bg-neutral-200" />
            <span>or</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form action={signInWithGoogleAction}>
            <input type="hidden" name="next" value={next ?? "/"} />
            <button
              type="submit"
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
            >
              Continue with Google
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

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-xs font-medium text-neutral-700"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className={inputClass}
      />
    </div>
  );
}
