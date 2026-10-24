"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MediaItem } from "@/types/media";
import { MediaGrid } from "@/components/media/media-grid";
import { FilterBar } from "@/components/search/filter-bar";
import { Tv, Sparkles } from "lucide-react";

export default function SeriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialGenre = searchParams.get("genreId") ? Number(searchParams.get("genreId")) : null;
  const initialYear = searchParams.get("year") ? Number(searchParams.get("year")) : null;
  const initialRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null;
  const initialSort = searchParams.get("sort") || "popularity.desc";

  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(initialGenre);
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
  const [selectedRating, setSelectedRating] = useState<number | null>(initialRating);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  const [series, setSeries] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const updateUrl = useCallback(
    (newParams: { genre?: number | null; year?: number | null; rating?: number | null; sort?: string }) => {
      const params = new URLSearchParams();
      if (newParams.genre) params.set("genreId", String(newParams.genre));
      if (newParams.year) params.set("year", String(newParams.year));
      if (newParams.rating) params.set("minRating", String(newParams.rating));
      if (newParams.sort && newParams.sort !== "popularity.desc") params.set("sort", newParams.sort);
      router.replace(`/series?${params.toString()}`);
    },
    [router]
  );

  const fetchSeries = useCallback(async (pageNum: number, isNewFilter: boolean = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: "tv",
        page: String(pageNum),
        sortBy,
      });
      if (selectedGenreId) params.set("genreId", String(selectedGenreId));
      if (selectedYear) params.set("year", String(selectedYear));
      if (selectedRating) params.set("minRating", String(selectedRating));

      const res = await fetch(`/api/media/discover?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const results = data.results || [];
        setSeries((prev) => (isNewFilter ? results : [...prev, ...results]));
        setHasMore(data.page < (data.totalPages || 1));
      }
    } catch (err) {
      console.error("Failed to load TV series:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenreId, selectedYear, selectedRating, sortBy]);

  useEffect(() => {
    setPage(1);
    fetchSeries(1, true);
    updateUrl({ genre: selectedGenreId, year: selectedYear, rating: selectedRating, sort: sortBy });
  }, [selectedGenreId, selectedYear, selectedRating, sortBy, fetchSeries, updateUrl]);

  const handleReset = () => {
    setSelectedGenreId(null);
    setSelectedYear(null);
    setSelectedRating(null);
    setSortBy("popularity.desc");
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSeries(nextPage, false);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 space-y-2">
        <div className="flex items-center gap-2 text-purple-600 dark:text-rose-500 font-semibold text-xs uppercase tracking-wider">
          <Tv className="w-4 h-4" />
          <span>Television & Serial Dramas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Browse TV Series
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          Immerse yourself in multi-season epic adventures, award-winning dramas, docuseries, and serial animated masterpieces.
        </p>
      </div>

      {/* Filter and Sorting Bar */}
      <FilterBar
        hideMediaType
        selectedGenreId={selectedGenreId}
        onGenreChange={setSelectedGenreId}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleReset}
      />

      {/* Media Grid */}
      {isLoading && series.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <MediaGrid items={series} emptyMessage="No TV series found for these filters" />
      )}

      {/* Load More Button */}
      {hasMore && series.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-8 py-3 rounded-2xl bg-white hover:bg-purple-600 hover:text-white dark:bg-white/5 dark:hover:bg-rose-600 text-zinc-800 dark:text-zinc-200 font-semibold text-xs tracking-wider uppercase border border-zinc-200/80 dark:border-white/10 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Loading more series..." : "Load More TV Series"}
          </button>
        </div>
      )}
    </div>
  );
}
