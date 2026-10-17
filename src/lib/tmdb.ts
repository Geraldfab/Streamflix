import { MediaItem, MediaType, PaginationResponse, Season, Episode, CastMember } from "@/types/media";
import { SHOWCASE_CATALOG, GENRES_LIST, SAMPLE_CINEMA_STREAMS } from "./constants";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey(): string {
  return process.env.TMDB_API_KEY || "babd261dc0b8f207fe4442292955e654";
}

function getAuthHeaders(): HeadersInit {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
  };
}

function buildUrl(endpoint: string, params: Record<string, string | number | undefined> = {}): string {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  const apiKey = getApiKey();
  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.set(key, String(val));
    }
  });
  return url.toString();
}

/**
 * Normalizes raw TMDB Movie or TV objects into clean MediaItem
 */
export function normalizeMediaItem(raw: any, explicitType?: MediaType): MediaItem {
  const mediaType: MediaType = explicitType || (raw.title ? "movie" : raw.name ? "tv" : raw.media_type || "movie");
  const isMovie = mediaType === "movie";
  const title = isMovie ? raw.title : raw.name;
  const originalTitle = isMovie ? raw.original_title : raw.original_name;
  const releaseDate = isMovie ? raw.release_date || "" : raw.first_air_date || "";
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 0;

  // Map genre objects or genre_ids
  let genres = raw.genres;
  if (!genres && Array.isArray(raw.genre_ids)) {
    genres = raw.genre_ids
      .map((id: number) => GENRES_LIST.find((g) => g.id === id))
      .filter(Boolean);
  }

  // Cast members
  const cast: CastMember[] = (raw.credits?.cast || raw.cast || [])
    .slice(0, 10)
    .map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character || "",
      profilePath: c.profile_path,
    }));

  // Trailer finding
  const videos = raw.videos?.results || [];
  const trailer = videos.find(
    (v: any) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
  ) || videos[0];
  const trailerKey = trailer?.key;
  const trailerUrl = trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : undefined;

  // Seasons for TV
  const seasons: Season[] = (raw.seasons || []).map((s: any) => ({
    id: s.id,
    seasonNumber: s.season_number,
    name: s.name,
    overview: s.overview || "",
    posterPath: s.poster_path,
    episodeCount: s.episode_count || 0,
    airDate: s.air_date || "",
  }));

  // Select a high definition video stream for cinematic playback testing
  const fallbackStreams = [
    SAMPLE_CINEMA_STREAMS.tearsOfSteel,
    SAMPLE_CINEMA_STREAMS.sintel,
    SAMPLE_CINEMA_STREAMS.bigBuckBunny,
    SAMPLE_CINEMA_STREAMS.elephantsDream,
  ];
  const streamIdx = Math.abs((typeof raw.id === "number" ? raw.id : 0) % fallbackStreams.length);
  const selectedCinema = fallbackStreams[streamIdx];

  const streamingSources = [
    {
      id: "0vidads",
      name: "0VIDADS (Default / No Ads)",
      type: "embed" as const,
      url: isMovie
        ? `https://0vidads.top/embed/movie/${raw.id}?color=E50914&branding=StreamFlix`
        : `https://0vidads.top/embed/tv/${raw.id}/1/1?color=E50914&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=false&overlay=true&branding=StreamFlix`,
      isEmbed: true,
    },
    {
      id: "zxc",
      name: "ZXC Stream (Mirror)",
      type: "embed" as const,
      url: isMovie
        ? `https://zxcstream.cc/player/movie/${raw.id}`
        : `https://zxcstream.cc/player/tv/${raw.id}/1/1`,
      isEmbed: true,
    },
  ];

  return {
    id: raw.id,
    tmdbId: raw.id,
    title: title || "Untitled Title",
    originalTitle: originalTitle || title,
    overview: raw.overview || "No synopsis available for this title.",
    mediaType,
    posterPath: raw.poster_path || null,
    backdropPath: raw.backdrop_path || null,
    releaseDate,
    releaseYear: isNaN(releaseYear) ? 0 : releaseYear,
    voteAverage: raw.vote_average ? Number(raw.vote_average.toFixed(1)) : 0,
    voteCount: raw.vote_count || 0,
    popularity: raw.popularity || 0,
    genreIds: raw.genre_ids || (genres ? genres.map((g: any) => g.id) : []),
    genres,
    runtime: isMovie ? raw.runtime : raw.episode_run_time?.[0],
    numberOfSeasons: raw.number_of_seasons,
    numberOfEpisodes: raw.number_of_episodes,
    seasons: seasons.length > 0 ? seasons : undefined,
    status: raw.status,
    tagline: raw.tagline,
    cast,
    trailerKey,
    trailerUrl,
    maturityRating: raw.adult ? "R" : "PG-13",
    language: raw.original_language || "en",
    streamingSources,
    chapters: selectedCinema.chapters,
  };
}

