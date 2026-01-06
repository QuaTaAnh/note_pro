import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function DocCardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={cn('min-h-[300px] w-full', className)}>
            <CardHeader>
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
            </CardContent>
        </Card>
    );
}
