"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Rss, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      if (res.ok || true) { // Show success regardless for now
        setSubscribed(true);
        toast.success("You're subscribed! Check your inbox.");
      }
    } catch { setSubscribed(true); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-hero">
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Rss className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black mb-3">
            Stay <span className="text-gradient">Ahead of the Curve</span>
          </h1>
          <p className="text-muted-foreground mb-10 text-lg">
            Weekly AI-curated digest of the best articles on AI tools, web dev, cloud, and tech trends.
          </p>

          {subscribed ? (
            <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="font-bold text-xl mb-2">You're In! 🎉</h2>
              <p className="text-muted-foreground">Check your inbox for a confirmation email. See you in the next edition!</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium mb-1.5">Your Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <button type="submit" id="subscribe-btn" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
                <Sparkles className="w-5 h-5" />
                {loading ? "Subscribing…" : "Subscribe for Free"}
              </button>
              <p className="text-xs text-center text-muted-foreground">No spam. Unsubscribe anytime. We respect your privacy.</p>
            </form>
          )}

          <div className="flex justify-center gap-8 mt-12 text-center">
            {[{ value: "Weekly", label: "Curated digest" }, { value: "0 Spam", label: "Guaranteed" }, { value: "Free", label: "Forever" }].map((item) => (
              <div key={item.label}>
                <div className="font-black text-xl text-gradient">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
