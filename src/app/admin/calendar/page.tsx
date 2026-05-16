import { getPosts } from "@/lib/firebase/firestore";
import { ContentCalendar } from "@/components/admin/content-calendar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Content Calendar" };

export default async function CalendarPage() {
  let posts = [];
  try { posts = await getPosts({ limit: 200 }); } catch { /* Firestore not configured */ }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black">Content Calendar</h1>
        <p className="text-muted-foreground text-sm mt-0.5">View and manage your publishing schedule.</p>
      </div>
      <ContentCalendar posts={posts} />
    </div>
  );
}
