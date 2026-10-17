"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/player/video-player";
import { EpisodeSelector } from "@/components/player/episode-selector";
import { MediaItem, MediaType } from "@/types/media";
import { ContentRail } from "@/components/home/content-rail";
import { ArrowLeft, Film, Tv, Star, Calendar, Clock, Share2 } from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { usePlayer } from "@/components/providers/player-context";
import { formatRuntime } from "@/lib/utils";

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const mediaType = (searchParams.get("type") as MediaType) || "movie";
  const seasonParam = searchParams.get("season") ? parseInt(searchParams.get("season")!, 10) : 1;
  const episodeParam = searchParams.get("episode") ? parseInt(searchParams.get("episode")!, 10) : 1;

  const [currentSeason, setCurrentSeason] = useState(seasonParam);
  const [currentEpisode, setCurrentEpisode] = useState(episodeParam);
  const [item, setItem] = useState<MediaItem | null>(null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useMedia();
  const { theaterMode } = usePlayer();

  // Keep state in sync with URL searchParams
  useEffect(() => {
    if (seasonParam) setCurrentSeason(seasonParam);
    if (episodeParam) setCurrentEpisode(episodeParam);
  }, [seasonParam, episodeParam]);

  // Fetch title details
  useEffect(() => {
    async function loadTitle() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/media/${id}?type=${mediaType}`);
        if (res.ok) {
          const data: MediaItem = await res.json();
          setItem(data);

          // If TV show and active season doesn't have episodes yet, fetch them
          if (data.mediaType === "tv") {
            const seasonToLoad = seasonParam || 1;
            const targetSeason = data.seasons?.find((s) => s.seasonNumber === seasonToLoad);
            if (targetSeason && (!targetSeason.episodes || targetSeason.episodes.length === 0)) {
              try {
                const epRes = await fetch(`/api/media/tv/${id}/season/${seasonToLoad}`);
                if (epRes.ok) {
                  const epData = await epRes.json();
                  if (epData.episodes && epData.episodes.length > 0) {
                    setItem((prev) => {
                      if (!prev || !prev.seasons) return prev;
                      return {
                        ...prev,
                        seasons: prev.seasons.map((s) =>
                          s.seasonNumber === seasonToLoad ? { ...s, episodes: epData.episodes } : s
                        ),
                      };
                    });
                  }
                }
              } catch (e) {
                console.warn("Could not fetch season episodes:", e);
              }
            }
          }
        }

        // Fetch recommendations / trending for below player
        const recRes = await fetch(`/api/media/trending?type=${mediaType}&window=week`);
        if (recRes.ok) {
          const recData = await recRes.json();
          setRecommendations(recData.results || []);
        }
      } catch (err) {
        console.error("Failed to load title for playback:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTitle();
  }, [id, mediaType, seasonParam]);

  const handleEpisodeChange = async (seasonNum: number, epNum: number) => {
    setCurrentSeason(seasonNum);
    setCurrentEpisode(epNum);
    router.replace(`/watch/${id}?type=tv&season=${seasonNum}&episode=${epNum}`);

    // If switching to a season whose episodes are not loaded yet, fetch them
    if (item && item.seasons) {
      const targetSeason = item.seasons.find((s) => s.seasonNumber === seasonNum);
      if (targetSeason && (!targetSeason.episodes || targetSeason.episodes.length === 0)) {
        try {
          const epRes = await fetch(`/api/media/tv/${id}/season/${seasonNum}`);
          if (epRes.ok) {
            const epData = await epRes.json();
            if (epData.episodes && epData.episodes.length > 0) {
              setItem((prev) => {
                if (!prev || !prev.seasons) return prev;
                return {
                  ...prev,
                  seasons: prev.seasons.map((s) =>
                    s.seasonNumber === seasonNum ? { ...s, episodes: epData.episodes } : s
                  ),
                };
              });
            }
          }
        } catch (e) {
          console.warn("Failed to fetch episodes for season:", e);
        }
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Shareable link copied to clipboard", "success");
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 space-y-6">
        <div className="aspect-video w-full rounded-3xl bg-zinc-900 animate-pulse border border-white/10" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">Playback Unavailable</h1>
        <p className="text-zinc-400">Could not resolve media stream for this title.</p>
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

  return (
    <div className={`pb-20 ${theaterMode ? "pt-14" : "pt-20 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
      {/* Central Video Player */}
      <div className="w-full">
        <VideoPlayer
          media={item}
          initialSeason={currentSeason}
          initialEpisode={currentEpisode}
          onEpisodeChange={handleEpisodeChange}
        />
      </div>

      {/* Title Details & Episodes Below Player */}
      <div className="mt-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-0">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Main Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-600/90 text-white">
                {item.mediaType === "movie" ? "Feature Film" : "TV Series"}
              </span>

              {item.voteAverage > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 glass-panel px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {item.voteAverage.toFixed(1)}
                </span>
              )}

              {item.releaseYear ? (
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.releaseYear}
                </span>
              ) : null}

              {item.runtime ? (
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatRuntime(item.runtime)}
                </span>
              ) : null}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {item.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              {item.overview}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/title/${item.id}?type=${item.mediaType}`}
                className="px-4 py-2 rounded-xl glass-panel hover:bg-zinc-100 dark:hover:bg-white/10 text-xs font-semibold text-zinc-800 dark:text-white border border-zinc-200/80 dark:border-white/10 transition-colors shadow-sm"
              >
                View Full Details & Cast
              </Link>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl glass-panel hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white border border-zinc-200/80 dark:border-white/10 transition-colors shadow-sm"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Episode List for TV shows */}
          {item.mediaType === "tv" && item.seasons && item.seasons.length > 0 && (
            <div className="w-full lg:w-96 h-96 flex-shrink-0">
              <EpisodeSelector
                mediaId={item.id}
                seasons={item.seasons}
                currentSeason={currentSeason}
                currentEpisode={currentEpisode}
                onSelectEpisode={handleEpisodeChange}
              />
            </div>
          )}
        </div>

        {/* Recommended & More Like This */}
        {recommendations.length > 0 && (
          <div className="pt-8 border-t border-white/10">
            <ContentRail
              title="More You May Like"
              subtitle="Titles recommended based on current viewing"
              items={recommendations.filter((r) => String(r.id) !== String(item.id))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
