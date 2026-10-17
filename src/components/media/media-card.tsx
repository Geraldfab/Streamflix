"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Plus, Check, Star, Info, Film, Tv } from "lucide-react";
import { MediaItem } from "@/types/media";
import { getTmdbImageUrl } from "@/lib/utils";
import { useMedia } from "@/components/providers/media-context";

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
    <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-950/20 select-none">
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
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Shimmer skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-800/60 animate-pulse" />
        )}

        {/* Top Badges: Media Type & Rating */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider glass-panel-elevated text-zinc-200 border border-white/10 flex items-center gap-1">
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
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold glass-panel-elevated text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              {item.voteAverage.toFixed(1)}
            </span>
          )}
        </div>

        {/* Hover / Touch Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* Play Button */}
            <button
              onClick={handlePlayClick}
              className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-950/50 transform transition-transform hover:scale-110 active:scale-95"
              title="Play Now"
              aria-label={`Play ${item.title}`}
            >
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </button>

            {/* Quick View Button */}
            <button
              onClick={handleQuickViewClick}
              className="p-2.5 rounded-full glass-panel hover:bg-white/20 text-white shadow-lg transform transition-transform hover:scale-110 active:scale-95"
              title="Quick Preview"
              aria-label={`Quick view ${item.title}`}
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Add to Watchlist */}
            <button
              onClick={handleWatchlistClick}
              className={`p-2.5 rounded-full transition-transform hover:scale-110 active:scale-95 ${
                inWatchlist
                  ? "bg-rose-600/80 text-white"
                  : "glass-panel hover:bg-white/20 text-white"
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

      {/* Card Info (Below Poster) */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <Link
            href={`/title/${item.id}?type=${item.mediaType}`}
            className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-rose-500 dark:hover:text-rose-400 transition-colors line-clamp-1"
            title={item.title}
          >
            {item.title}
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
            {item.releaseYear ? <span>{item.releaseYear}</span> : null}
            {item.genres?.[0] ? (
              <>
                <span>•</span>
                <span className="truncate">{item.genres[0].name}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
