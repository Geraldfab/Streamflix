"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Coffee,
  Copy,
  Check,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import { useMedia } from "@/components/providers/media-context";

interface SupportDevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportDevModal({ isOpen, onClose }: SupportDevModalProps) {
  const { showToast } = useMedia();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showGcash, setShowGcash] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, label: string, key: string) => {
    try {
      if (typeof window !== "undefined" && navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        showToast(`${label} copied to clipboard!`, "success");
        setTimeout(() => {
          setCopiedKey(null);
        }, 2200);
      } else {
        throw new Error("Clipboard unavailable");
      }
    } catch {
      showToast(`Please manually copy: ${text}`, "warning");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-white/10 shadow-2xl overflow-hidden animate-scale-up text-zinc-900 dark:text-white max-h-[92dvh] flex flex-col">
        {/* Top Decorative Gradient Scrim */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-amber-500/20 via-purple-500/15 to-transparent dark:from-amber-500/15 dark:via-rose-600/15 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10 overflow-y-auto">
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

            {/* Quotation card */}
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
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-600/30 shrink-0">
                    G
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                        GCash
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                        Philippines
                      </span>
                    </div>
                    {/* Number displayed hidden by default with reveal toggle */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm font-mono font-bold text-zinc-900 dark:text-white tracking-wider select-all">
                        {showGcash ? "09151491270" : "•••••••••••"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowGcash(!showGcash)}
                        className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                        title={showGcash ? "Hide number" : "Show number"}
                        aria-label={showGcash ? "Hide GCash number" : "Show GCash number"}
                      >
                        {showGcash ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard("09151491270", "GCash Number", "gcash")}
                  className={`h-10 px-4 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm shrink-0 flex items-center gap-1.5 ${
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
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#0079C1] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#0079C1]/30 shrink-0">
                    P
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-900 dark:text-sky-300">
                        PayPal
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-600/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                        International
                      </span>
                    </div>
                    {/* Gmail displayed hidden by default with reveal toggle */}
                    <div className="flex items-center gap-2 mt-0.5 min-w-0">
                      <p className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-white truncate select-all">
                        {showPaypal ? "geraldfabre282@gmail.com" : "•••••••••••••••••••••"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPaypal(!showPaypal)}
                        className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0 focus:outline-none"
                        title={showPaypal ? "Hide email" : "Show email"}
                        aria-label={showPaypal ? "Hide PayPal email" : "Show PayPal email"}
                      >
                        {showPaypal ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("geraldfabre282@gmail.com", "PayPal Email", "paypal")
                  }
                  className={`h-10 px-4 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm shrink-0 flex items-center gap-1.5 ${
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

          {/* Action Footer with Appropriate Button Sizing */}
          <div className="pt-2 flex items-center justify-end border-t border-zinc-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 transition-colors active:scale-95 shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
