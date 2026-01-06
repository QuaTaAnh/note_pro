'use client';

import { createContext, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';

const SidebarContext = createContext<{
    isOpen: boolean;
    toggle: () => void;
    isRightOpen: boolean;
    toggleRight: () => void;
}>({
    isOpen: true,
    toggle: () => {},
    isRightOpen: true,
    toggleRight: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isEditor = pathname?.startsWith('/editor/') ?? false;

    const [globalIsOpen, setGlobalIsOpen] = useState(true);
    const [editorIsOpen, setEditorIsOpen] = useState(true);

    const [editorRightIsOpen, setEditorRightIsOpen] = useState(true);

    const isOpen = isEditor ? editorIsOpen : globalIsOpen;
    const toggle = () =>
        isEditor
            ? setEditorIsOpen((prev) => !prev)
            : setGlobalIsOpen((prev) => !prev);

    const isRightOpen = editorRightIsOpen;
    const toggleRight = () => setEditorRightIsOpen((prev) => !prev);

    return (
        <SidebarContext.Provider
            value={{ isOpen, toggle, isRightOpen, toggleRight }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
