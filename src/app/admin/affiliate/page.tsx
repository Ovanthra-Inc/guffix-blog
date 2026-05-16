import { getAffiliateLinks } from "@/lib/firebase/firestore";
import { AffiliateLinkManager } from "@/components/admin/affiliate-link-manager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Affiliate Links" };

export default async function AffiliatePage() {
  let links = [];
  try { links = await getAffiliateLinks(); } catch { /* Firestore not configured */ }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black">Affiliate Link Manager</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your affiliate links. AI injects them automatically into generated blogs.
        </p>
      </div>

      {/* Revenue tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Inline Links", desc: "Naturally embedded in paragraph content", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
          { title: "CTA Blocks", desc: "Highlighted call-to-action sections", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
          { title: "Sidebar Widgets", desc: "Sticky sidebar recommendations", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
        ].map((type) => (
          <div key={type.title} className={`p-4 rounded-xl border ${type.color} bg-opacity-10`}>
            <p className="font-semibold text-sm mb-1">{type.title}</p>
            <p className="text-xs opacity-70">{type.desc}</p>
          </div>
        ))}
      </div>

      <AffiliateLinkManager initialLinks={links} />
    </div>
  );
}
