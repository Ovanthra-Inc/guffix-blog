"use client";

import { Crown, Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PremiumLock() {
  return (
    <div className="relative mt-12 p-1 rounded-3xl bg-gradient-to-br from-violet-600/20 via-primary/10 to-transparent border border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      
      <div className="relative p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-600/10">
          <Crown className="w-8 h-8 text-violet-400" />
        </div>
        
        <h2 className="text-3xl font-black mb-4">
          This Content is <span className="text-violet-400">Pro Only</span>
        </h2>
        
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
          Unlock this deep-dive article and get exclusive access to all premium tech guides, early trends, and the Pro community.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
          >
            Upgrade to Pro <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-muted border border-border/50 text-foreground font-bold hover:bg-muted/80 transition-all"
          >
            Sign In
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          {[
            { label: "Deep Dives", icon: Sparkles },
            { label: "Trend Reports", icon: TrendingUp },
            { label: "Ad Free", icon: ShieldCheck },
            { label: "Pro Badge", icon: Crown },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-background/50 border border-border/30">
              <item.icon className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper icons
import { TrendingUp, ShieldCheck } from "lucide-react";
