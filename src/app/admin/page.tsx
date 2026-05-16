import { getDashboardStats, getPosts } from "@/lib/firebase/firestore";
import { FileText, CheckCircle2, Clock, Eye, Link2, Mail, Sparkles, TrendingUp, Plus, Lightbulb } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { BlogPost } from "@/types/blog";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = { title: "Dashboard" };

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  href?: string;
}

function StatCard({ title, value, icon: Icon, color, href }: StatCardProps) {
  const content = (
    <div className={`p-5 rounded-2xl border border-border/50 bg-card hover:border-border transition-all group ${href ? "cursor-pointer hover:shadow-lg hover:shadow-primary/5" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : <div>{content}</div>;
}

export default async function AdminDashboard() {
  let stats = { totalPosts: 0, publishedPosts: 0, draftPosts: 0, scheduledPosts: 0, newsletterSubscribers: 0, affiliateClicks: 0, avgSeoScore: 0, monthlyViews: 0 };
  let recentPosts: BlogPost[] = [];

  try {
    [stats, recentPosts] = await Promise.all([getDashboardStats(), getPosts({ limit: 5 })]);
  } catch { /* Firestore not configured */ }

  const statCards: StatCardProps[] = [
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "bg-primary/10 text-primary", href: "/admin/posts" },
    { title: "Published", value: stats.publishedPosts, icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-500", href: "/admin/posts" },
    { title: "Drafts", value: stats.draftPosts, icon: Clock, color: "bg-amber-500/10 text-amber-500", href: "/admin/posts" },
    { title: "Scheduled", value: stats.scheduledPosts, icon: Sparkles, color: "bg-violet-500/10 text-violet-400", href: "/admin/calendar" },
    { title: "Monthly Views", value: stats.monthlyViews.toLocaleString(), icon: Eye, color: "bg-cyan-500/10 text-cyan-500" },
    { title: "Affiliate Clicks", value: stats.affiliateClicks, icon: Link2, color: "bg-orange-500/10 text-orange-500", href: "/admin/affiliate" },
    { title: "Subscribers", value: stats.newsletterSubscribers, icon: Mail, color: "bg-pink-500/10 text-pink-500" },
    { title: "Avg SEO Score", value: `${stats.avgSeoScore}/100`, icon: TrendingUp, color: "bg-green-500/10 text-green-500" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Your AI content operating system</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/topics"
            id="discover-topics-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Lightbulb className="w-4 h-4" /> Discover Topics
          </Link>
          <Link
            href="/admin/posts"
            id="new-post-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent posts */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Recent Posts</h2>
            <Link href="/admin/posts" className="text-primary text-sm hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {recentPosts.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No posts yet. Discover topics and generate your first blog.</p>
              </div>
            )}
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${post.status === "published" ? "bg-emerald-500" : post.status === "scheduled" ? "bg-amber-500" : "bg-muted-foreground/30"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">{post.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span className="capitalize">{post.status}</span>
                    <span>·</span>
                    <span>{post.category}</span>
                    {post.createdAt && (
                      <>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(post.createdAt as Date), { addSuffix: true })}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${post.seoScore >= 75 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : post.seoScore >= 50 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-muted text-muted-foreground border-border"}`}>
                  SEO {post.seoScore}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h2 className="font-semibold mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: "/admin/topics", icon: Lightbulb, label: "Discover Trending Topics", desc: "AI finds hot topics in your niche" },
              { href: "/admin/posts", icon: Plus, label: "Create New Post", desc: "Start writing or generate with AI" },
              { href: "/admin/affiliate", icon: Link2, label: "Manage Affiliate Links", desc: "Add links to monetize posts" },
              { href: "/admin/calendar", icon: Clock, label: "Content Calendar", desc: "View and schedule posts" },
              { href: "/admin/settings", icon: Sparkles, label: "AI Settings", desc: "Configure OpenRouter model" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
