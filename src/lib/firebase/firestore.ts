import { db } from "@/lib/firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { BlogPost, BlogStatus } from "@/types/blog";
import type { Topic } from "@/types/topic";
import type { AffiliateLink } from "@/types/affiliate";
import type { UserProfile } from "@/types/user";
import type { BlogSeries } from "@/types/series";

// ─── POSTS ───────────────────────────────────────────────

export async function getPosts(options?: {
  status?: BlogStatus;
  category?: string;
  limit?: number;
  lastDocId?: string;
}): Promise<{ posts: BlogPost[]; lastDocId: string | null }> {
  let query = db.collection("posts").orderBy("createdAt", "desc") as FirebaseFirestore.Query;

  if (options?.status) {
    query = query.where("status", "==", options.status);
  }
  if (options?.category) {
    query = query.where("category", "==", options.category);
  }
  if (options?.lastDocId) {
    const lastDoc = await db.collection("posts").doc(options.lastDocId).get();
    if (lastDoc.exists) {
      query = query.startAfter(lastDoc);
    }
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const snapshot = await query.get();
  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];

  return {
    posts,
    lastDocId: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null,
  };
}


export async function getPostById(id: string): Promise<BlogPost | null> {
  const doc = await db.collection("posts").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as BlogPost;
}

export async function getPostsByIds(ids: string[]): Promise<BlogPost[]> {
  if (ids.length === 0) return [];
  const snapshot = await db.collection("posts").where("__name__", "in", ids).get();
  // Sort them based on the input ids order
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as BlogPost[];
  return ids.map(id => posts.find(p => p.id === id)).filter(Boolean) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const snapshot = await db
    .collection("posts")
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as BlogPost;
}

export async function savePost(post: Omit<BlogPost, "id">): Promise<string> {
  const ref = await db.collection("posts").add({
    ...post,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    viewCount: 0,
  });
  return ref.id;
}

export async function updatePost(
  id: string,
  data: Partial<BlogPost>
): Promise<void> {
  await db
    .collection("posts")
    .doc(id)
    .update({ ...data, updatedAt: FieldValue.serverTimestamp() });
}

export async function deletePost(id: string): Promise<void> {
  await db.collection("posts").doc(id).delete();
}

