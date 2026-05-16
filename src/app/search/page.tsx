"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogCard } from "@/components/blog/blog-card";
import { Search, Loader2, FileQuestion, Globe, ExternalLink } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import type { TavilyResult } from "@/lib/ai/tavily";

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [webResults, setWebResults] = useState<TavilyResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setWebResults(data.webResults || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto mb-16 text-center">
        <h1 className="text-4xl font-black mb-6">Search <span className="text-gradient">Articles</span></h1>
        <form onSubmit={onSubmit} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, keyword, or category…"
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-xl shadow-primary/5"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          )}
        </form>
      </div>

      <div className="space-y-16">
        {/* Internal Posts */}
        {(posts.length > 0 || loading) && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Featured Articles</h2>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-50">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-slide-up">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Web Results */}
        {(webResults.length > 0 || loading) && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold">Web Insights</h2>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 animate-slide-up">
                {webResults.map((result, i) => (
                  <a
                    key={i}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl border border-border/50 bg-card/50 hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{result.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.content}</p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <span className="px-2 py-0.5 rounded bg-muted border border-border">{new URL(result.url).hostname}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && webResults.length === 0 && query && (
          <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-card/30">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileQuestion className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              We couldn't find anything matching "{query}" either on GuffixAI or the web.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-hero">
        <Suspense fallback={<div className="flex items-center justify-center py-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
