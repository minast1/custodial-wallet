import React from "react";
import { Skeleton } from "~~/components/ui/skeleton";

const TransactionSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-glass-border">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-6">
        <div className="text-right space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
};

export default TransactionSkeleton;
