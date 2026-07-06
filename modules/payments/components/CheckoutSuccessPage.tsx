import Link from "next/link";
import { redirect } from "next/navigation";
import { hasRole } from "@/core/rbac";
import { getCurrentUser } from "@/core/rbac/server";
import { fmtAmount } from "@/modules/payments/lib/format";
import { getProduct } from "@/modules/payments/lib/products";
import { getStripe } from "@/modules/payments/lib/stripe";
import type Stripe from "stripe";

// Purely informational: this page reads the session state from Stripe to show
// a confirmation. It never grants anything — fulfillment is webhook-only.
export async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/membership");

  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/membership");

  let session: Stripe.Checkout.Session | null = null;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    session = null;
  }

  // Only the buyer (or a director) may view a session's confirmation.
  if (
    !session ||
    (session.metadata?.user_id !== user.id && !hasRole(user.role, "director"))
  ) {
    redirect("/membership");
  }

  const product = getProduct(session.metadata?.product_key ?? "");
  const paid = session.payment_status === "paid";
  const open = session.status === "open";
  const shirtSize =
    session.custom_fields?.find((field) => field.key === "shirt_size")?.dropdown
      ?.value ?? null;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Membership
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
          {paid
            ? "Payment confirmed"
            : open
              ? "Payment not completed"
              : "Payment processing"}
        </h1>
      </header>

      <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
        {paid ? (
          <>
            <p className="text-sm leading-6 text-neutral-700">
              Thank you! Your payment for{" "}
              <span className="font-semibold text-neutral-900">
                {product?.name ?? "your order"}
              </span>{" "}
              was received.
            </p>
            <dl className="mt-5 divide-y divide-neutral-100 border-t border-neutral-100 text-sm">
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-neutral-500">Amount</dt>
                <dd className="font-medium text-neutral-900">
                  {fmtAmount(
                    session.amount_total ?? product?.amountCents ?? 0,
                    session.currency ?? "usd",
                  )}
                </dd>
              </div>
              {shirtSize && (
                <div className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-neutral-500">T-shirt size</dt>
                  <dd className="font-medium text-neutral-900">{shirtSize}</dd>
                </div>
              )}
            </dl>
            {product?.grantsMembership && (
              <p className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Your account is being upgraded to member automatically — this
                takes a few seconds. Refresh your account page if it hasn&apos;t
                appeared yet.
              </p>
            )}
            {product?.collectsShirtSize && (
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                T-shirt pickup details will be announced through TSA channels.
              </p>
            )}
          </>
        ) : open ? (
          <p className="text-sm leading-6 text-neutral-700">
            This checkout was not completed and you have not been charged. You
            can start again from the membership page.
          </p>
        ) : (
          <p className="text-sm leading-6 text-neutral-700">
            Your payment is still processing. Your order will appear on your
            account page once it completes.
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/account"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          My account
        </Link>
        <Link
          href="/membership"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          Back to membership
        </Link>
      </div>
    </main>
  );
}
