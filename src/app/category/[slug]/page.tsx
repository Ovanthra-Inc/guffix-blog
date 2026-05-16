import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogCard } from "@/components/blog/blog-card";
import { getPosts } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function slugToCategory(slug: string): string {
  return slug.split("-").map((w) => {
    if (w === "ai") return "AI";
    if (w === "devops") return "DevOps";
    if (w === "and") return "&";
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(" ");
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  return { title: `${category} Articles`, description: `Browse all AI-generated articles about ${category}.` };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = slugToCategory(slug);
  let posts = [];
  try { posts = await getPosts({ status: "published", category, limit: 50 }); } catch { /* Firestore not configured */ }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Category</p>
            <h1 className="text-4xl font-black">{category}</h1>
            <p className="text-muted-foreground mt-2">{posts.length} articles</p>
          </div>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => <BlogCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-dashed border-border/50">
              <p className="text-muted-foreground">No articles in this category yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
