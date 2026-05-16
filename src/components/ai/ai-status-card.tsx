"use client";

import { CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
import type { GenerationStep } from "@/types/blog";

interface AIStatusCardProps {
  steps: GenerationStep[];
  title?: string;
}

export function AIStatusCard({ steps, title = "AI Generation" }: AIStatusCardProps) {
  const done = steps.filter((s) => s.status === "done").length;
  const total = steps.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const hasError = steps.some((s) => s.status === "error");

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {done}/{total} steps
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            hasError ? "bg-destructive" : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <ul className="space-y-2">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center gap-3">
            {step.status === "done" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            {step.status === "running" && (
              <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
            )}
            {step.status === "pending" && (
              <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
            )}
            {step.status === "error" && (
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            )}
            <span
              className={`text-sm ${
                step.status === "done"
                  ? "text-foreground"
                  : step.status === "running"
                  ? "text-primary font-medium"
                  : step.status === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
