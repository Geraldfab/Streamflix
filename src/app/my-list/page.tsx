"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Film, Tv, Trash2, ArrowRight } from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { MediaCard } from "@/components/media/media-card";

export default function MyListPage() {
  const { watchlist } = useMedia();
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "title">("recent");

  const filteredItems = watchlist
    .filter((item) => (filterType === "all" ? true : item.mediaType === filterType))
    .sort((a, b) => {
      if (sortBy === "rating") return b.voteAverage - a.voteAverage;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0; // default recent insertion
    });

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-red-600 dark:text-rose-500 font-semibold text-xs uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
            My Watchlist
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved for later viewing
          </p>
        </div>

        {/* Filter & Sort Controls */}
        {watchlist.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Type toggle */}
            <div className="flex rounded-xl p-1 bg-zinc-100 dark:bg-black/40 border border-zinc-200/80 dark:border-white/10 text-xs font-medium">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === "all"
                    ? "bg-red-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("movie")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === "movie"
                    ? "bg-red-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setFilterType("tv")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === "tv"
                    ? "bg-red-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Series
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-black/40 border border-zinc-200/80 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-red-500 dark:focus:border-rose-500"
            >
              <option value="recent" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
                Recently Added
              </option>
              <option value="rating" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
                Highest Rated
              </option>
              <option value="title" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
                Title (A-Z)
              </option>
            </select>
          </div>
        )}
      </div>

      {/* Grid or Empty state */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-white dark:bg-zinc-900/60 rounded-3xl p-8 border border-zinc-200/80 dark:border-white/10 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-rose-600/10 border border-red-200 dark:border-rose-500/20 flex items-center justify-center text-red-600 dark:text-rose-400 mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Your watchlist is empty
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Bookmark movies and television series while browsing to build your personal streaming library.
          </p>
          <div className="pt-2">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase shadow-md shadow-red-600/20 dark:bg-rose-600 dark:hover:bg-rose-500 dark:shadow-rose-600/30 transition-all hover:scale-105"
            >
              <span>Explore Titles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
