'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { useTheme } from '@/contexts/ThemeProvider';

type ThemePreference = 'light' | 'dark';

export function ThemeToggle() {
    const { theme, setTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-6 h-6">
                <div className="h-4 w-4" />
            </Button>
        );
    }

    const toggleTheme = () => {
        const nextTheme: ThemePreference = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    const getIcon = () => {
        if (theme === 'dark') {
            return <Moon className="h-4 w-4" />;
        }
        return <Sun className="h-4 w-4" />;
    };

    return (
        <SimpleTooltip
            title={
                theme === 'light'
                    ? 'Switch to dark mode'
                    : 'Switch to light mode'
            }>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-6 h-6">
                {getIcon()}
            </Button>
        </SimpleTooltip>
    );
}
