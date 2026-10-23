"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Coffee,
  Heart,
  Copy,
  Check,
  Zap,
  MessageSquare,
  Send,
  Loader2,
  Smile,
  ShieldCheck,
} from "lucide-react";
import { useMedia } from "@/components/providers/media-context";
import { cn } from "@/lib/utils";
import type { FeedbackItem } from "@/lib/feedback-db";

interface SupportDevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_OPTIONS = ["🍿", "🔥", "❤️", "☕", "✨", "🎬", "😎", "🚀"];

function formatRelativeTime(isoDate: string): string {
  try {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDays = Math.floor(diffHour / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

export function SupportDevModal({ isOpen, onClose }: SupportDevModalProps) {
  const { showToast } = useMedia();
  const [activeTab, setActiveTab] = useState<"wallets" | "feedback">("wallets");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Love & Feedback State — Sourced strictly from actual user database records
  const [loveCount, setLoveCount] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isSendingLove, setIsSendingLove] = useState(false);
  const [hasCheered, setHasCheered] = useState(false);

  // Feedback form state
  const [authorName, setAuthorName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🍿");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Fetch real user data from database when modal opens
  const fetchSupportData = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        // Clear any old automated mock cache
        localStorage.removeItem("streamflix_support_permanent_v1");
        const localSaved = localStorage.getItem("streamflix_support_actual");
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved);
            if (typeof parsed.loveCount === "number") {
              setLoveCount(parsed.loveCount);
            }
          } catch {}
        }
      }

      const res = await fetch("/api/support");
      if (res.ok) {
        const data = await res.json();
        const count = typeof data.loveCount === "number" ? data.loveCount : 0;
        setLoveCount(count);
        if (Array.isArray(data.feedbacks)) setFeedbacks(data.feedbacks);

        if (typeof window !== "undefined") {
          localStorage.setItem("streamflix_support_actual", JSON.stringify({ loveCount: count }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch support data:", err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchSupportData();
    }
  }, [isOpen, fetchSupportData]);

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

  const handleSendLove = async () => {
    if (isSendingLove) return;

    // Optimistic update
    setLoveCount((prev) => {
      const next = prev + 1;
      if (typeof window !== "undefined") {
        localStorage.setItem("streamflix_support_actual", JSON.stringify({ loveCount: next }));
      }
      return next;
    });
    setHasCheered(true);
    setIsSendingLove(true);
    showToast("Salamat sa gugma! ☕ Daghang salamat, boss!", "info");

    try {
      const res = await fetch("/api/support/love", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.loveCount === "number") {
          setLoveCount(data.loveCount);
          if (typeof window !== "undefined") {
            localStorage.setItem("streamflix_support_actual", JSON.stringify({ loveCount: data.loveCount }));
          }
        }
      }
    } catch (err) {
      console.warn("Error incrementing love:", err);
    } finally {
      setIsSendingLove(false);
      setTimeout(() => setHasCheered(false), 1800);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMessage = messageText.trim();
    if (!cleanMessage) {
      showToast("Please enter a message before posting.", "warning");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const res = await fetch("/api/support/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: authorName.trim() || "Anonymous Viewer",
          message: cleanMessage,
          avatarEmoji: selectedEmoji,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
        } else if (data.feedback) {
          setFeedbacks((prev) => [data.feedback, ...prev]);
        }
        setMessageText("");
        setAuthorName("");
        showToast("Salamat! Your message is now visible to everyone.", "success");
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to post feedback.", "warning");
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      showToast("Something went wrong while posting your message.", "warning");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-dialog-title"
        className="relative z-10 w-full max-w-md rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800/90 shadow-2xl text-zinc-100 flex flex-col max-h-[min(90dvh,640px)] overflow-hidden"
      >
        {/* Subtle Top Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-rose-950/25 via-rose-950/5 to-transparent pointer-events-none" />

        {/* 1. COMPACT HEADER */}
        <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="support-dialog-title"
                className="text-base sm:text-lg font-bold tracking-tight text-white truncate"
              >
                Support StreamFlix
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
            aria-label="Close support dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* 2. SCROLLABLE CONTENT BODY */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 overscroll-contain">
          {/* Support Description Block */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/70 space-y-1">
            <p className="text-xs sm:text-sm font-semibold italic text-zinc-200 leading-snug">
              &ldquo;Pang kape lang boss. Tantadooo! Tigbason taka ron.&rdquo;
            </p>
            <p className="text-[11px] sm:text-xs text-zinc-400 leading-normal">
              Your support pays for server upkeep, fast stream relays, and continuous site updates!
            </p>
          </div>

          {/* 3. BALANCED TWO-OPTION NAVIGATION (TABS) */}
          <div
            role="tablist"
            className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-semibold gap-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "wallets"}
              onClick={() => setActiveTab("wallets")}
              className={cn(
                "h-9 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50",
                activeTab === "wallets"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              )}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Available Wallets</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "feedback"}
              onClick={() => setActiveTab("feedback")}
              className={cn(
                "h-9 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50",
                activeTab === "feedback"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              )}
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">Community Feedback</span>
              {feedbacks.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 shrink-0">
                  {feedbacks.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: AVAILABLE WALLETS */}
          {activeTab === "wallets" && (
            <div className="space-y-3 animate-fade-in">
              {/* GCash Card */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 transition-colors">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm shadow-blue-900/30">
                      G
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-200">GCash</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          PH
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide mt-0.5 select-all break-all">
                        09151491270
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard("09151491270", "GCash Number", "gcash")}
                    className={cn(
                      "h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                      copiedKey === "gcash"
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white border-zinc-700"
                    )}
                    aria-label="Copy GCash number"
                  >
                    {copiedKey === "gcash" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
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

              {/* PayPal Card */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 transition-colors">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-[#0079C1] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm shadow-[#0079C1]/30">
                      P
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-200">PayPal</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          Intl
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-mono font-bold text-white tracking-tight mt-0.5 select-all break-all">
                        geraldfabre282@gmail.com
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard("geraldfabre282@gmail.com", "PayPal Email", "paypal")
                    }
                    className={cn(
                      "h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50",
                      copiedKey === "paypal"
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white border-zinc-700"
                    )}
                    aria-label="Copy PayPal email"
                  >
                    {copiedKey === "paypal" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
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
          )}

          {/* TAB 2: COMMUNITY FEEDBACK */}
          {activeTab === "feedback" && (
            <div className="space-y-4 animate-fade-in">
              {/* Feedback Submission Form */}
              <form
                onSubmit={handleSubmitFeedback}
                className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Leave Anonymous Feedback</span>
                  </span>
                  <span className="text-[10px] font-normal text-zinc-500">
                    Public to all
                  </span>
                </div>

                {/* Nickname & Avatar Selection Row */}
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <select
                      value={selectedEmoji}
                      onChange={(e) => setSelectedEmoji(e.target.value)}
                      className="h-9 px-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500"
                      title="Select avatar emoji"
                    >
                      {EMOJI_OPTIONS.map((emoji) => (
                        <option key={emoji} value={emoji}>
                          {emoji}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Nickname (defaults to Anonymous)"
                    maxLength={35}
                    className="h-9 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500 flex-1 min-w-0"
                  />
                </div>

                {/* Feedback Message Textarea */}
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Drop a nice message, feedback, or review..."
                  maxLength={300}
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[10px] text-zinc-500">
                    {messageText.length}/300
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingFeedback || !messageText.trim()}
                    className="h-9 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
                  >
                    {isSubmittingFeedback ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Post Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Feed of Community Feedback Messages */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Recent Messages ({feedbacks.length})
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Live Community Feed
                  </span>
                </div>

                {feedbacks.length === 0 ? (
                  <div className="text-center py-6 px-4 rounded-xl bg-zinc-900/40 border border-dashed border-zinc-800 text-zinc-400 text-xs space-y-1">
                    <p className="font-semibold text-zinc-300">No feedback messages yet</p>
                    <p className="text-[11px] text-zinc-500">
                      Be the first to share your thoughts or send love to the dev!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 divide-y divide-zinc-800/60">
                    {feedbacks.map((item) => (
                      <div
                        key={item.id}
                        className="pt-2 first:pt-0 flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs shrink-0 border border-zinc-700/60">
                          {item.avatarEmoji || "❤️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-zinc-200 truncate">
                              {item.author}
                            </span>
                            <span className="text-[10px] text-zinc-500 shrink-0">
                              {formatRelativeTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed break-words">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. STANDARDIZED ACTION FOOTER */}
        <footer className="relative z-10 px-4 sm:px-6 py-3 border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between gap-2.5">
          {/* Send Love Button & Clean Counter Statistic */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={handleSendLove}
              disabled={isSendingLove}
              className={cn(
                "h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50",
                hasCheered
                  ? "bg-rose-600 text-white"
                  : "bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30"
              )}
              aria-label="Send love to developer"
            >
              <Heart
                className={cn(
                  "w-4 h-4 fill-rose-500 text-rose-500 transition-transform",
                  hasCheered && "scale-125 animate-ping"
                )}
              />
              <span>Send Love</span>
            </button>

            {/* Distinct Counter Statistic (NOT styled as a duplicate button) */}
            <div
              className="h-10 px-2.5 sm:px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs flex items-center gap-1.5 shrink-0"
              title="Total community love received"
            >
              <span className="text-rose-500 text-xs">❤️</span>
              <span className="font-mono font-bold text-white">
                {loveCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-400 hidden xs:inline sm:inline">
                Loves
              </span>
            </div>
          </div>

          {/* Secondary Action: Done Button */}
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
