"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  MediaItem,
  PlaybackProgress,
  WatchHistoryItem,
  UserPreferences,
} from "@/types/media";
import {
  getStoredWatchlist,
  saveStoredWatchlist,
  getStoredContinueWatching,
  saveStoredContinueWatching,
  getStoredWatchHistory,
  saveStoredWatchHistory,
  getStoredPreferences,
  saveStoredPreferences,
  DEFAULT_PREFERENCES,
} from "@/lib/storage";
import { SHOWCASE_CATALOG } from "@/lib/constants";

interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "warning";
}

interface MediaContextType {
  // Watchlist
  watchlist: MediaItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: string | number) => void;
  toggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string | number) => boolean;

  // Continue Watching
  continueWatching: PlaybackProgress[];
  saveProgress: (progress: Omit<PlaybackProgress, "lastUpdated">) => void;
  removeProgress: (id: string) => void;
  clearContinueWatching: () => void;

  // History
  history: WatchHistoryItem[];
  addToHistory: (item: MediaItem, season?: number, episode?: number, episodeTitle?: string, completionRate?: number) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Preferences
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // Quick View Modal
  quickViewItem: MediaItem | null;
  openQuickView: (item: MediaItem) => void;
  closeQuickView: () => void;

  // Random Discovery
  getRandomTitle: () => MediaItem;

  // Notification Toasts
  toasts: Toast[];
  showToast: (message: string, type?: "info" | "success" | "warning") => void;
  dismissToast: (id: string) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<PlaybackProgress[]>([]);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [quickViewItem, setQuickViewItem] = useState<MediaItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    setWatchlist(getStoredWatchlist());
    setContinueWatching(getStoredContinueWatching());
    setHistory(getStoredWatchHistory());
    setPreferences(getStoredPreferences());
    setMounted(true);
  }, []);

  const showToast = (message: string, type: "info" | "success" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Watchlist methods
  const addToWatchlist = (item: MediaItem) => {
    setWatchlist((prev) => {
      if (prev.some((i) => String(i.id) === String(item.id))) return prev;
      const updated = [item, ...prev];
      saveStoredWatchlist(updated);
      showToast(`Added "${item.title}" to My List`, "success");
      return updated;
    });
  };

  const removeFromWatchlist = (id: string | number) => {
    setWatchlist((prev) => {
      const target = prev.find((i) => String(i.id) === String(id));
      const updated = prev.filter((i) => String(i.id) !== String(id));
      saveStoredWatchlist(updated);
      if (target) {
        showToast(`Removed "${target.title}" from My List`, "info");
      }
      return updated;
    });
  };

  const toggleWatchlist = (item: MediaItem) => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const isInWatchlist = (id: string | number) => {
    return watchlist.some((i) => String(i.id) === String(id));
  };

  // Continue Watching methods
  const saveProgress = (progress: Omit<PlaybackProgress, "lastUpdated">) => {
    setContinueWatching((prev) => {
      const now = new Date().toISOString();
      const updatedItem: PlaybackProgress = { ...progress, lastUpdated: now };
      const filtered = prev.filter((p) => p.id !== progress.id);
      // Don't keep items that are practically finished (>95%)
      if (progress.percentage >= 95) {
        saveStoredContinueWatching(filtered);
        return filtered;
      }
      const nextList = [updatedItem, ...filtered].slice(0, 20);
      saveStoredContinueWatching(nextList);
      return nextList;
    });
  };

  const removeProgress = (id: string) => {
    setContinueWatching((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveStoredContinueWatching(updated);
      showToast("Removed from Continue Watching", "info");
      return updated;
    });
  };

  const clearContinueWatching = () => {
    setContinueWatching([]);
    saveStoredContinueWatching([]);
    showToast("Cleared Continue Watching history", "info");
  };

  // Watch History methods
  const addToHistory = (
    item: MediaItem,
    season?: number,
    episode?: number,
    episodeTitle?: string,
    completionRate: number = 0.5
  ) => {
    const historyId = `${item.mediaType}_${item.id}${season ? `_s${season}` : ""}${episode ? `_e${episode}` : ""}`;
    const newEntry: WatchHistoryItem = {
      id: historyId,
      mediaId: item.id,
      mediaType: item.mediaType,
      title: item.title,
      posterPath: item.posterPath,
      watchedAt: new Date().toISOString(),
      season,
      episode,
      episodeTitle,
      completionRate,
    };

    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== historyId);
      const updated = [newEntry, ...filtered].slice(0, 50);
      saveStoredWatchHistory(updated);
      return updated;
    });
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      saveStoredWatchHistory(updated);
      showToast("Item removed from watch history", "info");
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    saveStoredWatchHistory([]);
    showToast("Watch history cleared", "info");
  };

  // Preferences methods
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      saveStoredPreferences(updated);
      showToast("Preferences updated", "success");
      return updated;
    });
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    saveStoredPreferences(DEFAULT_PREFERENCES);
    showToast("Preferences reset to defaults", "info");
  };

  // Quick View
  const openQuickView = (item: MediaItem) => setQuickViewItem(item);
  const closeQuickView = () => setQuickViewItem(null);

  // Random Title
  const getRandomTitle = (): MediaItem => {
    const list = SHOWCASE_CATALOG;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  };

  return (
    <MediaContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        continueWatching,
        saveProgress,
        removeProgress,
        clearContinueWatching,
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        preferences,
        updatePreferences,
        resetPreferences,
        quickViewItem,
        openQuickView,
        closeQuickView,
        getRandomTitle,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl border glass-panel shadow-2xl flex items-center justify-between gap-3 text-sm animate-scale-up ${
              toast.type === "success"
                ? "border-emerald-500/40 text-emerald-400"
                : toast.type === "warning"
                ? "border-amber-500/40 text-amber-400"
                : "border-rose-500/40 text-rose-300 dark:text-rose-200"
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="opacity-70 hover:opacity-100 text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
}
