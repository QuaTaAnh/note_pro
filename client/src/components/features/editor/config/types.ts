import { BlockType } from '@/types/types';
import { MutableRefObject } from 'react';

export interface UseEditorConfigProps {
    editable: boolean;
    positionRef: MutableRefObject<number>;
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
