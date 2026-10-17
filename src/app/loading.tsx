import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-rose-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 animate-pulse">
        Buffering Cinema Experience...
      </p>
    </div>
  );
}
