'use client';

import { createContext, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';

const SidebarContext = createContext<{
    isOpen: boolean;
    toggle: () => void;
}>({
    isOpen: true,
    toggle: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isEditor = pathname?.startsWith('/editor/') ?? false;

    const [globalIsOpen, setGlobalIsOpen] = useState(true);
    const [editorIsOpen, setEditorIsOpen] = useState(true);

    const isOpen = isEditor ? editorIsOpen : globalIsOpen;
    const toggle = () =>
        isEditor
            ? setEditorIsOpen((prev) => !prev)
            : setGlobalIsOpen((prev) => !prev);

    return (
        <SidebarContext.Provider value={{ isOpen, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
