"use server";

import { saveSeries, updateSeries, deleteSeries, getSeries } from "@/lib/firebase/firestore";
import type { BlogSeries } from "@/types/series";
import { revalidatePath } from "next/cache";

export async function getSeriesAction(): Promise<BlogSeries[]> {
  return getSeries();
}

export async function saveSeriesAction(
  data: Omit<BlogSeries, "id" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = await saveSeries({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    revalidatePath("/admin/series");
    revalidatePath("/series");
    return { success: true, id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateSeriesAction(
  id: string,
  data: Partial<BlogSeries>
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateSeries(id, data);
    revalidatePath("/admin/series");
    revalidatePath("/series");
    if (data.slug) revalidatePath(`/series/${data.slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteSeriesAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteSeries(id);
    revalidatePath("/admin/series");
    revalidatePath("/series");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
