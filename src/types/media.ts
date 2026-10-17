export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
  slug?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string;
  runtime: number | null;
  voteAverage: number;
}

export interface Season {
  id: number;
  seasonNumber: number;
  name: string;
  overview: string;
  posterPath: string | null;
  episodeCount: number;
  airDate: string;
  episodes?: Episode[];
}

export interface VideoSource {
  id: string;
  name: string;
  type: 'hls' | 'mp4' | 'embed';
  url: string;
  quality?: string;
  isEmbed?: boolean;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  src: string;
  default?: boolean;
}

export interface Chapter {
  title: string;
  startTime: number;
  endTime: number;
  type: 'intro' | 'recap' | 'credits' | 'chapter';
}

export interface MediaItem {
  id: number | string;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  overview: string;
  mediaType: MediaType;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  releaseYear: number;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds?: number[];
  genres?: Genre[];
  runtime?: number; // minutes for movie
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  seasons?: Season[];
  status?: string;
  tagline?: string;
  cast?: CastMember[];
  trailerUrl?: string;
  trailerKey?: string;
  maturityRating?: string;
  language?: string;
  streamingSources?: VideoSource[];
  chapters?: Chapter[];
  subtitles?: SubtitleTrack[];
}

export interface PlaybackProgress {
  id: string; // `${mediaType}_${id}` or `${mediaType}_${id}_s${season}_e${episode}`
  mediaId: string | number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  currentTime: number;
  duration: number;
  percentage: number;
  lastUpdated: string;
}

export interface WatchHistoryItem {
  id: string;
  mediaId: string | number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  watchedAt: string;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  completionRate: number;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  preferredStreamServer: 'zxcstream' | '0vidads';
  customEmbedTemplate?: string;
  autoplayNextEpisode: boolean;
  autoplayTrailers: boolean;
  defaultQuality: 'auto' | '1080p' | '720p' | '480p';
  defaultPlaybackSpeed: number;
  preferredAudioLanguage: string;
  preferredSubtitleLanguage: string;
  subtitlesEnabled: boolean;
  subtitleAppearance: {
    fontSize: 'sm' | 'base' | 'lg' | 'xl';
    textColor: 'white' | 'yellow' | 'cyan';
    backgroundColor: 'none' | 'semi-black' | 'solid-black';
  };
}

export interface SearchFilters {
  query: string;
  mediaType?: 'all' | 'movie' | 'tv';
  genreId?: number | null;
  year?: number | null;
  minRating?: number | null;
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc' | 'title.asc';
}

export interface PaginationResponse<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
