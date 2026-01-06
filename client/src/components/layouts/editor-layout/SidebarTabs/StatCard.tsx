import { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: number;
    description?: string;
    icon: ReactNode;
}

export const StatCard = ({
    label,
    value,
    description,
    icon,
}: StatCardProps) => {
    return (
        <div className="rounded-lg border px-2 py-2 text-left">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <div className="text-base font-semibold leading-tight">{value}</div>
            {description && (
                <p className="text-[10px] text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
};
