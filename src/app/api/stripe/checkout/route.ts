import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail } = await req.json();

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await createCheckoutSession(userId, userEmail);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Checkout]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
