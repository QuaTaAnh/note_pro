'use client';

import { useLoading } from '@/contexts/LoadingContext';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function RouteChangeHandler() {
    const pathname = usePathname();
    const { stopLoading } = useLoading();
    const previousPathname = useRef(pathname);

    useEffect(() => {
        if (previousPathname.current !== pathname) {
            stopLoading();
            previousPathname.current = pathname;
        }
    }, [pathname, stopLoading]);

    return null;
}
