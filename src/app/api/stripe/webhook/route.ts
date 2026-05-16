import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateUserProfile, getUserByStripeCustomerId } from "@/lib/firebase/firestore";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, data } = body;

  try {
    // 1. New Subscription
    if (type === "checkout.session.completed") {
      const session = data.object;
      const userId = session.client_reference_id;
      const customerId = session.customer;

      if (userId) {
        console.log(`[Stripe Webhook] Upgrading user ${userId} to pro`);
        await createOrUpdateUserProfile(userId, {
          tier: "pro",
          stripeCustomerId: customerId,
        });
      }
    }

    // 2. Subscription Deleted (Cancellation or Payment Failure)
    if (type === "customer.subscription.deleted") {
      const subscription = data.object;
      const customerId = subscription.customer;
      
      const user = await getUserByStripeCustomerId(customerId);
      if (user) {
        console.log(`[Stripe Webhook] Downgrading user ${user.uid} (Subscription Deleted)`);
        await createOrUpdateUserProfile(user.uid, {
          tier: "free",
        });
      }
    }

    // 3. Subscription Updated (e.g. Past Due)
    if (type === "customer.subscription.updated") {
      const subscription = data.object;
      const customerId = subscription.customer;
      const status = subscription.status;

      if (status === "unpaid" || status === "canceled" || status === "incomplete_expired") {
        const user = await getUserByStripeCustomerId(customerId);
        if (user) {
          console.log(`[Stripe Webhook] Downgrading user ${user.uid} (Status: ${status})`);
          await createOrUpdateUserProfile(user.uid, {
            tier: "free",
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

