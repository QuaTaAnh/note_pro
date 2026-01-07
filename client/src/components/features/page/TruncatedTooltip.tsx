'use client';

import * as React from 'react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { SimpleTooltip } from './SimpleTooltip';

interface Props {
    text: string;
    children: React.ReactElement;
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    className?: string;
}

export function TruncatedTooltip({
    text,
    children,
    side = 'bottom',
    sideOffset = 8,
    className,
}: Props) {
    const [isTruncated, setIsTruncated] = useState(false);
    const elementRef = useRef<HTMLElement | null>(null);

    const checkTruncation = useCallback(() => {
        if (elementRef.current) {
            const element = elementRef.current;
            const truncatedElement = element.querySelector(
                '.truncate'
            ) as HTMLElement;

            if (truncatedElement) {
                const isTruncatedNow =
                    truncatedElement.scrollWidth > truncatedElement.clientWidth;
                setIsTruncated(isTruncatedNow);
            } else if (element.classList.contains('truncate')) {
                const isTruncatedNow =
                    element.scrollWidth > element.clientWidth;
                setIsTruncated(isTruncatedNow);
            }
        }
    }, []);

    const setRef = useCallback(
        (node: HTMLElement | null) => {
            elementRef.current = node;
            checkTruncation();
        },
        [checkTruncation]
    );

    useEffect(() => {
        checkTruncation();

        const resizeObserver = new ResizeObserver(checkTruncation);
        if (elementRef.current) {
            resizeObserver.observe(elementRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [checkTruncation, text]);

    const childWithRef = React.cloneElement(children, {
        ref: setRef,
    } as Partial<unknown>);

    return !isTruncated ? (
        childWithRef
    ) : (
        <SimpleTooltip
            title={text}
            side={side}
            sideOffset={sideOffset}
            className={className}>
            {childWithRef}
        </SimpleTooltip>
    );
}
