import { NextRequest, NextResponse } from "next/server";
import { saveNewsletterSubscriber } from "@/lib/firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    await saveNewsletterSubscriber(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[newsletter]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
