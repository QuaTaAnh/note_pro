import { GripVertical } from 'lucide-react';

interface DragHandleProps {
    attributes: any;
    listeners: any;
}

export function DragHandle({ attributes, listeners }: DragHandleProps) {
    return (
        <span
            {...attributes}
            {...listeners}
            tabIndex={-1}
            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <GripVertical size={16} />
        </span>
    );
}
