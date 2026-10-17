"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Something went wrong
      </h2>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
        An unexpected error occurred while loading this view. You can reload this section or return to the main catalog.
      </p>

      <div className="pt-2">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
