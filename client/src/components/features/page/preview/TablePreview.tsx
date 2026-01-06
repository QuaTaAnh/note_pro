import { Block } from '@/hooks';
import { Table } from 'lucide-react';

export const TablePreview = ({ block }: { block: Block }) => {
    const tableHTML = block.content?.text;

    if (!tableHTML || tableHTML.trim() === '') {
        return (
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60 bg-muted/30 rounded px-2 py-1">
                <Table className="w-3 h-3" />
                <span>Empty Table</span>
            </div>
        );
    }

    return (
        <div className="text-xs overflow-hidden max-h-24 bg-muted/10 rounded-md p-1">
            <div
                className="table-preview"
                dangerouslySetInnerHTML={{ __html: tableHTML }}
            />
        </div>
    );
};
