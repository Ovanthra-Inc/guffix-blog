import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { getServerUserProfile } from "@/lib/firebase/server-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin | GuffixAI",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getServerUserProfile();

  if (!profile || profile.role !== "admin") {
    return redirect("/");
  }

  return (

    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
