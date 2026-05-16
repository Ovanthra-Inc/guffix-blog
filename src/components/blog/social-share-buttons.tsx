"use client";

import { Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareButtonsProps {
  title: string;
  url: string;
}

export function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
  ];

  return (
    <div className="flex flex-col gap-2 sticky top-24 h-fit">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 text-center lg:text-left">
        Share
      </p>
      <div className="flex lg:flex-col gap-2 items-center justify-center lg:items-start">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2.5 rounded-xl border border-border/50 bg-card/50 text-muted-foreground transition-all ${p.color}`}
            title={`Share on ${p.name}`}
          >
            <p.icon className="w-4 h-4" />
          </a>
        ))}
        <button
          onClick={copyLink}
          className="p-2.5 rounded-xl border border-border/50 bg-card/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          title="Copy Link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
