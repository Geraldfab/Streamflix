"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Episode, Season } from "@/types/media";
import { getTmdbImageUrl } from "@/lib/utils";
import { Play, Check, ChevronDown, Clock, Star } from "lucide-react";

interface EpisodeSelectorProps {
  mediaId?: string | number;
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
  onSelectEpisode: (seasonNumber: number, episodeNumber: number) => void;
  className?: string;
}

export function EpisodeSelector({
  mediaId,
  seasons,
  currentSeason,
  currentEpisode,
  onSelectEpisode,
  className = "",
}: EpisodeSelectorProps) {
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(currentSeason || 1);
  const [localEpisodes, setLocalEpisodes] = useState<Record<number, Episode[]>>({});
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  // Sync selectedSeasonNumber when prop changes
  React.useEffect(() => {
    if (currentSeason) setSelectedSeasonNumber(currentSeason);
  }, [currentSeason]);

  const activeSeason =
    seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0];

  // Fetch season episodes if not available
  React.useEffect(() => {
    if (!mediaId || !activeSeason) return;
    if (activeSeason.episodes && activeSeason.episodes.length > 0) return;
    if (localEpisodes[selectedSeasonNumber]) return;

    let isMounted = true;
    async function fetchSeasonEpisodes() {
      setIsLoadingEpisodes(true);
      try {
        const res = await fetch(`/api/media/tv/${mediaId}/season/${selectedSeasonNumber}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.episodes && data.episodes.length > 0) {
            setLocalEpisodes((prev) => ({ ...prev, [selectedSeasonNumber]: data.episodes }));
          }
        }
      } catch (e) {
        console.warn("Failed to load episodes in EpisodeSelector:", e);
      } finally {
        if (isMounted) setIsLoadingEpisodes(false);
      }
    }
    fetchSeasonEpisodes();
    return () => {
      isMounted = false;
    };
  }, [mediaId, activeSeason, selectedSeasonNumber, localEpisodes]);

  // Resolve episodes list (from local cache, season prop, or generated fallback)
  const resolvedEpisodes: Episode[] =
    localEpisodes[selectedSeasonNumber] ||
    activeSeason?.episodes ||
    (activeSeason?.episodeCount && activeSeason.episodeCount > 0
      ? Array.from({ length: activeSeason.episodeCount }, (_, i) => ({
          id: i + 1,
          episodeNumber: i + 1,
          seasonNumber: selectedSeasonNumber,
          name: `Episode ${i + 1}`,
          overview: `Season ${selectedSeasonNumber}, Episode ${i + 1}`,
          runtime: 45,
          voteAverage: 8.0,
        }))
      : []);

  return (
    <div className={`flex flex-col h-full bg-zinc-950/90 border border-white/10 rounded-2xl overflow-hidden ${className}`}>
      {/* Header with Season Selector */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-white/5">
        <div>
          <h4 className="text-sm font-semibold text-white">Episodes & Seasons</h4>
          <p className="text-[11px] text-zinc-400">
            {activeSeason?.name || `Season ${selectedSeasonNumber}`} • {resolvedEpisodes.length} Episodes
          </p>
        </div>

        {/* Season Selector Dropdown */}
        {seasons.length > 1 && (
          <div className="relative">
            <select
              value={selectedSeasonNumber}
              onChange={(e) => setSelectedSeasonNumber(Number(e.target.value))}
              className="appearance-none bg-zinc-900 border border-white/20 hover:border-rose-500 rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-white focus:outline-none cursor-pointer"
            >
              {seasons.map((season) => (
                <option key={season.id || season.seasonNumber} value={season.seasonNumber}>
                  {season.name || `Season ${season.seasonNumber}`}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Episodes List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
        {isLoadingEpisodes && resolvedEpisodes.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-400 animate-pulse">
            Loading episodes...
          </div>
        ) : resolvedEpisodes.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500">
            No episodes found for this season.
          </div>
        ) : (
          resolvedEpisodes.map((ep) => {
            const isPlaying =
              currentSeason === ep.seasonNumber && currentEpisode === ep.episodeNumber;

            return (
              <button
                key={ep.id}
                onClick={() => onSelectEpisode(ep.seasonNumber, ep.episodeNumber)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                  isPlaying
                    ? "bg-rose-600/20 border border-rose-500/40 shadow-sm"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                  <Image
                    src={getTmdbImageUrl(ep.stillPath, "w300", "backdrop")}
                    alt={ep.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="96px"
                  />
                  {isPlaying ? (
                    <div className="absolute inset-0 bg-rose-950/70 flex items-center justify-center">
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-rose-400 rounded-full animate-pulse h-3" />
                        <span className="w-1 bg-rose-400 rounded-full animate-pulse h-4 delay-75" />
                        <span className="w-1 bg-rose-400 rounded-full animate-pulse h-2 delay-150" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] font-mono text-zinc-300">
                    {ep.runtime ? `${ep.runtime}m` : "45m"}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-rose-400">
                      E{ep.episodeNumber}
                    </span>
                    <span className="text-xs font-semibold text-zinc-100 truncate">
                      {ep.name}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {ep.overview || "No overview available for this episode."}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-1">
                    {ep.airDate && <span>{ep.airDate}</span>}
                    {ep.voteAverage > 0 && (
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {ep.voteAverage.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
