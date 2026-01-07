import { SIDEBAR_WIDTH } from '@/lib/constants';
import { useSidebar } from '@/contexts/SidebarContext';
import React from 'react';

interface LayoutEditorProps {
    left?: React.ReactNode;
    children?: React.ReactNode;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
    left,
    children,
}) => {
    const { isOpen } = useSidebar();

    return (
        <div className="w-full h-screen flex flex-row ">
            <div
                className="transition-all duration-300 flex-shrink-0 overflow-hidden"
                style={{ width: isOpen ? SIDEBAR_WIDTH : 0 }}>
                {isOpen ? left : null}
            </div>
            <div
                className={`flex-1 ${isOpen ? ' border-l rounded-t-md overflow-hidden' : ''} border-t`}>
                {children}
            </div>
        </div>
    );
};
