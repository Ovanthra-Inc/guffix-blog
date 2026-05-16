import { User2 } from "lucide-react";

interface AuthorCardProps {
  name?: string;
  bio?: string;
  avatar?: string;
}

export function AuthorCard({ name = "GuffixAI", bio, avatar }: AuthorCardProps) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-border/50 bg-card/50 mt-10">
      <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <User2 className="w-6 h-6 text-primary" />
        )}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Written by</p>
        <p className="font-semibold">{name}</p>
        <p className="text-muted-foreground text-sm leading-relaxed mt-1">
          {bio ||
            "AI-generated content by GuffixAI — a platform that researches trending topics and writes professional SEO blogs automatically."}
        </p>
      </div>
    </div>
  );
}
