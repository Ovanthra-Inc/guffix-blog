/**
 * All AI prompts for the GuffixAI AutoBlog platform.
 * Centralizing prompts here makes them easy to tune.
 */

export const TOPIC_DISCOVERY_PROMPT = (category: string) => `
You are an expert content strategist and SEO specialist.

Discover 8 trending, high-value blog topics in the "${category}" niche for ${new Date().getFullYear()}.

For each topic:
- It must have strong search demand (informational + commercial intent)
- It should have affiliate monetization potential
- It must be timely and relevant to current trends
- Prefer "best X", "how to X", "X vs Y", "X guide", "X tutorial" formats

Score each topic from 0-100 on:
- trendScore: How trending/timely the topic is right now
- seoScore: How much organic search potential it has
- monetizationScore: How well it can earn through affiliate links, ads, or products

Also provide:
- overallScore: Weighted average (trend 30%, seo 40%, monetization 30%)
- reason: One sentence explanation of why this topic is valuable
- suggestedKeywords: 3-5 LSI keywords to target
- estimatedSearchVolume: e.g. "10K-50K/month"
- competitionLevel: "low", "medium", or "high"
`;

export const BLOG_GENERATION_PROMPT = (topic: string, category: string, keywords: string[]) => `
You are an expert technical blogger and SEO writer. Generate a complete, professional, long-form blog post.

Topic: "${topic}"
Category: "${category}"
Target Keywords: ${keywords.join(", ")}
Year: ${new Date().getFullYear()}

Requirements:
1. Write in an engaging, authoritative tone
2. Minimum 2000 words of actual content across sections
3. Include at least one comparison table
4. Include at least one Mermaid diagram (flowchart or mind map)
5. Include at least one code example (TypeScript or Python preferred)
6. Include at least 5 FAQ entries
7. SEO-optimized: use keywords naturally, never stuff
8. Provide affiliate link placement suggestions (realistic product names and categories)
9. Add a compelling CTA section at the end

Section types available:
- "heading": H2/H3 headings with level field (2 or 3)
- "paragraph": Rich text paragraphs
- "table": Data comparison tables with columns and rows
- "code": Code blocks with language and filename
- "mermaid": Mermaid diagram definitions (flowchart, mindmap, sequenceDiagram)
- "quote": Expert quotes or highlights
- "faq": Single FAQ item with question and answer
- "cta": Call-to-action blocks with ctaText, ctaUrl, ctaStyle
- "image": Image placeholders with imageAlt and prompt fields

Generate sections in this order:
1. Introduction paragraph (hook + what reader will learn)
2. Main body headings (H2) with supporting paragraphs
3. Comparison table (if applicable)
4. Code example (if applicable)
5. Mermaid diagram
6. Sub-sections (H3) with details
7. FAQ section (5-7 questions)
8. Conclusion
9. CTA

For the hero image prompt: describe a photorealistic, professional image scene related to the topic.
For affiliate suggestions: suggest realistic software/product categories that would naturally fit.
`;

export const SEO_IMPROVEMENT_PROMPT = (
  title: string,
  excerpt: string,
  keyword: string
) => `
You are an SEO expert. Improve the SEO metadata for this blog post.

Current Title: "${title}"
Current Excerpt: "${excerpt}"
Focus Keyword: "${keyword}"

Generate:
1. metaTitle: Compelling, keyword-rich, 50-60 characters, include the year if relevant
2. metaDescription: Engaging, 140-155 characters, includes keyword, clear value proposition
3. focusKeyword: The single best primary keyword
4. suggestedTags: 5-8 relevant tags

Rules:
- metaTitle must be different from the post title but still descriptive
- metaDescription must make the user WANT to click
- Include numbers, power words, and urgency where natural
`;

export const SECTION_IMPROVEMENT_PROMPT = (
  sectionType: string,
  currentContent: string,
  instruction: string
) => `
You are an expert blog editor. Improve this blog section.

Section Type: ${sectionType}
Current Content:
"""
${currentContent}
"""

Editor Instruction: "${instruction}"

Rules:
- Keep the same section type
- Improve clarity, engagement, and SEO
- Make it more specific and actionable
- If it's a paragraph, aim for 150-250 words
- Preserve any code formatting or markdown
`;

export const SOCIAL_POST_PROMPT = (title: string, excerpt: string) => `
Generate social media posts for this blog article.

Title: "${title}"
Excerpt: "${excerpt}"

Generate:
1. twitter: Engaging tweet under 280 chars with 2-3 relevant hashtags
2. linkedin: Professional LinkedIn post (150-200 words) with 3-5 hashtags
3. instagram: Instagram caption with emojis and 10-15 hashtags
`;

export const NEWSLETTER_SUMMARY_PROMPT = (posts: { title: string; excerpt: string }[]) => `
Generate a weekly newsletter digest for these new blog posts:

${posts.map((p, i) => `${i + 1}. ${p.title}: ${p.excerpt}`).join("\n")}

Write:
- subject: Catchy email subject line
- preheader: Preview text (90 chars)
- intro: 2-3 sentence warm intro
- summaries: One engaging sentence per post
- outro: Closing CTA to visit the blog
`;
