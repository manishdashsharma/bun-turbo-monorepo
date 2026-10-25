import { ClipboardList } from 'lucide-react';

export default function TodosEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <ClipboardList className="size-6" />
      </div>
      <div>
        <p className="font-medium">No todos yet</p>
        <p className="text-sm text-muted-foreground">Add your first one above to get started.</p>
      </div>
    </div>
  );
}
