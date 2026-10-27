"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onOpenSearch: () => void;
}

export function MobileNav({ onOpenSearch }: MobileNavProps) {
  const pathname = usePathname();

  const items: Array<{
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number | string | null;
  }> = [
    { label: "Home", href: "/", icon: Home },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "Series", href: "/series", icon: Tv },
    { label: "Anime", href: "/anime", icon: Sparkles },
  ];

  // Do not render bottom navigation on the watch page to give full screen to video player controls
  if (pathname.startsWith("/watch")) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 transform-gpu px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200/80 dark:border-white/10 shadow-lg pointer-events-auto touch-manipulation">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] justify-center active:scale-95",
                isActive
                  ? "text-rose-600 dark:text-rose-500 font-bold"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-bold bg-rose-600 text-white rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-rose-600 dark:bg-rose-500 shadow-sm shadow-rose-600 dark:shadow-rose-500" />
              )}
            </Link>
          );
        })}

        {/* Mobile Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center py-1.5 px-3 rounded-xl text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 min-h-[44px] min-w-[44px] justify-center active:scale-95"
          aria-label="Open search"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>
      </div>
    </nav>
  );
}
