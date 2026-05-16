import { NextRequest, NextResponse } from "next/server";
import { regenerateSection } from "@/lib/ai/blog-generator";
import { updatePost, getPostById } from "@/lib/firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, sectionId, instruction } = body;

    if (!postId || !sectionId || !instruction) {
      return NextResponse.json(
        { error: "postId, sectionId, and instruction are required" },
        { status: 400 }
      );
    }

    const post = await getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const section = post.sections.find((s) => s.id === sectionId);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const currentContent = section.content || JSON.stringify(section);
    const improved = await regenerateSection(
      section.type,
      currentContent,
      instruction
    );

    // Update section in post
    const updatedSections = post.sections.map((s) =>
      s.id === sectionId ? { ...s, content: improved } : s
    );

    await updatePost(postId, { sections: updatedSections });

    return NextResponse.json({
      success: true,
      content: improved,
    });
  } catch (error) {
    console.error("[improve-section]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
