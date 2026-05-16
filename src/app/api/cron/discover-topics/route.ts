import { NextRequest, NextResponse } from "next/server";
import { discoverTopics } from "@/lib/ai/topic-discovery";
import { saveTopics, getSettings } from "@/lib/firebase/firestore";
import type { Topic } from "@/types/topic";

const FALLBACK_CATEGORIES = [
  "AI Tools",
  "Web Development",
  "Cloud & DevOps",
];

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSettings();
    const categories = (settings.defaultCategories as string[]) || FALLBACK_CATEGORIES;
    const results: { category: string; count: number }[] = [];

    // Run discovery for categories
    for (const category of categories) {
      const discovered = await discoverTopics(category);

      const topicsToSave: Omit<Topic, "id">[] = discovered.map((t) => ({
        ...t,
        status: "discovered" as const,
        discoveredAt: new Date(),
      }));

      await saveTopics(topicsToSave);
      results.push({ category, count: topicsToSave.length });
    }


    console.log("[Cron] Topic discovery complete:", results);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("[Cron discover-topics]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
