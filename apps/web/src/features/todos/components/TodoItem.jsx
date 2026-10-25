import { Loader2, Trash2 } from 'lucide-react';
import { useToggleTodo, useDeleteTodo } from '../api/todos.api.js';
import { cn } from '../../../lib/utils.js';
import { formatShortDate } from '../../../lib/format.js';
import { Button } from '../../../components/ui/button.jsx';
import { Checkbox } from '../../../components/ui/checkbox.jsx';

export default function TodoItem({ todo }) {
  const toggle = useToggleTodo();
  const remove = useDeleteTodo();
  const checked = toggle.isPending ? !todo.completed : todo.completed;
  const checkboxId = `todo-${todo.id}`;

  return (
    <li
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60',
        remove.isPending && 'opacity-50',
      )}
    >
      <Checkbox
        id={checkboxId}
        checked={checked}
        onCheckedChange={() => toggle.mutate(todo.id)}
        disabled={toggle.isPending}
        className="size-5 rounded-md data-[state=checked]:border-success data-[state=checked]:bg-success"
      />

      <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer select-none">
        <span
          className={cn(
            'block break-words text-[15px] leading-snug transition-colors',
            checked && 'text-muted-foreground line-through decoration-muted-foreground/60',
          )}
        >
          {todo.title}
        </span>
        <span className="text-xs text-muted-foreground">{formatShortDate(todo.createdAt)}</span>
      </label>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => remove.mutate(todo.id)}
        disabled={remove.isPending}
        aria-label="Delete todo"
        className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        {remove.isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
      </Button>
    </li>
  );
}
