"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Film, Trash2, Clock, Calendar, ArrowRight, Play } from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { getTmdbImageUrl } from "@/lib/utils";

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useMedia();

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Activity Log</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Watch History
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Review titles and episodes you have previously watched across all sessions.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Watch History</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center py-20 space-y-4 glass-panel rounded-3xl p-8 border border-white/10 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            No watch history yet
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Titles you play will be recorded here for convenient reference and personalized recommendations.
          </p>
          <div className="pt-2">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase transition-all hover:scale-105"
            >
              <span>Discover Movies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const watchHref = item.mediaType === "tv"
              ? `/watch/${item.mediaId}?type=tv&season=${item.season || 1}&episode=${item.episode || 1}`
              : `/watch/${item.mediaId}?type=movie`;

            const dateStr = new Date(item.watchedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-rose-500/30 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Poster Thumbnail */}
                  <Link
                    href={watchHref}
                    className="relative w-14 h-20 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 group"
                  >
                    <Image
                      src={getTmdbImageUrl(item.posterPath, "w300")}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="56px"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="min-w-0">
                    <Link
                      href={watchHref}
                      className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-rose-400 transition-colors truncate block"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {item.mediaType === "tv"
                        ? `Season ${item.season} Episode ${item.episode}${item.episodeTitle ? ` • ${item.episodeTitle}` : ""}`
                        : "Feature Film"}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1.5">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span className="text-rose-400 font-medium">
                        {Math.round(item.completionRate * 100)}% Watched
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove from history button */}
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove from history"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
