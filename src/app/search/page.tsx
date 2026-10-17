"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Film, Sparkles } from "lucide-react";
import { MediaItem } from "@/types/media";
import { MediaGrid } from "@/components/media/media-grid";
import { FilterBar } from "@/components/search/filter-bar";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [mediaType, setMediaType] = useState<"all" | "movie" | "tv">("all");
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("popularity.desc");

  // Fetch search query
  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/media/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
      setActiveQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setActiveQuery(searchTerm.trim());
    router.replace(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    performSearch(searchTerm.trim());
  };

  // Filter local results based on selected filters
  const filteredResults = results.filter((item) => {
    if (mediaType !== "all" && item.mediaType !== mediaType) return false;
    if (selectedGenreId && !item.genreIds?.includes(selectedGenreId)) return false;
    if (selectedYear && item.releaseYear !== selectedYear) return false;
    if (selectedRating && item.voteAverage < selectedRating) return false;
    return true;
  });

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Bar Header */}
      <div className="max-w-3xl mx-auto mb-10 text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Smart Catalog Search
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Find movies, television series, cast members, and genres across our cinema library.
        </p>

        <form onSubmit={handleSubmit} className="relative mt-6">
          <div className="relative flex items-center glass-panel-elevated rounded-2xl border border-white/10 shadow-xl overflow-hidden px-4 py-2">
            <Search className="w-5 h-5 text-rose-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, director, actor, genre..."
              className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 mr-2"
                aria-label="Clear text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {activeQuery && (
        <>
          {/* Filter Bar */}
          <FilterBar
            mediaType={mediaType}
            onMediaTypeChange={setMediaType}
            selectedGenreId={selectedGenreId}
            onGenreChange={setSelectedGenreId}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={() => {
              setMediaType("all");
              setSelectedGenreId(null);
              setSelectedYear(null);
              setSelectedRating(null);
            }}
          />

          <div className="mb-6 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
            <span>
              Showing {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"} for &quot;{activeQuery}&quot;
            </span>
          </div>
        </>
      )}

      {/* Grid Results */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-zinc-800/40 animate-pulse" />
          ))}
        </div>
      ) : activeQuery ? (
        <MediaGrid
          items={filteredResults}
          emptyMessage={`No titles found matching "${activeQuery}"`}
          emptySubtext="Try alternate keywords or clear specific filters."
        />
      ) : (
        /* Empty starting search suggestion */
        <div className="text-center py-16 space-y-4 glass-panel rounded-3xl p-8 border border-white/5 max-w-xl mx-auto">
          <Sparkles className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Looking for something to watch?
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Search for cinematic masterpieces like &quot;Dune&quot;, &quot;Arcane&quot;, &quot;Interstellar&quot;, or browse by genre.
          </p>
        </div>
      )}
    </div>
  );
}
