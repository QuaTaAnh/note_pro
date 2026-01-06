'use client';

import React, { useMemo, useCallback } from 'react';
import { PageLoading } from '@/components/ui/loading';
import {
    GetTodayTasksDocument,
    useGetTodayTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useUpdateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Task } from '@/types/app';
import { TaskItem } from '@/components/features/page/TaskItem';
import { showToast } from '@/lib/toast';
import { TASK_STATUS } from '@/lib/constants';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';

const TASK_ITEM_HEIGHT_WITHOUT_DATE = 32;
const TASK_ITEM_HEIGHT_WITH_DATE = 32;

interface TaskItemRowProps {
    index: number;
    style: React.CSSProperties;
    data: {
        tasks: Task[];
        onToggleComplete: (taskId: string, completed: boolean) => void;
        onMoreClick: (taskId: string) => void;
    };
}

const TaskItemRow = ({ index, style, data }: TaskItemRowProps) => {
    const { tasks, onToggleComplete, onMoreClick } = data;
    const task = tasks[index];

    if (!task) return null;

    return (
        <div style={style}>
            <TaskItem
                key={task.id}
                id={task.id}
                variant="compact"
                title={task.block?.content?.text || 'Untitled'}
                completed={task.status === TASK_STATUS.COMPLETED}
                onToggleComplete={onToggleComplete}
                onMoreClick={onMoreClick}
                scheduleDate={task.schedule_date || ''}
                deadlineDate={task.deadline_date || ''}
            />
        </div>
    );
};

export default function TodayPage() {
    const { workspace } = useWorkspace();

    const today = useMemo(() => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }, []);

    const { loading, data } = useGetTodayTasksQuery({
        variables: {
            workspaceId: workspace?.id || '',
            today: today || '',
        },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const [updateTask] = useUpdateTaskMutation();

    const tasks: Task[] = useMemo(() => {
        return data?.tasks || [];
    }, [data]);

    const getItemSize = useCallback(
        (index: number) => {
            const task = tasks[index];
            if (!task) return TASK_ITEM_HEIGHT_WITHOUT_DATE;

            const hasDateInfo = task.schedule_date || task.deadline_date;
            return hasDateInfo
                ? TASK_ITEM_HEIGHT_WITH_DATE
                : TASK_ITEM_HEIGHT_WITHOUT_DATE;
        },
        [tasks]
    );

    const handleToggleComplete = useCallback(
        async (taskId: string, completed: boolean) => {
            try {
                await updateTask({
                    variables: {
                        id: taskId,
                        input: {
                            status: completed
                                ? TASK_STATUS.COMPLETED
                                : TASK_STATUS.TODO,
                        },
                    },
                    refetchQueries: [
                        {
                            query: GetTodayTasksDocument,
                            variables: {
                                workspaceId: workspace?.id || '',
                                today: today,
                            },
                        },
                    ],
                });
                showToast.success(
                    completed ? 'Task completed' : 'Task reopened'
                );
            } catch (error) {
                console.error('Failed to update task:', error);
                showToast.error('Failed to update task');
            }
        },
        [updateTask, workspace?.id, today]
    );

    const handleMoreClick = useCallback((taskId: string) => {
        console.log('More options for task:', taskId);
    }, []);

    const itemData = useMemo(
        () => ({
            tasks,
            onToggleComplete: handleToggleComplete,
            onMoreClick: handleMoreClick,
        }),
        [tasks, handleToggleComplete, handleMoreClick]
    );

    return loading && tasks.length === 0 ? (
        <PageLoading />
    ) : (
        <div className="flex flex-col h-full w-full">
            {tasks.length === 0 ? (
                <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-64">
                    No tasks scheduled for today
                </div>
            ) : (
                <div className="flex-1 w-full overflow-hidden">
                    <AutoSizer>
                        {({ width, height }) => {
                            if (width === 0 || height === 0) return null;

                            return (
                                <List
                                    height={height}
                                    width={width}
                                    itemCount={tasks.length}
                                    itemSize={getItemSize}
                                    itemData={itemData}
                                    overscanCount={5}
                                    style={{ overflowX: 'hidden' }}>
                                    {TaskItemRow}
                                </List>
                            );
                        }}
                    </AutoSizer>
                </div>
            )}
        </div>
    );
}
