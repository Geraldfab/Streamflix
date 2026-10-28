"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Play,
  Plus,
  Check,
  Star,
  Film,
  Tv,
  Calendar,
  Clock,
  ExternalLink,
  Video,
} from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { getTmdbImageUrl, formatRuntime } from "@/lib/utils";

export function QuickViewModal() {
  const router = useRouter();
  const { quickViewItem, closeQuickView, isInWatchlist, toggleWatchlist } = useMedia();
  const [showTrailer, setShowTrailer] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset trailer & error states when modal item changes
  React.useEffect(() => {
    setShowTrailer(false);
    setImgError(false);
  }, [quickViewItem?.id]);

  if (!quickViewItem) return null;

  const inWatchlist = isInWatchlist(quickViewItem.id);

  const handlePlayNow = () => {
    closeQuickView();
    router.push(`/watch/${quickViewItem.id}?type=${quickViewItem.mediaType}`);
  };

  const backdropSrc = imgError
    ? "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1280&auto=format&fit=crop&q=80"
    : getTmdbImageUrl(quickViewItem.backdropPath || quickViewItem.posterPath, "w1280", "backdrop");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] animate-fade-in">
      {/* Dimmed backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={closeQuickView}
        aria-hidden="true"
      />

      {/* Modal Dialog (Compact on mobile to prevent touching or overlaying browser borders, generous on desktop) */}
      <div className="relative z-10 w-[88%] sm:w-full max-w-sm sm:max-w-3xl rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-950/95 border border-zinc-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[74dvh] sm:max-h-[85vh] animate-scale-up">
        {/* Backdrop / Trailer Header */}
        <div className="relative aspect-[18/9] sm:aspect-[21/9] w-full bg-zinc-950 overflow-hidden flex-shrink-0">
          {showTrailer && quickViewItem.trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${quickViewItem.trailerKey}?autoplay=1`}
              title="Official Trailer"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <Image
                src={backdropSrc}
                alt={quickViewItem.title}
                fill
                priority
                className="object-cover"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            </>
          )}

          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 rounded-full glass-panel hover:bg-white/20 text-white transition-colors shadow-md"
            aria-label="Close preview"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Quick Play & Trailer Trigger Over Backdrop */}
          {!showTrailer && (
            <div className="absolute bottom-2.5 left-3.5 right-3.5 sm:bottom-4 sm:left-6 sm:right-6 flex items-end justify-between gap-3 sm:gap-4 z-10">
              <div className="min-w-0 pr-2">
                <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-rose-600/90 text-white shadow-sm">
                  {quickViewItem.mediaType === "movie" ? "Feature Film" : "TV Series"}
                </span>
                <h2 className="text-base sm:text-2xl font-black text-white tracking-tight mt-0.5 sm:mt-1 truncate drop-shadow-md">
                  {quickViewItem.title}
                </h2>
              </div>

              {quickViewItem.trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all hover:scale-105 flex-shrink-0"
                >
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-6">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300">
            {quickViewItem.voteAverage > 0 && (
              <span className="flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                {quickViewItem.voteAverage.toFixed(1)} / 10
              </span>
            )}
            {quickViewItem.releaseYear ? (
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
                {quickViewItem.releaseYear}
              </span>
            ) : null}
            {quickViewItem.runtime ? (
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
                {formatRuntime(quickViewItem.runtime)}
              </span>
            ) : quickViewItem.numberOfSeasons ? (
              <span className="text-zinc-600 dark:text-zinc-300">{quickViewItem.numberOfSeasons} Seasons</span>
            ) : null}
            {quickViewItem.maturityRating && (
              <span className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-white/20 text-[9px] sm:text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-200">
                {quickViewItem.maturityRating}
              </span>
            )}
          </div>

          {/* Genres Chips */}
          {quickViewItem.genres && quickViewItem.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {quickViewItem.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
            {quickViewItem.overview}
          </p>

          {/* Cast Chips */}
          {quickViewItem.cast && quickViewItem.cast.length > 0 && (
            <div>
              <h4 className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                Starring
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300">
                {quickViewItem.cast.slice(0, 4).map((actor) => (
                  <span
                    key={actor.id}
                    className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl glass-panel text-zinc-800 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/5 text-[10px] sm:text-xs"
                  >
                    {actor.name} <span className="text-zinc-500 text-[9px] sm:text-[11px]">as {actor.character}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-3 sm:pt-4 border-t border-zinc-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handlePlayNow}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-md shadow-red-600/20 dark:bg-rose-600 dark:hover:bg-rose-500 dark:shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white translate-x-0.5" />
                <span>Play Now</span>
              </button>

              <button
                onClick={() => toggleWatchlist(quickViewItem)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all ${
                  inWatchlist
                    ? "bg-red-50 text-red-700 border border-red-200 dark:bg-rose-600/30 dark:text-rose-300 dark:border-rose-500/40"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-300 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10"
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-rose-500" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Add to List</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href={`/title/${quickViewItem.id}?type=${quickViewItem.mediaType}`}
              onClick={closeQuickView}
              className="text-[11px] sm:text-xs font-semibold text-red-600 dark:text-rose-400 hover:text-red-700 dark:hover:text-rose-500 flex items-center gap-1 sm:gap-1.5 transition-colors"
            >
              <span>View Full Details</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
