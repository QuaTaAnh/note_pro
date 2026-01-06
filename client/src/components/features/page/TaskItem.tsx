'use client';

import { cn } from '@/lib/utils';
import { Calendar, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CiFlag1 } from 'react-icons/ci';
import { FiMoreHorizontal } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { isToday, isTomorrow, format } from 'date-fns';

interface TaskItemProps {
    id: string;
    title: string;
    completed?: boolean;
    scheduleDate?: string;
    deadlineDate?: string;
    onToggleComplete?: (id: string, completed: boolean) => void;
    onMoreClick?: (id: string) => void;
    onItemClick?: (id: string) => void;
    isActive?: boolean;
    className?: string;
    variant?: 'default' | 'compact';
}

export const TaskItem = ({
    id,
    title,
    completed = false,
    scheduleDate,
    deadlineDate,
    onToggleComplete,
    onMoreClick,
    onItemClick,
    isActive = false,
    className,
    variant = 'default',
}: TaskItemProps) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [tempCompleted, setTempCompleted] = useState(completed);

    useEffect(() => {
        setTempCompleted(completed);
    }, [completed]);

    const handleToggleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnimating) return;

        const newCompletedState = !tempCompleted;
        setTempCompleted(newCompletedState);
        setIsAnimating(true);

        setTimeout(() => {
            onToggleComplete?.(id, newCompletedState);
            setIsAnimating(false);
        }, 300);
    };

    const handleItemClick = () => {
        onItemClick?.(id);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);

        if (isToday(date)) {
            return 'Today';
        } else if (isTomorrow(date)) {
            return 'Tomorrow';
        } else {
            return format(date, 'MMM d');
        }
    };

    return (
        <div
            onClick={handleItemClick}
            className={cn(
                'flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md group transition-colors',
                variant === 'compact' ? 'px-2 py-1' : 'px-3 py-2',
                onItemClick && 'cursor-pointer',
                isActive ? 'border-border bg-muted/60' : 'border-transparent',
                className
            )}>
            <button
                onClick={handleToggleComplete}
                disabled={isAnimating}
                className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0',
                    tempCompleted
                        ? 'bg-primary border-primary text-white'
                        : 'border-gray-300 hover:border-gray-400',
                    isAnimating && 'cursor-not-allowed'
                )}>
                {tempCompleted && <Check className="w-3 h-3" />}
            </button>

            <div className="flex-1 min-w-0 flex items-center">
                <div className="flex items-center gap-1.5">
                    {scheduleDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(scheduleDate)}</span>
                        </div>
                    )}

                    <div
                        className={cn(
                            variant === 'compact' ? 'text-xs' : 'text-sm',
                            'font-medium truncate transition-all duration-200 flex-1 min-w-0',
                            tempCompleted &&
                                'line-through text-muted-foreground'
                        )}>
                        {title}
                    </div>

                    {deadlineDate && (
                        <div className="flex items-center gap-1 text-xs text-red-500 flex-shrink-0">
                            <CiFlag1 className="w-3 h-3" />
                            <span>{formatDate(deadlineDate)}</span>
                        </div>
                    )}
                </div>
            </div>

            {onMoreClick && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => onMoreClick(id)}>
                    <FiMoreHorizontal className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};
