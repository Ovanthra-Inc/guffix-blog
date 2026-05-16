"use server";

import { getUserProfile, createOrUpdateUserProfile } from "@/lib/firebase/firestore";
import type { UserProfile } from "@/types/user";

export async function syncUserProfile(uid: string, data: { email: string; displayName?: string; photoURL?: string }): Promise<UserProfile> {
  let profile = await getUserProfile(uid);
  
  if (!profile) {
    await createOrUpdateUserProfile(uid, {
      ...data,
      tier: "free",
    });
    profile = await getUserProfile(uid);
  } else {
    // Optional: Update display name or photo if changed
    await createOrUpdateUserProfile(uid, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    });
    profile = { ...profile, ...data };
  }
  
  return profile!;
}
