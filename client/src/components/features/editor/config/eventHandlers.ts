import type { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/react";
import { MutableRefObject } from "react";
import { DELETE_KEYS } from "./constants";
import {
  isInTableCell,
  isModifierPressed,
  selectCellContent,
  shouldPreventTableDeletion,
} from "./helpers";

interface EventHandlersConfig {
  isComposingRef: MutableRefObject<boolean>;
  onFocusRef: MutableRefObject<(() => void) | undefined>;
  onBlurRef: MutableRefObject<(() => void) | undefined>;
  onSaveImmediateRef: MutableRefObject<(() => void) | undefined>;
  onChangeRef: MutableRefObject<(value: string) => void>;
  prevValueRef: MutableRefObject<string>;
}

export const createEventHandlers = ({
  isComposingRef,
  onFocusRef,
  onBlurRef,
  onSaveImmediateRef,
  onChangeRef,
  prevValueRef,
}: EventHandlersConfig) => ({
  handleDOMEvents: {
    compositionstart: () => {
      isComposingRef.current = true;
      return false;
    },
    compositionupdate: () => {
      isComposingRef.current = true;
      return false;
    },
    compositionend: () => {
      isComposingRef.current = false;
      return false;
    },
  },
  handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
    const { state } = view;
    const { $from } = state.selection;

    if (!isInTableCell($from)) return false;

    // Handle Select All (Ctrl+A / Cmd+A)
    if ((event.key === "a" || event.key === "A") && isModifierPressed(event)) {
      event.preventDefault();
      selectCellContent(view, $from);
      return true;
    }

    // Handle Delete/Backspace in empty cells
    if ((DELETE_KEYS as readonly string[]).includes(event.key)) {
      if (shouldPreventTableDeletion($from, event, state.selection.empty)) {
        return true;
      }
    }

    return false;
  },
  onFocus: () => onFocusRef.current?.(),
  onBlur: () => {
    onBlurRef.current?.();
    onSaveImmediateRef.current?.();
  },
  onUpdate: ({ editor }: { editor: Editor }) => {
    // Skip updates during IME composition (Vietnamese, Chinese, Japanese, etc.)
    if (isComposingRef.current) {
      return;
    }

    const content = editor.getHTML();
    if (content !== prevValueRef.current) {
      prevValueRef.current = content;
      onChangeRef.current(content);
    }
  },
});
