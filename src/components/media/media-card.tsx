"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Plus, Check, Star, Info, Film, Tv } from "lucide-react";
import { MediaItem } from "@/types/media";
import { getTmdbImageUrl } from "@/lib/utils";
import { useMedia } from "@/components/providers/media-context";
import { GENRES_LIST } from "@/lib/constants";

interface MediaCardProps {
  item: MediaItem;
  priority?: boolean;
}

export function MediaCard({ item, priority = false }: MediaCardProps) {
  const router = useRouter();
  const { isInWatchlist, toggleWatchlist, openQuickView, continueWatching } = useMedia();
  const [imageLoaded, setImageLoaded] = useState(false);

  const inWatchlist = isInWatchlist(item.id);

  // Check if item has in-progress watching
  const progress = continueWatching.find((p) => String(p.mediaId) === String(item.id));

  // Resolve primary genre or fallback category
  const genreName =
    item.genres?.[0]?.name ||
    (item.genreIds?.[0] ? GENRES_LIST.find((g) => g.id === item.genreIds?.[0])?.name : null) ||
    (item.mediaType === "movie" ? "Movie" : "Series");

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/watch/${item.id}?type=${item.mediaType}`);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(item);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(item);
  };

  return (
    <div className="media-card-container group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-zinc-300/40 dark:hover:shadow-rose-950/20 hover:border-purple-500/50 dark:hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1.5 select-none">
      {/* Poster Image Container */}
      <Link
        href={`/title/${item.id}?type=${item.mediaType}`}
        className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900 block"
      >
        <Image
          src={getTmdbImageUrl(item.posterPath, "w500")}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={priority}
          onLoad={() => setImageLoaded(true)}
          className={`object-cover transition-transform duration-300 ease-out group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Shimmer skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
        )}

        {/* Top Badges: Media Type & Rating */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white border border-white/20 backdrop-blur-md flex items-center gap-1 shadow-sm">
            {item.mediaType === "movie" ? (
              <>
                <Film className="w-2.5 h-2.5 text-rose-400" />
                Film
              </>
            ) : (
              <>
                <Tv className="w-2.5 h-2.5 text-indigo-400" />
                Series
              </>
            )}
          </span>

          {item.voteAverage > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center gap-1 shadow-sm">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              {item.voteAverage.toFixed(1)}
            </span>
          )}
        </div>

        {/* Desktop Hover Revealed Metadata Overlay (Centered Horizontally & Vertically) */}
        <div className="media-card-desktop-overlay hidden absolute inset-0 z-10 flex-col items-center justify-center p-3 sm:p-4 text-center bg-black/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 ease-out pointer-events-none group-hover:pointer-events-auto">
          <div className="flex flex-col items-center justify-center max-w-full transform transition-transform duration-200 ease-out group-hover:translate-y-0 translate-y-1">
            {/* Title */}
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight leading-snug line-clamp-2 px-1 drop-shadow-md">
              {item.title}
            </h3>

            {/* Release Year & Category */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-zinc-300 font-medium mt-1.5 drop-shadow-sm flex-wrap">
              {item.releaseYear ? <span>{item.releaseYear}</span> : null}
              {item.releaseYear && genreName ? <span className="text-zinc-400">•</span> : null}
              {genreName ? <span className="truncate max-w-[120px]">{genreName}</span> : null}
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-2.5 border-t border-white/15 w-full max-w-[140px]">
              {/* Play Button */}
              <button
                onClick={handlePlayClick}
                className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-500 dark:bg-rose-600 dark:hover:bg-rose-500 text-white shadow-xl shadow-black/40 transform transition-transform hover:scale-110 active:scale-95 pointer-events-auto"
                title="Play Now"
                aria-label={`Play ${item.title}`}
              >
                <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
              </button>

              {/* Quick View Button */}
              <button
                onClick={handleQuickViewClick}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white shadow-lg backdrop-blur-md transform transition-transform hover:scale-110 active:scale-95 pointer-events-auto"
                title="Quick Preview"
                aria-label={`Quick view ${item.title}`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {/* Add to Watchlist */}
              <button
                onClick={handleWatchlistClick}
                className={`p-2 rounded-full border transition-transform hover:scale-110 active:scale-95 pointer-events-auto ${
                  inWatchlist
                    ? "bg-purple-600 dark:bg-rose-600/90 text-white border-purple-500 dark:border-rose-500"
                    : "bg-black/60 hover:bg-black/80 border-white/20 text-white backdrop-blur-md"
                }`}
                title={inWatchlist ? "Remove from List" : "Add to My List"}
                aria-label={inWatchlist ? "Remove from My List" : "Add to My List"}
              >
                {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile & Touch Action Overlay (Bottom-aligned, only on non-desktop) */}
        <div className="media-card-mobile-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 z-10 pointer-events-none group-hover:pointer-events-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <button
              onClick={handlePlayClick}
              className="p-3 rounded-full bg-purple-600 hover:bg-purple-500 dark:bg-rose-600 dark:hover:bg-rose-500 text-white shadow-xl shadow-black/40 transform transition-transform hover:scale-110 active:scale-95 pointer-events-auto"
              title="Play Now"
              aria-label={`Play ${item.title}`}
            >
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </button>

            <button
              onClick={handleQuickViewClick}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white shadow-lg backdrop-blur-md transform transition-transform hover:scale-110 active:scale-95 pointer-events-auto"
              title="Quick Preview"
              aria-label={`Quick view ${item.title}`}
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={handleWatchlistClick}
              className={`p-2.5 rounded-full border transition-transform hover:scale-110 active:scale-95 pointer-events-auto ${
                inWatchlist
                  ? "bg-purple-600 dark:bg-rose-600/90 text-white border-purple-500 dark:border-rose-500"
                  : "bg-black/60 hover:bg-black/80 border-white/20 text-white backdrop-blur-md"
              }`}
              title={inWatchlist ? "Remove from List" : "Add to My List"}
              aria-label={inWatchlist ? "Remove from My List" : "Add to My List"}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* In-Progress Watch Bar */}
        {progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60 z-20 overflow-hidden">
            <div
              className="h-full bg-rose-600 transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        )}
      </Link>

      {/* Card Info (Below Poster - Permanently visible on mobile/tablet, hidden on desktop) */}
      <div className="media-card-bottom-info p-3 bg-white dark:bg-zinc-900/40 flex flex-col justify-between flex-1 border-t border-zinc-100 dark:border-white/5">
        <div>
          <Link
            href={`/title/${item.id}?type=${item.mediaType}`}
            className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-rose-400 transition-colors line-clamp-1"
            title={item.title}
          >
            {item.title}
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
            {item.releaseYear ? <span>{item.releaseYear}</span> : null}
            {genreName ? (
              <>
                <span>•</span>
                <span className="truncate">{genreName}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
