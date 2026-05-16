"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import type { Topic } from "@/types/topic";

const GENERATION_STEPS = [
  { id: "outline", label: "Generating outline & structure" },
  { id: "writing", label: "Writing blog sections" },
  { id: "seo", label: "Optimizing for SEO" },
  { id: "affiliate", label: "Adding affiliate suggestions" },
  { id: "saving", label: "Saving to Firestore" },
];

interface BlogGenerationPanelProps {
  topic: Topic;
  onGenerate: (topic: Topic) => Promise<{ id?: string }>;
  onComplete: (postId: string) => void;
}

export function BlogGenerationPanel({ topic, onGenerate, onComplete }: BlogGenerationPanelProps) {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [currentStep, setCurrentStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus("running");
    setError(null);
    setCurrentStep(0);

    try {
      // Simulate step progression while waiting for API
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < GENERATION_STEPS.length - 2) return prev + 1;
          clearInterval(stepInterval);
          return prev;
        });
      }, 4000);

      const result = await onGenerate(topic);
      clearInterval(stepInterval);
      setCurrentStep(GENERATION_STEPS.length - 1);

      setTimeout(() => {
        setStatus("done");
        if (result.id) {
          setPostId(result.id);
        }
      }, 800);
    } catch (err) {
      setStatus("error");
      setError(String(err));
    }
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 space-y-5">
      {/* Topic info */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{topic.category}</p>
        <h3 className="font-bold text-lg leading-snug">{topic.title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{topic.reason}</p>
        <div className="flex gap-3 mt-3">
          {[
            { label: "Trend", value: topic.trendScore },
            { label: "SEO", value: topic.seoScore },
            { label: "Revenue", value: topic.monetizationScore },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Generation status */}
      {status !== "idle" && (
        <div className="space-y-2.5">
          {GENERATION_STEPS.map((step, i) => {
            const isDone = i < currentStep || status === "done";
            const isRunning = i === currentStep && status === "running";
            return (
              <div key={step.id} className="flex items-center gap-3">
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                {isRunning && <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />}
                {!isDone && !isRunning && (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/20 shrink-0" />
                )}
                <span className={`text-sm ${isDone ? "text-foreground" : isRunning ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Error */}
      {status === "error" && error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success */}
      {status === "done" && postId && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="font-semibold text-emerald-400">Blog generated successfully!</p>
          <button
            onClick={() => onComplete(postId)}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Review & Edit Post <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CTA */}
      {status === "idle" && (
        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          Generate Full Blog Post
        </button>
      )}

      {status === "error" && (
        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          Retry Generation
        </button>
      )}
    </div>
  );
}
