'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface Props {
    message?: string;
}

export function SearchEmptyState({ message }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-background-soft p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">
                {message || 'No Results Found'}
            </h3>
            <p className="text-xs text-muted-foreground">
                Try adjusting your search terms
            </p>
        </div>
    );
}
