# GuffixAI — AI-Powered Auto-Blogging & Monetization Platform

GuffixAI is a state-of-the-art, "backendless" Next.js blog platform designed to automate the entire lifecycle of a content business. It uses AI to discover trending topics, generate high-quality SEO-optimized articles, and monetize them through multiple streams.

## 🚀 Key Features

### 🤖 AI Content Automation
- **Real-Time Trend Discovery**: Integrates with **Tavily/Serper** to search the web for current trends in your chosen categories before the AI proposes topics.
- **Auto-Generation Engine**: A fully automated pipeline that picks high-potential topics and generates complete, multi-section blog posts with images, code blocks, and diagrams.
- **AI Section Improver**: An interactive post editor that allows admins to "Rewrite with AI" specific sections using custom instructions.
- **Scheduled Publishing**: Automated Vercel Cron jobs to keep your blog active 24/7 without manual intervention.

### 💰 Monetization Ecosystem
- **Tiered Memberships**: Built-in **Free** vs **Pro** user tiers.
- **Stripe Integration**: Secure subscription onboarding and automatic tier upgrades via Stripe Webhooks.
- **Premium Content Gating**: Lock deep-dive articles behind a "Pro" wall to drive conversions.
- **Affiliate Link Manager**: Track clicks and manage affiliate redirects directly from the dashboard.
- **Newsletter Engine**: Integrated newsletter subscription system to build your audience.

### 📚 Content Structure
- **Series & Playlists**: Organize related posts into curated learning paths or "Playlists" for better user retention.
- **Advanced SEO**: Automated SEO scoring, meta-tag generation, and focus keyword tracking.
- **Hybrid Search**: A dual-purpose search engine that finds internal blog posts *and* real-time web insights for users.

### 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router), React 19.
- **Database**: Firebase Firestore.
- **Auth**: Firebase Auth.
- **AI Engine**: Vercel AI SDK + OpenRouter (GPT-4o, Claude 3.5, etc.).
- **Search API**: Tavily Search.
- **Styling**: Tailwind CSS 4.0 + shadcn/ui.
- **Payments**: Stripe (Raw-fetch integration).

## 🛠 Setup & Installation

### 1. Prerequisites
- Node.js 20+
- Firebase Project
- OpenRouter API Key
- Tavily API Key
- Stripe Account (Optional for payments)

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your credentials:
```bash
cp .env.local.example .env.local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```

## 📅 Automated Workflows (Cron Jobs)
GuffixAI is designed to be self-running. Set up these endpoints in your Vercel project:

1. **Daily Trend Discovery**: `GET /api/cron/discover-topics`
   - Scans the web for new trends based on your settings.
2. **Auto-Publishing**: `GET /api/cron/generate`
   - Picks the best discovered topic and publishes a new post.

## 🎨 Design Philosophy
The platform features an **"Electric Violet"** premium dark theme, utilizing glassmorphism, dynamic animations (Framer Motion), and high-fidelity typography to provide a stunning reader experience.

---