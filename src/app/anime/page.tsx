"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MediaItem, MediaType } from "@/types/media";
import { MediaGrid } from "@/components/media/media-grid";
import { FilterBar } from "@/components/search/filter-bar";
import { Sparkles, Flame, Tv, Film } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnimePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query parameters
  const initialType = (searchParams.get("type") as MediaType | "all") || "tv";
  const initialYear = searchParams.get("year") ? Number(searchParams.get("year")) : null;
  const initialRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null;
  const initialSort = searchParams.get("sort") || "popularity.desc";

  const [mediaType, setMediaType] = useState<MediaType | "all">(initialType);
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
  const [selectedRating, setSelectedRating] = useState<number | null>(initialRating);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  const [animeList, setAnimeList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sync state to URL
  const updateUrl = useCallback(
    (newParams: { type?: MediaType | "all"; year?: number | null; rating?: number | null; sort?: string }) => {
      const params = new URLSearchParams();
      if (newParams.type && newParams.type !== "tv") params.set("type", newParams.type);
      if (newParams.year) params.set("year", String(newParams.year));
      if (newParams.rating) params.set("minRating", String(newParams.rating));
      if (newParams.sort && newParams.sort !== "popularity.desc") params.set("sort", newParams.sort);
      
      const queryString = params.toString();
      router.replace(queryString ? `/anime?${queryString}` : "/anime");
    },
    [router]
  );

  // Fetch anime items
  const fetchAnime = useCallback(
    async (pageNum: number, isNewFilter: boolean = false) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          type: mediaType,
          genreId: "16", // Animation genre
          originalLanguage: "ja", // Authentic Japanese Anime
          page: String(pageNum),
          sortBy,
        });

        if (selectedYear) params.set("year", String(selectedYear));
        if (selectedRating) params.set("minRating", String(selectedRating));

        const res = await fetch(`/api/media/discover?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const results = data.results || [];
          setAnimeList((prev) => (isNewFilter ? results : [...prev, ...results]));
          setHasMore(data.page < (data.totalPages || 1));
        }
      } catch (err) {
        console.error("Failed to load anime:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [mediaType, selectedYear, selectedRating, sortBy]
  );

  // Trigger fetch on filter changes
  useEffect(() => {
    setPage(1);
    fetchAnime(1, true);
    updateUrl({ type: mediaType, year: selectedYear, rating: selectedRating, sort: sortBy });
  }, [mediaType, selectedYear, selectedRating, sortBy, fetchAnime, updateUrl]);

  const handleReset = () => {
    setMediaType("tv");
    setSelectedYear(null);
    setSelectedRating(null);
    setSortBy("popularity.desc");
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnime(nextPage, false);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-rose-500/10 border border-purple-500/20 dark:border-rose-500/20 text-purple-600 dark:text-rose-400 font-semibold text-xs tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Japanese Animation & Manga Adaptations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Explore Anime
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Immerse yourself in legendary anime series, seasonal hits, shonen epics, and acclaimed feature films in high definition.
        </p>

        {/* Quick Format Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setMediaType("tv")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm",
              mediaType === "tv"
                ? "bg-purple-600 dark:bg-rose-600 text-white shadow-purple-600/20 dark:shadow-rose-600/30 scale-102"
                : "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10"
            )}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Anime Series</span>
          </button>
          <button
            onClick={() => setMediaType("movie")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm",
              mediaType === "movie"
                ? "bg-purple-600 dark:bg-rose-600 text-white shadow-purple-600/20 dark:shadow-rose-600/30 scale-102"
                : "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10"
            )}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Anime Movies</span>
          </button>
          <button
            onClick={() => setMediaType("all")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm",
              mediaType === "all"
                ? "bg-purple-600 dark:bg-rose-600 text-white shadow-purple-600/20 dark:shadow-rose-600/30 scale-102"
                : "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10"
            )}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>All Anime</span>
          </button>
        </div>
      </div>

      {/* Filter and Sorting Bar */}
      <FilterBar
        hideMediaType
        selectedGenreId={null}
        onGenreChange={() => {}}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleReset}
      />

      {/* Media Grid */}
      {isLoading && animeList.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/40 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <MediaGrid items={animeList} emptyMessage="No anime titles found for the selected criteria" />
      )}

      {/* Load More Button */}
      {hasMore && animeList.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-8 py-3 rounded-2xl bg-white hover:bg-purple-600 hover:text-white dark:bg-white/5 dark:hover:bg-rose-600 text-zinc-800 dark:text-zinc-200 font-semibold text-xs tracking-wider uppercase border border-zinc-200/80 dark:border-white/10 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Loading more anime..." : "Load More Anime"}
          </button>
        </div>
      )}
    </div>
  );
}
