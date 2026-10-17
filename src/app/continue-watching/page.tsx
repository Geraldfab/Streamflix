"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, X, Clock, Trash2, ArrowRight } from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { getTmdbImageUrl, formatTime } from "@/lib/utils";

export default function ContinueWatchingPage() {
  const { continueWatching, removeProgress, clearContinueWatching } = useMedia();

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Resume Playback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Continue Watching
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Pick up right where you left off with accurate timestamp synchronization.
          </p>
        </div>

        {continueWatching.length > 0 && (
          <button
            onClick={clearContinueWatching}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Grid or Empty */}
      {continueWatching.length === 0 ? (
        <div className="text-center py-20 space-y-4 glass-panel rounded-3xl p-8 border border-white/10 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            No in-progress playback
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            When you watch movies or television episodes, your progress will automatically appear here so you can resume seamlessly.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase transition-all hover:scale-105"
            >
              <span>Start Watching</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {continueWatching.map((item) => {
            const watchHref = item.mediaType === "tv"
              ? `/watch/${item.mediaId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}`
              : `/watch/${item.mediaId}?type=movie`;

            return (
              <div
                key={item.id}
                className="group rounded-2xl glass-panel border border-white/10 overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/40"
              >
                {/* Backdrop Image */}
                <Link href={watchHref} className="relative aspect-video w-full block bg-zinc-900 overflow-hidden">
                  <Image
                    src={getTmdbImageUrl(item.backdropPath || item.posterPath, "w500", "backdrop")}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="p-3.5 rounded-full bg-rose-600/90 text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
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

                {/* Dismiss Button */}
                <button
                  onClick={() => removeProgress(item.id)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white transition-colors"
                  title="Remove from list"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Card Details */}
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <Link
                      href={watchHref}
                      className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate block hover:text-rose-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1">
                      {item.mediaType === "tv"
                        ? `Season ${item.season} Episode ${item.episode}${item.episodeTitle ? ` • ${item.episodeTitle}` : ""}`
                        : "Feature Film"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 mt-4 pt-3 border-t border-white/5">
                    <span>{formatTime(item.currentTime)} / {formatTime(item.duration)}</span>
                    <span className="font-semibold text-rose-400">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
