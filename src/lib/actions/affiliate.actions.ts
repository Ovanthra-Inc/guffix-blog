"use server";

import {
  saveAffiliateLink,
  updateAffiliateLink,
  deleteAffiliateLink,
  getAffiliateLinks,
  incrementAffiliateLinkClick,
} from "@/lib/firebase/firestore";
import type { AffiliateLink } from "@/types/affiliate";
import { revalidatePath } from "next/cache";

export async function getAffiliateLinksAction(): Promise<AffiliateLink[]> {
  return getAffiliateLinks();
}

export async function saveAffiliateLinkAction(
  data: Omit<AffiliateLink, "id" | "clickCount" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = await saveAffiliateLink({
      ...data,
      clickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    revalidatePath("/admin/affiliate");
    return { success: true, id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateAffiliateLinkAction(
  id: string,
  data: Partial<AffiliateLink>
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateAffiliateLink(id, data);
    revalidatePath("/admin/affiliate");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteAffiliateLinkAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteAffiliateLink(id);
    revalidatePath("/admin/affiliate");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function trackAffiliateLinkClickAction(
  id: string
): Promise<void> {
  await incrementAffiliateLinkClick(id);
}
