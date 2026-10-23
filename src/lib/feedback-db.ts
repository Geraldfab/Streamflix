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
  loveCount: 0,
  feedbacks: [],
};

// In-memory cache to guarantee fast response and fallback in read-only edge runtimes
let memoryStore: SupportData = { loveCount: 0, feedbacks: [] };
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

  resetDatabase(): SupportData {
    memoryStore = { loveCount: 0, feedbacks: [] };
    saveDatabase(memoryStore);
    isInitialized = true;
    return memoryStore;
  },
};
