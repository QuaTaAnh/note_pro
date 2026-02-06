import { SidebarButton } from '@/components/layouts/main-layout/components/SidebarButton';
import { FolderNode } from '@/lib/folder';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

export const FolderItem: React.FC<{
    folder: FolderNode;
    workspaceSlug: string | null;
}> = ({ folder, workspaceSlug }) => {
    const [expanded, setExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const hasChildren = folder.children && folder.children.length > 0;
    const pathname = usePathname();

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasChildren) {
            setExpanded(!expanded);
        }
    };

    const href = workspaceSlug
        ? ROUTES.WORKSPACE_FOLDER(workspaceSlug, folder.id)
        : undefined;

    return (
        <div className="flex flex-col gap-1">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                <SidebarButton
                    className="min-w-0"
                    label={folder.name}
                    icon={
                        <div className="relative w-4 h-4 flex items-center justify-center">
                            <div
                                className={cn(
                                    'absolute inset-0 flex items-center justify-center transition-all duration-200',
                                    hasChildren && isHovered
                                        ? 'opacity-0 scale-75'
                                        : 'opacity-100 scale-100'
                                )}>
                                <span className="text-base leading-none">
                                    {folder.icon}
                                </span>
                            </div>
                            {hasChildren && (
                                <button
                                    onClick={handleToggle}
                                    className={cn(
                                        'absolute inset-0 flex items-center justify-center transition-all duration-200',
                                        isHovered
                                            ? 'opacity-100 scale-100'
                                            : 'opacity-0 scale-75 pointer-events-none'
                                    )}>
                                    {expanded ? (
                                        <FiChevronDown className="w-4 h-4" />
                                    ) : (
                                        <FiChevronRight className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>
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
