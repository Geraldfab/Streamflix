"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Coffee,
  Heart,
  Copy,
  Check,
  Sparkles,
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

  // Love & Feedback State
  const [loveCount, setLoveCount] = useState<number>(342);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isSendingLove, setIsSendingLove] = useState(false);
  const [hasCheered, setHasCheered] = useState(false);

  // Feedback form state
  const [authorName, setAuthorName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🍿");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Fetch initial data from database when modal opens
  const fetchSupportData = useCallback(async () => {
    try {
      const res = await fetch("/api/support");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.loveCount === "number") setLoveCount(data.loveCount);
        if (Array.isArray(data.feedbacks)) setFeedbacks(data.feedbacks);
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

  const handleSendLove = async () => {
    // Optimistic update
    setLoveCount((prev) => prev + 1);
    setHasCheered(true);
    setIsSendingLove(true);
    showToast("Salamat sa gugma! ☕ Daghang salamat, boss!", "info");

    try {
      const res = await fetch("/api/support/love", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.loveCount === "number") {
          setLoveCount(data.loveCount);
        }
      }
    } catch (err) {
      console.warn("Error incrementing love:", err);
    } finally {
      setIsSendingLove(false);
      setTimeout(() => setHasCheered(false), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-white/10 shadow-2xl overflow-hidden animate-scale-up text-zinc-900 dark:text-white flex flex-col max-h-[92vh]">
        {/* Top Decorative Gradient Scrim */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-amber-500/20 via-purple-500/15 to-transparent dark:from-amber-500/15 dark:via-rose-600/15 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="p-5 sm:p-7 space-y-4 relative z-10 overflow-y-auto">
          {/* Header Icon & Title */}
          <div className="text-center space-y-2">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-amber-500/30 dark:bg-amber-400/20 blur-xl animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center transform transition-transform hover:rotate-6 hover:scale-105">
                <Coffee className="w-7 h-7 animate-bounce-slow" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 items-center justify-center text-[9px] font-bold text-white">
                    ❤
                  </span>
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Developer Tip Jar & Feedback</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                Support StreamFlix
              </h2>
            </div>

            {/* Sub-text quote */}
            <div className="p-3 rounded-2xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-center">
              <p className="text-xs sm:text-sm font-semibold italic text-zinc-700 dark:text-zinc-200">
                &ldquo;Pang kape lang boss. Tantadooo! Tigbason taka ron.&rdquo;
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Your support pays for server upkeep, fast stream relays, and continuous site updates!
              </p>
            </div>
          </div>

          {/* Tab Selector: Wallets vs Feedback */}
          <div className="flex rounded-2xl p-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("wallets")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all",
                activeTab === "wallets"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Available Wallets</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("feedback")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all",
                activeTab === "feedback"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
              <span>Community Feedback</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                {feedbacks.length}
              </span>
            </button>
          </div>

          {/* TAB 1: WALLETS */}
          {activeTab === "wallets" && (
            <div className="space-y-3 animate-fade-in">
              {/* GCash Card */}
              <div className="group relative p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-500/30 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-600/30 flex-shrink-0">
                      G
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                          GCash
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                          Philippines
                        </span>
                      </div>
                      <p className="text-sm font-mono font-bold text-zinc-900 dark:text-white tracking-wider select-all">
                        09151491270
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard("09151491270", "GCash Number", "gcash")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm ${
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

              {/* PayPal Card */}
              <div className="group relative p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/70 dark:from-sky-950/40 dark:to-indigo-950/30 border border-sky-200/80 dark:border-sky-500/30 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#0079C1] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#0079C1]/30 flex-shrink-0">
                      P
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-900 dark:text-sky-300">
                          PayPal
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-600/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                          International
                        </span>
                      </div>
                      <p className="text-xs font-mono font-bold text-zinc-900 dark:text-white truncate select-all">
                        geraldfabre282@gmail.com
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard("geraldfabre282@gmail.com", "PayPal Email", "paypal")
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm flex-shrink-0 ${
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

              {/* Feedback CTA Pill */}
              <button
                type="button"
                onClick={() => setActiveTab("feedback")}
                className="w-full py-2.5 px-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center justify-between transition-colors group text-left"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
                  <span>
                    See what <strong>{feedbacks.length} viewers</strong> said about StreamFlix
                  </span>
                </span>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  Read & Post →
                </span>
              </button>
            </div>
          )}

          {/* TAB 2: COMMUNITY FEEDBACK */}
          {activeTab === "feedback" && (
            <div className="space-y-4 animate-fade-in">
              {/* Post Feedback Form */}
              <form
                onSubmit={handleSubmitFeedback}
                className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-200">
                  <span className="flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-amber-500" />
                    <span>Leave Anonymous Feedback</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal">
                    Visible to all visitors
                  </span>
                </div>

                {/* Nickname & Avatar selection */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={selectedEmoji}
                      onChange={(e) => setSelectedEmoji(e.target.value)}
                      className="h-8 px-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/15 text-sm cursor-pointer shadow-sm focus:outline-none"
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
                    placeholder="Nickname (optional, defaults to Anonymous)"
                    maxLength={35}
                    className="flex-1 h-8 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/15 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Message input */}
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Drop a nice message, feedback, or review for the dev..."
                  maxLength={300}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/15 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">
                    {messageText.length}/300 characters
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingFeedback || !messageText.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                  >
                    {isSubmittingFeedback ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Post Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Feed of Community Feedback Messages */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Recent Messages ({feedbacks.length})
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Live Community Feed
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-zinc-100 dark:divide-white/5">
                  {feedbacks.length === 0 ? (
                    <div className="text-center py-6 text-zinc-400 text-xs">
                      No messages yet. Be the first to leave one!
                    </div>
                  ) : (
                    feedbacks.map((item) => (
                      <div
                        key={item.id}
                        className="pt-2.5 first:pt-0 flex items-start gap-2.5 group"
                      >
                        <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                          {item.avatarEmoji || "❤️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {item.author}
                            </span>
                            <span className="text-[10px] text-zinc-400 flex-shrink-0">
                              {formatRelativeTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5 leading-relaxed break-words">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Persistent Footer (Cheering Action & Live Love Counter) */}
        <div className="p-4 sm:p-5 bg-zinc-50/80 dark:bg-white/[0.03] border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between gap-3 relative z-20">
          {/* Send Love Button + Number beside the button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendLove}
              disabled={isSendingLove}
              className={cn(
                "relative flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95",
                hasCheered
                  ? "bg-rose-600 text-white scale-105"
                  : "bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 border border-rose-200 dark:border-rose-500/30"
              )}
              aria-label="Send love to developer"
            >
              <Heart
                className={cn(
                  "w-4 h-4 fill-rose-500 text-rose-500 transition-transform",
                  hasCheered ? "scale-125 animate-ping" : "group-hover:scale-110"
                )}
              />
              <span>Send Love</span>
            </button>

            {/* Live Love Counter displayed right beside the button */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-extrabold text-xs shadow-sm transition-all"
              title="Total people who sent love"
            >
              <span className="text-xs">❤️</span>
              <span>{loveCount.toLocaleString()} Loves</span>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200/80 hover:bg-zinc-300 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
