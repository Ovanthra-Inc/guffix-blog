import Link from "next/link";
import { ArrowRight, Sparkles, Zap, TrendingUp, DollarSign, Bot, BarChart3, Rss } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPosts } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GuffixAI — AI-Powered Blog Platform That Earns",
  description: "Discover trending topics, generate SEO blogs with AI, and monetize through affiliate links, ads, and newsletter. Built on Next.js and Firebase.",
};

const FEATURES = [
  { icon: Bot, title: "AI Blog Generator", desc: "One click to generate a full 2000+ word SEO blog post with code, diagrams, tables, and FAQs." },
  { icon: TrendingUp, title: "Trend Discovery", desc: "AI finds the hottest topics in your niche with trend, SEO, and monetization scores." },
  { icon: DollarSign, title: "Monetization Ready", desc: "Built-in affiliate link injection, newsletter capture, ad slots, and sponsored post pages." },
  { icon: Zap, title: "Auto Publishing", desc: "Vercel Cron discovers topics daily and publishes scheduled posts automatically." },
  { icon: BarChart3, title: "SEO Optimized", desc: "Every post gets AI-generated meta titles, descriptions, keywords, and structured data." },
  { icon: Rss, title: "Newsletter Engine", desc: "Grow your audience with AI-drafted weekly digests and easy subscriber management." },
];

const CATEGORIES = [
  "AI Tools", "Web Development", "Cloud & DevOps", "Cybersecurity",
  "Data Science", "Machine Learning", "Productivity", "Startup & Business",
];

export default async function HomePage() {
  let featuredPosts = [];
  try {
    featuredPosts = await getPosts({ status: "published", limit: 6 });
  } catch {
    // Firestore not configured — show empty state
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="bg-hero py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Content at Scale
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-slide-up">
              Blog Content That
              <br />
              <span className="text-gradient">Writes &amp; Earns</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up">
              AI discovers trending topics, generates SEO-perfect long-form blogs with diagrams and
              code, then helps you earn through affiliate links, ads, and newsletter subscriptions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-slide-up">
              <Link
                href="/blog"
                id="explore-blogs-btn"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Explore Blog <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/admin"
                id="admin-dashboard-btn"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm font-semibold hover:border-primary/30 hover:bg-card transition-all"
              >
                Admin Dashboard
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-border/50">
              {[
                { value: "2000+", label: "Words per blog" },
                { value: "9", label: "Section types" },
                { value: "100%", label: "SEO optimized" },
                { value: "5×", label: "Faster publishing" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-black text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="py-20 px-4 bg-card/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Everything You Need to Scale</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From trending topic discovery to automated publishing — GuffixAI handles the entire content pipeline.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Categories ───────────────────────────────────── */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-5">Browse by Category</h2>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="px-4 py-2 rounded-full border border-border bg-card/50 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Latest Posts ─────────────────────────────────── */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Latest Articles</h2>
              <Link href="/blog" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {featuredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredPosts.slice(0, 3).map((post) => (
                  <BlogCard key={post.id} post={post} variant="featured" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl border border-border/50 border-dashed">
                <Sparkles className="w-10 h-10 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="font-semibold mb-2">No posts published yet</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Head to the admin dashboard, discover trending topics, and generate your first AI blog.
                </p>
                <Link
                  href="/admin/topics"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Discover Topics
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-10 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
              <h2 className="text-3xl font-bold mb-3 relative">
                Start Publishing AI Blogs Today
              </h2>
              <p className="text-muted-foreground mb-8 relative">
                No separate backend. No complex setup. Just Next.js, Firebase, and OpenRouter.
              </p>
              <div className="flex flex-wrap gap-4 justify-center relative">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                  <Sparkles className="w-5 h-5" /> Open Admin Dashboard
                </Link>
                <Link
                  href="/newsletter"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-card/50 font-bold hover:border-primary/30 transition-all"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
