import { useMemo, useRef } from 'react';
import { EDITOR_ATTRIBUTES } from '../config/constants';
import { createEventHandlers } from '../config/eventHandlers';
import { createExtensions } from '../config/extensions';
import type { UseEditorConfigProps } from '../config/types';

export function useEditorConfig({
    editable,
    positionRef,
    onChangeRef,
    onFocusRef,
    onBlurRef,
    onSaveImmediateRef,
    onAddBlockRef,
    prevValueRef,
}: UseEditorConfigProps) {
    const isComposingRef = useRef(false);

    const getPosition = useMemo(() => () => positionRef.current, [positionRef]);

    const extensions = useMemo(
        () =>
            createExtensions({
                getPosition,
                onAddBlock: (...args) => onAddBlockRef.current?.(...args),
                onFlush: () => onSaveImmediateRef.current?.(),
            }),
        [getPosition, onAddBlockRef, onSaveImmediateRef]
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
        [onFocusRef, onBlurRef, onSaveImmediateRef, onChangeRef, prevValueRef]
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
        [extensions, editable, eventHandlers]
    );
}
