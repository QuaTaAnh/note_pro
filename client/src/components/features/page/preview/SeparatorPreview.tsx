import { Block } from '@/hooks';
import { cn } from '@/lib/utils';
import type { SeparatorStyle } from '../SeparatorBlock';

const separatorClasses: Record<SeparatorStyle, string> = {
    strong: 'border-t-[3px] border-solid border-gray-900 dark:border-gray-100',
    regular: 'border-t-[2px] border-solid border-gray-700 dark:border-gray-300',
    light: 'border-t border-solid border-gray-400 dark:border-gray-500',
    extralight: 'border-t border-dotted border-gray-400 dark:border-gray-500',
};

export const SeparatorPreview = ({ block }: { block: Block }) => {
    const style = (block.content?.style as SeparatorStyle) || 'regular';

    return <div className={cn('w-full my-1', separatorClasses[style])} />;
};
