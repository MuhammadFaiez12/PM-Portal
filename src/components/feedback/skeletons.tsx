import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-[#e2e8f0]', className)}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="mb-1 h-8 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
