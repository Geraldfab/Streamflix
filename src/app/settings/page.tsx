"use client";

import React from "react";
import {
  Settings,
  Server,
  PlaySquare,
  Subtitles,
  Sun,
  Moon,
  Laptop,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { useTheme } from "@/components/providers/theme-provider";
import { STREAM_SERVERS } from "@/lib/constants";

export default function SettingsPage() {
  const { preferences, updatePreferences, resetPreferences } = useMedia();
  const { theme, setTheme } = useTheme();

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-red-600 dark:text-rose-500 font-semibold text-xs uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
          Settings & Streaming Servers
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Configure video player streaming providers, playback behaviors, theme, and subtitle styling.
        </p>
      </div>

      {/* 1. Theme Configuration */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Sun className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Appearance & Theme
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Switch between cinematic dark mode and high-contrast light mode
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { id: "dark", label: "Dark Cinema", icon: Moon },
            { id: "light", label: "Pure Light", icon: Sun },
            { id: "system", label: "System Sync", icon: Laptop },
          ].map((mode) => {
            const isSelected = theme === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setTheme(mode.id as any)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-xs font-semibold gap-2 ${
                  isSelected
                    ? "bg-red-50 dark:bg-rose-500/15 border-red-500 dark:border-rose-500 text-red-700 dark:text-rose-400 shadow-sm font-bold"
                    : "bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 border-zinc-200 dark:border-white/10 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Streaming Servers Configuration */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-red-600 dark:text-rose-500" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Default Streaming Provider
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select the primary video stream source used when opening any title
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {STREAM_SERVERS.map((server) => {
            const isSelected = preferences.preferredStreamServer === server.id;
            return (
              <button
                key={server.id}
                onClick={() => updatePreferences({ preferredStreamServer: server.id as any })}
                className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-red-50 dark:bg-rose-600/20 border-red-500 dark:border-rose-500 text-zinc-950 dark:text-white shadow-sm"
                    : "bg-zinc-50/70 hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/10 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                    <span className="truncate">{server.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-red-100 text-red-700 dark:bg-white/10 dark:text-rose-300 flex-shrink-0">
                      {server.type}
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                    {server.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 dark:bg-rose-600 flex items-center justify-center text-white flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Playback Behaviors */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <PlaySquare className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Playback Behaviors
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Customize automation and default resolution settings
            </p>
          </div>
        </div>

        <div className="divide-y divide-zinc-200/80 dark:divide-white/5 space-y-3 pt-2 text-xs sm:text-sm">
          {/* Autoplay Next Episode */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-200">Autoplay Next Episode</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Automatically transition to the next episode when current episode ends
              </p>
            </div>
            <button
              onClick={() =>
                updatePreferences({ autoplayNextEpisode: !preferences.autoplayNextEpisode })
              }
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                preferences.autoplayNextEpisode ? "bg-red-600 dark:bg-rose-600" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.autoplayNextEpisode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Autoplay Trailers */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-200">Autoplay Trailers on Preview</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Play official trailers automatically in quick view modal
              </p>
            </div>
            <button
              onClick={() =>
                updatePreferences({ autoplayTrailers: !preferences.autoplayTrailers })
              }
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                preferences.autoplayTrailers ? "bg-red-600 dark:bg-rose-600" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.autoplayTrailers ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Default Playback Speed */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-200">Default Playback Speed</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Preferred normal playback rate</p>
            </div>
            <select
              value={preferences.defaultPlaybackSpeed}
              onChange={(e) =>
                updatePreferences({ defaultPlaybackSpeed: parseFloat(e.target.value) })
              }
              className="bg-zinc-50 dark:bg-black/30 border border-zinc-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-rose-500"
            >
              <option value="0.75" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">0.75x</option>
              <option value="1" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">1.0x (Normal)</option>
              <option value="1.25" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">1.25x</option>
              <option value="1.5" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">1.5x</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Subtitle Appearance */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-6 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Subtitles className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Subtitle Customization
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Adjust typography, size, and background opacity for captions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Font Size */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-400 block mb-1.5">
              Font Size
            </label>
            <select
              value={preferences.subtitleAppearance?.fontSize || "base"}
              onChange={(e) =>
                updatePreferences({
                  subtitleAppearance: {
                    ...preferences.subtitleAppearance,
                    fontSize: e.target.value as any,
                  },
                })
              }
              className="w-full bg-zinc-50 dark:bg-black/30 border border-zinc-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-rose-500"
            >
              <option value="sm" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">Small (14px)</option>
              <option value="base" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">Medium (18px)</option>
              <option value="lg" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">Large (22px)</option>
              <option value="xl" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">Extra Large (26px)</option>
            </select>
          </div>

          {/* Text Color */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-400 block mb-1.5">
              Caption Color
            </label>
            <select
              value={preferences.subtitleAppearance?.textColor || "white"}
              onChange={(e) =>
                updatePreferences({
                  subtitleAppearance: {
                    ...preferences.subtitleAppearance,
                    textColor: e.target.value as any,
                  },
                })
              }
              className="w-full bg-zinc-50 dark:bg-black/30 border border-zinc-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-rose-500"
            >
              <option value="white" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">White (#FFFFFF)</option>
              <option value="yellow" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">Cinema Yellow (#FACC15)</option>
              <option value="cyan" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">Cyan Blue (#38BDF8)</option>
            </select>
          </div>

          {/* Background */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-400 block mb-1.5">
              Background Opacity
            </label>
            <select
              value={preferences.subtitleAppearance?.backgroundColor || "semi-black"}
              onChange={(e) =>
                updatePreferences({
                  subtitleAppearance: {
                    ...preferences.subtitleAppearance,
                    backgroundColor: e.target.value as any,
                  },
                })
              }
              className="w-full bg-zinc-50 dark:bg-black/30 border border-zinc-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-rose-500"
            >
              <option value="none" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">None (Transparent)</option>
              <option value="semi-black" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">Semi-Transparent Black</option>
              <option value="solid-black" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">Solid Black</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Reset to Defaults */}
      <div className="pt-2 flex items-center justify-between">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Preferences are stored locally on your device and take effect immediately.
        </p>
        <button
          onClick={resetPreferences}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-rose-400 hover:text-red-700 dark:hover:text-rose-300 hover:bg-red-50 dark:hover:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Defaults</span>
        </button>
      </div>
    </div>
  );
}
