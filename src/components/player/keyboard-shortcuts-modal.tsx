"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { KEYBOARD_SHORTCUTS } from "@/lib/constants";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Controls" size="md">
      <div className="space-y-4">
        <p className="text-xs text-zinc-400">
          Use these quick keyboard shortcuts to control playback smoothly without touching your mouse or trackpad.
        </p>

        <div className="divide-y divide-white/10 rounded-2xl border border-white/10 overflow-hidden bg-black/20">
          {KEYBOARD_SHORTCUTS.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 text-xs"
            >
              <span className="text-zinc-300">{item.description}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 font-mono text-[11px] text-rose-300 font-semibold shadow-inner">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}
