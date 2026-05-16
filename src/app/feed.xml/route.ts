import { NextResponse } from "next/server";
import { getPosts } from "@/lib/firebase/firestore";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guffixai.com";
  const { posts } = await getPosts({ status: "published", limit: 20 });

  const rssItems = posts
    .map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt as any).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <category>${post.category}</category>
    </item>`)
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GuffixAI - The Future of AI Content</title>
    <link>${baseUrl}</link>
    <description>Latest deep-dives into AI, Tech, and Automation.</description>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
    }
    return c;
  });
}
