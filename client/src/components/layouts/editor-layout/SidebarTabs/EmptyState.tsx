import { ReactNode } from 'react';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed px-3 py-6 text-center">
            <div className="mb-2 text-muted-foreground">{icon}</div>
            <p className="text-xs font-semibold">{title}</p>
            <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
    );
}
