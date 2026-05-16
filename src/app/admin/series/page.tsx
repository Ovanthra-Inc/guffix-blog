"use client";

import { useEffect, useState } from "react";
import { getSeriesAction, saveSeriesAction, deleteSeriesAction } from "@/lib/actions/series.actions";
import { getPosts } from "@/lib/firebase/firestore";
import type { BlogSeries } from "@/types/series";
import type { BlogPost } from "@/types/blog";
import { Plus, Layers, Trash2, Edit3, Save, X, ExternalLink, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/utils/slugify";
import Link from "next/link";

export default function AdminSeriesPage() {
  const [seriesList, setSeriesList] = useState<BlogSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSeries, setNewSeries] = useState({ title: "", description: "", category: "AI Tools", isPremium: false });

  useEffect(() => {
    getSeriesAction().then((data) => { setSeriesList(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newSeries.title) return toast.error("Title required");
    const res = await saveSeriesAction({
      ...newSeries,
      slug: slugify(newSeries.title),
      postIds: [],
    });
    if (res.success) {
      toast.success("Series created!");
      setIsAdding(false);
      setNewSeries({ title: "", description: "", category: "AI Tools", isPremium: false });
      getSeriesAction().then(setSeriesList);
    } else {
      toast.error(res.error || "Failed to create series");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this series?")) return;
    const res = await deleteSeriesAction(id);
    if (res.success) {
      toast.success("Series deleted");
      setSeriesList((prev) => prev.filter((s) => s.id !== id));
    } else {
      toast.error(res.error || "Delete failed");
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading series…</div>;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            Playlists & Series
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Organize your blog posts into structured paths.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Series
        </button>
      </div>

      {isAdding && (
        <div className="p-6 rounded-2xl border border-primary/20 bg-card/50 space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold">New Series</h2>
            <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Title</label>
              <input
                value={newSeries.title}
                onChange={(e) => setNewSeries({ ...newSeries, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-muted border border-border text-sm"
                placeholder="The Future of LLMs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Category</label>
              <select
                value={newSeries.category}
                onChange={(e) => setNewSeries({ ...newSeries, category: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-muted border border-border text-sm"
              >
                {["AI Tools", "Web Development", "Cloud & DevOps", "Productivity"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Description</label>
            <textarea
              value={newSeries.description}
              onChange={(e) => setNewSeries({ ...newSeries, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-muted border border-border text-sm resize-none"
              rows={2}
              placeholder="A step-by-step guide to understanding large language models…"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPremium"
              checked={newSeries.isPremium}
              onChange={(e) => setNewSeries({ ...newSeries, isPremium: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isPremium" className="text-sm font-medium">Premium Series (Pro Only)</label>
          </div>
          <button
            onClick={handleCreate}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            Save Series
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seriesList.length === 0 && !isAdding && (
          <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-border/50">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No series created yet. Start organizing your content!</p>
          </div>
        )}
        {seriesList.map((item) => (
          <div
            key={item.id}
            className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.isPremium ? "bg-violet-600/20 text-violet-400 border border-violet-500/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
                {item.isPremium ? "Premium" : "Free"}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/series/${item.slug}`} target="_blank" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"><ExternalLink className="w-4 h-4" /></Link>
                <button onClick={() => handleDelete(item.id!)} className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.title}</h3>
            <p className="text-muted-foreground text-xs line-clamp-2 mb-6">{item.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground">{item.postIds.length} Posts</span>
              <button className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                Manage Posts <Edit3 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
