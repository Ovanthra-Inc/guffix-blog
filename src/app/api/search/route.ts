import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { tavilySearch } from "@/lib/ai/tavily";
import type { BlogPost } from "@/types/blog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (!q) {
    return NextResponse.json({ posts: [], webResults: [] });
  }

  try {
    // 1. Fetch internal posts (as before)
    const snapshot = await db
      .collection("posts")
      .where("status", "==", "published")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const allPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];

    const filteredInternal = allPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    // 2. Fetch real-time web results via Tavily
    let webResults = [];
    try {
      const tavilyData = await tavilySearch(q, { maxResults: 5 });
      webResults = tavilyData.results;
    } catch (e) {
      console.error("[Search API] Tavily error:", e);
    }

    return NextResponse.json({ 
      posts: filteredInternal.slice(0, 10),
      webResults 
    });
  } catch (error) {
    console.error("[Search API]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

