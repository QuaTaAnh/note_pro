'use client';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useLoading } from '@/contexts/LoadingContext';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/utils';
import { Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { GetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';

type FolderType = NonNullable<
    GetFolderByIdQuery['folders_by_pk']
>['children'][0];

interface CardFolderProps {
    folder: FolderType;
}

const CardFolderComponent = ({ folder }: CardFolderProps) => {
    const router = useRouter();
    const { workspace } = useWorkspace();
    const { startLoading } = useLoading();

    const workspaceId = workspace?.id;
    const docCount = folder.blocks_aggregate?.aggregate?.count || 0;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!workspaceId) return;

        startLoading();
        router.push(ROUTES.WORKSPACE_FOLDER(workspaceId, folder.id));
    };

    return (
        <Card
            key={folder.id}
            className="group relative cursor-pointer transition-all duration-200 h-[140px] w-full rounded-md border-[rgb(223,228,231)] hover:border-primary dark:border-border dark:hover:border-primary flex flex-col"
            onClick={handleClick}>
            <CardHeader className="flex flex-col p-4 flex-1">
                <div className="flex flex-col justify-center items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {folder.icon ? (
                            <span className="text-2xl">{folder.icon}</span>
                        ) : (
                            <Folder className="w-5 h-5 text-primary" />
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <CardTitle className="text-sm truncate">
                            {folder.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {docCount} {docCount < 1 ? 'document' : 'documents'}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
};

export const CardFolder = React.memo(CardFolderComponent);
