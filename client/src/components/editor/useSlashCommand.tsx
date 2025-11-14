"use client";

import { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/react";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { BlockType } from "@/types/types";
import { toast } from "sonner";
import { EmojiPicker } from "./EmojiPicker";
import { SlashCommand } from "./SlashCommand";

interface SlashCommandOptions {
  position?: number;
  onAddBlock?: (
    position: number,
    type: BlockType,
    content?: Record<string, unknown>
  ) => Promise<void> | void;
  onToggleUploading?: (isUploading: boolean) => void;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export const useSlashCommand = (
  editor: Editor | null,
  { position, onAddBlock, onToggleUploading }: SlashCommandOptions = {}
) => {
  const [showSlash, setShowSlash] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!onAddBlock) {
        toast.error("You don't have permission to upload files.");
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error("File is too large. Maximum size is 25MB.");
        return;
      }

      try {
        onToggleUploading?.(true);
        const uploadResult = await uploadFileToCloudinary(file, {
          folder: "note_pro/files",
          tags: ["note_pro", "file"],
          resourceType: "auto",
        });

        await onAddBlock((position ?? 0) + 1, BlockType.FILE, {
          fileUrl: uploadResult.secure_url,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          publicId: uploadResult.public_id,
        });

        toast.success("File uploaded successfully");
      } catch (error) {
        console.error("Failed to upload file", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to upload file. Please try again.";
        toast.error(message);
      } finally {
        onToggleUploading?.(false);
      }
    },
    [onAddBlock, onToggleUploading, position]
  );

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      await handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const triggerFilePicker = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

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
        case "upload-file": {
          if (!onAddBlock) {
            toast.error("You don't have permission to upload files.");
            break;
          }
          triggerFilePicker();
          break;
        }
      }
      setShowSlash(false);
    },
    [editor, onAddBlock, triggerFilePicker]
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
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
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
    [
      showSlash,
      showEmoji,
      slashPos,
      emojiPos,
      onCommandSelect,
      onEmojiSelect,
      handleFileChange,
    ]
  );

  return { handleKeyDown, menus };
};
