"use client";

import { List, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { type BlogPost } from "@/types/blog";
import { type BlogSeries } from "@/types/series";

interface SeriesNavigatorProps {
  post: BlogPost;
  series: BlogSeries;
  allPosts: BlogPost[];
}

export function SeriesNavigator({ post, series, allPosts }: SeriesNavigatorProps) {
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="mb-10 p-5 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <PlayCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Part {currentIndex + 1} of {allPosts.length} in series</p>
          <Link href={`/series/${series.slug}`} className="text-lg font-bold hover:text-primary transition-colors line-clamp-1">
            {series.title}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-primary/10">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="group flex flex-col gap-1.5 p-3 rounded-xl hover:bg-primary/10 transition-all text-left"
          >
            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <ChevronLeft className="w-3 h-3" /> Previous
            </span>
            <span className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-1">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div className="opacity-0" />
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex flex-col items-end gap-1.5 p-3 rounded-xl hover:bg-primary/10 transition-all text-right"
          >
            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Next <ChevronRight className="w-3 h-3" />
            </span>
            <span className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-1">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div className="opacity-0" />
        )}
      </div>
    </div>
  );
}
