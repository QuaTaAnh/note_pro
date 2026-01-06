import { SectionItem } from './types';

interface ContentsTabProps {
    sections: SectionItem[];
    onScrollToBlock: (blockId: string) => void;
    activeBlockId?: string;
}

export const ContentsTab = ({
    sections,
    onScrollToBlock,
    activeBlockId,
}: ContentsTabProps) => {
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-xs text-muted-foreground mb-2">
                Table of Contents
            </h3>
            <div className="text-sm space-y-1.5">
                {sections.length === 0 ? (
                    <h3 className="text-xs text-muted-foreground mt-2">
                        Use titles, pages or cards to create a table of
                        contents.
                    </h3>
                ) : (
                    sections.map((section) => {
                        const isActive = section.id === activeBlockId;
                        const level = section.level || 1;

                        return (
                            <button
                                key={section.id}
                                onClick={() => onScrollToBlock(section.id)}
                                className={`w-full rounded-lg border px-2 py-1.5 text-left transition-colors ${
                                    isActive
                                        ? 'border-border bg-muted/60'
                                        : 'border-transparent hover:border-border hover:bg-muted/60'
                                }`}>
                                <span
                                    className={`text-xs truncate block ${level === 1 ? 'font-bold' : level === 2 ? 'font-semibold' : 'font-medium'}`}>
                                    {section.title}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};
