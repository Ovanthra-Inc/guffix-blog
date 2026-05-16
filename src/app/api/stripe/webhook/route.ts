import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateUserProfile } from "@/lib/firebase/firestore";

/**
 * Stripe Webhook Handler
 * Updates user tier upon successful payment.
 * IMPORTANT: In production, verify the Stripe signature to prevent spoofing.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Basic check for successful checkout session
  if (body.type === "checkout.session.completed") {
    const session = body.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      console.log(`[Stripe Webhook] Upgrading user ${userId} to pro`);
      try {
        await createOrUpdateUserProfile(userId, {
          tier: "pro",
        });
      } catch (error) {
        console.error("[Stripe Webhook] Failed to update user profile:", error);
        return NextResponse.json({ error: "Firestore update failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
