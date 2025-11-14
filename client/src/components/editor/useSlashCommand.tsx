"use client";

import { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/react";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "@/hooks";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { EmojiPicker } from "./EmojiPicker";
import { SlashCommand } from "./SlashCommand";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "image/*",
].join(",");

const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getFileExtension = (name: string) =>
  name.split(".").pop()?.toUpperCase() || "FILE";

const buildFilePreviewHtml = ({
  name,
  url,
  extension,
  sizeLabel,
}: {
  name: string;
  url: string;
  extension: string;
  sizeLabel: string;
}) => {
  const safeName = escapeHtml(name);
  const safeExtension = escapeHtml(extension);
  const safeUrl = encodeURI(url);
  const safeMeta = escapeHtml(`${extension} Document • ${sizeLabel}`);

  return `
    <div
      class="np-file-block"
      data-file-url="${safeUrl}"
      data-file-name="${safeName}"
      role="button"
      tabindex="0"
      contenteditable="false"
    >
      <div class="np-file-icon" aria-hidden="true">
        <span class="np-file-icon-ext">${safeExtension}</span>
        <span class="np-file-icon-label">File</span>
      </div>
      <div class="np-file-body">
        <p class="np-file-name">${safeName}</p>
        <p class="np-file-info">${safeMeta}</p>
      </div>
      <div class="np-file-open" aria-hidden="true">Open ↗</div>
    </div>
  `.trim();
};

export const useSlashCommand = (editor: Editor | null) => {
  const [showSlash, setShowSlash] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  const [emojiPos, setEmojiPos] = useState({ top: 0, left: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File is too large",
          description: "Maximum upload size is 25MB",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      const uploadingToast = toast({
        title: "Uploading file...",
        description: file.name,
      });

      try {
        const uploadResponse = await uploadFileToCloudinary(file, {
          folder: "note_pro/files",
        });
        const url = uploadResponse.secure_url || uploadResponse.url;
        const extension = getFileExtension(file.name);
        const html = buildFilePreviewHtml({
          name: file.name,
          url,
          extension,
          sizeLabel: formatFileSize(file.size),
        });

        editor.chain().focus().insertContent(html).run();

        uploadingToast.dismiss();
        toast({
          title: "File uploaded",
          description: file.name,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        uploadingToast.dismiss();
        toast({
          title: "Upload failed",
          description:
            error instanceof Error
              ? error.message
              : "Please try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [editor]
  );

  const handleFileInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
      event.target.value = "";
    },
    [handleFileUpload]
  );

  const handleFileSelection = useCallback(() => {
    if (isUploading) {
      toast({
        title: "Upload in progress",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, [isUploading]);

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
          handleFileSelection();
          break;
        }
      }
      setShowSlash(false);
    },
    [editor, handleFileSelection]
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

  useEffect(() => {
    if (!editor) return;

    const openPreview = (source: HTMLElement | null) => {
      if (!source) return;
      const block = source.closest<HTMLDivElement>(".np-file-block");
      if (!block) return;
      const fileUrl = block.dataset.fileUrl;
      if (!fileUrl) return;
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    };

    const handleDoubleClick = (event: MouseEvent) => {
      openPreview(event.target as HTMLElement | null);
    };

    const handleKeyDownOnBlock = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const block = target.closest<HTMLDivElement>(".np-file-block");
      if (!block) return;

      event.preventDefault();
      openPreview(block);
    };

    const dom = editor.view.dom;
    dom.addEventListener("dblclick", handleDoubleClick);
    dom.addEventListener("keydown", handleKeyDownOnBlock);

    return () => {
      dom.removeEventListener("dblclick", handleDoubleClick);
      dom.removeEventListener("keydown", handleKeyDownOnBlock);
    };
  }, [editor]);

  const menus = useMemo(
    () => (
      <>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleFileInputChange}
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
      handleFileInputChange,
    ]
  );

  return { handleKeyDown, menus };
};
