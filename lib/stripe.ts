import Stripe from "stripe";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "PENDIENTE") {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export const PRICE_ID = process.env.STRIPE_PRICE_ID!;
export const PLAN_AMOUNT = 2900; // $29.00 in cents
