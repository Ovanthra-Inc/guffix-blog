"use server";

import { saveTopics, updateTopic, deleteTopic, getTopics } from "@/lib/firebase/firestore";
import { discoverTopics } from "@/lib/ai/topic-discovery";
import type { Topic } from "@/types/topic";
import { revalidatePath } from "next/cache";

export async function discoverAndSaveTopicsAction(
  category: string
): Promise<{ success: boolean; topics?: Topic[]; error?: string }> {
  try {
    // Use AI to discover trending topics
    const discovered = await discoverTopics(category);

    // Map to Topic shape and save
    const topicsToSave: Omit<Topic, "id">[] = discovered.map((t) => ({
      ...t,
      status: "discovered",
      discoveredAt: new Date(),
    }));

    const ids = await saveTopics(topicsToSave);

    const topics: Topic[] = topicsToSave.map((t, i) => ({
      ...t,
      id: ids[i],
    }));

    revalidatePath("/admin/topics");
    return { success: true, topics };
  } catch (error) {
    console.error("[discoverAndSaveTopicsAction]", error);
    return { success: false, error: String(error) };
  }
}

export async function getTopicsAction(options?: {
  category?: string;
  status?: string;
}): Promise<Topic[]> {
  return getTopics(options);
}

export async function rejectTopicAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateTopic(id, { status: "rejected" });
    revalidatePath("/admin/topics");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteTopicAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteTopic(id);
    revalidatePath("/admin/topics");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
