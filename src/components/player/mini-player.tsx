"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/components/providers/player-context";
import { Maximize2, X, Play, Pause } from "lucide-react";

export function MiniPlayer() {
  const router = useRouter();
  const { miniPlayer, closeMiniPlayer } = usePlayer();

  if (!miniPlayer.isOpen || !miniPlayer.media) return null;

  const handleExpand = () => {
    if (!miniPlayer.media) return;
    const params = new URLSearchParams();
    if (miniPlayer.season) params.set("season", String(miniPlayer.season));
    if (miniPlayer.episode) params.set("episode", String(miniPlayer.episode));
    router.push(`/watch/${miniPlayer.media.id}?${params.toString()}`);
    closeMiniPlayer();
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-72 sm:w-80 rounded-2xl glass-panel-elevated shadow-2xl border border-white/20 overflow-hidden animate-scale-up">
      {/* Video preview / stream */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
        {miniPlayer.isEmbed ? (
          <iframe
            src={miniPlayer.streamUrl}
            className="w-full h-full border-0 pointer-events-auto"
            allowFullScreen
          />
        ) : (
          <video
            src={miniPlayer.streamUrl}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Hover overlay actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={handleExpand}
            className="p-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform hover:scale-110"
            title="Expand to Full Player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={closeMiniPlayer}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
          title="Close Mini-Player"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info bar */}
      <div className="p-3 flex items-center justify-between gap-2 bg-zinc-950/80">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white truncate">
            {miniPlayer.media.title}
          </p>
          <p className="text-[10px] text-zinc-400 truncate">
            {miniPlayer.season
              ? `S${miniPlayer.season} E${miniPlayer.episode || 1} • ${miniPlayer.episodeTitle || "Episode"}`
              : "Movie Playback"}
          </p>
        </div>
        <button
          onClick={handleExpand}
          className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors flex-shrink-0"
        >
          Expand
        </button>
      </div>
    </div>
  );
}
