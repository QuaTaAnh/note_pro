'use client';

import { cn } from '@/lib/utils';

interface Props {
    isActive?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export const BubbleButton = ({ isActive, onClick, children }: Props) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
                isActive && 'text-blue-600'
            )}>
            {children}
        </button>
    );
};
