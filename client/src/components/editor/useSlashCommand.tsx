"use client";

import { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/react";
import { useCallback, useMemo, useState } from "react";
import { EmojiPicker } from "./EmojiPicker";
import { SlashCommand } from "./SlashCommand";

export const useSlashCommand = (editor: Editor | null) => {
  const [showSlash, setShowSlash] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });

  const onCommandSelect = useCallback(
    (cmd: string) => {
      if (!editor) return;
      switch (cmd) {
        case "emojis": {
          const { state } = editor.view;
          const coords = editor.view.coordsAtPos(state.selection.from);
          setEmojiPos({
            top: coords.bottom + window.scrollY,
            left: coords.left + window.scrollX,
          });
          setShowEmoji(true);
          break;
        }
      }
      setShowSlash(false);
    },
    [editor]
  );

  const onEmojiSelect = useCallback(
    (emoji: string) => {
      if (editor) editor.commands.insertContent(emoji);
      setShowEmoji(false);
    },
    [editor]
  );

  const handleKeyDown = useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      if (event.key === "/" && !event.shiftKey) {
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        const textBefore = $from.nodeBefore?.textContent || "";
        if (textBefore === "" || textBefore.endsWith(" ")) {
          const coords = view.coordsAtPos($from.pos);
          setSlashPos({
            top: coords.bottom + window.scrollY,
            left: coords.left + window.scrollX,
          });
          setShowSlash(true);
          return true;
        }
      }
      if ((showSlash || showEmoji) && event.key === "Escape") {
        setShowSlash(false);
        setShowEmoji(false);
        return true;
      }
      return false;
    },
    [showSlash, showEmoji]
  );

  const menus = useMemo(
    () => (
      <>
        {showSlash && (
          <SlashCommand
            show={showSlash}
            onSelect={onCommandSelect}
            close={() => setShowSlash(false)}
            position={slashPos}
          />
        )}
        {showEmoji && (
          <div
            className="fixed z-50"
            style={{ top: emojiPos.top, left: emojiPos.left }}
          >
            <EmojiPicker
              show={showEmoji}
              onSelect={onEmojiSelect}
              close={() => setShowEmoji(false)}
            />
          </div>
        )}
      </>
    ),
    [showSlash, showEmoji, slashPos, emojiPos, onCommandSelect, onEmojiSelect]
  );

  return { handleKeyDown, menus };
};
