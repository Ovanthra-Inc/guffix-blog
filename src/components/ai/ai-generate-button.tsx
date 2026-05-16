"use client";

import { useState } from "react";
import { Loader2, Sparkles, Check, AlertCircle } from "lucide-react";

interface AIGenerateButtonProps {
  onClick: () => Promise<void>;
  label?: string;
  loadingLabel?: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function AIGenerateButton({
  onClick,
  label = "Generate with AI",
  loadingLabel = "Generating...",
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
}: AIGenerateButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleClick = async () => {
    if (status === "loading") return;
    setStatus("loading");
    try {
      await onClick();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const baseClass = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-primary/50 text-primary hover:bg-primary/10",
    ghost: "text-primary hover:bg-primary/10",
  }[variant];

  const sizeClass = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }[size];

  return (
    <button
      onClick={handleClick}
      disabled={disabled || status === "loading"}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${baseClass} ${sizeClass} ${className}`}
      aria-label={status === "loading" ? loadingLabel : label}
    >
      {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === "done" && <Check className="w-4 h-4 text-emerald-400" />}
      {status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
      {status === "idle" && <Sparkles className="w-4 h-4" />}

      <span>
        {status === "loading"
          ? loadingLabel
          : status === "done"
          ? "Done!"
          : status === "error"
          ? "Failed — retry"
          : label}
      </span>
    </button>
  );
}
