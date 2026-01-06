'use client';

import React from 'react';

interface SearchSectionHeaderProps {
    title: string;
    count?: number;
}

export function SearchSectionHeader({
    title,
    count,
}: SearchSectionHeaderProps) {
    return (
        <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
            {count !== undefined && count > 0 && ` (${count})`}
        </div>
    );
}
