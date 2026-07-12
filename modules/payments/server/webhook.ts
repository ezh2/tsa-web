import "server-only";
// Stripe webhook fulfillment is temporarily paused.
// import type { SupabaseClient } from "@supabase/supabase-js";
// import type Stripe from "stripe";
// import { getProduct } from "@/modules/payments/lib/products";
// import { getStripe, getStripeWebhookSecret } from "@/modules/payments/lib/stripe";
// import { createAdminClient } from "./admin-client";

// The ONLY fulfillment path. Trust model:
//  1. The request is authenticated by verifying Stripe's signature — an
//     unsigned or tampered payload is rejected before anything else runs.
//  2. Each event id is recorded in payments_stripe_event before fulfilling;
//     a duplicate means Stripe retried an already-handled event, so we skip
//     it. This makes fulfillment idempotent (no double role grants/orders).
//  3. Membership is granted only when payment_status is 'paid', and only
//     upgrades 'customer' → 'member' — a director's role can never change.
export async function handleStripeWebhook(): Promise<Response> {
  return Response.json({ received: false, paused: true }, { status: 503 });
}

// Original Stripe webhook implementation:
// export async function handleStripeWebhook(request: Request): Promise<Response> {
//   const payload = await request.text();
//   const signature = request.headers.get("stripe-signature");
//   if (!signature) {
//     return new Response("Missing stripe-signature header", { status: 400 });
//   }
//
//   let event: Stripe.Event;
//   try {
//     event = await getStripe().webhooks.constructEventAsync(
//       payload,
//       signature,
//       getStripeWebhookSecret(),
//     );
//   } catch {
//     return new Response("Invalid signature", { status: 400 });
//   }
//
//   const admin = createAdminClient();
//
//   const { error: ledgerError } = await admin
//     .from("payments_stripe_event")
//     .insert({ id: event.id, type: event.type });
//   if (ledgerError) {
//     // 23505 = unique_violation: this event was already processed.
//     if (ledgerError.code === "23505") {
//       return Response.json({ received: true, duplicate: true });
//     }
//     return new Response("Could not record event", { status: 500 });
//   }
//
//   try {
//     switch (event.type) {
//       case "checkout.session.completed":
//       case "checkout.session.async_payment_succeeded":
//         await fulfillCheckoutSession(admin, event.data.object);
//         break;
//       case "checkout.session.async_payment_failed":
//         await markSessionFailed(admin, event.data.object);
//         break;
//       case "charge.refunded":
//         await markOrderRefunded(admin, event.data.object);
//         break;
//       default:
//         break;
//     }
//   } catch {
//     // Un-record the event so Stripe's retry can reprocess it.
//     await admin.from("payments_stripe_event").delete().eq("id", event.id);
//     return new Response("Webhook handler failed", { status: 500 });
//   }
//
//   return Response.json({ received: true });
// }
//
// async function fulfillCheckoutSession(
//   admin: SupabaseClient,
//   session: Stripe.Checkout.Session,
// ): Promise<void> {
//   const product = getProduct(session.metadata?.product_key ?? "");
//   // Not a session this integration created — ignore.
//   if (!product) return;
//
//   const userId = session.metadata?.user_id ?? session.client_reference_id ?? null;
//   const paid = session.payment_status === "paid";
//   const shirtSize =
//     session.custom_fields?.find((field) => field.key === "shirt_size")?.dropdown
//       ?.value ?? null;
//   const paymentIntentId =
//     typeof session.payment_intent === "string"
//       ? session.payment_intent
//       : (session.payment_intent?.id ?? null);
//
//   const { error } = await admin.from("payments_order").upsert(
//     {
//       stripe_session_id: session.id,
//       user_id: userId,
//       product_key: product.key,
//       product_name: product.name,
//       status: paid ? "paid" : "processing",
//       amount_total: session.amount_total ?? product.amountCents,
//       currency: session.currency ?? "usd",
//       shirt_size: shirtSize,
//       stripe_payment_intent_id: paymentIntentId,
//     },
//     { onConflict: "stripe_session_id" },
//   );
//   if (error) throw new Error(error.message);
//
//   if (paid && product.grantsMembership && userId) {
//     const { error: roleError } = await admin
//       .from("profiles")
//       .update({ role: "member" })
//       .eq("id", userId)
//       .eq("role", "customer");
//     if (roleError) throw new Error(roleError.message);
//   }
// }
//
// async function markSessionFailed(
//   admin: SupabaseClient,
//   session: Stripe.Checkout.Session,
// ): Promise<void> {
//   const { error } = await admin
//     .from("payments_order")
//     .update({ status: "failed" })
//     .eq("stripe_session_id", session.id);
//   if (error) throw new Error(error.message);
// }
//
// async function markOrderRefunded(
//   admin: SupabaseClient,
//   charge: Stripe.Charge,
// ): Promise<void> {
//   // charge.refunded is true only for full refunds; partial refunds keep the
//   // order as paid. Refunds never auto-demote a member — directors decide.
//   if (!charge.refunded) return;
//   const paymentIntentId =
//     typeof charge.payment_intent === "string"
//       ? charge.payment_intent
//       : (charge.payment_intent?.id ?? null);
//   if (!paymentIntentId) return;
//
//   const { error } = await admin
//     .from("payments_order")
//     .update({ status: "refunded" })
//     .eq("stripe_payment_intent_id", paymentIntentId);
//   if (error) throw new Error(error.message);
// }
