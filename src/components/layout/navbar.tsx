"use client";

import React, { useState, useEffect } from "react";
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
  Menu,
  X,
  Play,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useMedia } from "@/components/providers/media-context";
import { GENRES_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Series", href: "/series" },
    { name: "My List", href: "/my-list", badge: watchlist.length > 0 ? watchlist.length : null },
    { name: "Continue Watching", href: "/continue-watching" },
  ];

  const handleSurpriseMe = () => {
    const title = getRandomTitle();
    if (title) openQuickView(title);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "glass-panel shadow-lg shadow-black/10 py-3"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4"
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
                    "text-xl font-bold tracking-tight bg-clip-text text-transparent",
                    isScrolled
                      ? "bg-gradient-to-r from-zinc-950 via-zinc-800 to-rose-600 dark:from-white dark:via-zinc-200 dark:to-rose-400"
                      : "bg-gradient-to-r from-white via-zinc-100 to-rose-400"
                  )}>
                    StreamFlix
                  </span>
                  <span className="text-[9px] tracking-widest uppercase font-semibold text-rose-500 -mt-1">
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
                        "relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5",
                        isActive
                          ? "text-rose-600 dark:text-white bg-rose-500/10 dark:bg-white/10 shadow-sm font-semibold"
                          : isScrolled
                            ? "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/5"
                            : "text-zinc-200 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {link.name}
                      {link.badge ? (
                        <span className="px-1.5 py-0.2 text-[10px] font-bold bg-rose-600 text-white rounded-full">
                          {link.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}

                {/* Genres Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsGenreOpen(!isGenreOpen)}
                    onBlur={() => setTimeout(() => setIsGenreOpen(false), 200)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                      isScrolled
                        ? "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/5"
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
                    <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl glass-panel-elevated shadow-2xl border border-zinc-200 dark:border-white/10 grid grid-cols-2 gap-1 animate-scale-up z-50">
                      {GENRES_LIST.slice(0, 12).map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/genre/${genre.slug || genre.name.toLowerCase()}`}
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
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Surprise Me / Random Title */}
              <button
                onClick={handleSurpriseMe}
                title="Surprise Me (Random title)"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <Shuffle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span>Surprise Me</span>
              </button>

              {/* Smart Search Trigger Button */}
              <button
                onClick={onOpenSearch}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel transition-all group",
                  isScrolled
                    ? "text-xs text-zinc-700 hover:text-zinc-950 border-zinc-200/80 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:text-white dark:border-white/10 dark:hover:bg-white/10"
                    : "text-xs text-zinc-200 hover:text-white border-white/20 hover:bg-white/10"
                )}
                aria-label="Search movies and series"
              >
                <Search className={cn("w-4 h-4 transition-colors group-hover:text-rose-500", isScrolled ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-300")} />
                <span className="hidden sm:inline">Search...</span>
                <kbd className={cn("hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded", isScrolled ? "bg-zinc-200/80 text-zinc-600 dark:bg-white/10 dark:text-zinc-400" : "bg-white/10 text-zinc-300")}>
                  Ctrl+K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
                className={cn(
                  "p-2 rounded-xl glass-panel transition-all hover:scale-105 active:scale-95",
                  isScrolled
                    ? "text-zinc-700 hover:text-zinc-950 border-zinc-200/80 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:text-white dark:border-white/10 dark:hover:bg-white/10"
                    : "text-zinc-200 hover:text-white border-white/20 hover:bg-white/10"
                )}
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
                ) : (
                  <Moon className="w-4 h-4 text-rose-600" />
                )}
              </button>

              {/* Profile / Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                  className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 glass-panel hover:ring-2 hover:ring-rose-500/50 transition-all flex items-center justify-center bg-gradient-to-tr from-rose-950 via-zinc-900 to-red-900 text-white font-semibold text-xs shadow-md"
                  aria-label="User Account"
                >
                  SF
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl glass-panel-elevated shadow-2xl border border-zinc-200 dark:border-white/10 animate-scale-up z-50">
                    <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/10">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">VIP Guest</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">StreamFlix Premium 4K</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/my-list"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-rose-500" />
                        <span>My List ({watchlist.length})</span>
                      </Link>
                      <Link
                        href="/continue-watching"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>Continue Watching</span>
                      </Link>
                      <Link
                        href="/history"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Film className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Watch History</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-amber-500" />
                        <span>Settings & Servers</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "md:hidden p-2 rounded-xl glass-panel transition-colors",
                  isScrolled
                    ? "text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                    : "text-zinc-200 hover:text-white"
                )}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 px-4 py-3 glass-panel-elevated border-t border-b border-zinc-200 dark:border-white/10 animate-fade-in flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between",
                  pathname === link.href
                    ? "bg-rose-500/10 text-rose-600 dark:bg-rose-600/30 dark:text-rose-300 font-semibold"
                    : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/5"
                )}
              >
                <span>{link.name}</span>
                {link.badge ? (
                  <span className="px-2 py-0.5 text-xs bg-rose-600 text-white rounded-full">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            ))}
            <div className="pt-2 border-t border-zinc-200 dark:border-white/10 grid grid-cols-3 gap-1">
              {GENRES_LIST.slice(0, 6).map((g) => (
                <Link
                  key={g.id}
                  href={`/genre/${g.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1 text-center text-xs rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-white transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
