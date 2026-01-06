'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
    onSubmit: (url: string) => void;
    onCancel: () => void;
}

export const LinkInput = ({ onSubmit, onCancel }: Props) => {
    const [url, setUrl] = useState('');

    return (
        <div className="flex items-center gap-1">
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://"
                className="text-sm border px-1 rounded"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSubmit(url);
                    } else if (e.key === 'Escape') {
                        onCancel();
                    }
                }}
            />
            <button
                onClick={() => onSubmit(url)}
                className="text-blue-600 text-sm">
                OK
            </button>
            <button onClick={onCancel} className="text-gray-500">
                <X className="w-3 h-3" />
            </button>
        </div>
    );
};
