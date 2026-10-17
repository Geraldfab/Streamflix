import { MediaItem, PlaybackProgress, WatchHistoryItem, UserPreferences } from "@/types/media";

const STORAGE_KEYS = {
  WATCHLIST: "streamflix_watchlist",
  CONTINUE_WATCHING: "streamflix_continue_watching",
  WATCH_HISTORY: "streamflix_history",
  PREFERENCES: "streamflix_preferences",
  RECENT_SEARCHES: "streamflix_recent_searches",
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  preferredStreamServer: "0vidads",
  customEmbedTemplate: "",
  autoplayNextEpisode: true,
  autoplayTrailers: true,
  defaultQuality: "auto",
  defaultPlaybackSpeed: 1.0,
  preferredAudioLanguage: "en",
  preferredSubtitleLanguage: "en",
  subtitlesEnabled: false,
  subtitleAppearance: {
    fontSize: "base",
    textColor: "white",
    backgroundColor: "semi-black",
  },
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

// Watchlist
export function getStoredWatchlist(): MediaItem[] {
  return safeGetItem<MediaItem[]>(STORAGE_KEYS.WATCHLIST, []);
}

export function saveStoredWatchlist(items: MediaItem[]): void {
  safeSetItem(STORAGE_KEYS.WATCHLIST, items);
}

// Continue Watching
export function getStoredContinueWatching(): PlaybackProgress[] {
  return safeGetItem<PlaybackProgress[]>(STORAGE_KEYS.CONTINUE_WATCHING, []);
}

export function saveStoredContinueWatching(progressList: PlaybackProgress[]): void {
  safeSetItem(STORAGE_KEYS.CONTINUE_WATCHING, progressList);
}

// Watch History
export function getStoredWatchHistory(): WatchHistoryItem[] {
  return safeGetItem<WatchHistoryItem[]>(STORAGE_KEYS.WATCH_HISTORY, []);
}

export function saveStoredWatchHistory(history: WatchHistoryItem[]): void {
  safeSetItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

// Preferences
export function getStoredPreferences(): UserPreferences {
  const stored = safeGetItem<Partial<UserPreferences>>(STORAGE_KEYS.PREFERENCES, {});
  return { ...DEFAULT_PREFERENCES, ...stored };
}

export function saveStoredPreferences(prefs: UserPreferences): void {
  safeSetItem(STORAGE_KEYS.PREFERENCES, prefs);
}

// Search History
export function getStoredRecentSearches(): string[] {
  return safeGetItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES, [
    "Dune",
    "Oppenheimer",
    "Arcane",
    "Stranger Things",
    "Sci-Fi",
  ]);
}

export function saveStoredRecentSearches(searches: string[]): void {
  safeSetItem(STORAGE_KEYS.RECENT_SEARCHES, searches);
}
