import React from "react";
import { MediaItem } from "@/types/media";
import { MediaCard } from "./media-card";
import { Film } from "lucide-react";

interface MediaGridProps {
  items: MediaItem[];
  emptyMessage?: string;
  emptySubtext?: string;
}

export function MediaGrid({
  items,
  emptyMessage = "No titles found matching your criteria",
  emptySubtext = "Try adjusting your filters or search terms to discover more content.",
}: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-zinc-900/60 rounded-3xl p-8 border border-zinc-200/80 dark:border-white/10 shadow-sm my-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-rose-600/10 border border-purple-200 dark:border-rose-500/20 flex items-center justify-center text-purple-600 dark:text-rose-400">
          <Film className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {emptyMessage}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
            {emptySubtext}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
