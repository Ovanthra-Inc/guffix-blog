"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import type { BlogSection } from "@/types/blog";

interface BlogContentRendererProps {
  sections: BlogSection[];
}

// ─── Code Block ──────────────────────────────────────────────────
function CodeBlock({ section }: { section: BlogSection }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(section.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border/50 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {section.filename && (
            <span className="text-xs text-white/40 font-mono ml-2">
              {section.filename}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {section.language && (
            <span className="text-xs text-white/40 uppercase">{section.language}</span>
          )}
          <button
            onClick={copy}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={section.language || "text"}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          background: "#1e1e2e",
        }}
        showLineNumbers
      >
        {section.content || ""}
      </SyntaxHighlighter>
    </div>
  );
}

// ─── Mermaid Block ───────────────────────────────────────────────
function MermaidBlock({ section }: { section: BlogSection }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = async () => {
      if (!ref.current || !section.content) return;
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          theme: "dark",
          themeVariables: {
            primaryColor: "#8b5cf6",
            primaryTextColor: "#fff",
            primaryBorderColor: "#7c3aed",
            lineColor: "#6d28d9",
            background: "#1e1e2e",
          },
          startOnLoad: false,
        });
        const id = `mermaid-${section.id}`;
        const { svg } = await mermaid.render(id, section.content);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-xs text-muted-foreground p-4 overflow-auto">${section.content}</pre>`;
        }
      }
    };
    render();
  }, [section.content, section.id]);

  return (
    <div className="my-6 rounded-xl border border-border/50 overflow-hidden">
      <div className="px-4 py-2 bg-muted/50 border-b border-border/50 text-xs text-muted-foreground font-medium">
        Diagram
      </div>
      <div
        ref={ref}
        className="p-6 flex items-center justify-center min-h-[200px] bg-card/50"
      />
    </div>
  );
}

// ─── Table Block ─────────────────────────────────────────────────
function TableBlock({ section }: { section: BlogSection }) {
  if (!section.columns || !section.rows) return null;
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/60 border-b border-border/50">
            {section.columns.map((col, i) => (
              <th
                key={i}
                className="text-left px-4 py-3 font-semibold text-foreground/90 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/30 hover:bg-muted/30 transition-colors last:border-0"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── FAQ Block ───────────────────────────────────────────────────
function FAQBlock({ section }: { section: BlogSection }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-3 rounded-xl border border-border/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-medium text-sm leading-snug pr-4">{section.question || section.content}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-border/30 pt-3">
          {section.answer}
        </div>
      )}
    </div>
  );
}

// ─── CTA Block ───────────────────────────────────────────────────
function CTABlock({ section }: { section: BlogSection }) {
  return (
    <div className="my-8 p-6 rounded-2xl border border-primary/20 bg-primary/5">
      <p className="text-base font-medium mb-4">{section.content}</p>
      {section.ctaUrl && section.ctaText && (
        <a
          href={section.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          {section.ctaText}
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

// ─── Main Renderer ───────────────────────────────────────────────
export function BlogContentRenderer({ sections }: BlogContentRendererProps) {
  return (
    <div className="prose-guffix">
      {sections.map((section) => {
        switch (section.type) {
          case "heading":
            if (section.level === 3) {
              return (
                <h3 key={section.id} id={section.id} className="text-xl font-semibold mt-8 mb-3">
                  {section.content}
                </h3>
              );
            }
            return (
              <h2 key={section.id} id={section.id} className="text-2xl font-bold mt-10 mb-4">
                {section.content}
              </h2>
            );

          case "paragraph":
            return (
              <p key={section.id} className="text-muted-foreground leading-relaxed mb-5">
                {section.content}
              </p>
            );

          case "code":
            return <CodeBlock key={section.id} section={section} />;

          case "mermaid":
            return <MermaidBlock key={section.id} section={section} />;

          case "table":
            return <TableBlock key={section.id} section={section} />;

          case "quote":
            return (
              <blockquote
                key={section.id}
                className="border-l-4 border-primary/50 pl-5 italic text-muted-foreground my-6 py-1"
              >
                {section.content}
              </blockquote>
            );

          case "faq":
            return <FAQBlock key={section.id} section={section} />;

          case "cta":
            return <CTABlock key={section.id} section={section} />;

          case "image":
            return section.imageUrl ? (
              <div key={section.id} className="my-6 rounded-xl overflow-hidden border border-border/50">
                <Image
                  src={section.imageUrl}
                  alt={section.imageAlt || "Blog image"}
                  width={800}
                  height={450}
                  className="w-full h-auto object-cover"
                />
                {section.imageAlt && (
                  <p className="text-center text-xs text-muted-foreground px-4 py-2 bg-muted/30">
                    {section.imageAlt}
                  </p>
                )}
              </div>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}
