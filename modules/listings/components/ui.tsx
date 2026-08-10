import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="border-b border-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-16">
        <Link
          href="/current-students"
          className="text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
        >
          Back to Current Students
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
          {body}
        </p>
      </div>
    </section>
  );
}

export function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
  min,
  step,
  inputMode,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: number | string;
  step?: number | string;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        inputMode={inputMode}
        className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
      />
    </label>
  );
}

export function Textarea({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={3}
        className="mt-2 w-full resize-none rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
      />
    </label>
  );
}

export function StatusBanner({
  posted,
  deleted,
  error,
}: {
  posted?: string;
  deleted?: string;
  error?: string;
}) {
  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto mt-6 w-full max-w-6xl px-6"
      >
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      </div>
    );
  }

  if (posted === "ok") {
    return (
      <div role="status" className="mx-auto mt-6 w-full max-w-6xl px-6">
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Post saved.
        </p>
      </div>
    );
  }

  if (deleted === "ok") {
    return (
      <div role="status" className="mx-auto mt-6 w-full max-w-6xl px-6">
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Post deleted.
        </p>
      </div>
    );
  }

  return null;
}

export function SignInToPost({ next }: { next: string }) {
  return (
    <div className="h-fit rounded-md border border-neutral-200 bg-neutral-50 p-5">
      <h2 className="text-lg font-semibold text-neutral-900">Post a listing</h2>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        Sign in with your UIUC account to publish a post. Everyone can browse
        without signing in.
      </p>
      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        className="mt-5 inline-flex w-full justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
      >
        Sign in to post
      </Link>
    </div>
  );
}
