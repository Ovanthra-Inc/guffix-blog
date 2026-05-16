import type { Metadata } from "next";
import type { BlogPost } from "@/types/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guffix.ai";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "GuffixAI";

/**
 * Generates Next.js Metadata from a BlogPost object.
 */
export function generateSeoMetadata(post: BlogPost): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.heroImage.url || `${SITE_URL}/og-default.png`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: [post.focusKeyword, ...post.tags].filter(Boolean),
    authors: post.authorName ? [{ name: post.authorName }] : [{ name: SITE_NAME }],
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.heroImage.alt || post.title,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt as Date).toISOString()
        : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: post.status === "published",
      follow: true,
    },
  };
}

/**
 * Default site metadata for non-blog pages.
 */
export function defaultMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: "AI-powered blog platform generating SEO content that earns.",
    metadataBase: new URL(SITE_URL),
    ...overrides,
  };
}
