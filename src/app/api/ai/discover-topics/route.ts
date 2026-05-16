import { NextRequest, NextResponse } from "next/server";
import { discoverTopics } from "@/lib/ai/topic-discovery";
import { saveTopics } from "@/lib/firebase/firestore";
import type { Topic } from "@/types/topic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category } = body;

    if (!category) {
      return NextResponse.json(
        { error: "category is required" },
        { status: 400 }
      );
    }

    const discovered = await discoverTopics(category);

    const topicsToSave: Omit<Topic, "id">[] = discovered.map((t) => ({
      ...t,
      status: "discovered" as const,
      discoveredAt: new Date(),
    }));

    const ids = await saveTopics(topicsToSave);

    const topics = topicsToSave.map((t, i) => ({ ...t, id: ids[i] }));

    return NextResponse.json({ success: true, topics }, { status: 201 });
  } catch (error) {
    console.error("[discover-topics]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
