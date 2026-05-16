"use server";

import { getUserProfile, createOrUpdateUserProfile } from "@/lib/firebase/firestore";
import type { UserProfile } from "@/types/user";

export async function syncUserProfile(uid: string, data: { email: string; displayName?: string; photoURL?: string }): Promise<UserProfile> {
  let profile = await getUserProfile(uid);
  
  const ADMIN_EMAIL = "sidhyaasutosh@gmail.com";

  if (!profile) {
    const role = data.email === ADMIN_EMAIL ? "admin" : "user";
    await createOrUpdateUserProfile(uid, {
      ...data,
      tier: "free",
      role,
    });
    profile = await getUserProfile(uid);
  } else {
    // Update display name or photo if changed, but preserve role
    await createOrUpdateUserProfile(uid, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    });
    profile = await getUserProfile(uid);
  }
  
  return profile!;
}

