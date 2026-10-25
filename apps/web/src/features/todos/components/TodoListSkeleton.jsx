import { Skeleton } from '../../../components/ui/skeleton.jsx';

export default function TodoListSkeleton() {
  return (
    <div className="space-y-3 px-3 py-2">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Skeleton className="size-5 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
