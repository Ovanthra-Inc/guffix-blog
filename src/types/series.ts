import { Timestamp } from "firebase/firestore";

export interface BlogSeries {
  id?: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  postIds: string[]; // Ordered list of post IDs
  category: string;
  isPremium: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}
