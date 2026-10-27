"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  Tv,
  Sparkles,
  Search,
  Sun,
  Moon,
  Bookmark,
  Clock,
  Settings,
  ChevronDown,
  Shuffle,
  Play,
  Coffee,
  Heart,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useMedia } from "@/components/providers/media-context";
import { GENRES_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SupportDevModal } from "@/components/modals/support-dev-modal";

interface NavbarProps {
  onOpenSearch: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { watchlist, getRandomTitle, openQuickView } = useMedia();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const genreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsGenreOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Click outside and Escape key handling for dropdowns
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) {
        setIsGenreOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGenreOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: Array<{
    name: string;
    href: string;
    badge?: number | string | null;
  }> = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Series", href: "/series" },
    { name: "Anime", href: "/anime" },
    { name: "Continue Watching", href: "/continue-watching" },
  ];

  const handleSurpriseMe = () => {
    setIsRolling(true);
    setTimeout(() => setIsRolling(false), 650);
    const title = getRandomTitle();
    if (title) openQuickView(title);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 transform-gpu",
          resolvedTheme === "light"
            ? "bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-sm shadow-zinc-950/5 py-3"
            : isScrolled
              ? "glass-panel shadow-lg shadow-black/20 py-3"
              : "bg-gradient-to-b from-black/85 via-black/40 to-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Brand Logo & Navigation Links */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="relative w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/logo.png"
                    alt="StreamFlix"
                    width={36}
                    height={36}
                    priority
                    className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(229,9,20,0.55)]"
                  />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-xl font-black tracking-tight bg-clip-text text-transparent",
                    resolvedTheme === "light"
                      ? "bg-gradient-to-r from-zinc-950 via-zinc-800 to-red-600"
                      : isScrolled
                        ? "bg-gradient-to-r from-white via-zinc-200 to-rose-400"
                        : "bg-gradient-to-r from-white via-zinc-100 to-rose-400"
                  )}>
                    StreamFlix
                  </span>
                  <span className={cn(
                    "text-[9px] tracking-widest uppercase font-bold -mt-1",
                    resolvedTheme === "light" ? "text-red-600" : "text-rose-500"
                  )}>
                    Cinema Studio
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "relative px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-1.5",
                        isActive
                          ? resolvedTheme === "light"
                            ? "text-red-700 font-bold bg-red-50 shadow-sm border border-red-100"
                            : "text-white bg-white/10 shadow-sm font-semibold"
                          : resolvedTheme === "light"
                            ? "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80"
                            : isScrolled
                              ? "text-zinc-300 hover:text-white hover:bg-white/10"
                              : "text-zinc-200 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.name}
                      {link.badge ? (
                        <span className={cn(
                          "px-1.5 py-0.2 text-[10px] font-bold text-white rounded-full",
                          resolvedTheme === "light" ? "bg-red-600" : "bg-rose-600"
                        )}>
                          {link.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}

                {/* Genres Dropdown */}
                <div ref={genreRef} className="relative">
                  <button
                    onClick={() => setIsGenreOpen(!isGenreOpen)}

                    className={cn(
                      "px-3 py-1.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1",
                      resolvedTheme === "light"
                        ? "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80"
                        : isScrolled
                          ? "text-zinc-300 hover:text-white hover:bg-white/10"
                          : "text-zinc-200 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <span>Genres</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        isGenreOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isGenreOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-white/10 grid grid-cols-2 gap-1 animate-scale-up z-50">
                      {GENRES_LIST.slice(0, 12).map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/genre/${genre.slug || genre.name.toLowerCase()}`}
                          onClick={() => setIsGenreOpen(false)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* 1. Smart Search Trigger Button */}
              <button
                onClick={onOpenSearch}
                className={cn(
                  "w-9 sm:w-auto h-9 flex items-center justify-center sm:justify-start sm:gap-2 px-0 sm:px-3 rounded-xl transition-all group",
                  resolvedTheme === "light"
                    ? "text-xs text-zinc-700 hover:text-zinc-950 bg-zinc-100/80 hover:bg-zinc-100 border border-zinc-200/90 shadow-sm"
                    : isScrolled
                      ? "text-xs text-zinc-300 hover:text-white border-white/10 hover:bg-white/10 glass-panel"
                      : "text-xs text-zinc-200 hover:text-white border-white/20 hover:bg-white/10 glass-panel"
                )}
                aria-label="Search movies and series"
              >
                <Search className={cn("w-4 h-4 transition-colors", resolvedTheme === "light" ? "text-red-600 group-hover:text-red-700" : "text-zinc-400 group-hover:text-rose-400")} />
                <span className="hidden sm:inline">Search...</span>
                <kbd className={cn("hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded", resolvedTheme === "light" ? "bg-zinc-200 text-zinc-700" : "bg-white/10 text-zinc-300")}>
                  Ctrl+K
                </kbd>
              </button>

              {/* 2. Surprise Me / Random Title (Now fully visible in mobile & desktop) */}
              <button
                onClick={handleSurpriseMe}
                title="Surprise Me (Random title)"
                aria-label="Surprise Me (Random title)"
                className={cn(
                  "flex relative group items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm",
                  resolvedTheme === "light"
                    ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/90 border border-red-200/90 hover:border-red-300 shadow-sm shadow-red-500/5 hover:shadow-red-500/15"
                    : isScrolled
                      ? "text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 glass-panel"
                      : "text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 glass-panel"
                )}
              >
                <Shuffle
                  className={cn(
                    "w-4 h-4 transition-transform duration-500 ease-out",
                    isRolling
                      ? "rotate-[360deg] scale-110 text-red-700 dark:text-rose-300"
                      : "group-hover:rotate-45 group-hover:scale-110"
                  )}
                />
              </button>

              {/* 3. Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95",
                  resolvedTheme === "light"
                    ? "text-zinc-700 hover:text-zinc-950 bg-zinc-100/80 hover:bg-zinc-100 border border-zinc-200/90 shadow-sm"
                    : isScrolled
                      ? "text-zinc-300 hover:text-white border-white/10 hover:bg-white/10 glass-panel"
                      : "text-zinc-200 hover:text-white border-white/20 hover:bg-white/10 glass-panel"
                )}
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
                ) : (
                  <Moon className="w-4 h-4 text-red-600" />
                )}
              </button>

              {/* 4. Profile / Account Dropdown (Terminal anchor at far right) */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    "w-9 h-9 rounded-xl overflow-hidden border transition-all flex items-center justify-center font-bold text-xs shadow-md",
                    resolvedTheme === "light"
                      ? "bg-gradient-to-tr from-red-600 via-rose-700 to-red-800 text-white border-red-200 hover:ring-2 hover:ring-red-500/50"
                      : "bg-gradient-to-tr from-rose-950 via-zinc-900 to-red-900 text-white border-white/20 hover:ring-2 hover:ring-rose-500/50"
                  )}
                  aria-label="User Account"
                >
                  SF
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-white/10 animate-scale-up z-50">
                    <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/10">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">VIP Guest</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">StreamFlix Premium 4K</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/my-list"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Bookmark className={cn("w-3.5 h-3.5", resolvedTheme === "light" ? "text-red-600" : "text-rose-500")} />
                        <span>My List ({watchlist.length})</span>
                      </Link>
                      <Link
                        href="/continue-watching"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>Continue Watching</span>
                      </Link>
                      <Link
                        href="/history"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Film className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Watch History</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-amber-500" />
                        <span>Settings & Servers</span>
                      </Link>

                      {/* Support Dev Option */}
                      <div className="pt-1 mt-1 border-t border-zinc-200 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsSupportModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-500/10 rounded-lg transition-colors group text-left"
                        >
                          <Coffee className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                          <span>Support Dev</span>
                          <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            ☕ Tip
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Support Dev Modal */}
      <SupportDevModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}
