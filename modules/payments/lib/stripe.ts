import "server-only";
// Stripe is temporarily paused.
// import Stripe from "stripe";

// Lazy env access (mirrors core/config/env.ts serverEnv): builds and pages
// that never touch Stripe don't fail when the keys aren't configured yet.
// function required(name: string): string {
//   const value = process.env[name];
//   if (!value || value.trim() === "") {
//     throw new Error(`Missing required env var: ${name}`);
//   }
//   return value;
// }

// let client: Stripe | null = null;

export function getStripe(): never {
  throw new Error("Stripe is temporarily paused.");
}

export function getStripeWebhookSecret(): string {
  throw new Error("Stripe webhook handling is temporarily paused.");
}

// Original Stripe client helpers:
// export function getStripe(): Stripe {
//   if (!client) {
//     client = new Stripe(required("STRIPE_SECRET_KEY"));
//   }
//   return client;
// }
//
// export function getStripeWebhookSecret(): string {
//   return required("STRIPE_WEBHOOK_SECRET");
// }
