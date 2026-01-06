'use client';

import { useEffect, useState } from 'react';

interface TiptapWrapperProps {
    children: React.ReactNode;
}

export const TiptapWrapper = ({ children }: TiptapWrapperProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="min-h-[100px] bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
