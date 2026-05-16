"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Megaphone, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdvertisePage() {
  const [form, setForm] = useState({ name: "", company: "", email: "", budget: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Inquiry sent! We'll get back to you within 24 hours.");
    setSubmitted(true);
  };

  const fieldClass = "w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <>
      <Header />
      <main className="flex-1 bg-hero">
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-5">
              <Megaphone className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black mb-3">Advertise on GuffixAI</h1>
            <p className="text-muted-foreground text-lg">
              Reach a targeted audience of developers, tech founders, and AI enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-12">
            {[{ value: "50K+", label: "Monthly readers" }, { value: "85%", label: "Tech professionals" }, { value: "3.2x", label: "Avg. CTR vs industry" }].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl border border-border/50 bg-card/50">
                <div className="text-2xl font-black text-gradient">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="font-bold text-xl mb-2">Inquiry Received!</h2>
              <p className="text-muted-foreground">Our team will contact you at {form.email} within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-7 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5">Name *</label><input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="John Doe" className={fieldClass} /></div>
                <div><label className="block text-sm font-medium mb-1.5">Company</label><input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} placeholder="Acme Inc." className={fieldClass} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1.5">Email *</label><input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@company.com" className={fieldClass} /></div>
              <div><label className="block text-sm font-medium mb-1.5">Monthly Budget</label>
                <select value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} className={fieldClass}>
                  <option value="">Select range</option>
                  <option>$100 – $500</option><option>$500 – $2,000</option><option>$2,000 – $10,000</option><option>$10,000+</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1.5">Message</label><textarea rows={4} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="Tell us about your campaign goals…" className={`${fieldClass} resize-none`} /></div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">Send Inquiry</button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
