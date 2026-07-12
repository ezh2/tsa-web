import Link from "next/link";
// Stripe checkout confirmation is temporarily paused.
// import { redirect } from "next/navigation";
// import { hasRole } from "@/core/rbac";
// import { getCurrentUser } from "@/core/rbac/server";
// import { fmtAmount } from "@/modules/payments/lib/format";
// import { getProduct } from "@/modules/payments/lib/products";
// import { getStripe } from "@/modules/payments/lib/stripe";
// import type Stripe from "stripe";

// Purely informational: this page reads the session state from Stripe to show
// a confirmation. It never grants anything — fulfillment is webhook-only.
export async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  void searchParams;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Membership
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
          Checkout paused
        </h1>
      </header>

      <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
        <p className="text-sm leading-6 text-neutral-700">
          Online checkout is temporarily paused, so this page is not checking
          Stripe session status right now.
        </p>
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

// Original Stripe-backed confirmation flow:
// export async function CheckoutSuccessPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ session_id?: string }>;
// }) {
//   const user = await getCurrentUser();
//   if (!user) redirect("/login?next=/membership");
//
//   const { session_id: sessionId } = await searchParams;
//   if (!sessionId) redirect("/membership");
//
//   let session: Stripe.Checkout.Session | null = null;
//   try {
//     session = await getStripe().checkout.sessions.retrieve(sessionId);
//   } catch {
//     session = null;
//   }
//
//   // Only the buyer (or a director) may view a session's confirmation.
//   if (
//     !session ||
//     (session.metadata?.user_id !== user.id && !hasRole(user.role, "director"))
//   ) {
//     redirect("/membership");
//   }
//
//   const product = getProduct(session.metadata?.product_key ?? "");
//   const paid = session.payment_status === "paid";
//   const open = session.status === "open";
//   const shirtSize =
//     session.custom_fields?.find((field) => field.key === "shirt_size")?.dropdown
//       ?.value ?? null;
//
//   return (...);
// }
