"use client";

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface ContentCalendarProps {
  posts: BlogPost[];
}

const STATUS_COLORS = {
  published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  scheduled: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  draft: "bg-muted text-muted-foreground border-border",
};

export function ContentCalendar({ posts }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad to start on correct weekday
  const startPad = monthStart.getDay();
  const paddedDays = Array(startPad).fill(null).concat(days);

  const getPostsForDay = (day: Date) =>
    posts.filter((p) => {
      const date = p.publishedAt || p.scheduledAt || p.createdAt;
      return date && isSameDay(new Date(date as Date), day);
    });

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-xs">
        {Object.entries(STATUS_COLORS).map(([status, cls]) => (
          <span key={status} className={`px-2 py-0.5 rounded-full border ${cls} capitalize`}>
            {status}
          </span>
        ))}
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((day, idx) => {
          if (!day) return <div key={`pad-${idx}`} className="min-h-[80px]" />;
          const dayPosts = getPostsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`min-h-[80px] p-1.5 rounded-lg border transition-colors ${
                isCurrentDay
                  ? "border-primary/50 bg-primary/5"
                  : isCurrentMonth
                  ? "border-border/50 hover:border-border"
                  : "border-transparent"
              }`}
            >
              <div
                className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isCurrentDay
                    ? "bg-primary text-primary-foreground"
                    : isCurrentMonth
                    ? "text-foreground"
                    : "text-muted-foreground/30"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {dayPosts.slice(0, 2).map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/posts/${post.id}`}
                    className={`block px-1.5 py-0.5 rounded text-xs truncate border ${STATUS_COLORS[post.status]} hover:opacity-80 transition-opacity`}
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                ))}
                {dayPosts.length > 2 && (
                  <span className="text-xs text-muted-foreground pl-1">
                    +{dayPosts.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
