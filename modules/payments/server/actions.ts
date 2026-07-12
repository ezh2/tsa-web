"use server";

import { redirect } from "next/navigation";
// Stripe checkout is temporarily paused.
// import { headers } from "next/headers";
// import { hasRole } from "@/core/rbac";
// import { getCurrentUser } from "@/core/rbac/server";
// import { getProduct, SHIRT_SIZES } from "@/modules/payments/lib/products";
// import { getStripe } from "@/modules/payments/lib/stripe";
// import type Stripe from "stripe";

// Creates a Stripe Checkout Session and redirects the buyer to Stripe's hosted
// payment page. The client only ever sends a product key — the price, name,
// and membership grant all come from the server-side catalog. Fulfillment
// happens exclusively in the webhook handler, never here.
export async function startCheckoutAction(): Promise<void> {
  redirect("/membership?checkout=paused");
}

// Original Stripe checkout action:
// export async function startCheckoutAction(formData: FormData): Promise<void> {
//   const productKey = String(formData.get("product_key") ?? "");
//   const product = getProduct(productKey);
//   if (!product) redirect("/membership?checkout=unknown-product");
//
//   const user = await getCurrentUser();
//   if (!user) redirect(`/login?next=${encodeURIComponent("/membership")}`);
//
//   if (product.grantsMembership && hasRole(user.role, "member")) {
//     redirect("/membership?checkout=already-member");
//   }
//
//   const origin = (await headers()).get("origin");
//   if (!origin) redirect("/membership?checkout=error");
//
//   let session: Stripe.Checkout.Session;
//   try {
//     session = await getStripe().checkout.sessions.create({
//       mode: "payment",
//       client_reference_id: user.id,
//       customer_email: user.email ?? user.auth_email ?? undefined,
//       metadata: {
//         user_id: user.id,
//         product_key: product.key,
//       },
//       line_items: [
//         {
//           quantity: 1,
//           price_data: {
//             currency: "usd",
//             unit_amount: product.amountCents,
//             product_data: {
//               name: product.name,
//               description: product.description,
//             },
//           },
//         },
//       ],
//       custom_fields: product.collectsShirtSize
//         ? [
//             {
//               key: "shirt_size",
//               label: { type: "custom", custom: "T-shirt size" },
//               type: "dropdown",
//               dropdown: {
//                 options: SHIRT_SIZES.map((size) => ({
//                   label: size,
//                   value: size,
//                 })),
//               },
//             },
//           ]
//         : undefined,
//       success_url: `${origin}/membership/thanks?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${origin}/membership?checkout=cancelled`,
//     });
//   } catch {
//     redirect("/membership?checkout=error");
//   }
//
//   if (!session.url) redirect("/membership?checkout=error");
//   redirect(session.url);
// }
