import { useMemo, MutableRefObject } from "react";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { CustomCode } from "@/lib/customCodeTiptap";
import { EnterHandler } from "@/lib/enterHandler";
import { PasteHandler } from "@/lib/pasteHandler";
import { BlockType } from "@/types/types";

interface UseEditorConfigProps {
  editable: boolean;
  position: number;
  onChangeRef: MutableRefObject<(value: string) => void>;
  onFocusRef: MutableRefObject<(() => void) | undefined>;
  onBlurRef: MutableRefObject<(() => void) | undefined>;
  onSaveImmediateRef: MutableRefObject<(() => void) | undefined>;
  onAddBlockRef: MutableRefObject<
    | ((
        position: number,
        type: BlockType,
        content?: Record<string, unknown>
      ) => void)
    | undefined
  >;
  prevValueRef: MutableRefObject<string>;
}

export function useEditorConfig({
  editable,
  position,
  onChangeRef,
  onFocusRef,
  onBlurRef,
  onSaveImmediateRef,
  onAddBlockRef,
  prevValueRef,
}: UseEditorConfigProps) {
  return useMemo(
    () => ({
      extensions: [
        StarterKit.configure({
          code: false,
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        CustomCode,
        Underline,
        Highlight.configure({
          multicolor: true,
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        }),
        EnterHandler.configure({
          onAddBlock: onAddBlockRef.current,
          position,
        }),
        PasteHandler,
      ],
      immediatelyRender: false,
      editable,
      onFocus: () => onFocusRef.current?.(),
      onBlur: () => {
        if (onBlurRef.current) {
          onBlurRef.current();
        }
        if (onSaveImmediateRef.current) {
          onSaveImmediateRef.current();
        }
      },
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();
        if (content !== prevValueRef.current) {
          prevValueRef.current = content;
          onChangeRef.current(content);
        }
      },
    }),
    [
      editable,
      position,
      onChangeRef,
      onFocusRef,
      onBlurRef,
      onSaveImmediateRef,
      onAddBlockRef,
      prevValueRef,
    ]
  );
}
