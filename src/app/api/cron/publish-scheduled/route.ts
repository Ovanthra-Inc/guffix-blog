import { NextRequest, NextResponse } from "next/server";
import { getScheduledPostsDue, publishPost } from "@/lib/firebase/firestore";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const duePosts = await getScheduledPostsDue();
    const published: string[] = [];

    for (const post of duePosts) {
      if (post.id) {
        await publishPost(post.id);
        published.push(post.id);
      }
    }

    console.log(`[Cron] Published ${published.length} scheduled posts`);
    return NextResponse.json({ success: true, published, count: published.length });
  } catch (error) {
    console.error("[Cron publish-scheduled]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
