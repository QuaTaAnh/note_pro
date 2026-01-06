'use client';

import { useState, useEffect } from 'react';
import { FiShare2 } from 'react-icons/fi';
import { SharedUsersList, SharedUser } from './SharedUsersList';
import {
    UserEmailAutocomplete,
    UserSearchResult,
} from './UserEmailAutocomplete';
import {
    useShareDocumentWithUserMutation,
    useRemoveDocumentAccessMutation,
    useUpdateDocumentPermissionMutation,
    useGetDocumentSharedUsersQuery,
} from '@/graphql/mutations/__generated__/document-share.generated';
import { useUserId } from '@/hooks/useAuth';
import { useDocumentPermission } from '@/hooks/useDocumentPermission';
import { showToast } from '@/lib/toast';
import { PermissionType as PermissionTypeEnum } from '@/types/types';

interface ShareTabProps {
    documentId: string;
}

export function ShareTab({ documentId }: ShareTabProps) {
    const currentUserId = useUserId();
    const { permissionType } = useDocumentPermission(documentId);
    const isOwner = permissionType === PermissionTypeEnum.OWNER;
    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

    const { data, refetch } = useGetDocumentSharedUsersQuery({
        variables: { documentId },
        skip: !documentId,
    });

    const [shareDocument] = useShareDocumentWithUserMutation();
    const [removeAccess] = useRemoveDocumentAccessMutation();
    const [updatePermission] = useUpdateDocumentPermissionMutation();

    useEffect(() => {
        if (data?.access_requests) {
            const users: SharedUser[] = data.access_requests.map((ar) => ({
                id: ar.requester_id,
                email: ar.requester?.email || '',
                name: ar.requester?.name || undefined,
                role: ar.permission_type === 'write' ? 'editor' : 'viewer',
                avatar_url: ar.requester?.avatar_url || undefined,
            }));
            setSharedUsers(users);
        }
    }, [data]);

    const handleSelectUser = async (user: UserSearchResult) => {
        const userExists = sharedUsers.some((u) => u.id === user.id);
        if (userExists || !currentUserId) {
            return;
        }

        try {
            await shareDocument({
                variables: {
                    documentId,
                    userId: user.id,
                    ownerId: currentUserId,
                    permissionType: 'read',
                },
            });

            showToast.success(`Shared document with ${user.email}`);
            refetch();
        } catch (error) {
            console.error('Error sharing document:', error);
            showToast.error('Failed to share document');
        }
    };

    const handleRoleChange = async (
        userId: string,
        newRole: 'viewer' | 'editor'
    ) => {
        try {
            await updatePermission({
                variables: {
                    documentId,
                    userId,
                    permissionType: newRole === 'editor' ? 'write' : 'read',
                },
            });

            showToast.success('Permission updated');
            refetch();
        } catch (error) {
            console.error('Error updating permission:', error);
            showToast.error('Failed to update permission');
        }
    };

    const handleRemoveUser = async (userId: string) => {
        try {
            await removeAccess({
                variables: {
                    documentId,
                    userId,
                },
            });

            showToast.success('Access removed');
            refetch();
        } catch (error) {
            console.error('Error removing access:', error);
            showToast.error('Failed to remove access');
        }
    };

    return (
        <div className="py-4 px-2">
            <div className="flex items-center gap-2">
                <FiShare2 className="h-4 w-4" />
                <h3 className="text-sm font-bold">Invite to Collaborate</h3>
            </div>
            <p className="text-sm text-muted-foreground my-2">
                For easy collaboration with anyone, even without a Bin account
            </p>

            {isOwner && (
                <UserEmailAutocomplete
                    onSelectUser={handleSelectUser}
                    excludeUserIds={sharedUsers.map((user) => user.id)}
                    placeholder="Add emails to invite"
                />
            )}

            <SharedUsersList
                users={sharedUsers}
                onRoleChange={handleRoleChange}
                onRemoveUser={handleRemoveUser}
                currentUserId={currentUserId || undefined}
                canManageUsers={isOwner}
            />
        </div>
    );
}
