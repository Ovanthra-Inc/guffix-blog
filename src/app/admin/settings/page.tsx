"use client";

import { useState } from "react";
import { Settings, Save, Sparkles, Database, Globe, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";


const MODELS = [
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini (Fast, Cheap)" },
  { value: "openai/gpt-4o", label: "GPT-4o (Balanced)" },
  { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet (Premium)" },
  { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku (Fast)" },
  { value: "google/gemini-flash-1.5", label: "Gemini Flash 1.5 (Fast)" },
  { value: "meta-llama/llama-3.1-8b-instruct", label: "Llama 3.1 8B (Free)" },
];

const CATEGORIES = [
  "AI Tools", "Web Development", "Mobile Development", "Cloud & DevOps",
  "Cybersecurity", "Data Science", "Machine Learning", "Blockchain",
  "Startup & Business", "Productivity",
];

export default function SettingsPage() {
  const [model, setModel] = useState("openai/gpt-4o-mini");
  const [siteName, setSiteName] = useState("GuffixAI");
  const [siteUrl, setSiteUrl] = useState("https://guffix.ai");
  const [defaultCategories, setDefaultCategories] = useState<string[]>(["AI Tools", "Web Development", "Cloud & DevOps"]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.model) setModel(data.model);
        if (data.siteName) setSiteName(data.siteName);
        if (data.siteUrl) setSiteUrl(data.siteUrl);
        if (data.defaultCategories) setDefaultCategories(data.defaultCategories);
      })
      .catch(console.error);
  }, []);


  const toggleCategory = (cat: string) => {
    setDefaultCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, siteName, siteUrl, defaultCategories }),
      });
      if (res.ok) toast.success("Settings saved!");
      else toast.error("Failed to save settings");
    } catch {
      toast.error("An error occurred while saving.");

    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Configure AI model, site settings, and automation.</p>
      </div>

      {/* AI Settings */}
      <section className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border/50">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">AI Configuration</h2>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">OpenRouter Model</label>
          <div className="relative">
            <select value={model} onChange={(e) => setModel(e.target.value)} className={`${fieldClass} appearance-none pr-9`}>
              {MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Used for blog generation, topic discovery, and SEO improvement.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Default Cron Categories</label>
          <p className="text-xs text-muted-foreground mb-3">AI will discover topics in these categories daily.</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${defaultCategories.includes(cat) ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:border-border hover:text-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Site Settings */}
      <section className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/50">
          <Globe className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Site Settings</h2>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Site Name</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={fieldClass} placeholder="GuffixAI" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Site URL</label>
          <input type="url" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className={fieldClass} placeholder="https://guffix.ai" />
        </div>
      </section>

      {/* Cron info */}
      <section className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-border/50">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Vercel Cron Schedule</h2>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { time: "9:00 AM UTC", task: "Discover trending topics across all categories" },
            { time: "7:00 PM UTC", task: "Publish all scheduled posts that are due" },
          ].map((cron) => (
            <div key={cron.time} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-xs font-mono text-primary whitespace-nowrap">{cron.time}</span>
              <span className="text-muted-foreground text-xs">{cron.task}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Cron jobs run automatically in production. Test locally by calling the endpoints directly.</p>
      </section>

      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
        <Save className="w-4 h-4" />
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}
