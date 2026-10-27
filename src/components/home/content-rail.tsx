"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { MediaItem } from "@/types/media";
import { MediaCard } from "@/components/media/media-card";

interface ContentRailProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  seeAllHref?: string;
  badge?: string;
}

export function ContentRail({
  title,
  subtitle,
  items,
  seeAllHref,
  badge,
}: ContentRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="content-rail-section relative my-8 sm:my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/rail">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-600/20 dark:text-rose-400 dark:border-rose-500/30">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: See All Link & Nav Buttons */}
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 transition-colors mr-2"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Left Arrow */}
          <button
            onClick={() => handleScroll("left")}
            className="p-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 dark:bg-zinc-900/60 dark:hover:bg-white/15 dark:text-zinc-300 dark:hover:text-white border border-zinc-200/90 dark:border-white/10 transition-all opacity-0 group-hover/rail:opacity-100 hidden sm:flex items-center justify-center shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => handleScroll("right")}
            className="p-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 dark:bg-zinc-900/60 dark:hover:bg-white/15 dark:text-zinc-300 dark:hover:text-white border border-zinc-200/90 dark:border-white/10 transition-all opacity-0 group-hover/rail:opacity-100 hidden sm:flex items-center justify-center shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Rail */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overscroll-x-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-36 sm:w-44 md:w-48 lg:w-52 flex-shrink-0"
          >
            <MediaCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
