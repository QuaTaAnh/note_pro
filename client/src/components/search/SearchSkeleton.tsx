import React from "react";
import { Skeleton } from "../ui/skeleton";

export const SearchSkeleton = () => {
  return (
    <div className="py-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <Skeleton className="h-5 w-5 rounded" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
