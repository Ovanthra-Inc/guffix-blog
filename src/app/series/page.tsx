"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PlayCircle, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import { type BlogSeries } from "@/types/series";
import { useEffect, useState } from "react";
import { getSeries } from "@/lib/firebase/firestore";

export default function SeriesListingPage() {
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      try {
        const data = await getSeries();
        setSeries(data);
      } catch (e) {
        console.error("Error fetching series:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSeries();
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 bg-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-black">Playlists & <span className="text-gradient">Series</span></h1>
                <p className="text-muted-foreground mt-1">Structured learning paths and deep-dive sequences.</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : series.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {series.map((item) => (
                <Link
                  key={item.id}
                  href={`/series/${item.slug}`}
                  className="group relative block overflow-hidden rounded-3xl border border-border/50 bg-card/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                          {item.category}
                        </span>
                        {item.isPremium && (
                          <span className="px-3 py-1 rounded-full bg-violet-600/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest border border-violet-500/20">
                            Premium
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {item.postIds.length} Parts
                      </span>
                    </div>

                    <h2 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-8 flex-1">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      Start Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PlayCircle className="w-24 h-24" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-muted/20">
              <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground">No series available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
