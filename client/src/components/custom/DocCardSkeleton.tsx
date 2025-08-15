import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DocCardSkeleton() {
  return (
    <Card className="min-h-[346px] w-full md:min-w-[240px]">
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
