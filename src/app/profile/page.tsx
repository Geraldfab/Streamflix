"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Crown,
  Film,
  Clock,
  Bookmark,
  Settings,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useMedia } from "@/components/providers/media-context";

export default function ProfilePage() {
  const { watchlist, continueWatching, history, preferences } = useMedia();

  const totalTitlesWatched = history.length;
  const estimatedHours = Math.round((history.reduce((acc, curr) => acc + (curr.completionRate * 90), 0)) / 60);

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header Card */}
      <div className="relative glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-700 via-red-600 to-rose-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-rose-600/30 flex-shrink-0">
          SF
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              VIP Cinema Guest
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              StreamFlix Ultra 4K
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Active cinema subscriber with adaptive streaming and personalized discovery.
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Stream Account
            </span>
          </div>
        </div>

        <Link
          href="/settings"
          className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 flex items-center gap-2 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Preferences</span>
        </Link>
      </div>

      {/* Viewing Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
            <Bookmark className="w-4 h-4" />
            <span>My List</span>
          </div>
          <div className="text-2xl font-black text-white">{watchlist.length}</div>
          <div className="text-[11px] text-zinc-500">Titles saved</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            <span>In Progress</span>
          </div>
          <div className="text-2xl font-black text-white">{continueWatching.length}</div>
          <div className="text-[11px] text-zinc-500">Active playback sessions</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <Film className="w-4 h-4" />
            <span>Titles Watched</span>
          </div>
          <div className="text-2xl font-black text-white">{totalTitlesWatched}</div>
          <div className="text-[11px] text-zinc-500">Total completed</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Watch Time</span>
          </div>
          <div className="text-2xl font-black text-white">~{estimatedHours}h</div>
          <div className="text-[11px] text-zinc-500">Hours enjoyed</div>
        </div>
      </div>

      {/* Account Details & Server Status */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>Active Streaming Configurations</span>
        </h3>

        <div className="divide-y divide-white/5 text-xs text-zinc-300 space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-zinc-400">Configured Primary Server</span>
            <span className="font-semibold text-rose-400 capitalize">
              {preferences.preferredStreamServer}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-zinc-400">Metadata Catalog Provider</span>
            <span className="font-semibold text-emerald-400">TMDB Live Sync (v3 API)</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-zinc-400">Theme Preference</span>
            <span className="font-semibold capitalize text-zinc-200">{preferences.theme}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-zinc-400">Autoplay Next Episode</span>
            <span className="font-semibold text-zinc-200">
              {preferences.autoplayNextEpisode ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
