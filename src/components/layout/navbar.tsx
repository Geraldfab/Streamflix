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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

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
                      ? "bg-gradient-to-r from-zinc-950 via-zinc-800 to-purple-600"
                      : isScrolled
                        ? "bg-gradient-to-r from-white via-zinc-200 to-rose-400"
                        : "bg-gradient-to-r from-white via-zinc-100 to-rose-400"
                  )}>
                    StreamFlix
                  </span>
                  <span className={cn(
                    "text-[9px] tracking-widest uppercase font-bold -mt-1",
                    resolvedTheme === "light" ? "text-purple-600" : "text-rose-500"
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
                            ? "text-purple-700 font-bold bg-purple-50 shadow-sm border border-purple-100"
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
                          resolvedTheme === "light" ? "bg-purple-600" : "bg-rose-600"
                        )}>
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
                className={cn(
                  "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm",
                  resolvedTheme === "light"
                    ? "text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200"
                    : "text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30"
                )}
              >
                <Shuffle className={cn("w-3.5 h-3.5", resolvedTheme === "light" ? "text-purple-600" : "text-rose-400")} />
                <span>Surprise Me</span>
              </button>

              {/* Smart Search Trigger Button */}
              <button
                onClick={onOpenSearch}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all group",
                  resolvedTheme === "light"
                    ? "text-xs text-zinc-700 hover:text-zinc-950 bg-zinc-100/80 hover:bg-zinc-100 border border-zinc-200/90"
                    : isScrolled
                      ? "text-xs text-zinc-300 hover:text-white border-white/10 hover:bg-white/10 glass-panel"
                      : "text-xs text-zinc-200 hover:text-white border-white/20 hover:bg-white/10 glass-panel"
                )}
                aria-label="Search movies and series"
              >
                <Search className={cn("w-4 h-4 transition-colors", resolvedTheme === "light" ? "text-purple-600 group-hover:text-purple-700" : "text-zinc-400 group-hover:text-rose-400")} />
                <span className="hidden sm:inline">Search...</span>
                <kbd className={cn("hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded", resolvedTheme === "light" ? "bg-zinc-200 text-zinc-700" : "bg-white/10 text-zinc-300")}>
                  Ctrl+K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
                className={cn(
                  "p-2 rounded-xl transition-all hover:scale-105 active:scale-95",
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
                  <Moon className="w-4 h-4 text-purple-600" />
                )}
              </button>

              {/* Profile / Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                  className={cn(
                    "w-9 h-9 rounded-xl overflow-hidden border transition-all flex items-center justify-center font-bold text-xs shadow-md",
                    resolvedTheme === "light"
                      ? "bg-gradient-to-tr from-purple-700 to-indigo-900 text-white border-purple-200 hover:ring-2 hover:ring-purple-500/50"
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
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Bookmark className={cn("w-3.5 h-3.5", resolvedTheme === "light" ? "text-purple-600" : "text-rose-500")} />
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

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "md:hidden p-2 rounded-xl transition-colors",
                  resolvedTheme === "light"
                    ? "text-zinc-700 hover:text-zinc-950 bg-zinc-100/80 border border-zinc-200/90"
                    : isScrolled
                      ? "text-zinc-300 hover:text-white glass-panel"
                      : "text-zinc-200 hover:text-white glass-panel"
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
          <div className="md:hidden mt-3 px-4 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-b border-zinc-200 dark:border-white/10 animate-fade-in flex flex-col gap-2 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between",
                  pathname === link.href
                    ? resolvedTheme === "light"
                      ? "bg-purple-50 text-purple-700 font-bold border border-purple-100"
                      : "bg-rose-600/30 text-rose-300 font-semibold"
                    : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/5"
                )}
              >
                <span>{link.name}</span>
                {link.badge ? (
                  <span className={cn(
                    "px-2 py-0.5 text-xs text-white rounded-full font-bold",
                    resolvedTheme === "light" ? "bg-purple-600" : "bg-rose-600"
                  )}>
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

            {/* Mobile Support Dev Button */}
            <div className="pt-2 border-t border-zinc-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSupportModalOpen(true);
                }}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-amber-800 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 border border-amber-200 dark:border-amber-500/30 transition-all active:scale-98 shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Support StreamFlix Dev
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold">
                  ☕ Tip Jar
                </span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Support Dev Modal */}
      <SupportDevModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}
