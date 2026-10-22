"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { MediaItem } from "@/types/media";
import {
  Cast,
  Tv,
  Airplay,
  ScreenShare,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  Sparkles,
  Info,
  Smartphone,
  MonitorPlay,
  Radio,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScreenCastModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem;
  currentSeason?: number;
  currentEpisode?: number;
  activeEpisodeTitle?: string;
  currentTime?: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  isEmbedMode: boolean;
  streamUrl: string;
  isCasting: boolean;
  setIsCasting: (casting: boolean) => void;
}

export function ScreenCastModal({
  isOpen,
  onClose,
  media,
  currentSeason,
  currentEpisode,
  activeEpisodeTitle,
  currentTime,
  videoRef,
  isEmbedMode,
  streamUrl,
  isCasting,
  setIsCasting,
}: ScreenCastModalProps) {
  const [copied, setCopied] = useState(false);
  const [castStatus, setCastStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"cast" | "tv-browser" | "help">("cast");
  const [selectedGuide, setSelectedGuide] = useState<"chromecast" | "airplay" | "smarttv" | "windows">("chromecast");
  const [displayStream, setDisplayStream] = useState<MediaStream | null>(null);

  // Detect platform capabilities
  const [supportsAirPlay, setSupportsAirPlay] = useState(false);
  const [supportsRemotePlayback, setSupportsRemotePlayback] = useState(false);
  const [supportsDisplayMedia, setSupportsDisplayMedia] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const video = videoRef.current;
    const hasAirPlay = Boolean(
      video && typeof (video as any).webkitShowPlaybackTargetPicker === "function"
    );
    const hasRemote = Boolean(
      video && "remote" in video && typeof (video as any).remote?.prompt === "function"
    );
    const hasDisplayMedia = Boolean(
      navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === "function"
    );

    setSupportsAirPlay(hasAirPlay);
    setSupportsRemotePlayback(hasRemote);
    setSupportsDisplayMedia(hasDisplayMedia);
  }, [isOpen, videoRef]);

  // Construct current stream share URL
  const [watchUrl, setWatchUrl] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const origin = window.location.origin;
    const params = new URLSearchParams();
    if (media.mediaType) params.set("type", media.mediaType);
    if (media.mediaType === "tv") {
      if (currentSeason) params.set("season", String(currentSeason));
      if (currentEpisode) params.set("episode", String(currentEpisode));
    }
    const fullUrl = `${origin}/watch/${media.id}?${params.toString()}`;
    setWatchUrl(fullUrl);
  }, [media, currentSeason, currentEpisode, isOpen]);

  // Handle direct AirPlay
  const handleTriggerAirPlay = () => {
    const video = videoRef.current;
    if (video && typeof (video as any).webkitShowPlaybackTargetPicker === "function") {
      try {
        setCastStatus("Opening Apple AirPlay device picker...");
        (video as any).webkitShowPlaybackTargetPicker();
        setIsCasting(true);
      } catch (err) {
        console.warn("AirPlay failed:", err);
        setCastStatus("AirPlay was cancelled or not available.");
      }
    } else {
      setCastStatus("AirPlay is only available on Apple Safari browsers.");
    }
  };

  // Handle RemotePlayback (Chromecast / Google Cast)
  const handleTriggerRemotePlayback = async () => {
    const video = videoRef.current;
    if (video && "remote" in video && (video as any).remote) {
      try {
        setCastStatus("Connecting to Google Cast / Smart TV...");
        await (video as any).remote.prompt();
        setIsCasting(true);
        setCastStatus("Connected to cast device.");
      } catch (err: any) {
        if (err.name !== "AbortError" && err.name !== "NotAllowedError") {
          console.warn("RemotePlayback failed:", err);
        }
        setCastStatus(err.name === "AbortError" ? "Cast selection cancelled." : "Could not connect to cast device.");
      }
    } else {
      handleTriggerDisplayMedia();
    }
  };

  // Handle Wireless Screen Mirroring (Display Media)
  const handleTriggerDisplayMedia = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setCastStatus("Display screen sharing is not supported by this browser.");
      return;
    }

    try {
      setCastStatus("Choose your TV or monitor in the screen picker dialog...");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: true,
      });

      setDisplayStream(stream);
      setIsCasting(true);
      setCastStatus("Screen cast streaming to external display!");

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setIsCasting(false);
        setDisplayStream(null);
        setCastStatus("Screen cast ended.");
      });
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setCastStatus("Screen sharing prompt was dismissed.");
      } else {
        setCastStatus("Could not initiate screen share.");
      }
    }
  };

  // Stop active casting
  const handleStopCast = () => {
    if (displayStream) {
      displayStream.getTracks().forEach((track) => track.stop());
      setDisplayStream(null);
    }
    setIsCasting(false);
    setCastStatus("Casting session ended.");
  };

  // Copy TV Link
  const handleCopyLink = () => {
    if (!watchUrl) return;
    navigator.clipboard.writeText(watchUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const qrImageUrl = watchUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(watchUrl)}&margin=6`
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cast to Larger Screen / TV"
      size="lg"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header Title & Media Info Banner */}
        <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Tv className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {media.title}
              </h4>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
              {media.mediaType === "tv"
                ? `Season ${currentSeason || 1} • Episode ${currentEpisode || 1}${activeEpisodeTitle ? ` - ${activeEpisodeTitle}` : ""}`
                : "Feature Film"}
            </p>
          </div>

          {isCasting ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex-shrink-0 animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>Casting Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/10 dark:bg-rose-500/10 border border-purple-500/20 dark:border-rose-500/20 text-purple-700 dark:text-rose-300 text-[11px] font-semibold flex-shrink-0">
              <Wifi className="w-3 h-3" />
              <span>Ready to Cast</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/10 text-xs font-medium">
          <button
            onClick={() => setActiveTab("cast")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
              activeTab === "cast"
                ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <Cast className="w-3.5 h-3.5" />
            <span>Wireless Cast</span>
          </button>

          <button
            onClick={() => setActiveTab("tv-browser")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
              activeTab === "tv-browser"
                ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smart TV & QR Link</span>
          </button>

          <button
            onClick={() => setActiveTab("help")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
              activeTab === "help"
                ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Connection Guide</span>
          </button>
        </div>

        {/* Status notification banner if any */}
        {castStatus && (
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="truncate">{castStatus}</span>
            </div>
            <button
              onClick={() => setCastStatus(null)}
              className="p-1 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-md transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* TAB 1: WIRELESS CAST */}
        {activeTab === "cast" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Google Cast / Chromecast / Android TV */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-purple-600/10 text-purple-600 dark:text-rose-400">
                      <Cast className="w-4 h-4" />
                    </span>
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Google Cast & Chromecast
                    </h5>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Stream to Chromecast, Google TV, Android TV, and compatible smart speakers.
                  </p>
                </div>

                <button
                  onClick={handleTriggerRemotePlayback}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Cast className="w-3.5 h-3.5" />
                  <span>Connect Chromecast</span>
                </button>
              </div>

              {/* Option B: Apple AirPlay */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      <Airplay className="w-4 h-4" />
                    </span>
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Apple AirPlay
                    </h5>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Cast directly to Apple TV, AirPlay 2 Smart TVs (Samsung, LG, Sony, Roku).
                  </p>
                </div>

                <button
                  onClick={handleTriggerAirPlay}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Airplay className="w-3.5 h-3.5" />
                  <span>Start Apple AirPlay</span>
                </button>
              </div>
            </div>

            {/* Option C: Wireless Display Mirroring (Screen & Audio Share) */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <ScreenShare className="w-4 h-4 text-emerald-500" />
                  <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Wireless Screen Mirroring (Any TV / Monitor)
                  </h5>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Mirror this video tab with synchronized high-definition audio to any connected monitor or TV.
                </p>
              </div>

              {isCasting ? (
                <button
                  onClick={handleStopCast}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Stop Casting</span>
                </button>
              ) : (
                <button
                  onClick={handleTriggerDisplayMedia}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <MonitorPlay className="w-3.5 h-3.5" />
                  <span>Mirror to Screen</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SMART TV BROWSER & QR CODE */}
        {activeTab === "tv-browser" && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row items-center gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="p-2.5 rounded-2xl bg-white shadow-md border border-zinc-200">
                  {qrImageUrl ? (
                    <img
                      src={qrImageUrl}
                      alt="Scan to Watch on TV"
                      className="w-36 h-36 rounded-lg object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-36 h-36 bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                      Generating QR...
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  Scan with Phone or TV
                </span>
              </div>

              {/* Instructions and direct URL */}
              <div className="space-y-3 flex-1 min-w-0">
                <div>
                  <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Open Directly in Your Smart TV Browser
                  </h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Have a Samsung, LG, Roku, Fire TV, or PlayStation / Xbox? Open the web browser on your TV and go to this direct streaming link:
                  </p>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-xs">
                  <input
                    type="text"
                    readOnly
                    value={watchUrl}
                    className="bg-transparent text-zinc-700 dark:text-zinc-300 w-full outline-none font-mono text-[11px] select-all truncate px-1"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>Resumes exactly at your current playback location and episode.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONNECTION GUIDES */}
        {activeTab === "help" && (
          <div className="space-y-4">
            {/* Guide Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "chromecast", label: "Chromecast & Google TV" },
                { id: "airplay", label: "Apple TV / AirPlay" },
                { id: "smarttv", label: "Samsung & LG Smart TV" },
                { id: "windows", label: "Windows PC (Win + K)" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuide(g.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                    selectedGuide === g.id
                      ? "bg-purple-50 dark:bg-rose-600/20 border-purple-500 dark:border-rose-500 text-purple-700 dark:text-white"
                      : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Guide Content */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] text-xs text-zinc-600 dark:text-zinc-300 space-y-2.5 leading-relaxed">
              {selectedGuide === "chromecast" && (
                <>
                  <h6 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Cast className="w-4 h-4 text-purple-600 dark:text-rose-500" />
                    How to Cast with Chromecast or Android TV:
                  </h6>
                  <ol className="list-decimal list-inside space-y-1.5 text-zinc-500 dark:text-zinc-400 pl-1">
                    <li>Make sure your phone, tablet, or laptop is on the <strong>same Wi-Fi network</strong> as your Chromecast or TV.</li>
                    <li>Click <strong>Connect Chromecast</strong> in the Wireless Cast tab above, or click Chrome's top-right menu (⋮) &gt; <strong>Cast...</strong></li>
                    <li>Select your Chromecast, Google TV, or Android TV device from the list.</li>
                    <li>The video will immediately start streaming in full resolution on your big screen!</li>
                  </ol>
                </>
              )}

              {selectedGuide === "airplay" && (
                <>
                  <h6 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Airplay className="w-4 h-4 text-sky-500" />
                    How to use Apple AirPlay:
                  </h6>
                  <ol className="list-decimal list-inside space-y-1.5 text-zinc-500 dark:text-zinc-400 pl-1">
                    <li>Ensure your Apple device (iPhone, iPad, Mac) and Apple TV or AirPlay 2 Smart TV share the same Wi-Fi.</li>
                    <li>Click <strong>Start Apple AirPlay</strong> above or open your device&apos;s <strong>Control Center</strong>.</li>
                    <li>Tap <strong>Screen Mirroring</strong> or the AirPlay icon and select your TV.</li>
                    <li>Enter the AirPlay passcode displayed on your TV if prompted.</li>
                  </ol>
                </>
              )}

              {selectedGuide === "smarttv" && (
                <>
                  <h6 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-emerald-500" />
                    How to stream on Samsung Tizen, LG webOS, Roku & Fire TV:
                  </h6>
                  <ol className="list-decimal list-inside space-y-1.5 text-zinc-500 dark:text-zinc-400 pl-1">
                    <li>On your TV remote, open the <strong>Internet</strong>, <strong>Web Browser</strong>, or <strong>Silk Browser</strong> app.</li>
                    <li>Enter the copied link from the <strong>Smart TV & QR Link</strong> tab.</li>
                    <li>Bookmark or add StreamFlix to your TV&apos;s home screen for one-click access anytime!</li>
                  </ol>
                </>
              )}

              {selectedGuide === "windows" && (
                <>
                  <h6 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4 text-amber-500" />
                    How to project from Windows 10/11:
                  </h6>
                  <ol className="list-decimal list-inside space-y-1.5 text-zinc-500 dark:text-zinc-400 pl-1">
                    <li>On your keyboard, press the shortcut <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">Win</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">K</kbd>.</li>
                    <li>The Windows <strong>Cast / Connect</strong> sidebar will appear on the right side of your desktop.</li>
                    <li>Select your Wireless TV, Roku, or Miracast receiver to project wirelessly.</li>
                  </ol>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-white/10 text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">
            Supports Chromecast, AirPlay, DLNA & Smart TVs
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-900 dark:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
