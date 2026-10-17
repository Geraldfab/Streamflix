"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Info,
  Plus,
  Check,
  Star,
  Film,
  Tv,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { MediaItem } from "@/types/media";
import { getTmdbImageUrl, formatRuntime } from "@/lib/utils";
import { useMedia } from "@/components/providers/media-context";

interface HeroBannerProps {
  featuredItems: MediaItem[];
}

export function HeroBanner({ featuredItems }: HeroBannerProps) {
  const router = useRouter();
  const { isInWatchlist, toggleWatchlist, openQuickView } = useMedia();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = featuredItems.length > 0 ? featuredItems.slice(0, 5) : [];
  const currentItem = items[currentIndex] || items[0];

  // Auto-rotation every 7 seconds when not paused
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  if (!currentItem) return null;

  const inWatchlist = isInWatchlist(currentItem.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-end justify-start overflow-hidden pt-20 pb-16 select-none">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getTmdbImageUrl(currentItem.backdropPath, "original", "backdrop")}
          alt={currentItem.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-all duration-1000 scale-100"
        />

        {/* Cinematic Multi-layered Gradients */}
        <div className="absolute inset-0 hero-gradient-overlay" />
        <div className="absolute inset-0 side-fade-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-4 animate-fade-in">
          {/* Top Tagline / Category */}
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-rose-600/90 text-white shadow-md shadow-rose-950/40 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Featured Spotlight
            </span>

            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider glass-panel text-zinc-300 border border-white/10">
              {currentItem.mediaType === "movie" ? "Feature Film" : "Original Series"}
            </span>

            {currentItem.voteAverage > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 glass-panel px-2 py-0.5 rounded-md border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {currentItem.voteAverage.toFixed(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {currentItem.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium">
            {currentItem.releaseYear ? <span>{currentItem.releaseYear}</span> : null}
            {currentItem.runtime ? (
              <>
                <span>•</span>
                <span>{formatRuntime(currentItem.runtime)}</span>
              </>
            ) : currentItem.numberOfSeasons ? (
              <>
                <span>•</span>
                <span>{currentItem.numberOfSeasons} Seasons</span>
              </>
            ) : null}
            {currentItem.maturityRating && (
              <>
                <span>•</span>
                <span className="px-1.5 py-0.5 rounded border border-white/30 text-[10px] font-mono">
                  {currentItem.maturityRating}
                </span>
              </>
            )}
            {currentItem.genres && currentItem.genres.length > 0 && (
              <>
                <span>•</span>
                <span className="text-rose-300">
                  {currentItem.genres.map((g) => g.name).slice(0, 3).join(", ")}
                </span>
              </>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-zinc-300/90 line-clamp-3 max-w-xl leading-relaxed drop-shadow">
            {currentItem.overview}
          </p>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Primary Play Button */}
            <Link
              href={`/watch/${currentItem.id}?type=${currentItem.mediaType}`}
              className="px-6 sm:px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-rose-950/40 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
              <span>Play Now</span>
            </Link>

            {/* More Info Quick View Button */}
            <button
              onClick={() => openQuickView(currentItem)}
              className="px-5 py-3 rounded-2xl bg-black/40 hover:bg-black/60 text-white font-semibold text-sm flex items-center gap-2 border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <Info className="w-4 h-4 text-rose-300" />
              <span>More Info</span>
            </button>

            {/* Add to My List Toggle */}
            <button
              onClick={() => toggleWatchlist(currentItem)}
              className={`p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-md ${
                inWatchlist
                  ? "bg-rose-600 text-white border border-rose-500/50"
                  : "bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md"
              }`}
              title={inWatchlist ? "In My List" : "Add to My List"}
              aria-label={inWatchlist ? "Remove from My List" : "Add to My List"}
            >
              {inWatchlist ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>

        {/* Carousel Rotation Controls and Indicators */}
        {items.length > 1 && (
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10">
            {/* Indicators */}
            <div className="flex items-center gap-2">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-rose-500 shadow-sm shadow-rose-500"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Slide to ${item.title}`}
                />
              ))}
            </div>

            {/* Arrows & Pause Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title={isPaused ? "Resume auto-rotation" : "Pause auto-rotation"}
                aria-label={isPaused ? "Resume rotation" : "Pause rotation"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                aria-label="Previous featured title"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                aria-label="Next featured title"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
