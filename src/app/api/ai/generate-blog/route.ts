import { NextRequest, NextResponse } from "next/server";
import { generateBlog } from "@/lib/ai/blog-generator";
import { savePost, updateTopic } from "@/lib/firebase/firestore";
import { slugify } from "@/lib/utils/slugify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicTitle, category, keywords = [], topicId } = body;

    if (!topicTitle || !category) {
      return NextResponse.json(
        { error: "topicTitle and category are required" },
        { status: 400 }
      );
    }

    // Generate blog with AI
    const blogData = await generateBlog(topicTitle, category, keywords);

    // Save to Firestore as draft
    const postId = await savePost({
      ...blogData,
      slug: slugify(blogData.title),
      status: "draft",
      topicId: topicId || null,
    });

    // Update topic status if topicId provided
    if (topicId) {
      await updateTopic(topicId, { status: "generated", postId });
    }

    return NextResponse.json({ success: true, postId }, { status: 201 });
  } catch (error) {
    console.error("[generate-blog]", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
