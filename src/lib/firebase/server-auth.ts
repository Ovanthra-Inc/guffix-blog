import { cookies } from "next/headers";
import { auth } from "@/lib/firebase/admin";
import { getUserProfile } from "@/lib/firebase/firestore";
import type { UserTier } from "@/types/user";

export async function getServerUserTier(): Promise<UserTier> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return "free";

  try {
    const decoded = await auth.verifySessionCookie(session);
    if (!decoded) return "free";

    const profile = await getUserProfile(decoded.uid);
    return profile?.tier || "free";
  } catch {
    return "free";
  }
}

export async function getServerUserProfile() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const decoded = await auth.verifySessionCookie(session);
    if (!decoded) return null;

    return await getUserProfile(decoded.uid);
  } catch {
    return null;
  }
}

