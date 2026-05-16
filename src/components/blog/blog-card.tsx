import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Clock, Eye, TrendingUp, Crown } from "lucide-react";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured" | "compact";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const publishedDate = post.publishedAt
    ? formatDistanceToNow(new Date(post.publishedAt as Date), { addSuffix: true })
    : "Draft";

  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Hero image */}
          <div className="relative h-56 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent overflow-hidden">
            {post.heroImage?.url ? (
              <Image
                src={post.heroImage.url}
                alt={post.heroImage.alt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl opacity-20">✦</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            
            {/* Pro badge */}
            {post.isPremium && (
              <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-violet-600 text-[10px] font-black text-white flex items-center gap-1 shadow-lg z-10">
                <Crown className="w-3 h-3" />
                PRO
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
                {post.category}
              </span>
            </div>
            {/* SEO Score */}
            {post.seoScore > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">{post.seoScore}</span>
              </div>
            )}
          </div>

          <div className="p-5">
            <h2 className="font-bold text-xl leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTime || 5} min
                </span>
                {(post.viewCount ?? 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.viewCount?.toLocaleString()}
                  </span>
                )}
              </div>
              <span>{publishedDate}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex gap-3 py-3">
        <div className="flex-1 min-w-0">
          <span className="text-xs text-primary font-medium">{post.category}</span>
          <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mt-0.5">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{post.readingTime || 5} min</span>
            <span>·</span>
            <span>{publishedDate}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {post.category}
            </span>
            {post.isPremium && (
              <span className="px-2 py-0.5 rounded bg-violet-600 text-[10px] font-black text-white flex items-center gap-1 shadow-sm">
                <Crown className="w-3 h-3" />
                PRO
              </span>
            )}
          </div>
          {post.seoScore > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              SEO {post.seoScore}
            </span>
          )}
        </div>

        <h2 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2 flex-1">
          {post.title}
        </h2>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50 mt-auto">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime || 5} min read
          </span>
          <span>{publishedDate}</span>
        </div>
      </article>
    </Link>
  );
}