async function fetchFromTmdb<T>(endpoint: string, params: Record<string, any> = {}): Promise<T | null> {
  try {
    const url = buildUrl(endpoint, params);
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }, // 1 hour caching
    });

    if (!res.ok) {
      console.warn(`TMDB API request failed for ${endpoint}: ${res.status} ${res.statusText}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Error requesting TMDB at ${endpoint}:`, error);
    return null;
  }
}

export const tmdbService = {
  // Trending content (Movies and TV)
  async getTrending(mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week"): Promise<MediaItem[]> {
    const data = await fetchFromTmdb<any>(`/trending/${mediaType}/${timeWindow}`);
    if (data?.results && data.results.length > 0) {
      return data.results.map((item: any) => normalizeMediaItem(item));
    }
    // Fallback to showcase catalog
    return SHOWCASE_CATALOG;
  },

  // Popular movies or TV
  async getPopular(mediaType: MediaType = "movie", page: number = 1): Promise<PaginationResponse<MediaItem>> {
    const endpoint = mediaType === "movie" ? "/movie/popular" : "/tv/popular";
    const data = await fetchFromTmdb<any>(endpoint, { page });
    if (data?.results && data.results.length > 0) {
      return {
        page: data.page,
        totalPages: Math.min(data.total_pages || 1, 50),
        totalResults: data.total_results || data.results.length,
        results: data.results.map((item: any) => normalizeMediaItem(item, mediaType)),
      };
    }
    const filtered = SHOWCASE_CATALOG.filter((i) => i.mediaType === mediaType);
    return {
      page: 1,
      totalPages: 1,
      totalResults: filtered.length,
      results: filtered,
    };
  },

  // Top Rated movies or TV
  async getTopRated(mediaType: MediaType = "movie", page: number = 1): Promise<MediaItem[]> {
    const endpoint = mediaType === "movie" ? "/movie/top_rated" : "/tv/top_rated";
    const data = await fetchFromTmdb<any>(endpoint, { page });
    if (data?.results && data.results.length > 0) {
      return data.results.map((item: any) => normalizeMediaItem(item, mediaType));
    }
    return SHOWCASE_CATALOG.filter((i) => i.mediaType === mediaType);
  },

  // Now Playing / On The Air
  async getNowPlaying(mediaType: MediaType = "movie", page: number = 1): Promise<MediaItem[]> {
    const endpoint = mediaType === "movie" ? "/movie/now_playing" : "/tv/on_the_air";
    const data = await fetchFromTmdb<any>(endpoint, { page });
    if (data?.results && data.results.length > 0) {
      return data.results.map((item: any) => normalizeMediaItem(item, mediaType));
    }
    return SHOWCASE_CATALOG;
  },

  // Upcoming Movies
  async getUpcoming(page: number = 1): Promise<MediaItem[]> {
    const data = await fetchFromTmdb<any>("/movie/upcoming", { page });
    if (data?.results && data.results.length > 0) {
      return data.results.map((item: any) => normalizeMediaItem(item, "movie"));
    }
    return SHOWCASE_CATALOG.slice(0, 5);
  },

  // Discover with filters (Genre, Year, Rating, Sort)
  async discover(options: {
    mediaType?: MediaType;
    genreId?: number | null;
    year?: number | null;
    minRating?: number | null;
    sortBy?: string;
    page?: number;
  }): Promise<PaginationResponse<MediaItem>> {
    const mediaType = options.mediaType || "movie";
    const endpoint = mediaType === "movie" ? "/discover/movie" : "/discover/tv";
    const params: Record<string, any> = {
      page: options.page || 1,
      sort_by: options.sortBy || "popularity.desc",
      include_adult: false,
    };

    if (options.genreId) {
      params.with_genres = options.genreId;
    }
    if (options.year) {
      if (mediaType === "movie") params.primary_release_year = options.year;
      else params.first_air_date_year = options.year;
    }
    if (options.minRating) {
      params["vote_average.gte"] = options.minRating;
    }

    const data = await fetchFromTmdb<any>(endpoint, params);
    if (data?.results && data.results.length > 0) {
      return {
        page: data.page,
        totalPages: Math.min(data.total_pages || 1, 50),
        totalResults: data.total_results || data.results.length,
        results: data.results.map((item: any) => normalizeMediaItem(item, mediaType)),
      };
    }

    // Filter showcase catalog as fallback
    let results = SHOWCASE_CATALOG.filter((i) => i.mediaType === mediaType);
    if (options.genreId) {
      results = results.filter((i) => i.genreIds?.includes(options.genreId!));
    }
    if (options.minRating) {
      results = results.filter((i) => i.voteAverage >= options.minRating!);
    }
    return {
      page: 1,
      totalPages: 1,
      totalResults: results.length,
      results,
    };
  },

  // Multi Search (Movie, TV)
  async search(query: string, page: number = 1): Promise<MediaItem[]> {
    if (!query || query.trim() === "") return [];
    const data = await fetchFromTmdb<any>("/search/multi", {
      query: query.trim(),
      page,
      include_adult: false,
    });

    if (data?.results && data.results.length > 0) {
      return data.results
        .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
        .map((r: any) => normalizeMediaItem(r));
    }

    // Fallback local search
    const q = query.toLowerCase();
    return SHOWCASE_CATALOG.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.overview.toLowerCase().includes(q) ||
        item.genres?.some((g) => g.name.toLowerCase().includes(q))
    );
  },

  // Full Details (with credits, videos, similar)
  async getDetails(id: string | number, mediaType: MediaType = "movie"): Promise<MediaItem | null> {
    const endpoint = `/${mediaType}/${id}`;
    const data = await fetchFromTmdb<any>(endpoint, {
      append_to_response: "credits,videos,similar,recommendations",
    });

    if (data) {
      const normalized = normalizeMediaItem(data, mediaType);
      if (mediaType === "tv" && normalized.seasons && normalized.seasons.length > 0) {
        // Find season 1 (or the first available non-special season)
        const primarySeason = normalized.seasons.find((s) => s.seasonNumber === 1) || normalized.seasons[0];
        if (primarySeason && (!primarySeason.episodes || primarySeason.episodes.length === 0)) {
          try {
            const seasonData = await fetchFromTmdb<any>(`/tv/${id}/season/${primarySeason.seasonNumber}`);
            if (seasonData?.episodes && seasonData.episodes.length > 0) {
              primarySeason.episodes = seasonData.episodes.map((ep: any) => ({
                id: ep.id,
                episodeNumber: ep.episode_number,
                seasonNumber: ep.season_number,
                name: ep.name,
                overview: ep.overview || "",
                stillPath: ep.still_path,
                airDate: ep.air_date || "",
                runtime: ep.runtime || normalized.runtime || 45,
                voteAverage: ep.vote_average ? Number(ep.vote_average.toFixed(1)) : 8.0,
              }));
            }
          } catch (e) {
            console.warn(`Could not preload season ${primarySeason.seasonNumber} episodes for TV ${id}:`, e);
          }
        }
      }
      return normalized;
    }

    // Look in showcase catalog
    const found = SHOWCASE_CATALOG.find(
      (item) => String(item.id) === String(id) || String(item.tmdbId) === String(id)
    );
    return found || null;
  },

  // TV Season Episodes
  async getSeason(tvId: string | number, seasonNumber: number): Promise<Episode[]> {
    const data = await fetchFromTmdb<any>(`/tv/${tvId}/season/${seasonNumber}`);
    if (data?.episodes) {
      return data.episodes.map((ep: any) => ({
        id: ep.id,
        episodeNumber: ep.episode_number,
        seasonNumber: ep.season_number,
        name: ep.name,
        overview: ep.overview || "",
        stillPath: ep.still_path,
        airDate: ep.air_date || "",
        runtime: ep.runtime || 45,
        voteAverage: ep.vote_average ? Number(ep.vote_average.toFixed(1)) : 8.0,
      }));
    }

    const show = SHOWCASE_CATALOG.find((i) => String(i.id) === String(tvId));
    const season = show?.seasons?.find((s) => s.seasonNumber === seasonNumber);
    return season?.episodes || [];
  },
};
