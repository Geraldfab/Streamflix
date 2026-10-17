import React from "react";
import Link from "next/link";
import { Film, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
        <Film className="w-10 h-10" />
      </div>

      <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400 mb-2">
        Error 404
      </span>

      <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
        Lost in the Multiverse
      </h1>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
        The cinematic title or page you are searching for does not exist or has been shifted to another timeline.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/movies"
          className="px-6 py-3 rounded-2xl glass-panel hover:bg-white/10 text-zinc-300 font-semibold text-xs tracking-wider uppercase border border-white/10 transition-colors"
        >
          <span>Browse Catalog</span>
        </Link>
      </div>
    </div>
  );
}
