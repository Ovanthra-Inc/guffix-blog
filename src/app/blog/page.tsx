import { BlogCard } from "@/components/blog/blog-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPosts } from "@/lib/firebase/firestore";
import type { Metadata } from "next";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Browse all AI-generated blog articles covering AI tools, web development, cloud, cybersecurity, and more.",
};

const CATEGORIES = ["All", "AI Tools", "Web Development", "Cloud & DevOps", "Cybersecurity", "Data Science", "Productivity"];
const PAGE_SIZE = 12;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; cursor?: string; page?: string }>;
}) {
  const { category, cursor } = await searchParams;
  let posts = [];
  let nextCursor = null;

  try {
    const res = await getPosts({
      status: "published",
      category: category && category !== "All" ? category : undefined,
      limit: PAGE_SIZE,
      lastDocId: cursor,
    });
    posts = res.posts;
    nextCursor = res.lastDocId;
  } catch { /* Firestore not configured */ }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-black mb-3">
              <span className="text-gradient">All Articles</span>
            </h1>
            <p className="text-muted-foreground">
              AI-generated, SEO-optimized content on the topics that matter.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  (category ?? "All") === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </a>
            ))}
          </div>

          {/* Posts grid */}
          {posts.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 pt-8">
                {cursor && (
                  <Link
                    href={`/blog?${category ? `category=${category}&` : ""}`}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-card/50 text-sm font-bold hover:bg-muted transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Start Over
                  </Link>
                )}
                {nextCursor && posts.length === PAGE_SIZE && (
                  <Link
                    href={`/blog?${category ? `category=${category}&` : ""}cursor=${nextCursor}`}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Next Page <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-24 rounded-3xl border border-dashed border-border/50 bg-card/30">
              <BookOpen className="w-10 h-10 mx-auto mb-4 text-muted-foreground/30" />
              <h2 className="font-bold text-xl mb-2">No articles found</h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {category && category !== "All" 
                  ? `We haven't published any articles in ${category} yet. Check back soon!`
                  : "Generate your first blog from the admin dashboard."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

