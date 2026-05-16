import { Timestamp } from "firebase/firestore";

export type UserTier = "free" | "pro";
export type UserRole = "user" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  tier: UserTier;
  role: UserRole;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

