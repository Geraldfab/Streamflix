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

const INITIAL_SUPPORT_DATA: SupportData = {
  loveCount: 342,
  feedbacks: [
    {
      id: "seed-1",
      author: "Anonymous Binge Watcher",
      message: "Hands down the cleanest streaming site. Zero annoying popups, smooth buffer, and 4K quality is insane!",
      avatarEmoji: "🍿",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    },
    {
      id: "seed-2",
      author: "Anime Fanatic PH",
      message: "The new Anime page is incredible! Original Japanese audio with subs works like a charm. Salamat boss!",
      avatarEmoji: "✨",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
    },
    {
      id: "seed-3",
      author: "Cebuano VIP",
      message: "Sent GCash tip for coffee boss! Tigbason ta ani hahaha. Solid kaayo ang StreamFlix!",
      avatarEmoji: "☕",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12h ago
    },
    {
      id: "seed-4",
      author: "Night Owl Viewer",
      message: "Screen cast to TV works effortlessly. Beautiful dark UI and lightning-fast search.",
      avatarEmoji: "🔥",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: "seed-5",
      author: "Cinema Buff",
      message: "Love the desktop hover metadata and zero clutter. Feels like a legit premium service.",
      avatarEmoji: "🎬",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
  ],
};

// In-memory cache to guarantee fast response and fallback in read-only edge runtimes
let memoryStore: SupportData = { ...INITIAL_SUPPORT_DATA };
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

function loadDatabase(): SupportData {
  try {
    const filePath = getDataFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.loveCount === "number" && Array.isArray(parsed.feedbacks)) {
        memoryStore = parsed;
        return memoryStore;
      }
    } else {
      // First time initialization: write initial data
      ensureDirectoryExists(filePath);
      fs.writeFileSync(filePath, JSON.stringify(memoryStore, null, 2), "utf-8");
    }
  } catch (err) {
    // If filesystem is not available or read-only (e.g. edge worker), silently fallback to memoryStore
    console.warn("Feedback DB filesystem warning (falling back to memory):", err);
  }
  return memoryStore;
}

function saveDatabase(data: SupportData): void {
  memoryStore = data;
  try {
    const filePath = getDataFilePath();
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
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
    data.loveCount = (data.loveCount || 0) + Math.max(1, amount);
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
