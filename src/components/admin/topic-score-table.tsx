"use client";

import { useState } from "react";
import { TrendingUp, Search, ArrowRight, Star, BarChart3, DollarSign, Loader2 } from "lucide-react";
import type { Topic } from "@/types/topic";

interface TopicScoreTableProps {
  topics: Topic[];
  onGenerate: (topic: Topic) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 75 ? "score-high" : score >= 50 ? "score-medium" : "score-low";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {score}
    </span>
  );
}

export function TopicScoreTable({ topics, onGenerate, onReject }: TopicScoreTableProps) {
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState<string | null>(null);

  const filtered = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleGenerate = async (topic: Topic) => {
    if (!topic.id) return;
    setGenerating(topic.id);
    try {
      await onGenerate(topic);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  Topic
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Trend
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <Search className="w-3.5 h-3.5" /> SEO
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Revenue
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5" /> Overall
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  Competition
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  Volume
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted-foreground">
                    No topics found. Click &quot;Discover Topics&quot; to start.
                  </td>
                </tr>
              )}
              {filtered.map((topic) => (
                <tr
                  key={topic.id}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 max-w-xs">
                    <div>
                      <p className="font-medium line-clamp-1">{topic.title}</p>
                      <p className="text-xs text-primary mt-0.5">{topic.category}</p>
                      {topic.reason && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {topic.reason}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={topic.trendScore} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={topic.seoScore} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={topic.monetizationScore} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ScoreBadge score={topic.overallScore} />
                      {topic.overallScore >= 80 && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium capitalize ${
                        topic.competitionLevel === "low"
                          ? "text-emerald-500"
                          : topic.competitionLevel === "medium"
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {topic.competitionLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {topic.estimatedSearchVolume}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {topic.status !== "generated" && (
                        <button
                          onClick={() => handleGenerate(topic)}
                          disabled={!!generating}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {generating === topic.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ArrowRight className="w-3 h-3" />
                          )}
                          {generating === topic.id ? "Generating..." : "Generate Blog"}
                        </button>
                      )}
                      {topic.status === "generated" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                          ✓ Generated
                        </span>
                      )}
                      {topic.status !== "generated" && (
                        <button
                          onClick={() => topic.id && onReject(topic.id)}
                          className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-xs hover:bg-muted transition-colors"
                        >
                          Skip
                        </button>
                      )}
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
