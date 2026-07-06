import { handleStripeWebhook } from "@/modules/payments/server/webhook";

export async function POST(request: Request): Promise<Response> {
  return handleStripeWebhook(request);
}
