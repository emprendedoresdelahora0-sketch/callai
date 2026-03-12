import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export const PRICE_ID = process.env.STRIPE_PRICE_ID!;
export const PLAN_AMOUNT = 2900; // $29.00 in cents
