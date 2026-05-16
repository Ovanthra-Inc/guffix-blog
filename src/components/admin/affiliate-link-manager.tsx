"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { AffiliateLink } from "@/types/affiliate";
import {
  saveAffiliateLinkAction,
  deleteAffiliateLinkAction,
  updateAffiliateLinkAction,
} from "@/lib/actions/affiliate.actions";

interface AffiliateLinkManagerProps {
  initialLinks: AffiliateLink[];
}

const CATEGORIES = ["AI Tools","Web Hosting","SaaS Tools","Courses & Learning","Developer Tools","Cloud Services","Productivity","Security","Marketing","Other"];

export function AffiliateLinkManager({ initialLinks }: AffiliateLinkManagerProps) {
  const [links, setLinks] = useState(initialLinks);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", url: "", anchorText: "", category: "AI Tools", commission: "", description: "", isActive: true });
  const [saving, setSaving] = useState(false);

  const resetForm = () => setForm({ name: "", url: "", anchorText: "", category: "AI Tools", commission: "", description: "", isActive: true });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await saveAffiliateLinkAction({ name: form.name, url: form.url, anchorText: form.anchorText, category: form.category, commission: form.commission, description: form.description, isActive: form.isActive });
    setSaving(false);
    if (result.success && result.id) {
      setLinks((prev) => [{ ...form, id: result.id, clickCount: 0, createdAt: new Date(), updatedAt: new Date() } as AffiliateLink, ...prev]);
      setShowForm(false);
      resetForm();
      toast.success("Affiliate link added!");
    } else { toast.error(result.error || "Failed to add link"); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    const result = await updateAffiliateLinkAction(editingId, form);
    setSaving(false);
    if (result.success) {
      setLinks((prev) => prev.map((l) => (l.id === editingId ? { ...l, ...form } : l)));
      setEditingId(null);
      resetForm();
      toast.success("Link updated!");
    } else { toast.error(result.error || "Failed to update"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this affiliate link?")) return;
    const result = await deleteAffiliateLinkAction(id);
    if (result.success) { setLinks((prev) => prev.filter((l) => l.id !== id)); toast.success("Link deleted"); }
    else { toast.error(result.error || "Failed to delete"); }
  };

  const startEdit = (link: AffiliateLink) => {
    setForm({ name: link.name, url: link.url, anchorText: link.anchorText, category: link.category, commission: link.commission || "", description: link.description || "", isActive: link.isActive });
    setEditingId(link.id!);
    setShowForm(false);
  };

  const fieldClass = "w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{links.length} affiliate {links.length === 1 ? "link" : "links"}</p>
        <button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {(showForm || editingId) && (
        <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-4 p-5 rounded-xl border border-border/50 bg-card/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label><input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. OpenAI" className={fieldClass} /></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Category *</label><select required value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className={fieldClass}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Affiliate URL *</label><input required type="url" value={form.url} onChange={(e) => setForm({...form, url: e.target.value})} placeholder="https://..." className={fieldClass} /></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Anchor Text *</label><input required value={form.anchorText} onChange={(e) => setForm({...form, anchorText: e.target.value})} placeholder="Try it free" className={fieldClass} /></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Commission</label><input value={form.commission} onChange={(e) => setForm({...form, commission: e.target.value})} placeholder="30% recurring" className={fieldClass} /></div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="accent-primary" /><span className="text-sm text-muted-foreground">Active</span></label>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">{saving ? "Saving..." : editingId ? "Update" : "Add Link"}</button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {links.length === 0 && !showForm && (
          <div className="text-center py-16 text-muted-foreground rounded-xl border border-border/50">
            <p className="font-medium mb-1">No affiliate links yet</p>
            <p className="text-sm">Add your first affiliate link to start monetizing.</p>
          </div>
        )}
        {links.map((link) => (
          <div key={link.id} className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/30 hover:border-border transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{link.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{link.category}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${link.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>{link.isActive ? "Active" : "Inactive"}</span>
                {link.commission && <span className="text-xs text-muted-foreground">💰 {link.commission}</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">"{link.anchorText}"</p>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5 truncate max-w-xs">
                <ExternalLink className="w-3 h-3 shrink-0" />{link.url}
              </a>
              <p className="text-xs text-muted-foreground mt-1">{link.clickCount} clicks</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(link)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(link.id!)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
