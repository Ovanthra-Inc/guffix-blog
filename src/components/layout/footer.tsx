import Link from "next/link";
import { Sparkles, Rss, Mail, Globe } from "lucide-react";


const footerLinks = {
  Topics: [
    { label: "AI Tools", href: "/category/ai-tools" },
    { label: "Web Development", href: "/category/web-development" },
    { label: "Cloud & DevOps", href: "/category/cloud-devops" },
    { label: "Cybersecurity", href: "/category/cybersecurity" },
    { label: "Data Science", href: "/category/data-science" },
  ],
  Platform: [
    { label: "All Articles", href: "/blog" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Advertise", href: "/advertise" },
    { label: "Admin", href: "/admin" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      {/* Newsletter inline */}
      <div className="bg-primary/5 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Rss className="w-5 h-5 text-primary" />
                Stay ahead of the curve
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Get weekly AI, dev, and tech insights delivered to your inbox.
              </p>
            </div>
            <form
              action="/api/newsletter"
              method="POST"
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-lg text-gradient">GuffixAI</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              AI-powered blog platform generating SEO content that earns through
              affiliate links, ads, and sponsorships.
            </p>
            <div className="flex gap-2">
              <a
                href="https://twitter.com"
                className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                aria-label="Twitter"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                aria-label="GitHub"
              >
                <Globe className="w-4 h-4" />
              </a>
              <Link
                href="/newsletter"
                className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                aria-label="Newsletter"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground text-xs">
          <p>© {new Date().getFullYear()} GuffixAI. All rights reserved.</p>
          <p>Built with Next.js, Firebase & Vercel AI SDK</p>
        </div>
      </div>
    </footer>
  );
}
