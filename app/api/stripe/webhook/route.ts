// Stripe webhook handling is temporarily paused.
// import { handleStripeWebhook } from "@/modules/payments/server/webhook";

export async function POST(): Promise<Response> {
  return Response.json({ received: false, paused: true }, { status: 503 });
}

// Original Stripe webhook route:
// export async function POST(request: Request): Promise<Response> {
//   return handleStripeWebhook(request);
// }
