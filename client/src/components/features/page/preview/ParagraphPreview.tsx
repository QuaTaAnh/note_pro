import { Block } from '@/hooks';
import { getPlainText } from '../CardDocument';

export const ParagraphPreview = ({ block }: { block: Block }) => {
    const text = getPlainText(block.content?.text);
    if (!text) return null;

    return (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {text}
        </p>
    );
};