export async function publishPost(id: string): Promise<void> {
  await db.collection("posts").doc(id).update({
    status: "published",
    publishedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function incrementViewCount(id: string): Promise<void> {
  const batch = db.batch();
  
  // Increment individual post view count
  const postRef = db.collection("posts").doc(id);
  batch.update(postRef, { viewCount: FieldValue.increment(1) });
  
  // Increment global total views
  const statsRef = db.collection("stats").doc("overview");
  batch.set(statsRef, { totalViews: FieldValue.increment(1) }, { merge: true });
  
  await batch.commit();
}


// ─── TOPICS ──────────────────────────────────────────────

export async function getTopics(options?: {
  category?: string;
  status?: string;
  limit?: number;
}): Promise<Topic[]> {
  let query = db
    .collection("topics")
    .orderBy("discoveredAt", "desc") as FirebaseFirestore.Query;

  if (options?.category) {
    query = query.where("category", "==", options.category);
  }
  if (options?.status) {
    query = query.where("status", "==", options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Topic[];
}

export async function saveTopic(topic: Omit<Topic, "id">): Promise<string> {
  const ref = await db.collection("topics").add({
    ...topic,
    discoveredAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function saveTopics(topics: Omit<Topic, "id">[]): Promise<string[]> {
  const batch = db.batch();
  const ids: string[] = [];
  for (const topic of topics) {
    const ref = db.collection("topics").doc();
    batch.set(ref, { ...topic, discoveredAt: FieldValue.serverTimestamp() });
    ids.push(ref.id);
  }
  await batch.commit();
  return ids;
}

export async function updateTopic(id: string, data: Partial<Topic>): Promise<void> {
  await db.collection("topics").doc(id).update(data);
}

export async function deleteTopic(id: string): Promise<void> {
  await db.collection("topics").doc(id).delete();
}

// ─── AFFILIATE LINKS ─────────────────────────────────────

export async function getAffiliateLinks(): Promise<AffiliateLink[]> {
  const snapshot = await db
    .collection("affiliate_links")
    .where("isActive", "==", true)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AffiliateLink[];
}

export async function saveAffiliateLink(
  link: Omit<AffiliateLink, "id">
): Promise<string> {
  const ref = await db.collection("affiliate_links").add({
    ...link,
    clickCount: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateAffiliateLink(
  id: string,
  data: Partial<AffiliateLink>
): Promise<void> {
  await db
    .collection("affiliate_links")
    .doc(id)
    .update({ ...data, updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteAffiliateLink(id: string): Promise<void> {
  await db.collection("affiliate_links").doc(id).delete();
}

export async function incrementAffiliateLinkClick(id: string): Promise<void> {
  await db
    .collection("affiliate_links")
    .doc(id)
    .update({ clickCount: FieldValue.increment(1) });
}

// ─── NEWSLETTER ───────────────────────────────────────────

export async function saveNewsletterSubscriber(email: string): Promise<void> {
  const existing = await db
    .collection("newsletter_subscribers")
    .where("email", "==", email)
    .get();
  if (!existing.empty) return;
  await db.collection("newsletter_subscribers").add({
    email,
    subscribedAt: FieldValue.serverTimestamp(),
    isActive: true,
  });
}

export async function getNewsletterSubscriberCount(): Promise<number> {
  const snapshot = await db
    .collection("newsletter_subscribers")
    .where("isActive", "==", true)
    .count()
    .get();
  return snapshot.data().count;
}

export async function unsubscribeNewsletter(email: string): Promise<void> {
  const snapshot = await db
    .collection("newsletter_subscribers")
    .where("email", "==", email)
    .get();
  
  if (snapshot.empty) return;
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { isActive: false, unsubscribedAt: FieldValue.serverTimestamp() });
  });
  await batch.commit();
}


// ─── ANALYTICS ────────────────────────────────────────────

export async function getDashboardStats() {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    scheduledPosts,
    subscriberCount,
    affiliateLinks,
  ] = await Promise.all([
    db.collection("posts").count().get(),
    db.collection("posts").where("status", "==", "published").count().get(),
    db.collection("posts").where("status", "==", "draft").count().get(),
    db.collection("posts").where("status", "==", "scheduled").count().get(),
    getNewsletterSubscriberCount(),
    getAffiliateLinks(),
  ]);

  const totalAffiliateClicks = affiliateLinks.reduce(
    (sum, link) => sum + (link.clickCount || 0),
    0
  );

  // Average SEO score
  const { posts: recentPosts } = await getPosts({ status: "published", limit: 20 });

  const avgSeoScore =
    recentPosts.length > 0
      ? Math.round(
          recentPosts.reduce((sum, p) => sum + (p.seoScore || 0), 0) /
            recentPosts.length
        )
      : 0;

  // Real View Count (Optimized: Fetch from aggregate doc)
  const statsDoc = await db.collection("stats").doc("overview").get();
  const totalViews = statsDoc.exists ? statsDoc.data()?.totalViews || 0 : 0;

  return {
    totalPosts: totalPosts.data().count,
    publishedPosts: publishedPosts.data().count,
    draftPosts: draftPosts.data().count,
    scheduledPosts: scheduledPosts.data().count,
    newsletterSubscribers: subscriberCount,
    affiliateClicks: totalAffiliateClicks,
    avgSeoScore,
    monthlyViews: totalViews,
  };
}



// ─── SCHEDULED POSTS ─────────────────────────────────────

export async function getScheduledPostsDue(): Promise<BlogPost[]> {
  const now = Timestamp.now();
  const snapshot = await db
    .collection("posts")
    .where("status", "==", "scheduled")
    .where("scheduledAt", "<=", now)
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
}

// ─── SETTINGS ─────────────────────────────────────────────

export async function getSettings(): Promise<Record<string, unknown>> {
  const doc = await db.collection("settings").doc("global").get();
  return doc.exists ? (doc.data() as Record<string, unknown>) : {};
}

export async function updateSettings(data: Record<string, unknown>): Promise<void> {
  await db
    .collection("settings")
    .doc("global")
    .set(data, { merge: true });
}

// ─── USERS ───────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const doc = await db.collection("users").doc(uid).get();
  if (!doc.exists) return null;
  return { uid: doc.id, ...doc.data() } as UserProfile;
}
export async function getUserByStripeCustomerId(
  customerId: string
): Promise<UserProfile | null> {
  const snapshot = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { uid: doc.id, ...doc.data() } as UserProfile;
}

export async function createOrUpdateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await db.collection("users").doc(uid).set(
    {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
      ...(data.createdAt ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true }
  );
}

// ─── SERIES ──────────────────────────────────────────────

export async function getSeries(): Promise<BlogSeries[]> {
  const snapshot = await db.collection("series").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogSeries[];
}

export async function getSeriesBySlug(slug: string): Promise<BlogSeries | null> {
  const snapshot = await db
    .collection("series")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as BlogSeries;
}

export async function getSeriesById(id: string): Promise<BlogSeries | null> {
  const doc = await db.collection("series").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as BlogSeries;
}

export async function saveSeries(series: Omit<BlogSeries, "id">): Promise<string> {
  const ref = await db.collection("series").add({
    ...series,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateSeries(
  id: string,
  data: Partial<BlogSeries>
): Promise<void> {
  await db
    .collection("series")
    .doc(id)
    .update({ ...data, updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteSeries(id: string): Promise<void> {
  await db.collection("series").doc(id).delete();
}
