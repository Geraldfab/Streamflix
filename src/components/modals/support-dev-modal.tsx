"use client";

import React, { useState } from "react";
import {
  X,
  Coffee,
  Heart,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Send,
  Zap,
} from "lucide-react";
import { useMedia } from "@/components/providers/media-context";

interface SupportDevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportDevModal({ isOpen, onClose }: SupportDevModalProps) {
  const { showToast } = useMedia();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cheerCount, setCheerCount] = useState(0);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string, key: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast(`${label} copied to clipboard!`, "success");
      setTimeout(() => {
        setCopiedKey(null);
      }, 2500);
    }
  };

  const handleCheer = () => {
    setCheerCount((prev) => prev + 1);
    showToast("Salamat sa gugma! ☕ Daghang salamat, boss!", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-white/10 shadow-2xl overflow-hidden animate-scale-up text-zinc-900 dark:text-white">
        {/* Top Decorative Gradient Scrim */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-amber-500/20 via-purple-500/15 to-transparent dark:from-amber-500/15 dark:via-rose-600/15 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          {/* Header Icon & Title */}
          <div className="text-center space-y-3">
            <div className="relative inline-flex items-center justify-center">
              {/* Glowing Pulse Halo */}
              <div className="absolute inset-0 rounded-3xl bg-amber-500/30 dark:bg-amber-400/20 blur-xl animate-pulse" />
              
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center transform transition-transform hover:rotate-6 hover:scale-105">
                <Coffee className="w-8 h-8 animate-bounce-slow" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 items-center justify-center text-[9px] font-bold text-white">
                    ❤
                  </span>
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Developer Tip Jar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                Support StreamFlix
              </h2>
            </div>

            {/* User Requested exact sub-text styled as quote */}
            <div className="p-3.5 rounded-2xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-center">
              <p className="text-xs sm:text-sm font-semibold italic text-zinc-700 dark:text-zinc-200">
                &ldquo;Pang kape lang boss. Tantadooo! Tigbason taka ron.&rdquo;
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Your support helps pay server upkeep, fast stream relays, and continuous site updates!
              </p>
            </div>
          </div>

          {/* Wallet Cards Section */}
          <div className="space-y-3 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Available Wallets</span>
            </p>

            {/* 1. GCash Card */}
            <div className="group relative p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-500/30 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-600/30 flex-shrink-0">
                    G
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-300">GCash</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                        Philippines
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-mono font-bold text-zinc-900 dark:text-white tracking-wider mt-0.5 select-all">
                      09151491270
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard("09151491270", "GCash Number", "gcash")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm ${
                    copiedKey === "gcash"
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                  }`}
                  aria-label="Copy GCash number"
                >
                  {copiedKey === "gcash" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. PayPal Card */}
            <div className="group relative p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/70 dark:from-sky-950/40 dark:to-indigo-950/30 border border-sky-200/80 dark:border-sky-500/30 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0079C1] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#0079C1]/30 flex-shrink-0">
                    P
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-900 dark:text-sky-300">PayPal</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-600/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                        International
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-white truncate mt-0.5 select-all">
                      geraldfabre282@gmail.com
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard("geraldfabre282@gmail.com", "PayPal Email", "paypal")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm flex-shrink-0 ${
                    copiedKey === "paypal"
                      ? "bg-emerald-600 text-white"
                      : "bg-[#0079C1] hover:bg-[#00609b] text-white hover:scale-105"
                  }`}
                  aria-label="Copy PayPal email"
                >
                  {copiedKey === "paypal" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Cheering Action & Close */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-zinc-200/80 dark:border-white/10">
            <button
              onClick={handleCheer}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Send Love {cheerCount > 0 ? `(${cheerCount})` : ""}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
