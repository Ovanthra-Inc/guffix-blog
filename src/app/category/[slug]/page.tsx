import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogCard } from "@/components/blog/blog-card";
import { getPosts } from "@/lib/firebase/firestore";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cursor?: string }>;
}

const PAGE_SIZE = 12;

function slugToCategory(slug: string): string {
  // Simple mapping for common slugs
  const mapping: Record<string, string> = {
    "ai-tools": "AI Tools",
    "web-development": "Web Development",
    "cloud-devops": "Cloud & DevOps",
    "cybersecurity": "Cybersecurity",
    "data-science": "Data Science",
    "productivity": "Productivity",
  };
  return mapping[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  return { title: `${category} Articles`, description: `Browse all AI-generated articles about ${category}.` };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { cursor } = await searchParams;
  const category = slugToCategory(slug);
  
  let posts = [];
  let nextCursor = null;

  try { 
    const res = await getPosts({ 
      status: "published", 
      category, 
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
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Category</p>
            <h1 className="text-4xl font-black text-gradient">{category}</h1>
            <p className="text-muted-foreground mt-2">Latest articles in {category}</p>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {posts.map((post) => <BlogCard key={post.id} post={post} />)}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 pt-8">
                {cursor && (
                  <Link
                    href={`/category/${slug}`}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-card/50 text-sm font-bold hover:bg-muted transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Start Over
                  </Link>
                )}
                {nextCursor && posts.length === PAGE_SIZE && (
                  <Link
                    href={`/category/${slug}?cursor=${nextCursor}`}
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
              <p className="text-muted-foreground text-sm">
                Check back soon for more content in {category}.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

