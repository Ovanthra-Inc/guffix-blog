import { MetadataRoute } from "next";
import { getPosts, getSeries } from "@/lib/firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guffixai.com";

  // 1. Fetch all published posts
  const { posts } = await getPosts({ status: "published", limit: 1000 });
  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt as any),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 2. Fetch all series
  const series = await getSeries();
  const seriesEntries = series.map((s) => ({
    url: `${baseUrl}/series/${s.slug}`,
    lastModified: new Date(s.updatedAt as any),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 3. Static pages
  const staticPages = ["", "/blog", "/series", "/pricing", "/newsletter"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  }));

  return [...staticPages, ...postEntries, ...seriesEntries];
}
