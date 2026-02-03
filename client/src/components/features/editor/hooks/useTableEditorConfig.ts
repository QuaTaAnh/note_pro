import { useMemo, useRef } from 'react';
import { EDITOR_ATTRIBUTES } from '../config/constants';
import { createTableExtensions } from '../config/tableExtensions';

interface UseTableEditorConfigProps {
    editable: boolean;
    onChangeRef: React.MutableRefObject<((value: string) => void) | undefined>;
    onFocusRef: React.MutableRefObject<(() => void) | undefined>;
    onBlurRef: React.MutableRefObject<(() => void) | undefined>;
    onSaveImmediateRef: React.MutableRefObject<(() => void) | undefined>;
    prevValueRef: React.MutableRefObject<string>;
}

export function useTableEditorConfig({
    editable,
    onChangeRef,
    onFocusRef,
    onBlurRef,
    onSaveImmediateRef,
    prevValueRef,
}: UseTableEditorConfigProps) {
    const isComposingRef = useRef(false);

    const extensions = useMemo(() => createTableExtensions(), []);

    const handleDOMEvents = useMemo(
        () => ({
            handleDOMEvents: {
                compositionstart: () => {
                    isComposingRef.current = true;
                    return false;
                },
                compositionend: () => {
                    isComposingRef.current = false;
                    return false;
                },
            },
        }),
        []
    );

    const onFocus = useMemo(
        () => () => {
            onFocusRef.current?.();
        },
        [onFocusRef]
    );

    const onBlur = useMemo(
        () => () => {
            onSaveImmediateRef.current?.();
            onBlurRef.current?.();
        },
        [onSaveImmediateRef, onBlurRef]
    );

    const onUpdate = useMemo(
        () =>
            ({ editor }: { editor: { getHTML: () => string } }) => {
                if (isComposingRef.current) return;

                const html = editor.getHTML();
                if (html !== prevValueRef.current) {
                    prevValueRef.current = html;
                    onChangeRef.current?.(html);
                }
            },
        [onChangeRef, prevValueRef]
    );

    return useMemo(
        () => ({
            extensions,
            immediatelyRender: false,
            shouldRerenderOnTransaction: false,
            editable,
            editorProps: {
                attributes: EDITOR_ATTRIBUTES,
                ...handleDOMEvents,
            },
            onFocus,
            onBlur,
            onUpdate,
        }),
        [extensions, editable, handleDOMEvents, onFocus, onBlur, onUpdate]
    );
}
