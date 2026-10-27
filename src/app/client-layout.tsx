"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MediaProvider } from "@/components/providers/media-context";
import { PlayerProvider } from "@/components/providers/player-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchOverlay } from "@/components/search/search-overlay";
import { QuickViewModal } from "@/components/media/quick-view-modal";
import { MiniPlayer } from "@/components/player/mini-player";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ThemeProvider>
      <MediaProvider>
        <PlayerProvider>
          <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-[#09090B] text-zinc-900 dark:text-[#FAFAFA] antialiased selection:bg-red-500/20 selection:text-red-900 dark:selection:bg-rose-500/30 dark:selection:text-rose-200">
            {/* Sticky Navigation */}
            <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

            {/* Main Page Content */}
            <main className="flex-1">{children}</main>

            {/* Global Search Overlay */}
            <SearchOverlay
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />

            {/* Global Quick Preview Modal */}
            <QuickViewModal />

            {/* Global Mini-Player */}
            <MiniPlayer />

            {/* Mobile Bottom Navigation */}
            <MobileNav onOpenSearch={() => setIsSearchOpen(true)} />

            {/* Cinematic Footer */}
            <Footer />
          </div>
        </PlayerProvider>
      </MediaProvider>
    </ThemeProvider>
  );
}
