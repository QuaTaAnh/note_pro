'use client';

import { useEffect } from 'react';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/styles/nprogress-custom.css';

interface TopLoadingBarProps {
    isLoading: boolean;
}

export function TopLoadingBar({ isLoading }: TopLoadingBarProps) {
    useEffect(() => {
        nprogress.configure({
            showSpinner: false,
            trickleSpeed: 200,
            minimum: 0.08,
            easing: 'ease',
            speed: 500,
        });
    }, []);

    useEffect(() => {
        if (isLoading) {
            nprogress.start();
        } else {
            nprogress.done();
        }

        return () => {
            nprogress.done();
        };
    }, [isLoading]);

    return null;
}
