'use client';

import AuthGuard from '@/components/features/auth/AuthGuard';
import { PageLoading } from '@/components/ui/loading';
import { RouteChangeHandler } from '@/components/shared/RouteChangeHandler';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { useDocumentAccess } from '@/contexts/DocumentAccessContext';
import { useBinCraftTitle, useWorkspace, useDocumentTitle } from '@/hooks';
import { ROUTES } from '@/lib/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/lib/constants';

function LayoutMain({ children }: { children: React.ReactNode }) {
    const { workspaceSlug, loading, workspace } = useWorkspace();
    const { isOpen } = useSidebar();
    const pathname = usePathname();
    const router = useRouter();

    const isGlobalRoute =
        !pathname.startsWith('/s/') && !pathname.startsWith('/editor/');

    useEffect(() => {
        if (!loading && workspaceSlug && pathname.startsWith('/s/')) {
            const currentSlug = pathname.split('/')[2];
            if (currentSlug && currentSlug !== workspaceSlug) {
                const newPath = pathname.replace(currentSlug, workspaceSlug);
                router.replace(newPath);
            }
        }
    }, [loading, workspaceSlug, pathname, router]);

    const editorPage = Boolean(pathname.startsWith('/editor/'));

    return pathname === ROUTES.LOGIN ? (
        <>{children}</>
    ) : (
        <AuthGuard>
            <div className={`h-screen flex flex-col overflow-hidden`}>
                {loading && !isGlobalRoute ? (
                    <PageLoading />
                ) : (
                    <>
                        <Header
                            workspaceSlug={workspaceSlug ?? ''}
                            isEditorPage={editorPage}
                        />
                        <div className="flex flex-1 pt-[var(--header-height)]">
                            {!editorPage && (
                                <div
                                    className={`transition-all duration-300 overflow-hidden`}
                                    style={{
                                        width: isOpen ? SIDEBAR_WIDTH : 0,
                                    }}>
                                    <Sidebar
                                        workspaceSlug={workspaceSlug || ''}
                                        workspaceId={workspace?.id || ''}
                                    />
                                </div>
                            )}

                            <main
                                className={`flex-1 transition-all duration-300 flex justify-center overflow-hidden ${
                                    editorPage ? 'p-0' : 'p-4'
                                }`}
                                style={{
                                    paddingTop: HEADER_HEIGHT,
                                }}>
                                <div
                                    className={`w-full ${
                                        editorPage
                                            ? 'max-w-full mt-1'
                                            : 'max-w-7xl'
                                    }`}>
                                    {children}
                                </div>
                            </main>
                        </div>
                    </>
                )}
            </div>
        </AuthGuard>
    );
}

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { hasAccess } = useDocumentAccess();

    const isEditorPage = useMemo(
        () => pathname.startsWith('/editor/'),
        [pathname]
    );

    const { documentTitle, hasDocument } = useDocumentTitle({
        enabled: isEditorPage,
    });

    useBinCraftTitle({
        dynamicTitle:
            isEditorPage && hasDocument && hasAccess ? documentTitle : null,
    });

    return (
        <SidebarProvider>
            <RouteChangeHandler />
            <LayoutMain>{children}</LayoutMain>
        </SidebarProvider>
    );
}
