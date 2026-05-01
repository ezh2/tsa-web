import { requireAuth } from "@/core/rbac/server";
import { createClient } from "@/core/supabase/server";
import { MyUpcomingRsvps } from "@/modules/events";
import {
  linkGoogleAction,
  unlinkGoogleAction,
  updateDisplayNameAction,
} from "@/modules/auth/server/actions";
import {
  ACADEMIC_STAGE_LABELS,
  getCurrentAcademicStage,
} from "@/core/academic-year";

function feedbackMessage(
  account: string | undefined,
  error: string | undefined,
): { tone: "ok" | "err"; text: string } | null {
  if (error) return { tone: "err", text: error };
  if (account === "updated") return { tone: "ok", text: "Profile updated." };
  if (account === "linked") return { tone: "ok", text: "Google account linked." };
  if (account === "unlinked")
    return { tone: "ok", text: "Google account unlinked." };
  return null;
}

export async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string; error?: string }>;
}) {
  const user = await requireAuth();
  const { account, error } = await searchParams;
  const feedback = feedbackMessage(account, error);
  const currentAcademicStage = getCurrentAcademicStage(
    user.academic_stage_start,
    user.academic_stage_recorded_year,
  );
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  const supabase = await createClient();
  const { data: identitiesData } = await supabase.auth.getUserIdentities();
  const identities = identitiesData?.identities ?? [];
  const hasGoogle = identities.some((i) => i.provider === "google");
  const onlyIdentity = identities.length <= 1;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Account
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
          My account
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Your profile and upcoming RSVPs.
        </p>
      </header>

      {feedback && (
        <div
          role={feedback.tone === "err" ? "alert" : "status"}
          className={
            "mt-6 rounded-md border px-3 py-2 text-sm " +
            (feedback.tone === "err"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800")
          }
        >
          {feedback.text}
        </div>
      )}

      <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Profile</h2>

        <form action={updateDisplayNameAction} className="mt-4 space-y-2">
          <label
            htmlFor="display_name"
            className="block text-sm font-medium text-neutral-700"
          >
            Display name
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              id="display_name"
              name="display_name"
              type="text"
              maxLength={100}
              defaultValue={user.display_name ?? ""}
              placeholder="How should we show your name?"
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Save
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            Leave blank to clear. Up to 100 characters.
          </p>
        </form>

        <dl className="mt-6 divide-y divide-neutral-100 border-t border-neutral-100 text-sm">
          <Row label="Name" value={fullName || "—"} />
          <Row label="NetID" value={user.netid ?? "—"} />
          <Row label="Illinois email" value={user.email ?? "—"} />
          <Row label="Personal email" value={user.personal_email ?? "—"} />
          <Row label="Phone" value={user.phone_number ?? "—"} />
          <Row
            label="Year in school"
            value={
              currentAcademicStage
                ? ACADEMIC_STAGE_LABELS[currentAcademicStage]
                : "—"
            }
          />
          <Row label="Role" value={user.role} />
          <Row label="User ID" value={user.id} mono />
        </dl>
      </section>

      <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Connected accounts
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          {hasGoogle
            ? "You can sign in with Google."
            : "Link a Google account to sign in faster next time."}
        </p>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-neutral-200 p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900">Google</p>
            <p className="truncate text-xs text-neutral-500">
              {hasGoogle ? "Linked" : "Not linked"}
            </p>
          </div>
          {hasGoogle ? (
            <form action={unlinkGoogleAction}>
              <button
                type="submit"
                disabled={onlyIdentity}
                title={
                  onlyIdentity
                    ? "Cannot unlink your only sign-in method."
                    : undefined
                }
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 transition hover:border-neutral-400 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Unlink
              </button>
            </form>
          ) : (
            <form action={linkGoogleAction}>
              <button
                type="submit"
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Link Google
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">
          Upcoming RSVPs
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Events you&apos;ve RSVP&apos;d to that haven&apos;t happened yet.
        </p>
        <div className="mt-4">
          <MyUpcomingRsvps />
        </div>
      </section>
    </main>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-neutral-500">{label}</dt>
      <dd
        className={
          "max-w-[60%] truncate text-right font-medium text-neutral-900 " +
          (mono ? "font-mono text-xs" : "")
        }
      >
        {value}
      </dd>
    </div>
  );
}
