import { notFound } from "next/navigation";
import { getPostBySlug, incrementViewCount } from "@/lib/firebase/firestore";
import { generateSeoMetadata } from "@/lib/utils/seo";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AuthorCard } from "@/components/blog/author-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { formatDistanceToNow } from "date-fns";
import { Clock, Eye, Tag, TrendingUp } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { getServerUserTier } from "@/lib/firebase/server-auth";
import { PremiumLock } from "@/components/blog/premium-lock";
import { SeriesNavigator } from "@/components/blog/series-navigator";
import { getSeriesById, getPostsByIds } from "@/lib/firebase/firestore";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return generateSeoMetadata(post);
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post = null;
  try {
    post = await getPostBySlug(slug);
    if (post?.id) {
      // Increment view count in background
      incrementViewCount(post.id).catch(() => {});
    }
  } catch { /* Firestore not configured */ }

  if (!post) return notFound();

  // Tier access control
  const userTier = await getServerUserTier();
  const isLocked = post.isPremium && userTier !== "pro";

  // Series data
  let series = null;
  let seriesPosts = [];
  if (post.seriesId) {
    try {
      series = await getSeriesById(post.seriesId);
      if (series) {
        seriesPosts = await getPostsByIds(series.postIds);
      }
    } catch { /* Fail silently */ }
  }

  const publishedDate = post.publishedAt
    ? formatDistanceToNow(new Date(post.publishedAt as Date), { addSuffix: true })
    : null;

  const faqSections = post.sections.filter((s) => s.type === "faq");

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
              <span>/</span>
              <span className="text-primary">{post.category}</span>
            </div>

            {/* Hero */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {post.category}
                </span>
                {post.seoScore > 0 && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm border border-emerald-500/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    SEO Score: {post.seoScore}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border/50">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readingTime || 5} min read
                </span>
                {(post.viewCount ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {post.viewCount?.toLocaleString()} views
                  </span>
                )}
                {publishedDate && <span>Published {publishedDate}</span>}
              </div>
            </div>

            {/* Hero image */}
            {post.heroImage?.url && (
              <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden border border-border/50 mb-10">
                <Image
                  src={post.heroImage.url}
                  alt={post.heroImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>

          {/* Content layout */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
            {/* Main content */}
            <div className="max-w-3xl">
              {series && (
                <SeriesNavigator post={post} series={series} allPosts={seriesPosts} />
              )}

              {isLocked ? (
                <div className="relative">
                  <div className="opacity-[0.15] blur-xl select-none pointer-events-none">
                    <BlogContentRenderer sections={post.sections.slice(0, 2)} />
                  </div>
                  <PremiumLock />
                </div>
              ) : (
                <BlogContentRenderer sections={post.sections} />
              )}

              {/* FAQ section */}
              {post.faq && post.faq.length > 0 && faqSections.length === 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {post.faq.map((item, i) => (
                      <details key={i} className="rounded-xl border border-border/50 group">
                        <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-sm">
                          {item.question}
                        </summary>
                        <div className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-border/30 pt-3">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2 items-center">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-muted border border-border text-sm text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <AuthorCard
                name={post.authorName}
                bio={post.authorBio}
                avatar={post.authorAvatar}
              />
            </div>

            {/* Sidebar TOC */}
            <div className="hidden lg:block">
              <TableOfContents sections={post.sections} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
