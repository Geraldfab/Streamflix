"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hls from "hls.js";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  ListVideo,
  ArrowLeft,
  ChevronRight,
  Server,
  HelpCircle,
  PictureInPicture,
  Tv,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { MediaItem, Season, Episode, Chapter } from "@/types/media";
import { formatTime, cn } from "@/lib/utils";
import { useMedia } from "@/components/providers/media-context";
import { usePlayer } from "@/components/providers/player-context";
import { STREAM_SERVERS } from "@/lib/constants";
import { KeyboardShortcutsModal } from "./keyboard-shortcuts-modal";

interface VideoPlayerProps {
  media: MediaItem;
  initialSeason?: number;
  initialEpisode?: number;
  onEpisodeChange?: (seasonNumber: number, episodeNumber: number) => void;
  className?: string;
}

export function VideoPlayer({
  media,
  initialSeason = 1,
  initialEpisode = 1,
  onEpisodeChange,
  className = "",
}: VideoPlayerProps) {
  const router = useRouter();
  const { preferences, saveProgress, addToHistory, continueWatching } = useMedia();
  const { openMiniPlayer, theaterMode, toggleTheaterMode } = usePlayer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active episode states for TV
  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);

  // Sync with prop changes
  useEffect(() => {
    if (initialSeason) setCurrentSeason(initialSeason);
  }, [initialSeason]);

  useEffect(() => {
    if (initialEpisode) setCurrentEpisode(initialEpisode);
  }, [initialEpisode]);

  // Dynamic episode storage for player drawer
  const [playerSeasonEpisodes, setPlayerSeasonEpisodes] = useState<Record<number, Episode[]>>({});

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(preferences.defaultPlaybackSpeed || 1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Controls UI visibility
  const [showControls, setShowControls] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  // Menus
  const [activeMenu, setActiveMenu] = useState<"none" | "settings" | "servers" | "episodes" | "subtitles">("none");
  const [selectedServer, setSelectedServer] = useState<string>(() => {
    const pref = preferences.preferredStreamServer;
    return pref === "zxcstream" || pref === "0vidads" ? pref : "0vidads";
  });
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(preferences.subtitlesEnabled || false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Autoplay next episode countdown
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState<number | null>(null);

  // Get active episode details
  const seasons = media.seasons || [];
  const activeSeason = seasons.find((s) => s.seasonNumber === currentSeason) || seasons[0];

  // Auto fetch season episodes for TV if not present
  useEffect(() => {
    if (media.mediaType !== "tv" || !media.id) return;
    const sNum = currentSeason || 1;
    const existing = media.seasons?.find((s) => s.seasonNumber === sNum)?.episodes;
    if (existing && existing.length > 0) return;
    if (playerSeasonEpisodes[sNum]) return;

    let isMounted = true;
    async function loadEpisodes() {
      try {
        const res = await fetch(`/api/media/tv/${media.id}/season/${sNum}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.episodes && data.episodes.length > 0) {
            setPlayerSeasonEpisodes((prev) => ({ ...prev, [sNum]: data.episodes }));
          }
        }
      } catch (e) {
        console.warn("Failed to load episodes in video player:", e);
      }
    }
    loadEpisodes();
    return () => {
      isMounted = false;
    };
  }, [media.id, media.mediaType, media.seasons, currentSeason, playerSeasonEpisodes]);

  // Resolved episode list with fallback guarantee
  const resolvedEpisodeList: Episode[] =
    playerSeasonEpisodes[currentSeason] ||
    activeSeason?.episodes ||
    (activeSeason?.episodeCount && activeSeason.episodeCount > 0
      ? Array.from({ length: activeSeason.episodeCount }, (_, i) => ({
          id: i + 1,
          episodeNumber: i + 1,
          seasonNumber: currentSeason,
          name: `Episode ${i + 1}`,
          overview: `Season ${currentSeason}, Episode ${i + 1}`,
          runtime: 45,
          voteAverage: 8.0,
        }))
      : Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          episodeNumber: i + 1,
          seasonNumber: currentSeason,
          name: `Episode ${i + 1}`,
          overview: `Season ${currentSeason}, Episode ${i + 1}`,
          runtime: 45,
          voteAverage: 8.0,
        })));

  const activeEpisode =
    resolvedEpisodeList.find((e) => e.episodeNumber === currentEpisode) ||
    resolvedEpisodeList[0];

  // Resume timestamp check
  useEffect(() => {
    const progressId = media.mediaType === "tv"
      ? `tv_${media.id}_s${currentSeason}_e${currentEpisode}`
      : `movie_${media.id}`;
    const saved = continueWatching.find((p) => p.id === progressId);
    if (saved && saved.currentTime > 5 && saved.percentage < 95 && videoRef.current) {
      videoRef.current.currentTime = saved.currentTime;
      setCurrentTime(saved.currentTime);
    }
  }, [media.id, media.mediaType, currentSeason, currentEpisode, continueWatching]);

  // Current stream URL resolver based on selected server (Default: 0vidads.top, Mirror: zxcstream.cc)
  const getStreamSource = useCallback(() => {
    const isMovie = media.mediaType === "movie";

    // 1. 0VIDADS API (https://0vidads.top/) with custom branding and styling (Default)
    if (selectedServer === "0vidads") {
      return {
        url: isMovie
          ? `https://0vidads.top/embed/movie/${media.id}?color=E50914&branding=StreamFlix`
          : `https://0vidads.top/embed/tv/${media.id}/${currentSeason}/${currentEpisode}?color=E50914&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&branding=StreamFlix`,
        type: "embed" as const,
      };
    }

    // 2. ZXC Stream Custom Player (Mirror from zxcstream.cc)
    if (selectedServer === "zxcstream") {
      return {
        url: isMovie
          ? `https://zxcstream.cc/player/movie/${media.id}`
          : `https://zxcstream.cc/player/tv/${media.id}/${currentSeason}/${currentEpisode}`,
        type: "embed" as const,
      };
    }

    // Fallback default to 0vidads
    return {
      url: isMovie
        ? `https://0vidads.top/embed/movie/${media.id}?color=E50914&branding=StreamFlix`
        : `https://0vidads.top/embed/tv/${media.id}/${currentSeason}/${currentEpisode}?color=E50914&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&branding=StreamFlix`,
      type: "embed" as const,
    };
  }, [media, currentSeason, currentEpisode, selectedServer]);

  // Support postMessage events from 0VIDADS and mirror players for live progress tracking
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }
        if (!data || typeof data !== "object") return;

        const time =
          typeof data.currentTime === "number"
            ? data.currentTime
            : typeof data.time === "number"
            ? data.time
            : typeof data.data?.currentTime === "number"
            ? data.data.currentTime
            : typeof data.data?.time === "number"
            ? data.data.time
            : null;

        const dur =
          typeof data.duration === "number" && data.duration > 0
            ? data.duration
            : typeof data.data?.duration === "number" && data.data.duration > 0
            ? data.data.duration
            : null;

        if (time !== null) {
          setCurrentTime(time);
        }
        if (dur !== null) {
          setDuration(dur);
        }
      } catch {
        // Ignore non-JSON postMessages
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const streamSource = getStreamSource();
  const isEmbedMode = streamSource.type === "embed";

  // Initialize Video & HLS
  useEffect(() => {
    if (isEmbedMode) return;

    const video = videoRef.current;
    if (!video) return;

    setPlaybackError(null);
    setIsBuffering(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = streamSource.url;

    if (streamUrl.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
          video.play().catch(() => setIsPlaying(false));
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setPlaybackError("Failed to decode video stream. Switch server or retry.");
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = streamUrl;
      }
    } else {
      // Direct MP4
      video.src = streamUrl;
      video.load();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamSource.url, isEmbedMode]);

  // Handle Controls Auto-Hide
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (activeMenu === "none") {
          setShowControls(false);
        }
      }, 2500);
    }
  }, [isPlaying, activeMenu]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, resetControlsTimeout]);

  // Estimated duration fallback if iframe doesn't supply one
  const estimatedDuration =
    media.runtime && media.runtime > 0
      ? media.runtime * 60
      : media.mediaType === "movie"
      ? 7200
      : 2700;
  const effectiveDuration = duration > 0 ? duration : estimatedDuration;

  const watchTrackerRef = useRef({
    currentTime: 0,
    duration: effectiveDuration,
  });

  useEffect(() => {
    watchTrackerRef.current.duration = effectiveDuration;
  }, [effectiveDuration]);

  useEffect(() => {
    if (currentTime > 0) {
      watchTrackerRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Robust Watch Progress Persistence (Works for embed iframes & direct streams)
  useEffect(() => {
    const progressId =
      media.mediaType === "tv"
        ? `tv_${media.id}_s${currentSeason}_e${currentEpisode}`
        : `movie_${media.id}`;

    // Look up previous progress or default to start
    const saved = continueWatching.find((p) => p.id === progressId);
    let activeSeconds = saved?.currentTime && saved.currentTime > 0 ? saved.currentTime : 25;
    watchTrackerRef.current.currentTime = activeSeconds;

    const commitProgress = (time: number, dur: number) => {
      const finalDur = dur > 0 ? dur : estimatedDuration;
      const pct = Math.min(94, Math.max(1, Math.round((time / finalDur) * 100)));

      saveProgress({
        id: progressId,
        mediaId: media.id,
        mediaType: media.mediaType,
        title: media.title,
        posterPath: media.posterPath,
        backdropPath: media.backdropPath,
        season: media.mediaType === "tv" ? currentSeason : undefined,
        episode: media.mediaType === "tv" ? currentEpisode : undefined,
        episodeTitle: activeEpisode?.name,
        currentTime: Math.round(time),
        duration: Math.round(finalDur),
        percentage: pct,
      });

      addToHistory(
        media,
        media.mediaType === "tv" ? currentSeason : undefined,
        media.mediaType === "tv" ? currentEpisode : undefined,
        activeEpisode?.name,
        pct / 100
      );
    };

    // 1. Initial save after 2.5s of playback so it registers in Continue Watching immediately
    const initialTimer = setTimeout(() => {
      commitProgress(watchTrackerRef.current.currentTime, watchTrackerRef.current.duration);
    }, 2500);

    // 2. Active timer: track playback progress every 5s and save every 10s
    let ticks = 0;
    const intervalTimer = setInterval(() => {
      if (!isEmbedMode && videoRef.current && !videoRef.current.paused) {
        activeSeconds = videoRef.current.currentTime;
      } else {
        activeSeconds += 5;
      }
      watchTrackerRef.current.currentTime = activeSeconds;

      ticks++;
      if (ticks % 2 === 0) {
        commitProgress(watchTrackerRef.current.currentTime, watchTrackerRef.current.duration);
      }
    }, 5000);

    // 3. Unload listener
    const handleBeforeUnload = () => {
      commitProgress(watchTrackerRef.current.currentTime, watchTrackerRef.current.duration);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      commitProgress(watchTrackerRef.current.currentTime, watchTrackerRef.current.duration);
    };
  }, [media, currentSeason, currentEpisode, activeEpisode, isEmbedMode, estimatedDuration, saveProgress, addToHistory]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing while typing inside inputs
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const video = videoRef.current;
      if (!video && !isEmbedMode) return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekDelta(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          seekDelta(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          changeVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          changeVolume(Math.max(0, volume - 0.1));
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyT":
          e.preventDefault();
          toggleTheaterMode();
          break;
        case "KeyC":
          e.preventDefault();
          setSubtitlesEnabled((prev) => !prev);
          break;
        case "Slash":
          if (e.shiftKey) {
            // '?' key
            e.preventDefault();
            setShowShortcutsModal(true);
          }
          break;
        case "Escape":
          if (activeMenu !== "none") setActiveMenu("none");
          break;
      }
      resetControlsTimeout();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [volume, isMuted, isPlaying, isEmbedMode, activeMenu, resetControlsTimeout, toggleTheaterMode]);

  // Playback Control Handlers
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(console.error);
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const seekDelta = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  const changeVolume = (newVol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      video.volume = volume > 0 ? volume : 1;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (video) video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setActiveMenu("none");
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement && !isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          // Mobile fallback (e.g. iOS Safari which restricts div fullscreen)
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => setIsFullscreen(false));
      }
      setIsFullscreen(false);
    }
  };

  // Synchronize native fullscreen state with react state
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  // Skip Intro / Credits check
  const activeChapter: Chapter | undefined = media.chapters?.find(
    (c) => currentTime >= c.startTime && currentTime <= c.endTime
  );

  const handleSkipChapter = (chapter: Chapter) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = chapter.endTime + 0.5;
    }
  };

  // Next Episode Action
  const handleNextEpisode = () => {
    const nextEpNum = currentEpisode + 1;
    const nextEpExists = activeSeason?.episodes?.some((e) => e.episodeNumber === nextEpNum);

    if (nextEpExists) {
      setCurrentEpisode(nextEpNum);
      if (onEpisodeChange) onEpisodeChange(currentSeason, nextEpNum);
    } else {
      // Check next season
      const nextSeasonNum = currentSeason + 1;
      const nextSeasonExists = seasons.some((s) => s.seasonNumber === nextSeasonNum);
      if (nextSeasonExists) {
        setCurrentSeason(nextSeasonNum);
        setCurrentEpisode(1);
        if (onEpisodeChange) onEpisodeChange(nextSeasonNum, 1);
      }
    }
  };

  // Mini Player Action
  const handleLaunchMiniPlayer = () => {
    openMiniPlayer({
      media,
      season: media.mediaType === "tv" ? currentSeason : undefined,
      episode: media.mediaType === "tv" ? currentEpisode : undefined,
      episodeTitle: activeEpisode?.name,
      streamUrl: streamSource.url,
      isEmbed: isEmbedMode,
      currentTime,
    });
    router.push("/");
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={resetControlsTimeout}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onTouchStart={resetControlsTimeout}
        onClick={resetControlsTimeout}
        className={cn(
          "relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group border border-white/10 touch-manipulation",
          theaterMode && "max-w-none rounded-none aspect-[21/9] h-[85vh]",
          isFullscreen && "fixed inset-0 z-50 w-screen h-screen rounded-none aspect-auto max-w-none border-0",
          className
        )}
      >
        {/* Error State Overlay */}
        {playbackError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/90 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 animate-bounce" />
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-white">Playback Error</h3>
              <p className="text-xs text-zinc-400 mt-1">{playbackError}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedServer("zxcstream")}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2"
              >
                <Server className="w-3.5 h-3.5" />
                Switch to Mirror Server
              </button>
              <button
                onClick={() => setPlaybackError(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl glass-panel text-zinc-300 hover:text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Video Element OR Embed iframe */}
        {isEmbedMode ? (
          <iframe
            src={streamSource.url}
            title={media.title}
            className="w-full h-full border-0 relative z-10"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="origin"
            loading="eager"
          />
        ) : (
          <video
            ref={videoRef}
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current && !isSeeking) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
                setIsBuffering(false);
              }
            }}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => {
              setIsBuffering(false);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              if (media.mediaType === "tv" && preferences.autoplayNextEpisode) {
                setNextEpisodeCountdown(5);
              }
            }}
            playsInline
            className="w-full h-full object-contain cursor-pointer"
          />
        )}

        {/* Buffering Indicator */}
        {isBuffering && !isEmbedMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-16 h-16 border-4 border-rose-500/30 border-t-rose-400 rounded-full animate-spin" />
          </div>
        )}

        {/* Skip Intro / Credits Floating Badge */}
        {!isEmbedMode && activeChapter && (
          <div className="absolute bottom-24 right-8 z-30 animate-scale-up">
            <button
              onClick={() => handleSkipChapter(activeChapter)}
              className="px-4 py-2 rounded-xl glass-panel-elevated hover:bg-rose-600 text-xs font-bold text-white border border-white/20 shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>
                {activeChapter.type === "intro"
                  ? "Skip Intro"
                  : activeChapter.type === "credits"
                  ? "Skip Credits"
                  : "Skip Recap"}
              </span>
            </button>
          </div>
        )}

        {/* Autoplay Next Episode Overlay */}
        {nextEpisodeCountdown !== null && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 text-center p-6 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Next Episode Playing in
            </p>
            <div className="text-6xl font-black text-white my-3 font-mono">
              {nextEpisodeCountdown}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleNextEpisode}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg"
              >
                Play Now
              </button>
              <button
                onClick={() => setNextEpisodeCountdown(null)}
                className="px-5 py-2.5 rounded-xl glass-panel text-zinc-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Top Control Bar (Overlay) - Non-blocking wrapper, buttons only intercept clicks */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 z-20 p-3 sm:p-5 bg-gradient-to-b from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex items-center justify-between pointer-events-none",
            isEmbedMode || showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Back button and title */}
          <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl glass-panel hover:bg-white/10 text-white border border-white/10 transition-colors"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2 truncate max-w-[140px] sm:max-w-xs md:max-w-md">
                {media.title}
              </h2>
              {media.mediaType === "tv" && (
                <p className="text-[10px] sm:text-xs text-rose-300 truncate">
                  Season {currentSeason} Episode {currentEpisode}
                  {activeEpisode?.name ? ` • ${activeEpisode.name}` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Top Right System Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-shrink-0">
            {/* Stream Server Switcher Pill */}
            <button
              onClick={() => setActiveMenu(activeMenu === "servers" ? "none" : "servers")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 text-xs font-medium text-zinc-200 border border-white/10 transition-colors"
              title="Change Streaming Server"
            >
              <Server className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">
                {STREAM_SERVERS.find((s) => s.id === selectedServer)?.name || "Server"}
              </span>
            </button>

            {/* In Embed Mode: Place Episodes, Theater, Mini-Player, and Fullscreen here so bottom of iframe is 100% unobstructed */}
            {isEmbedMode && (
              <>
                {media.mediaType === "tv" && seasons.length > 0 && (
                  <button
                    onClick={() => setActiveMenu(activeMenu === "episodes" ? "none" : "episodes")}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 text-xs font-medium text-white border border-white/10 transition-colors"
                    title="Select Episode"
                  >
                    <ListVideo className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden sm:inline">Episodes</span>
                  </button>
                )}

                <button
                  onClick={toggleTheaterMode}
                  className={cn(
                    "hidden sm:flex p-2 rounded-xl border border-white/10 transition-colors",
                    theaterMode
                      ? "bg-rose-600 text-white"
                      : "glass-panel hover:bg-white/10 text-zinc-300 hover:text-white"
                  )}
                  title="Theater Mode (T)"
                >
                  <Tv className="w-4 h-4" />
                </button>

                <button
                  onClick={handleLaunchMiniPlayer}
                  className="hidden sm:flex p-2 rounded-xl glass-panel hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                  title="Picture-in-Picture Mini Player"
                >
                  <PictureInPicture className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl glass-panel hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                  title="Fullscreen (F)"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </>
            )}

            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="p-2 rounded-xl glass-panel hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Server Selector Popup / Mobile Drawer */}
        {activeMenu === "servers" && (
          <>
            {/* Backdrop for click-away dismissal on mobile and desktop */}
            <div
              className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xs cursor-pointer"
              onClick={() => setActiveMenu("none")}
              aria-hidden="true"
            />

            <div className="absolute inset-x-2.5 top-2.5 bottom-2.5 sm:top-14 sm:bottom-auto sm:right-4 sm:left-auto sm:inset-x-auto z-40 w-auto sm:w-72 max-w-sm sm:max-w-none mx-auto sm:mx-0 p-3 rounded-2xl glass-panel-elevated border border-white/20 shadow-2xl animate-scale-up flex flex-col max-h-[calc(100%-1.25rem)] overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-rose-400" />
                  <span>Streaming Server</span>
                </div>
                <button
                  onClick={() => setActiveMenu("none")}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 text-xs transition-colors"
                  aria-label="Close server selector"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5 overflow-y-auto pr-0.5 no-scrollbar flex-1">
                {STREAM_SERVERS.map((server) => {
                  const isSelected = selectedServer === server.id;
                  return (
                    <button
                      key={server.id}
                      onClick={() => {
                        setSelectedServer(server.id);
                        setActiveMenu("none");
                      }}
                      className={`w-full text-left p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? "bg-rose-600/30 border border-rose-500/50 text-white shadow-sm"
                          : "hover:bg-white/5 border border-transparent text-zinc-300"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold flex items-center gap-1.5">
                          <span className="truncate">{server.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-mono bg-white/10 text-rose-300 flex-shrink-0">
                            {server.type}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                          {server.description}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-white flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Bottom Control Bar - ONLY for Direct HLS/MP4 streams (Embed players have their own built-in controls) */}
        {!isEmbedMode && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 pb-4 sm:pb-6 pt-12 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300 flex flex-col gap-2 pointer-events-auto",
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
          {/* Interactive Timeline Bar (Direct stream mode) */}
          <div
            className="relative w-full h-4 sm:h-3 flex items-center cursor-pointer group/timeline touch-manipulation py-1"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              setHoverPosition(pos);
              setHoverTime(pos * duration);
            }}
            onMouseLeave={() => setHoverTime(null)}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (!touch) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
              setHoverPosition(pos);
              setHoverTime(pos * duration);
              if (videoRef.current) {
                const newTime = pos * duration;
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
            onTouchEnd={() => setHoverTime(null)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              const newTime = pos * duration;
              if (videoRef.current) {
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
          >
            {/* Hover Timestamp Preview Tooltip */}
            {hoverTime !== null && (
              <div
                className="absolute bottom-6 px-2 py-1 rounded-md glass-panel-elevated border border-white/10 text-[10px] font-mono text-white pointer-events-none transform -translate-x-1/2 shadow-lg"
                style={{ left: `${hoverPosition * 100}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}

            {/* Background Track */}
            <div className="w-full h-1 group-hover/timeline:h-2 rounded-full bg-white/20 transition-all overflow-hidden relative">
              {/* Buffered / Progress */}
              <div
                className="h-full bg-rose-600 rounded-full transition-all"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>

            {/* Scrubber Knob */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-md transform -translate-x-1/2 opacity-0 group-hover/timeline:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mt-1">
            {/* Left Controls: Play, Seek, Volume, Timestamps */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={togglePlay}
                className="p-2 sm:p-2.5 rounded-full bg-white text-zinc-950 hover:bg-rose-400 transition-colors shadow-lg active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950 translate-x-0.5" />}
              </button>

              <button
                onClick={() => seekDelta(-10)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors active:scale-95"
                title="Seek backward 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => seekDelta(10)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors active:scale-95"
                title="Seek forward 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-1.5 sm:gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors active:scale-95"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-white/20 accent-rose-600 rounded-lg cursor-pointer hidden sm:inline-block"
                  aria-label="Volume slider"
                />
              </div>

              {/* Timestamps */}
              <div className="text-[11px] sm:text-xs font-mono text-zinc-400 ml-0.5 sm:ml-1 whitespace-nowrap">
                <span className="text-white font-medium">{formatTime(currentTime)}</span>
                <span className="mx-0.5 sm:mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: TV Episodes, Speed, Theater, Mini, Fullscreen */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Episodes drawer trigger for TV */}
              {media.mediaType === "tv" && seasons.length > 0 && (
                <button
                  onClick={() => setActiveMenu(activeMenu === "episodes" ? "none" : "episodes")}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 text-xs font-medium text-white transition-colors active:scale-95"
                  title="Episodes"
                >
                  <ListVideo className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Episodes</span>
                </button>
              )}

              {/* Subtitles Toggle */}
              <button
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                className={cn(
                  "p-1.5 sm:p-2 rounded-xl transition-colors active:scale-95",
                  subtitlesEnabled
                    ? "bg-rose-600 text-white"
                    : "glass-panel hover:bg-white/10 text-zinc-300"
                )}
                title="Subtitles / Captions (C)"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Playback Settings (Speed) */}
              <div className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === "settings" ? "none" : "settings")}
                  className="p-1.5 sm:p-2 rounded-xl glass-panel hover:bg-white/10 text-zinc-300 hover:text-white transition-colors active:scale-95"
                  title="Playback Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {activeMenu === "settings" && (
                  <div className="absolute bottom-12 right-0 z-30 w-48 p-2 rounded-2xl glass-panel-elevated border border-white/20 shadow-2xl animate-scale-up">
                    <div className="px-3 py-1 text-xs font-bold text-white border-b border-white/10 mb-1">
                      Speed
                    </div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`w-full px-3 py-1.5 text-xs text-left rounded-lg flex items-center justify-between ${
                          playbackSpeed === s
                            ? "bg-rose-600/30 text-rose-300 font-semibold"
                            : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        <span>{s === 1 ? "1x (Normal)" : `${s}x`}</span>
                        {playbackSpeed === s && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theater Mode Toggle */}
              <button
                onClick={toggleTheaterMode}
                className={cn(
                  "hidden sm:flex p-2 rounded-xl transition-colors",
                  theaterMode
                    ? "bg-rose-600 text-white"
                    : "glass-panel hover:bg-white/10 text-zinc-300 hover:text-white"
                )}
                title="Theater Mode (T)"
              >
                <Tv className="w-4 h-4" />
              </button>

              {/* Mini Player */}
              <button
                onClick={handleLaunchMiniPlayer}
                className="hidden sm:flex p-2 rounded-xl glass-panel hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title="Picture-in-Picture Mini Player"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl glass-panel hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title="Fullscreen (F)"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

        {/* TV Series Episode Drawer Overlay */}
        {activeMenu === "episodes" && (
          <>
            {/* Click-away backdrop */}
            <div
              className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setActiveMenu("none")}
              aria-hidden="true"
            />

            <div className="absolute top-0 right-0 bottom-0 z-40 w-full sm:w-96 shadow-2xl animate-fade-in p-3 bg-zinc-950/95 backdrop-blur-2xl border-l border-white/10 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Select Episode</span>
                  {seasons.length > 1 && (
                    <select
                      value={currentSeason}
                      onChange={(e) => {
                        const newSeason = Number(e.target.value);
                        setCurrentSeason(newSeason);
                        setCurrentEpisode(1);
                        if (onEpisodeChange) onEpisodeChange(newSeason, 1);
                      }}
                      className="bg-zinc-900 border border-white/20 text-white rounded-lg px-2 py-0.5 text-xs focus:outline-none"
                    >
                      {seasons.map((s) => (
                        <option key={s.id || s.seasonNumber} value={s.seasonNumber}>
                          {s.name || `Season ${s.seasonNumber}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <button
                  onClick={() => setActiveMenu("none")}
                  className="px-2 py-1 text-xs text-zinc-400 hover:text-white"
                >
                  Close ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mt-2 space-y-1">
                {resolvedEpisodeList.map((ep) => {
                  const isCurrent = ep.episodeNumber === currentEpisode && ep.seasonNumber === currentSeason;
                  return (
                    <button
                      key={ep.id || ep.episodeNumber}
                      onClick={() => {
                        setCurrentEpisode(ep.episodeNumber);
                        if (onEpisodeChange) onEpisodeChange(currentSeason, ep.episodeNumber);
                        setActiveMenu("none");
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2 ${
                        isCurrent
                          ? "bg-rose-600/30 text-white border border-rose-500/40 shadow-sm"
                          : "hover:bg-white/5 text-zinc-300 border border-transparent"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">
                          E{ep.episodeNumber}: {ep.name}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {ep.runtime ? `${ep.runtime}m` : "45m"}
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </>
  );
}
