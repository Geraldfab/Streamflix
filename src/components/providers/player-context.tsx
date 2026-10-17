"use client";

import React, { createContext, useContext, useState } from "react";
import { MediaItem } from "@/types/media";

interface MiniPlayerState {
  isOpen: boolean;
  media: MediaItem | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  streamUrl?: string;
  isEmbed?: boolean;
  currentTime?: number;
}

interface PlayerContextType {
  miniPlayer: MiniPlayerState;
  openMiniPlayer: (data: Omit<MiniPlayerState, "isOpen">) => void;
  closeMiniPlayer: () => void;
  theaterMode: boolean;
  toggleTheaterMode: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [miniPlayer, setMiniPlayer] = useState<MiniPlayerState>({
    isOpen: false,
    media: null,
  });
  const [theaterMode, setTheaterMode] = useState(false);

  const openMiniPlayer = (data: Omit<MiniPlayerState, "isOpen">) => {
    setMiniPlayer({ ...data, isOpen: true });
  };

  const closeMiniPlayer = () => {
    setMiniPlayer((prev) => ({ ...prev, isOpen: false }));
  };

  const toggleTheaterMode = () => setTheaterMode((prev) => !prev);

  return (
    <PlayerContext.Provider
      value={{
        miniPlayer,
        openMiniPlayer,
        closeMiniPlayer,
        theaterMode,
        toggleTheaterMode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
