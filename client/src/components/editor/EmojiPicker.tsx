"use client";

import {
  CheckCircle,
  Clock,
  FileText,
  MessageCircle,
  Star,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  show: boolean;
  onSelect: (emoji: string) => void;
  close: () => void;
}

const EMOJI_CATEGORIES = {
  document: {
    name: "Document",
    icon: FileText,
    emojis: [
      "📝",
      "📄",
      "📋",
      "📊",
      "📈",
      "📉",
      "📑",
      "📃",
      "📜",
      "📰",
      "📚",
      "📖",
      "📕",
      "📗",
      "📘",
      "📙",
      "📓",
      "📔",
      "📒",
      "📇",
      "✏️",
      "✒️",
      "🖊️",
      "🖋️",
      "📝",
      "📏",
      "📐",
      "📌",
      "📍",
      "📎",
    ],
  },
  communication: {
    name: "Communication",
    icon: MessageCircle,
    emojis: [
      "💬",
      "💭",
      "🗨️",
      "🗯️",
      "📢",
      "📣",
      "📯",
      "🔔",
      "🔕",
      "📞",
      "📱",
      "📧",
      "✉️",
      "📨",
      "📩",
      "📤",
      "📥",
      "📦",
      "📫",
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "👋",
      "🤝",
      "👏",
    ],
  },
  status: {
    name: "Status",
    icon: CheckCircle,
    emojis: [
      "✅",
      "❌",
      "✔️",
      "✖️",
      "⚠️",
      "🚨",
      "🔴",
      "🟡",
      "🟢",
      "🔵",
      "⭐",
      "🌟",
      "💫",
      "✨",
      "🔥",
      "💯",
      "🎯",
      "🏆",
      "🥇",
      "🥈",
      "❓",
      "❔",
      "❗",
      "❕",
      "‼️",
      "⁉️",
      "🔴",
      "🟠",
      "🟡",
      "🟢",
    ],
  },
  reactions: {
    name: "Reactions",
    icon: ThumbsUp,
    emojis: [
      "😊",
      "😄",
      "😃",
      "😁",
      "😆",
      "😂",
      "🤣",
      "😍",
      "🥰",
      "😘",
      "😉",
      "😎",
      "🤔",
      "😏",
      "😒",
      "😔",
      "😢",
      "😭",
      "😤",
      "😡",
      "🤯",
      "😱",
      "😨",
      "😰",
      "😴",
      "🤤",
      "😋",
      "🤢",
      "🤮",
      "😷",
    ],
  },
  time: {
    name: "Time",
    icon: Clock,
    emojis: [
      "⏰",
      "⏱️",
      "⏲️",
      "🕰️",
      "⌛",
      "⏳",
      "📅",
      "📆",
      "🗓️",
      "🕐",
      "🕑",
      "🕒",
      "🕓",
      "🕔",
      "🕕",
      "🕖",
      "🕗",
      "🕘",
      "🕙",
      "🕚",
      "🕛",
      "🌅",
      "🌄",
      "🌆",
      "🌇",
      "🌃",
      "🌌",
      "🌠",
      "🌙",
    ],
  },
  priority: {
    name: "Priority",
    icon: Star,
    emojis: [
      "🔴",
      "🟠",
      "🟡",
      "🟢",
      "🔵",
      "🟣",
      "⚫",
      "⚪",
      "🟤",
      "🔶",
      "🔷",
      "🔸",
      "🔹",
      "🔺",
      "🔻",
      "💎",
      "🏷️",
      "🏆",
      "🥇",
      "🥈",
      "🥉",
      "🎖️",
      "🏅",
      "🎗️",
      "🎀",
      "🎁",
      "🎊",
      "🎉",
    ],
  },
  arrows: {
    name: "Arrows",
    icon: Zap,
    emojis: [
      "⬆️",
      "⬇️",
      "⬅️",
      "➡️",
      "↗️",
      "↘️",
      "↙️",
      "↖️",
      "↕️",
      "↔️",
      "↩️",
      "↪️",
      "⤴️",
      "⤵️",
      "🔃",
      "🔄",
      "🔁",
      "🔂",
      "🔀",
      "🔁",
      "➡️",
      "⬅️",
      "⬆️",
      "⬇️",
      "↗️",
      "↘️",
      "↙️",
      "↖️",
      "↕️",
      "↔️",
    ],
  },
};

export const EmojiPicker = ({ show, onSelect, close }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof EMOJI_CATEGORIES>("document");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [show, close]);

  const currentEmojis = EMOJI_CATEGORIES[activeCategory].emojis;

  if (!show) return null;

  return (
    <div
      ref={ref}
      className="fixed bg-popover border border-border rounded-lg shadow-lg p-3 z-50 max-w-sm"
    >
      <div className="flex gap-1 mb-3 overflow-x-auto">
        {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => {
          const IconComponent = category.icon;
          return (
            <button
              key={key}
              onClick={() =>
                setActiveCategory(key as keyof typeof EMOJI_CATEGORIES)
              }
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                activeCategory === key
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/60 text-muted-foreground hover:text-accent-foreground"
              }`}
            >
              <IconComponent className="w-3 h-3" />
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
        {currentEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect(emoji);
              close();
            }}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground text-lg transition-colors"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
