import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { incrementAffiliateLinkClick } from "@/lib/firebase/firestore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const doc = await db.collection("affiliate_links").doc(id).get();
    if (!doc.exists) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const data = doc.data();
    const targetUrl = data?.url;

    if (!targetUrl) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Increment click count in background
    incrementAffiliateLinkClick(id).catch(console.error);

    return NextResponse.redirect(new URL(targetUrl));
  } catch (error) {
    console.error("[Affiliate Redirect]", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
