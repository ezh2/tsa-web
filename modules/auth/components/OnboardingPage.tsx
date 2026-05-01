import { redirect } from "next/navigation";
import { ACADEMIC_STAGE_LABELS, ACADEMIC_STAGES } from "@/core/academic-year";
import { isMemberProfileComplete } from "@/core/member-profile";
import { requireAuth } from "@/core/rbac/server";
import { completeGoogleProfileAction } from "@/modules/auth/server/actions";
import type { AcademicStage } from "@/core/types";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-900";

function safeNext(value: string | undefined): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const user = await requireAuth();
  const { next: rawNext, error } = await searchParams;
  const next = safeNext(rawNext);

  if (isMemberProfileComplete(user)) redirect(next);

  const authEmail = user.auth_email?.toLowerCase() ?? "";
  const defaultNetid =
    user.netid ??
    (authEmail.endsWith("@illinois.edu") ? authEmail.split("@")[0] : "");
  const defaultPersonalEmail =
    user.personal_email ?? (authEmail.endsWith("@illinois.edu") ? "" : authEmail);

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-neutral-50 px-6 py-16">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Finish signup
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
            Complete your TSA profile
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            We filled in what Google shared. Add the remaining member details.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <form action={completeGoogleProfileAction} className="mt-6 space-y-3">
          <input type="hidden" name="next" value={next} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="First name"
              name="first_name"
              autoComplete="given-name"
              defaultValue={user.first_name ?? ""}
            />
            <Field
              label="Last name"
              name="last_name"
              autoComplete="family-name"
              defaultValue={user.last_name ?? ""}
            />
            <Field
              label="NetID"
              name="netid"
              autoComplete="username"
              placeholder="netid"
              defaultValue={defaultNetid}
            />
            <Field
              label="Phone number"
              name="phone_number"
              type="tel"
              autoComplete="tel"
              placeholder="(217) 555-0123"
              defaultValue={user.phone_number ?? ""}
            />
          </div>

          <Field
            label="Personal email"
            name="personal_email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            defaultValue={defaultPersonalEmail}
          />

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
              defaultValue={user.academic_stage_start ?? ""}
              className={inputClass}
            >
              <option value="" disabled>
                Select your current year
              </option>
              {ACADEMIC_STAGES.map((stage: AcademicStage) => (
                <option key={stage} value={stage}>
                  {ACADEMIC_STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-500">
              This advances automatically each academic year until grad.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Save profile
          </button>
        </form>
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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        required
        className={inputClass}
      />
    </div>
  );
}
