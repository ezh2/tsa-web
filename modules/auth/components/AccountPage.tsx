import { requireAuth } from "@/core/rbac/server";
import { MyUpcomingRsvps } from "@/modules/events";
import { updateDisplayNameAction } from "@/modules/auth/server/actions";

function feedbackMessage(
  account: string | undefined,
  error: string | undefined,
): { tone: "ok" | "err"; text: string } | null {
  if (error) return { tone: "err", text: error };
  if (account === "updated") return { tone: "ok", text: "Profile updated." };
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
          <Row label="Email" value={user.email ?? "—"} />
          <Row label="Role" value={user.role} />
          <Row label="User ID" value={user.id} mono />
        </dl>
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
