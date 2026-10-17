"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Bookmark, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { MediaCard } from "@/components/media/media-card";

export function MyListRail() {
  const { watchlist } = useMedia();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!watchlist || watchlist.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const amount = clientWidth * 0.75;
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - amount : scrollLeft + amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/mrail">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-rose-400" />
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Your Watchlist
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
            {watchlist.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/my-list"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 mr-2 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => handleScroll("left")}
            className="p-1.5 rounded-xl glass-panel hover:bg-zinc-200/50 dark:hover:bg-white/10 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white border border-zinc-200/80 dark:border-white/10 hidden sm:flex items-center justify-center shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-1.5 rounded-xl glass-panel hover:bg-zinc-200/50 dark:hover:bg-white/10 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white border border-zinc-200/80 dark:border-white/10 hidden sm:flex items-center justify-center shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {watchlist.map((item) => (
          <div key={item.id} className="w-36 sm:w-44 md:w-48 lg:w-52 flex-shrink-0">
            <MediaCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
