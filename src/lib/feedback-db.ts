import fs from "fs";
import path from "path";

export interface FeedbackItem {
  id: string;
  author: string;
  message: string;
  avatarEmoji: string;
  createdAt: string;
}

export interface SupportData {
  loveCount: number;
  feedbacks: FeedbackItem[];
}

export const PERMANENT_BASE_LOVE_COUNT = 345;

export const PERMANENT_BASE_FEEDBACKS: FeedbackItem[] = [
  {
    id: "fb-perm-1",
    author: "Test test",
    message: "Test test",
    avatarEmoji: "❤️",
    createdAt: "2026-10-23T14:40:00.000Z",
  },
  {
    id: "fb-perm-2",
    author: "Cebu Anime Lover",
    message: "This website is awesome, no lag at all!",
    avatarEmoji: "🔥",
    createdAt: "2026-10-23T14:24:15.590Z",
  },
  {
    id: "fb-perm-3",
    author: "Anonymous Binge Watcher",
    message: "Hands down the cleanest streaming site. Zero annoying popups, smooth buffer, and 4K quality is insane!",
    avatarEmoji: "🍿",
    createdAt: "2026-10-23T13:38:39.361Z",
  },
  {
    id: "fb-perm-4",
    author: "Anime Fanatic PH",
    message: "The new Anime page is incredible! Original Japanese audio with subs works like a charm. Salamat boss!",
    avatarEmoji: "✨",
    createdAt: "2026-10-23T11:23:39.363Z",
  },
  {
    id: "fb-perm-5",
    author: "Cebuano VIP",
    message: "Sent GCash tip for coffee boss! Tigbason ta ani hahaha. Solid kaayo ang StreamFlix!",
    avatarEmoji: "☕",
    createdAt: "2026-10-23T02:23:39.363Z",
  },
  {
    id: "fb-perm-6",
    author: "Night Owl Viewer",
    message: "Screen cast to TV works effortlessly. Beautiful dark UI and lightning-fast search.",
    avatarEmoji: "🔥",
    createdAt: "2026-10-22T14:23:39.363Z",
  },
  {
    id: "fb-perm-7",
    author: "Cinema Buff",
    message: "Love the desktop hover metadata and zero clutter. Feels like a legit premium service.",
    avatarEmoji: "🎬",
    createdAt: "2026-10-21T14:23:39.363Z",
  },
];

// In-memory cache guaranteed to start with the permanent baseline
let memoryStore: SupportData = {
  loveCount: PERMANENT_BASE_LOVE_COUNT,
  feedbacks: [...PERMANENT_BASE_FEEDBACKS],
};
let isInitialized = false;

function getDataFilePath(): string {
  return path.join(process.cwd(), "data", "support-feedback.json");
}

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function mergeWithPermanentBase(loaded: Partial<SupportData>): SupportData {
  const loadedCount = typeof loaded.loveCount === "number" ? loaded.loveCount : 0;
  const finalCount = Math.max(PERMANENT_BASE_LOVE_COUNT, loadedCount);

  const existingFeedbacks = Array.isArray(loaded.feedbacks) ? loaded.feedbacks : [];
  const mergedFeedbacks = [...existingFeedbacks];

  // Guarantee all permanent feedbacks exist in the list
  for (const baseFb of PERMANENT_BASE_FEEDBACKS) {
    const alreadyExists = mergedFeedbacks.some(
      (f) => f.id === baseFb.id || (f.author === baseFb.author && f.message === baseFb.message)
    );
    if (!alreadyExists) {
      mergedFeedbacks.push(baseFb);
    }
  }

  return {
    loveCount: finalCount,
    feedbacks: mergedFeedbacks,
  };
}

function loadDatabase(): SupportData {
  try {
    const filePath = getDataFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      memoryStore = mergeWithPermanentBase(parsed);
      return memoryStore;
    } else {
      // First time initialization: write permanent baseline data
      ensureDirectoryExists(filePath);
      fs.writeFileSync(filePath, JSON.stringify(memoryStore, null, 2), "utf-8");
    }
  } catch (err) {
    // If filesystem is not available or read-only (e.g. Cloudflare Worker), fallback to memoryStore
    console.warn("Feedback DB filesystem warning (falling back to memory):", err);
  }
  return memoryStore;
}

function saveDatabase(data: SupportData): void {
  memoryStore = mergeWithPermanentBase(data);
  try {
    const filePath = getDataFilePath();
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (err) {
    console.warn("Feedback DB save warning (saved to in-memory store):", err);
  }
}

export const feedbackDb = {
  getSupportData(): SupportData {
    if (!isInitialized) {
      loadDatabase();
      isInitialized = true;
    }
    return memoryStore;
  },

  incrementLove(amount: number = 1): number {
    const data = this.getSupportData();
    data.loveCount = Math.max(PERMANENT_BASE_LOVE_COUNT, (data.loveCount || PERMANENT_BASE_LOVE_COUNT) + Math.max(1, amount));
    saveDatabase(data);
    return data.loveCount;
  },

  addFeedback(author: string, message: string, avatarEmoji?: string): FeedbackItem {
    const data = this.getSupportData();
    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      author: (author || "Anonymous Viewer").trim().slice(0, 40),
      message: (message || "").trim().slice(0, 300),
      avatarEmoji: avatarEmoji || "❤️",
      createdAt: new Date().toISOString(),
    };

    // Prepend new feedback so latest appears first
    data.feedbacks = [newFeedback, ...data.feedbacks.slice(0, 99)];
    saveDatabase(data);
    return newFeedback;
  },
};
