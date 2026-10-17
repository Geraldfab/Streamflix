import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Film, ShieldCheck, Sparkles } from "lucide-react";
import { GENRES_LIST } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200/50 dark:border-white/5 bg-zinc-100/50 dark:bg-black/40 backdrop-blur-md pt-12 pb-24 md:pb-12 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 relative flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="StreamFlix"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]"
                />
              </div>
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                StreamFlix
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              A minimalist, cinematic streaming platform engineered for movie lovers and television enthusiasts. Fluid animations, adaptive multi-server streams, and distraction-free viewing.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>TMDB Verified Metadata</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3">
              Explore Catalog
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-purple-600 dark:hover:text-rose-500 transition-colors">
                  Featured & Trending
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-purple-600 dark:hover:text-rose-500 transition-colors">
                  All Movies
                </Link>
              </li>
              <li>
                <Link href="/series" className="hover:text-purple-600 dark:hover:text-rose-500 transition-colors">
                  TV Series Catalog
                </Link>
              </li>
              <li>
                <Link href="/my-list" className="hover:text-purple-600 dark:hover:text-rose-500 transition-colors">
                  My Watchlist
                </Link>
              </li>
              <li>
                <Link href="/continue-watching" className="hover:text-purple-600 dark:hover:text-rose-500 transition-colors">
                  Continue Watching
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Genres */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3">
              Popular Genres
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {GENRES_LIST.slice(0, 8).map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.slug}`}
                  className="hover:text-purple-600 dark:hover:text-rose-500 transition-colors truncate"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Preferences & Tech */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/settings" className="hover:text-purple-600 dark:hover:text-rose-500 transition-colors">
                  Playback & Server Settings
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-purple-600 dark:hover:text-rose-500 transition-colors">
                  Watch History Management
                </Link>
              </li>
              <li>
                <span className="text-zinc-400 dark:text-zinc-500">
                  Adaptive Bitrate HLS.js 4K
                </span>
              </li>
              <li>
                <span className="text-zinc-400 dark:text-zinc-500">
                  Glassmorphism Design System
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} StreamFlix Cinema Studio. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-zinc-500">
            <a
              href="mailto:geraldfabre282@gmail.com?subject=StreamFlix%20Feedback"
              className="text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors underline-offset-2 hover:underline"
              title="Send feedback or feature request to developer"
            >
              Vibecoded by Fabs • Send Feedback
            </a>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
            <p className="flex items-center gap-1.5">
              Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for cinematic excellence.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
