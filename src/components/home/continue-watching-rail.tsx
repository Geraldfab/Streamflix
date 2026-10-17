"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { getTmdbImageUrl, formatTime } from "@/lib/utils";

export function ContinueWatchingRail() {
  const { continueWatching, removeProgress } = useMedia();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!continueWatching || continueWatching.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const amount = clientWidth * 0.7;
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - amount : scrollLeft + amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/crail">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-400" />
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Continue Watching
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
            {continueWatching.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/continue-watching"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 mr-2"
          >
            Manage All →
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
        className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {continueWatching.map((item) => {
          const watchHref = item.mediaType === "tv"
            ? `/watch/${item.mediaId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}`
            : `/watch/${item.mediaId}?type=movie`;

          return (
            <div
              key={item.id}
              className="w-64 sm:w-72 flex-shrink-0 group rounded-2xl glass-panel border border-white/10 overflow-hidden relative transition-all duration-200 hover:-translate-y-1 hover:border-rose-500/40"
            >
              {/* Backdrop image */}
              <Link href={watchHref} className="relative aspect-video w-full block bg-zinc-900 overflow-hidden">
                <Image
                  src={getTmdbImageUrl(item.backdropPath || item.posterPath, "w500", "backdrop")}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="288px"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="p-3 rounded-full bg-rose-600/90 text-white shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/80">
                  <div
                    className="h-full bg-rose-600 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </Link>

              {/* Remove button */}
              <button
                onClick={() => removeProgress(item.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white transition-colors"
                title="Remove from Continue Watching"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Card info */}
              <div className="p-3 flex flex-col justify-between">
                <div>
                  <Link
                    href={watchHref}
                    className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate block hover:text-rose-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {item.mediaType === "tv"
                      ? `S${item.season} E${item.episode} • ${item.episodeTitle || "Episode"}`
                      : "Movie"}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2">
                  <span>{formatTime(item.currentTime)} left</span>
                  <span>{item.percentage}% watched</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
