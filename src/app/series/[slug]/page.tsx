import { notFound } from "next/navigation";
import { getSeriesBySlug, getPostsByIds } from "@/lib/firebase/firestore";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PlayCircle, Clock, ChevronRight, Lock, Crown } from "lucide-react";
import Link from "next/link";
import { getServerUserTier } from "@/lib/firebase/server-auth";

interface SeriesDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);
  if (!series) return notFound();

  const posts = await getPostsByIds(series.postIds);
  const userTier = await getServerUserTier();
  const isSeriesLocked = series.isPremium && userTier !== "pro";

  return (
    <>
      <Header />
      <main className="flex-1 bg-hero py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                {series.category}
              </span>
              {series.isPremium && (
                <span className="px-3 py-1 rounded-full bg-violet-600/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest border border-violet-500/20 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> PRO SERIES
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">{series.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {series.description}
            </p>
          </div>

          {/* List of posts */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Series Index</h2>
            {posts.map((post, index) => {
              const isLocked = isSeriesLocked || (post.isPremium && userTier !== "pro");
              
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`group flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card/50 transition-all duration-300 ${
                    isLocked ? "opacity-75" : "hover:border-primary/30 hover:bg-card hover:translate-x-1"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${
                    isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  }`}>
                    {isLocked ? <Lock className="w-4 h-4" /> : index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.isPremium && (
                        <Crown className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readingTime || 5} min read
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">
                    Read <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>

          {isSeriesLocked && (
            <div className="mt-12 p-8 rounded-3xl bg-violet-600/10 border border-violet-500/20 text-center">
              <Lock className="w-10 h-10 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-violet-400">Unlock Full Series</h3>
              <p className="text-muted-foreground mb-6">This learning path is reserved for Pro members.</p>
              <Link
                href="/pricing"
                className="inline-block px-8 py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all"
              >
                Upgrade to Pro
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
