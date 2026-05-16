import { NextRequest, NextResponse } from "next/server";
import { getTopics, updateTopic } from "@/lib/firebase/firestore";
import { generateAndSavePostAction } from "@/lib/actions/post.actions";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get the best discovered topic that hasn't been used
    const topics = await getTopics({ status: "discovered", limit: 5 });
    
    if (topics.length === 0) {
      return NextResponse.json({ success: true, message: "No new topics to generate" });
    }

    // Pick the one with the highest total potential
    const bestTopic = topics.sort((a, b) => 
      ((b.seoPotential || 0) + (b.monetizationPotential || 0) + (b.trendScore || 0)) - 
      ((a.seoPotential || 0) + (a.monetizationPotential || 0) + (a.trendScore || 0))
    )[0];

    // 2. Mark topic as generating
    await updateTopic(bestTopic.id!, { status: "generating" });

    // 3. Trigger generation
    const result = await generateAndSavePostAction(
      bestTopic.id!,
      bestTopic.title,
      bestTopic.category,
      bestTopic.suggestedKeywords || []
    );

    if (!result.success || !result.id) {
      await updateTopic(bestTopic.id!, { status: "discovered" }); // Reset status on failure
      throw new Error(result.error || "Generation failed");
    }

    // 4. Mark topic as used
    await updateTopic(bestTopic.id!, { status: "used" });

    console.log(`[Cron] Auto-generated post for topic: ${bestTopic.title}`);
    return NextResponse.json({ 
      success: true, 
      postId: result.id,
      topic: bestTopic.title 
    });

  } catch (error) {
    console.error("[Cron generate]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
