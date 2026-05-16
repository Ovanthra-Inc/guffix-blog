"use client";

import { useEffect, useState } from "react";
import type { BlogSection } from "@/types/blog";

interface TableOfContentsProps {
  sections: BlogSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  const headings = sections.filter((s) => s.type === "heading" && (s.level === 2 || s.level === 3));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-24 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Table of Contents
      </h4>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`block text-sm leading-snug py-0.5 transition-colors hover:text-primary ${
                activeId === h.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {h.content}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
