"use client";

import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw, ChevronDown } from "lucide-react";
import { TopicScoreTable } from "@/components/admin/topic-score-table";
import { BlogGenerationPanel } from "@/components/admin/blog-generation-panel";
import { discoverAndSaveTopicsAction, getTopicsAction } from "@/lib/actions/topic.actions";
import { rejectTopicAction } from "@/lib/actions/topic.actions";
import type { Topic } from "@/types/topic";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CATEGORIES = ["AI Tools","Web Development","Mobile Development","Cloud & DevOps","Cybersecurity","Data Science","Machine Learning","Blockchain","Startup & Business","Productivity"];

export default function TopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("AI Tools");
  const [discovering, setDiscovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    getTopicsAction().then((t) => { setTopics(t); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDiscover = async () => {
    setDiscovering(true);
    const toastId = toast.loading(`Discovering ${selectedCategory} topics…`);
    try {
      const result = await discoverAndSaveTopicsAction(selectedCategory);
      if (result.success && result.topics) {
        setTopics((prev) => [...(result.topics || []), ...prev]);
        toast.success(`Found ${result.topics.length} trending topics!`, { id: toastId });
      } else {
        toast.error(result.error || "Discovery failed", { id: toastId });
      }
    } finally {
      setDiscovering(false);
    }
  };

  const handleGenerate = async (topic: Topic): Promise<{ id?: string }> => {
    const res = await fetch("/api/ai/generate-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicTitle: topic.title, category: topic.category, keywords: topic.suggestedKeywords, topicId: topic.id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Generation failed");
    return { id: data.postId };
  };

  const handleReject = async (id: string) => {
    await rejectTopicAction(id);
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, status: "rejected" as const } : t)));
    toast.info("Topic skipped");
  };

  const handleGenerateComplete = (postId: string) => {
    router.push(`/admin/posts/${postId}`);
  };

  const visibleTopics = topics.filter((t) => t.status !== "rejected");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            Topic Discovery
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            AI discovers trending topics scored by trend, SEO, and monetization potential.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            id="discover-topics-btn"
            onClick={handleDiscover}
            disabled={discovering}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {discovering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            {discovering ? "Discovering…" : "Discover Topics"}
          </button>
        </div>
      </div>

      {/* Generation panel */}
      {selectedTopic && (
        <div className="max-w-xl">
          <BlogGenerationPanel
            topic={selectedTopic}
            onGenerate={handleGenerate}
            onComplete={handleGenerateComplete}
          />
        </div>
      )}

      {/* Topics table */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />
          Loading topics…
        </div>
      ) : (
        <TopicScoreTable
          topics={visibleTopics}
          onGenerate={(topic) => { setSelectedTopic(topic); return handleGenerate(topic); }}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
