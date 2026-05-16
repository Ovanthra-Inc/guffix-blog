import { NextRequest, NextResponse } from "next/server";
import { unsubscribeNewsletter } from "@/lib/firebase/firestore";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await unsubscribeNewsletter(email);
    return NextResponse.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("[Newsletter Unsubscribe] Error:", error);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}

// Support GET for easy unsubscribe links in emails
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse("Email required", { status: 400 });
  }

  try {
    await unsubscribeNewsletter(email);
    return new NextResponse(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1>You've been unsubscribed</h1>
        <p>You will no longer receive our newsletter. We're sorry to see you go!</p>
        <a href="/">Return to Home</a>
      </div>
    `, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    return new NextResponse("Error processing request", { status: 500 });
  }
}
