"use client";

import React from "react";
import { Filter, RotateCcw, ChevronDown } from "lucide-react";
import { GENRES_LIST } from "@/lib/constants";
import { MediaType } from "@/types/media";

interface FilterBarProps {
  mediaType?: MediaType | "all";
  onMediaTypeChange?: (type: MediaType | "all") => void;
  selectedGenreId?: number | null;
  onGenreChange: (genreId: number | null) => void;
  selectedYear?: number | null;
  onYearChange: (year: number | null) => void;
  selectedRating?: number | null;
  onRatingChange: (rating: number | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  hideMediaType?: boolean;
}

export function FilterBar({
  mediaType = "all",
  onMediaTypeChange,
  selectedGenreId,
  onGenreChange,
  selectedYear,
  onYearChange,
  selectedRating,
  onRatingChange,
  sortBy,
  onSortChange,
  onReset,
  hideMediaType = false,
}: FilterBarProps) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, 2020, 2019, 2015, 2010, 2000];

  const hasActiveFilters =
    Boolean(selectedGenreId) ||
    Boolean(selectedYear) ||
    Boolean(selectedRating) ||
    (mediaType !== "all" && !hideMediaType);

  return (
    <div className="w-full bg-white dark:bg-zinc-900/60 rounded-2xl p-4 mb-8 border border-zinc-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Media Type Toggle */}
        {!hideMediaType && onMediaTypeChange && (
          <div className="flex rounded-xl p-1 bg-zinc-100 dark:bg-black/40 border border-zinc-200/80 dark:border-white/10 text-xs font-medium">
            <button
              onClick={() => onMediaTypeChange("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mediaType === "all"
                  ? "bg-purple-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => onMediaTypeChange("movie")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mediaType === "movie"
                  ? "bg-purple-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => onMediaTypeChange("tv")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mediaType === "tv"
                  ? "bg-purple-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              TV Series
            </button>
          </div>
        )}

        {/* Genre Selector */}
        <div className="relative">
          <select
            value={selectedGenreId || ""}
            onChange={(e) => onGenreChange(e.target.value ? Number(e.target.value) : null)}
            className="appearance-none bg-zinc-50 hover:bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-rose-500/50 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-rose-500 cursor-pointer shadow-sm"
          >
            <option value="" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              All Genres
            </option>
            {GENRES_LIST.map((g) => (
              <option key={g.id} value={g.id} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                {g.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Release Year Selector */}
        <div className="relative">
          <select
            value={selectedYear || ""}
            onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
            className="appearance-none bg-zinc-50 hover:bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-rose-500/50 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-rose-500 cursor-pointer shadow-sm"
          >
            <option value="" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              All Years
            </option>
            {years.map((y) => (
              <option key={y} value={y} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Minimum Rating Selector */}
        <div className="relative">
          <select
            value={selectedRating || ""}
            onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : null)}
            className="appearance-none bg-zinc-50 hover:bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-rose-500/50 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-rose-500 cursor-pointer shadow-sm"
          >
            <option value="" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              Any Rating
            </option>
            <option value="8" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              ★ 8.0+ Masterpieces
            </option>
            <option value="7" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              ★ 7.0+ Highly Rated
            </option>
            <option value="6" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              ★ 6.0+ Good
            </option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right: Sort and Reset */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Sort Selector */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-zinc-50 hover:bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-rose-500/50 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-rose-500 cursor-pointer shadow-sm"
          >
            <option value="popularity.desc" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              Most Popular
            </option>
            <option value="vote_average.desc" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              Highest Rated
            </option>
            <option value="primary_release_date.desc" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              Newest Released
            </option>
            <option value="title.asc" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              Alphabetical (A-Z)
            </option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-600 hover:bg-purple-50 border border-purple-200 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:border-rose-500/30 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
