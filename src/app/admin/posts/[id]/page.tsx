"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostByIdAction, updatePostAction, publishPostAction, schedulePostAction } from "@/lib/actions/post.actions";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";
import { AIGenerateButton } from "@/components/ai/ai-generate-button";
import { toast } from "sonner";
import type { BlogPost, BlogSection } from "@/types/blog";
import { Save, Globe, Calendar, Eye, ArrowLeft, Sparkles, BarChart3, Settings2, Crown, Layers } from "lucide-react";
import { getSeries } from "@/lib/firebase/firestore";
import type { BlogSeries } from "@/types/series";
import Link from "next/link";

export default function PostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "seo">("editor");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionInstruction, setSectionInstruction] = useState("");

  const [seriesList, setSeriesList] = useState<BlogSeries[]>([]);

  useEffect(() => {
    getPostByIdAction(id).then((p) => { setPost(p); setLoading(false); }).catch(() => setLoading(false));
    getSeries().then(setSeriesList).catch(() => {});
  }, [id]);


  const handleSave = async () => {
    if (!post) return;
    setSaving(true);
    const result = await updatePostAction(id, post);
    setSaving(false);
    if (result.success) toast.success("Post saved!"); else toast.error(result.error || "Save failed");
  };

  const handlePublish = async () => {
    const result = await publishPostAction(id);
    if (result.success) { setPost((p) => p ? { ...p, status: "published" } : p); toast.success("Post published!"); }
    else toast.error(result.error || "Publish failed");
  };

  const handleRegenerateSection = async (sectionId: string) => {
    if (!sectionInstruction.trim()) { toast.error("Enter an instruction first"); return; }
    const res = await fetch("/api/ai/improve-section", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, sectionId, instruction: sectionInstruction }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setPost((p) => p ? {
      ...p,
      sections: p.sections.map((s) => s.id === sectionId ? { ...s, content: data.content } : s),
    } : p);
    toast.success("Section improved!");
    setEditingSection(null);
    setSectionInstruction("");
  };

  const updateSection = (sectionId: string, field: keyof BlogSection, value: string) => {
    setPost((p) => p ? {
      ...p,
      sections: p.sections.map((s) => s.id === sectionId ? { ...s, [field]: value } : s),
    } : p);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />Loading post…</div>;
  if (!post) return <div className="p-8 text-center text-muted-foreground">Post not found. <Link href="/admin/posts" className="text-primary">Go back</Link></div>;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <p className="font-semibold text-sm line-clamp-1 max-w-xs">{post.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`capitalize ${post.status === "published" ? "text-emerald-500" : post.status === "scheduled" ? "text-amber-500" : ""}`}>{post.status}</span>
              <span>·</span>
              <span>SEO: {post.seoScore}/100</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="hidden sm:flex gap-0.5 bg-muted rounded-lg p-0.5">
            {(["editor", "preview", "seo", "config"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
            ))}
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50">
            <Save className="w-3.5 h-3.5" />{saving ? "Saving…" : "Save"}
          </button>
          {post.status !== "published" && (
            <button onClick={handlePublish} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Globe className="w-3.5 h-3.5" /> Publish
            </button>
          )}
          {post.status === "published" && (
            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              <Eye className="w-3.5 h-3.5" /> View
            </a>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "editor" && (
          <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
            {/* Post meta */}
            <div className="space-y-3">
              <input
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                className="w-full text-3xl font-black bg-transparent border-none outline-none placeholder:text-muted-foreground/30 resize-none"
                placeholder="Post title…"
              />
              <textarea
                value={post.excerpt}
                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                rows={2}
                className="w-full text-muted-foreground bg-transparent border-none outline-none resize-none text-lg placeholder:text-muted-foreground/30"
                placeholder="Post excerpt…"
              />
            </div>

            {/* Sections */}
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Content Sections</h2>
                <span className="text-xs text-muted-foreground">{post.sections.length} sections</span>
              </div>
              {post.sections.map((section) => (
                <div key={section.id} className="group relative rounded-xl border border-border/40 hover:border-border transition-colors bg-card/30">
                  <div className="flex items-start justify-between p-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground font-mono uppercase">{section.type}</span>
                        {section.language && <span className="text-xs text-primary">{section.language}</span>}
                      </div>
                      {section.type === "heading" ? (
                        <input
                          value={section.content || ""}
                          onChange={(e) => updateSection(section.id, "content", e.target.value)}
                          className={`w-full bg-transparent outline-none ${section.level === 2 ? "text-xl font-bold" : "text-lg font-semibold"}`}
                          placeholder="Heading text…"
                        />
                      ) : section.type === "paragraph" || section.type === "quote" ? (
                        <textarea
                          value={section.content || ""}
                          onChange={(e) => updateSection(section.id, "content", e.target.value)}
                          rows={3}
                          className="w-full bg-transparent outline-none resize-none text-sm text-muted-foreground"
                          placeholder="Write content here…"
                        />
                      ) : section.type === "code" ? (
                        <pre className="text-xs font-mono text-muted-foreground line-clamp-3 overflow-hidden">{section.content}</pre>
                      ) : section.type === "mermaid" ? (
                        <pre className="text-xs font-mono text-muted-foreground line-clamp-2 overflow-hidden">{section.content}</pre>
                      ) : section.type === "table" ? (
                        <p className="text-xs text-muted-foreground">{section.columns?.join(", ")} • {section.rows?.length} rows</p>
                      ) : section.type === "faq" ? (
                        <p className="text-sm line-clamp-1">{section.question}</p>
                      ) : section.type === "cta" ? (
                        <p className="text-sm">{section.content} → {section.ctaText}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">{section.content || "(empty)"}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                      title="Improve with AI"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AI regenerate panel */}
                  {editingSection === section.id && (
                    <div className="px-3 pb-3 border-t border-border/40 pt-3 flex gap-2">
                      <input
                        value={sectionInstruction}
                        onChange={(e) => setSectionInstruction(e.target.value)}
                        placeholder="Instruction for AI (e.g. 'Make this more detailed')"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <AIGenerateButton
                        size="sm"
                        label="Improve"
                        loadingLabel="Improving…"
                        onClick={() => handleRegenerateSection(section.id)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="max-w-3xl mx-auto p-6 lg:p-8">
            <h1 className="text-4xl font-black mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
            <BlogContentRenderer sections={post.sections} />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="max-w-2xl mx-auto p-6 lg:p-8 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">SEO Settings</h2>
            </div>

            {/* Score indicator */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SEO Score</span>
                <span className={`text-2xl font-black ${post.seoScore >= 75 ? "text-emerald-500" : post.seoScore >= 50 ? "text-amber-500" : "text-rose-500"}`}>{post.seoScore}/100</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full transition-all ${post.seoScore >= 75 ? "bg-emerald-500" : post.seoScore >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${post.seoScore}%` }} />
              </div>
            </div>

            {[
              { label: "Meta Title", key: "metaTitle" as const, placeholder: "SEO-optimized title (50-60 chars)", maxLength: 70 },
              { label: "Focus Keyword", key: "focusKeyword" as const, placeholder: "Primary target keyword" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                <input
                  value={String(post[field.key] || "")}
                  onChange={(e) => setPost({ ...post, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1.5">Meta Description</label>
              <textarea
                value={post.metaDescription}
                onChange={(e) => setPost({ ...post, metaDescription: e.target.value })}
                rows={3}
                maxLength={160}
                placeholder="Compelling meta description (140-155 chars)"
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">{post.metaDescription.length}/160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <div key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                    {tag}
                    <button onClick={() => setPost({ ...post, tags: post.tags.filter((_, j) => j !== i) })} className="text-primary/60 hover:text-primary">×</button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              <Save className="w-4 h-4" /> Save SEO Settings
            </button>
          </div>
        )}

        {activeTab === "config" && (
          <div className="max-w-2xl mx-auto p-6 lg:p-8 space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Post Configuration</h2>
            </div>

            {/* Premium Content */}
            <div className="p-5 rounded-2xl border border-border/50 bg-card/50 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${post.isPremium ? "bg-violet-600/20 text-violet-400" : "bg-muted text-muted-foreground"}`}>
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Premium Content (Pro Only)</p>
                  <p className="text-xs text-muted-foreground">Restrict access to paying Pro members.</p>
                </div>
              </div>
              <button
                onClick={() => setPost({ ...post, isPremium: !post.isPremium })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${post.isPremium ? "bg-violet-600" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${post.isPremium ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            {/* Series / Playlist */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                <Layers className="w-4 h-4 text-primary" />
                Add to Series / Playlist
              </label>
              <select
                value={post.seriesId || ""}
                onChange={(e) => setPost({ ...post, seriesId: e.target.value || undefined })}
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">None (Standalone Post)</option>
                {seriesList.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Series posts show a navigation widget for easier learning paths.</p>
            </div>

            {post.seriesId && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Order in Series</label>
                <input
                  type="number"
                  value={post.seriesOrder || 0}
                  onChange={(e) => setPost({ ...post, seriesOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
