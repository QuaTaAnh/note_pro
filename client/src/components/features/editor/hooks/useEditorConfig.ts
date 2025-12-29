import { useMemo, useRef } from "react";
import { EDITOR_ATTRIBUTES } from "../config/constants";
import { createEventHandlers } from "../config/eventHandlers";
import { createExtensions } from "../config/extensions";
import type { UseEditorConfigProps } from "../config/types";

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

  const extensions = useMemo(
    () =>
      createExtensions({
        position,
        onAddBlock: onAddBlockRef.current,
        onFlush: () => onSaveImmediateRef.current?.(),
      }),
    [position, onAddBlockRef, onSaveImmediateRef],
  );

  const eventHandlers = useMemo(
    () =>
      createEventHandlers({
        isComposingRef,
        onFocusRef,
        onBlurRef,
        onSaveImmediateRef,
        onChangeRef,
        prevValueRef,
      }),
    [onFocusRef, onBlurRef, onSaveImmediateRef, onChangeRef, prevValueRef],
  );

  return useMemo(
    () => ({
      extensions,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      editable,
      editorProps: {
        attributes: EDITOR_ATTRIBUTES,
        ...eventHandlers.handleDOMEvents,
        handleKeyDown: eventHandlers.handleKeyDown,
      },
      onFocus: eventHandlers.onFocus,
      onBlur: eventHandlers.onBlur,
      onUpdate: eventHandlers.onUpdate,
    }),
    [extensions, editable, eventHandlers],
  );
}
