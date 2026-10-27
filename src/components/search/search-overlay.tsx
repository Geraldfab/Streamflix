"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Clock,
  Star,
  Film,
  Tv,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { MediaItem } from "@/types/media";
import { getTmdbImageUrl } from "@/lib/utils";
import { getStoredRecentSearches, saveStoredRecentSearches } from "@/lib/storage";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Focus input and load recents on open
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getStoredRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Global hotkey Ctrl+K / Cmd+K / / to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent, or event
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced Search API call
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/media/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search query failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const handleClearRecents = () => {
    setRecentSearches([]);
    saveStoredRecentSearches([]);
  };

  const handleSubmitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    // Save to recents
    const updated = [query.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    saveStoredRecentSearches(updated);

    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        const item = results[selectedIndex];
        onClose();
        router.push(`/title/${item.id}?type=${item.mediaType}`);
      } else {
        handleSubmitSearch();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 sm:p-6 md:p-12 animate-fade-in">
      {/* Dimmed backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search container */}
      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Input Bar */}
        <form onSubmit={handleSubmitSearch} className="relative flex items-center px-6 py-4 border-b border-zinc-200 dark:border-white/10">
          <Search className="w-5 h-5 text-red-600 dark:text-rose-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search movies, TV shows, actors, genres..."
            className="w-full bg-transparent text-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          {isLoading && (
            <div className="w-5 h-5 border-2 border-red-600 dark:border-rose-500 border-r-transparent rounded-full animate-spin mr-3 flex-shrink-0" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white mr-2"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 transition-colors"
          >
            ESC
          </button>
        </form>

        {/* Content area: Results or Recents */}
        <div className="p-6 overflow-y-auto space-y-6">
          {query.trim() === "" ? (
            /* Recent Searches & Popular Tags */
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-red-600 dark:text-rose-500" />
                      Recent Searches
                    </span>
                    <button
                      onClick={handleClearRecents}
                      className="text-zinc-500 hover:text-red-600 dark:hover:text-rose-500 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectRecent(term)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 transition-all hover:scale-105"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  Popular Suggestions
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Dune", "Oppenheimer", "Arcane", "Breaking Bad", "Stranger Things", "Cyberpunk", "Animation", "Sci-Fi"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => handleSelectRecent(tag)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 border border-red-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/20 transition-all hover:scale-105"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Live suggestions list */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1 mb-2">
                <span>Top Results ({results.length})</span>
                <span>Press Enter to view all</span>
              </div>
              {results.slice(0, 7).map((item, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <Link
                    key={item.id}
                    href={`/title/${item.id}?type=${item.mediaType}`}
                    onClick={onClose}
                    className={`flex items-center gap-4 p-2.5 rounded-2xl transition-all duration-150 ${
                      isSelected
                        ? "bg-red-50 dark:bg-rose-600/30 border border-red-300 dark:border-rose-500/40"
                        : "hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {/* Poster thumbnail */}
                    <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                      <Image
                        src={getTmdbImageUrl(item.posterPath, "w300")}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-zinc-200/70 dark:border-transparent">
                          {item.mediaType === "movie" ? "Movie" : "TV"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {item.overview}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        {item.releaseYear ? <span>{item.releaseYear}</span> : null}
                        {item.voteAverage > 0 && (
                          <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-medium">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {item.voteAverage.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
                  </Link>
                );
              })}

              <button
                onClick={() => handleSubmitSearch()}
                className="w-full mt-4 py-2.5 text-center text-xs font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 dark:text-rose-300 dark:hover:text-white dark:bg-rose-600/20 dark:hover:bg-rose-600/30 border border-red-200 dark:border-rose-500/30 rounded-xl transition-colors shadow-sm"
              >
                View all search results for &quot;{query}&quot; →
              </button>
            </div>
          ) : !isLoading ? (
            /* No results state */
            <div className="text-center py-12 space-y-3">
              <Film className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                No matching movies or series found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-zinc-500">
                Try searching with alternate keywords, genre names, or check your spelling.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
