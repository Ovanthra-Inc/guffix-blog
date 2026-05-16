"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, Search, Trash2, Eye, Edit3, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { getPostsAction, deletePostAction, publishPostAction } from "@/lib/actions/post.actions";
import type { BlogPost, BlogStatus } from "@/types/blog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const STATUS_FILTERS: { value: BlogStatus | "all"; label: string }[] = [
  { value: "all", label: "All Posts" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<BlogStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPostsAction(status !== "all" ? { status } : {})
      .then((p) => { setPosts(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const result = await deletePostAction(id);
    if (result.success) { setPosts((prev) => prev.filter((p) => p.id !== id)); toast.success("Post deleted"); }
    else toast.error(result.error || "Failed to delete");
  };

  const handlePublish = async (id: string) => {
    const result = await publishPostAction(id);
    if (result.success) {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status: "published" } : p));
      toast.success("Post published!");
    } else toast.error(result.error || "Failed to publish");
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Posts</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/topics"
          id="generate-from-topics"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Generate with AI
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === f.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">SEO</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Loading posts…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p>No posts found.</p>
                    <Link href="/admin/topics" className="text-primary text-sm hover:underline mt-2 inline-block">
                      Generate your first post →
                    </Link>
                  </td>
                </tr>
              )}
              {filtered.map((post) => (
                <tr key={post.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium line-clamp-1 max-w-xs">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{post.readingTime || 5} min read</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{post.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${post.status === "published" ? "text-emerald-500" : post.status === "scheduled" ? "text-amber-500" : "text-muted-foreground"}`}>
                      {post.status === "published" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {post.status === "scheduled" && <Clock className="w-3.5 h-3.5" />}
                      {post.status === "draft" && <Edit3 className="w-3.5 h-3.5" />}
                      <span className="capitalize">{post.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${post.seoScore >= 75 ? "text-emerald-500" : post.seoScore >= 50 ? "text-amber-500" : "text-muted-foreground"}`}>
                      {post.seoScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {post.createdAt ? formatDistanceToNow(new Date(post.createdAt as Date), { addSuffix: true }) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {post.status === "published" && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {post.status === "draft" && (
                        <button onClick={() => post.id && handlePublish(post.id)} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                          Publish
                        </button>
                      )}
                      <Link href={`/admin/posts/${post.id}`} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => post.id && post.title && handleDelete(post.id, post.title)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
