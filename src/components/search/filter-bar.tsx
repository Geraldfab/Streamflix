"use client";

import React from "react";
import { RotateCcw, ChevronDown } from "lucide-react";
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

  const isGenreActive = Boolean(selectedGenreId);
  const isYearActive = Boolean(selectedYear);
  const isRatingActive = Boolean(selectedRating);
  const isSortActive = sortBy !== "popularity.desc";
  const isMediaTypeActive = !hideMediaType && mediaType !== "all";

  const hasActiveFilters =
    isGenreActive ||
    isYearActive ||
    isRatingActive ||
    isSortActive ||
    isMediaTypeActive;

  // Consistent control sizing and styling
  const baseSelectClass =
    "w-full lg:w-auto min-w-0 appearance-none h-[36px] sm:h-10 lg:h-10 pl-2.5 sm:pl-3.5 pr-7 sm:pr-8 text-[11.5px] sm:text-xs lg:text-xs font-medium rounded-lg sm:rounded-xl border transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-1 truncate";

  const activeSelectClass =
    "border-red-500/60 dark:border-rose-500/60 text-red-700 dark:text-rose-400 bg-red-50/60 dark:bg-rose-500/10 focus:ring-red-500 dark:focus:ring-rose-500";

  const inactiveSelectClass =
    "border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/90 dark:hover:bg-zinc-800/80 hover:border-red-500/40 dark:hover:border-rose-500/40 focus:ring-red-500 dark:focus:ring-rose-500";

  const chevronClass = (isActive: boolean) =>
    `w-3.5 h-3.5 absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
      isActive ? "text-red-600 dark:text-rose-400" : "text-zinc-400 dark:text-zinc-500"
    }`;

  return (
    <div className="w-full bg-white dark:bg-[#121216] rounded-[14px] sm:rounded-2xl p-2.5 sm:p-3.5 lg:p-4 mb-3.5 sm:mb-6 lg:mb-8 border border-zinc-200/90 dark:border-white/10 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:items-center lg:gap-3 gap-2 sm:gap-2.5 lg:gap-3">
        {/* Optional Media Type Toggle (Full width on mobile/tablet, inline left on desktop) */}
        {!hideMediaType && onMediaTypeChange && (
          <div className="col-span-2 md:col-span-4 lg:col-auto lg:w-auto flex rounded-lg sm:rounded-xl p-0.5 sm:p-1 bg-zinc-100 dark:bg-black/40 border border-zinc-200/80 dark:border-white/10 text-[11px] sm:text-xs font-medium w-full">
            <button
              type="button"
              onClick={() => onMediaTypeChange("all")}
              className={`flex-1 lg:flex-none px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all ${
                mediaType === "all"
                  ? "bg-red-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onMediaTypeChange("movie")}
              className={`flex-1 lg:flex-none px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all ${
                mediaType === "movie"
                  ? "bg-red-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Movies
            </button>
            <button
              type="button"
              onClick={() => onMediaTypeChange("tv")}
              className={`flex-1 lg:flex-none px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all ${
                mediaType === "tv"
                  ? "bg-red-600 dark:bg-rose-600 text-white font-semibold shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              TV Series
            </button>
          </div>
        )}

        {/* Row 1, Col 1 on Mobile: Genre Selector */}
        <div className="relative w-full lg:w-auto min-w-0">
          <select
            aria-label="Filter by genre"
            value={selectedGenreId || ""}
            onChange={(e) => onGenreChange(e.target.value ? Number(e.target.value) : null)}
            className={`${baseSelectClass} ${isGenreActive ? activeSelectClass : inactiveSelectClass}`}
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
          <ChevronDown className={chevronClass(isGenreActive)} />
        </div>

        {/* Row 1, Col 2 on Mobile: Release Year Selector */}
        <div className="relative w-full lg:w-auto min-w-0">
          <select
            aria-label="Filter by release year"
            value={selectedYear || ""}
            onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
            className={`${baseSelectClass} ${isYearActive ? activeSelectClass : inactiveSelectClass}`}
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
          <ChevronDown className={chevronClass(isYearActive)} />
        </div>

        {/* Row 2, Col 1 on Mobile: Minimum Rating Selector */}
        <div className="relative w-full lg:w-auto min-w-0">
          <select
            aria-label="Filter by rating"
            value={selectedRating || ""}
            onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : null)}
            className={`${baseSelectClass} ${isRatingActive ? activeSelectClass : inactiveSelectClass}`}
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
          <ChevronDown className={chevronClass(isRatingActive)} />
        </div>

        {/* Row 2, Col 2 on Mobile: Sort Selector (Pushed to right on desktop with ml-auto) */}
        <div className="relative w-full lg:w-auto min-w-0 ml-0 lg:ml-auto">
          <select
            aria-label="Sort titles"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={`${baseSelectClass} ${isSortActive ? activeSelectClass : inactiveSelectClass}`}
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
          <ChevronDown className={chevronClass(isSortActive)} />
        </div>

        {/* Reset Button (Full width row on mobile, end-aligned on tablet, inline right on desktop) */}
        {hasActiveFilters && (
          <div className="col-span-2 md:col-span-4 lg:col-auto flex items-center justify-center md:justify-end lg:justify-start pt-0.5 sm:pt-1 lg:pt-0">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto h-[36px] sm:h-10 lg:h-10 flex items-center justify-center gap-1.5 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11.5px] sm:text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 border border-rose-200/90 dark:border-rose-500/30 transition-all shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
