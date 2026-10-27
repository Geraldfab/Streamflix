"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Play,
  Plus,
  Check,
  Star,
  Share2,
  Film,
  Tv,
  Calendar,
  Clock,
  Video,
  Layers,
  Sparkles,
  ArrowLeft,
  Users,
} from "lucide-react";
import { MediaItem, MediaType, Season } from "@/types/media";
import { getTmdbImageUrl, formatRuntime } from "@/lib/utils";
import { useMedia } from "@/components/providers/media-context";
import { ContentRail } from "@/components/home/content-rail";
import { EpisodeSelector } from "@/components/player/episode-selector";
import { Modal } from "@/components/ui/modal";

export default function TitleDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const mediaType = (searchParams.get("type") as MediaType) || "movie";

  const { isInWatchlist, toggleWatchlist, showToast, continueWatching } = useMedia();

  const [item, setItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);

  // Fetch title details from API
  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/media/${id}?type=${mediaType}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        }
      } catch (err) {
        console.error("Failed to fetch title:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [id, mediaType]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="aspect-[21/9] rounded-3xl bg-zinc-800/40 animate-pulse" />
        <div className="h-8 w-64 bg-zinc-800/40 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-zinc-800/40 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">Title Not Found</h1>
        <p className="text-zinc-400">The requested film or series could not be located.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(item.id);

  // Check Continue Watching
  const progress = continueWatching.find((p) => String(p.mediaId) === String(item.id));

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "success");
    }
  };

  const handleEpisodeSelect = (seasonNum: number, episodeNum: number) => {
    router.push(`/watch/${item.id}?type=tv&season=${seasonNum}&episode=${episodeNum}`);
  };

  return (
    <div className="pb-24">
      {/* Cinematic Hero Backdrop */}
      <div className="relative w-full h-[45vh] min-h-[320px] sm:h-[55vh] sm:min-h-[420px] md:h-[65vh] bg-black overflow-hidden select-none">
        <Image
          src={getTmdbImageUrl(item.backdropPath, "original", "backdrop")}
          alt={item.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Gradients */}
        <div className="absolute inset-0 hero-gradient-overlay" />
        <div className="absolute inset-0 side-fade-gradient hidden sm:block opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent dark:block hidden" />

        {/* Back navigation button */}
        <div className="absolute top-20 sm:top-24 left-4 sm:left-8 z-30">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold shadow-xl border border-white/20 backdrop-blur-md transition-all active:scale-95 hover:scale-105"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Title Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-24 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Floating Poster */}
          <div className="w-44 sm:w-56 md:w-64 aspect-[2/3] rounded-3xl overflow-hidden glass-panel-elevated shadow-2xl border border-white/15 flex-shrink-0 relative hidden sm:block">
            <Image
              src={getTmdbImageUrl(item.posterPath, "w500")}
              alt={item.title}
              fill
              className="object-cover"
              sizes="256px"
            />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600 dark:bg-rose-600 text-white shadow-sm">
                {item.mediaType === "movie" ? "Feature Film" : "TV Series"}
              </span>

              {item.voteAverage > 0 && (
                <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{item.voteAverage.toFixed(1)} / 10</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">
                    ({item.voteCount.toLocaleString()} votes)
                  </span>
                </span>
              )}

              {item.maturityRating && (
                <span className="inline-flex items-center h-6 px-2.5 rounded-full border border-zinc-300 dark:border-white/20 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 font-bold bg-white/70 dark:bg-black/40 backdrop-blur-md">
                  {item.maturityRating}
                </span>
              )}
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                {item.title}
              </h1>
              {item.tagline && (
                <p className="text-sm sm:text-base text-red-600 dark:text-rose-300 italic mt-1 font-medium">
                  &ldquo;{item.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              {item.releaseYear ? (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  {item.releaseDate || item.releaseYear}
                </span>
              ) : null}

              {item.runtime ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  {formatRuntime(item.runtime)}
                </span>
              ) : item.numberOfSeasons ? (
                <span className="flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-zinc-400" />
                  {item.numberOfSeasons} Seasons ({item.numberOfEpisodes || 0} Episodes)
                </span>
              ) : null}

              {item.language && (
                <span className="uppercase text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  Lang: {item.language}
                </span>
              )}
            </div>

            {/* Genre Pills */}
            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {item.genres.map((g) => (
                  <Link
                    key={g.id}
                    href={`/genre/${g.slug || g.name.toLowerCase()}`}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-900/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-white border border-zinc-200/80 dark:border-white/10 hover:border-red-500/40 dark:hover:border-rose-500/40 shadow-sm transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Play Now / Resume Button */}
              <Link
                href={`/watch/${item.id}?type=${item.mediaType}${progress?.season ? `&season=${progress.season}&episode=${progress.episode}` : ""}`}
                className="px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2.5 shadow-md shadow-red-600/20 dark:bg-rose-600 dark:hover:bg-rose-500 dark:shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
                <span>{progress ? `Resume (${progress.percentage}%)` : "Play Now"}</span>
              </Link>

              {/* Watch Trailer Button */}
              {item.trailerKey && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-800 dark:text-white font-semibold text-sm flex items-center gap-2 border border-zinc-200/80 dark:border-white/10 shadow-sm transition-all hover:scale-105"
                >
                  <Video className="w-4 h-4 text-red-600 dark:text-rose-400" />
                  <span>Official Trailer</span>
                </button>
              )}

              {/* Watchlist Toggle */}
              <button
                onClick={() => toggleWatchlist(item)}
                className={`px-5 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  inWatchlist
                    ? "bg-red-50 text-red-700 border border-red-200 dark:bg-rose-600/30 dark:text-rose-300 dark:border-rose-500/40"
                    : "bg-white dark:bg-white/5 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 border border-zinc-200/80 dark:border-white/10 shadow-sm"
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-4 h-4 text-red-600 dark:text-rose-500" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to My List</span>
                  </>
                )}
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-3.5 rounded-2xl bg-white dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-zinc-200/80 dark:border-white/10 shadow-sm transition-colors"
                title="Share this title"
                aria-label="Share title"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Synopsis */}
            <div className="pt-3 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Synopsis
              </h3>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
                {item.overview}
              </p>
            </div>
          </div>
        </div>

        {/* TV Series Season & Episode Guide */}
        {item.mediaType === "tv" && item.seasons && item.seasons.length > 0 && (
          <div className="mt-14 space-y-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <Tv className="w-5 h-5 text-red-600 dark:text-rose-400" />
              <span>Episodes Guide</span>
            </h3>
            <div className="max-w-4xl h-[420px]">
              <EpisodeSelector
                seasons={item.seasons}
                currentSeason={selectedSeason}
                currentEpisode={1}
                onSelectEpisode={handleEpisodeSelect}
              />
            </div>
          </div>
        )}

        {/* Cast & Crew Section */}
        {item.cast && item.cast.length > 0 && (
          <div className="mt-14 space-y-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600 dark:text-rose-400" />
              <span>Top Billed Cast</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {item.cast.slice(0, 6).map((actor) => (
                <div
                  key={actor.id}
                  className="bg-white dark:bg-zinc-900/60 rounded-2xl p-3 border border-zinc-200/80 dark:border-white/5 shadow-sm flex flex-col items-center text-center space-y-2"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 border-2 border-red-500/20 dark:border-rose-500/20">
                    <Image
                      src={getTmdbImageUrl(actor.profilePath, "w300", "profile")}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[120px]">
                      {actor.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Official Trailer Modal */}
      {item.trailerKey && (
        <Modal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          title={`${item.title} — Official Trailer`}
          size="lg"
        >
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${item.trailerKey}?autoplay=1`}
              title="Official Trailer"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
