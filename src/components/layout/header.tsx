"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles, Search, Rss, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";


const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/series", label: "Series" },
  { href: "/pricing", label: "Pricing" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/advertise", label: "Advertise" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gradient">
              GuffixAI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>
            <Link
              href="/newsletter"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Rss className="w-3.5 h-3.5" />
              Subscribe
            </Link>
            <Link
              href={user?.email === "sidhyaasutosh@gmail.com" ? "/admin" : "/login"}
              className="hidden sm:flex px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {user?.email === "sidhyaasutosh@gmail.com" ? "Admin" : "Login"}
            </Link>


            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-border/50 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={user?.email === "sidhyaasutosh@gmail.com" ? "/admin" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-2.5 mt-1 rounded-md text-sm font-bold text-primary bg-primary/10"
            >
              {user?.email === "sidhyaasutosh@gmail.com" ? "Admin Dashboard" : "Login"}
            </Link>

          </div>
        )}
      </div>
    </header>
  );
}
