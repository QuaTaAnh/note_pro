import { FolderNode } from '@/lib/folder';
import { iconMap } from '@/lib/icons';
import { ROUTES } from '@/lib/routes';
import { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiFolder } from 'react-icons/fi';
import { SidebarButton } from '@/components/layouts/main-layout/components/SidebarButton';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export const FolderItem: React.FC<{
    folder: FolderNode;
    workspaceSlug: string | null;
}> = ({ folder, workspaceSlug }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = folder.children && folder.children.length > 0;
    const pathname = usePathname();

    const isEmoji = folder.icon && !iconMap[folder.icon];
    const Icon =
        !isEmoji && folder.icon && iconMap[folder.icon]
            ? iconMap[folder.icon]
            : null;

    const handleMoreClick = () => {
        if (hasChildren) {
            setExpanded(!expanded);
        }
    };

    const href = workspaceSlug
        ? ROUTES.WORKSPACE_FOLDER(workspaceSlug, folder.id)
        : undefined;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center">
                {hasChildren ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-5 h-5"
                        onClick={handleMoreClick}>
                        {expanded ? (
                            <FiChevronDown className="w-4 h-4" />
                        ) : (
                            <FiChevronRight className="w-4 h-4" />
                        )}
                    </Button>
                ) : (
                    <span className="w-4 h-4" />
                )}

                <SidebarButton
                    className="min-w-0"
                    label={folder.name}
                    icon={
                        isEmoji ? (
                            <span className="text-base leading-none">
                                {folder.icon}
                            </span>
                        ) : Icon ? (
                            <Icon className="w-4 h-4" />
                        ) : (
                            <FiFolder className="w-4 h-4" />
                        )
                    }
                    href={href}
                    isActive={href ? pathname === href : false}
                />
            </div>
            {expanded && hasChildren && (
                <div className="ml-5">
                    {folder.children!.map((child) => (
                        <FolderItem
                            key={child.id}
                            folder={child}
                            workspaceSlug={workspaceSlug}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
