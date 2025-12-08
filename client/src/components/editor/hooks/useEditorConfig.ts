import { CustomCode } from "@/lib/customCodeTiptap";
import { EnterHandler } from "@/lib/enterHandler";
import { PasteHandler } from "@/lib/pasteHandler";
import { PerformanceOptimizer } from "@/lib/performanceOptimizer";
import { BlockType } from "@/types/types";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MutableRefObject, useMemo, useRef } from "react";
import { Markdown } from "tiptap-markdown";

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
  const isComposingRef = useRef(false);
  
  return useMemo(
    () => ({
      extensions: [
        StarterKit.configure({
          code: false,
          // Enable markdown input transformations
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
          blockquote: {
            HTMLAttributes: {
              class: 'border-l-4 border-gray-300 pl-4 italic',
            },
          },
          codeBlock: {
            HTMLAttributes: {
              class: 'bg-gray-100 rounded p-2 font-mono text-sm',
            },
          },
        }),
        Markdown.configure({
          html: true,                 // Allow HTML in markdown
          tightLists: true,           // Tight list spacing
          tightListClass: 'tight',    // Class for tight lists
          bulletListMarker: '-',      // Bullet list marker
          linkify: true,              // Auto-convert URLs to links
          breaks: false,              // Don't convert \n to <br>
          transformPastedText: true,  // Transform pasted markdown
          transformCopiedText: true,  // Transform copied markdown
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
        Typography,
        CharacterCount.configure({
          limit: null,
        }),
        EnterHandler.configure({
          onAddBlock: onAddBlockRef.current,
          position,
          onFlush: () => {
            // Flush pending changes immediately when Enter is pressed
            if (onSaveImmediateRef.current) {
              onSaveImmediateRef.current();
            }
          },
        }),
        PasteHandler,
        PerformanceOptimizer,
      ],
      immediatelyRender: false,
      editable,
      editorProps: {
        attributes: {
          // Optimize for Vietnamese input
          spellcheck: "false",
          autocorrect: "off",
          autocomplete: "off",
          autocapitalize: "off",
        },
        handleDOMEvents: {
          // Handle IME composition for Vietnamese
          compositionstart: () => {
            isComposingRef.current = true;
            return false;
          },
          compositionend: () => {
            isComposingRef.current = false;
            return false;
          },
        },
      },
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
