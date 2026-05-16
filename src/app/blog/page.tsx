import { BlogCard } from "@/components/blog/blog-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPosts } from "@/lib/firebase/firestore";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Browse all AI-generated blog articles covering AI tools, web development, cloud, cybersecurity, and more.",
};

const CATEGORIES = ["All", "AI Tools", "Web Development", "Cloud & DevOps", "Cybersecurity", "Data Science", "Productivity"];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let posts = [];
  try {
    posts = await getPosts({
      status: "published",
      category: category && category !== "All" ? category : undefined,
      limit: 50,
    });
  } catch { /* Firestore not configured */ }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-black mb-3">
              <span className="text-gradient">All Articles</span>
            </h1>
            <p className="text-muted-foreground">
              AI-generated, SEO-optimized content on the topics that matter.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 rounded-2xl border border-dashed border-border/50">
              <BookOpen className="w-10 h-10 mx-auto mb-4 text-muted-foreground/30" />
              <h2 className="font-semibold mb-2">No articles yet</h2>
              <p className="text-muted-foreground text-sm">
                Generate your first blog from the admin dashboard.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
