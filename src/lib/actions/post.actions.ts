"use server";

import {
  savePost,
  updatePost,
  deletePost,
  publishPost,
  getPostById,
  getPosts,
} from "@/lib/firebase/firestore";
import { generateBlog } from "@/lib/ai/blog-generator";
import { slugify } from "@/lib/utils/slugify";
import type { BlogPost, BlogStatus } from "@/types/blog";
import { revalidatePath } from "next/cache";

export async function createPostAction(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = await savePost({ ...data, status: "draft" });
    revalidatePath("/admin/posts");
    return { success: true, id };
  } catch (error) {
    console.error("[createPostAction]", error);
    return { success: false, error: String(error) };
  }
}

export async function updatePostAction(
  id: string,
  data: Partial<BlogPost>
): Promise<{ success: boolean; error?: string }> {
  try {
    await updatePost(id, data);
    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${id}`);
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("[updatePostAction]", error);
    return { success: false, error: String(error) };
  }
}

export async function publishPostAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await publishPost(id);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[publishPostAction]", error);
    return { success: false, error: String(error) };
  }
}

export async function schedulePostAction(
  id: string,
  scheduledAt: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    await updatePost(id, { status: "scheduled", scheduledAt });
    revalidatePath("/admin/posts");
    revalidatePath("/admin/calendar");
    return { success: true };
  } catch (error) {
    console.error("[schedulePostAction]", error);
    return { success: false, error: String(error) };
  }
}

export async function deletePostAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deletePost(id);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("[deletePostAction]", error);
    return { success: false, error: String(error) };
  }
}

export async function generateAndSavePostAction(
  topicId: string,
  topicTitle: string,
  category: string,
  keywords: string[]
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Generate blog with AI
    const blogData = await generateBlog(topicTitle, category, keywords);

    // Ensure unique slug
    const slug = slugify(blogData.title);

    // Save to Firestore as draft
    const id = await savePost({
      ...blogData,
      slug,
      status: "draft",
      topicId,
    });

    revalidatePath("/admin/posts");
    revalidatePath("/admin/topics");
    return { success: true, id };
  } catch (error) {
    console.error("[generateAndSavePostAction]", error);
    return { success: false, error: String(error) };
  }
}

export async function getPostsAction(options?: {
  status?: BlogStatus;
  category?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  return getPosts(options);
}

export async function getPostByIdAction(id: string): Promise<BlogPost | null> {
  return getPostById(id);
}
