"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GENRES_LIST } from "@/lib/constants";
import { MediaItem, MediaType } from "@/types/media";
import { MediaGrid } from "@/components/media/media-grid";
import { FilterBar } from "@/components/search/filter-bar";
import { Sparkles, Layers } from "lucide-react";

export default function GenrePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = params.slug as string;
  const genre = GENRES_LIST.find(
    (g) => (g.slug && g.slug.toLowerCase() === slug.toLowerCase()) || g.name.toLowerCase() === slug.toLowerCase()
  );

  const [mediaType, setMediaType] = useState<MediaType | "all">("all");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("popularity.desc");

  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGenreContent = useCallback(async () => {
    if (!genre) return;
    setIsLoading(true);
    try {
      const type = mediaType === "all" ? "movie" : mediaType;
      const qParams = new URLSearchParams({
        type,
        genreId: String(genre.id),
        sortBy,
      });
      if (selectedYear) qParams.set("year", String(selectedYear));
      if (selectedRating) qParams.set("minRating", String(selectedRating));

      const res = await fetch(`/api/media/discover?${qParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.results || []);
      }
    } catch (err) {
      console.error("Failed to load genre titles:", err);
    } finally {
      setIsLoading(false);
    }
  }, [genre, mediaType, selectedYear, selectedRating, sortBy]);

  useEffect(() => {
    fetchGenreContent();
  }, [fetchGenreContent]);

  if (!genre) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold">Genre Not Found</h1>
        <p className="text-zinc-400 mt-2">The requested category does not exist.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Genre Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Genre Collection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          {genre.name}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          Curated selection of top-rated movies and television series in the {genre.name} category.
        </p>
      </div>

      {/* Filter and Sorting Bar */}
      <FilterBar
        mediaType={mediaType}
        onMediaTypeChange={setMediaType}
        selectedGenreId={genre.id}
        onGenreChange={() => {}} // locked to current genre
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={() => {
          setSelectedYear(null);
          setSelectedRating(null);
          setMediaType("all");
          setSortBy("popularity.desc");
        }}
      />

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-zinc-800/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <MediaGrid
          items={items}
          emptyMessage={`No ${genre.name} titles found`}
          emptySubtext="Try adjusting your filters or year range."
        />
      )}
    </div>
  );
}
