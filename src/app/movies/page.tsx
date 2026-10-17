"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MediaItem } from "@/types/media";
import { MediaGrid } from "@/components/media/media-grid";
import { FilterBar } from "@/components/search/filter-bar";
import { Film, Sparkles } from "lucide-react";

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query parameters
  const initialGenre = searchParams.get("genreId") ? Number(searchParams.get("genreId")) : null;
  const initialYear = searchParams.get("year") ? Number(searchParams.get("year")) : null;
  const initialRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null;
  const initialSort = searchParams.get("sort") || "popularity.desc";

  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(initialGenre);
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
  const [selectedRating, setSelectedRating] = useState<number | null>(initialRating);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sync state to URL
  const updateUrl = useCallback(
    (newParams: { genre?: number | null; year?: number | null; rating?: number | null; sort?: string }) => {
      const params = new URLSearchParams();
      if (newParams.genre) params.set("genreId", String(newParams.genre));
      if (newParams.year) params.set("year", String(newParams.year));
      if (newParams.rating) params.set("minRating", String(newParams.rating));
      if (newParams.sort && newParams.sort !== "popularity.desc") params.set("sort", newParams.sort);
      router.replace(`/movies?${params.toString()}`);
    },
    [router]
  );

  // Fetch movies from API
  const fetchMovies = useCallback(async (pageNum: number, isNewFilter: boolean = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: "movie",
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
        setMovies((prev) => (isNewFilter ? results : [...prev, ...results]));
        setHasMore(data.page < (data.totalPages || 1));
      }
    } catch (err) {
      console.error("Failed to load movies:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenreId, selectedYear, selectedRating, sortBy]);

  // Initial and filter changes
  useEffect(() => {
    setPage(1);
    fetchMovies(1, true);
    updateUrl({ genre: selectedGenreId, year: selectedYear, rating: selectedRating, sort: sortBy });
  }, [selectedGenreId, selectedYear, selectedRating, sortBy, fetchMovies, updateUrl]);

  const handleReset = () => {
    setSelectedGenreId(null);
    setSelectedYear(null);
    setSelectedRating(null);
    setSortBy("popularity.desc");
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage, false);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-wider">
          <Film className="w-4 h-4" />
          <span>Cinematic Features</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Browse All Movies
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          Explore thousands of feature films across blockbuster franchises, indie discoveries, timeless classics, and 4K cinema masters.
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
      {isLoading && movies.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-zinc-800/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <MediaGrid items={movies} />
      )}

      {/* Load More Button */}
      {hasMore && movies.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-8 py-3 rounded-2xl glass-panel hover:bg-rose-600 hover:text-white font-semibold text-xs tracking-wider uppercase border border-white/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Loading more titles..." : "Load More Movies"}
          </button>
        </div>
      )}
    </div>
  );
}
