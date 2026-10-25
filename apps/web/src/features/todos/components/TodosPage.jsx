import { AlertCircle, CheckCheck } from 'lucide-react';
import { useTodos } from '../api/todos.api.js';
import { apiErrorMessage } from '../../../config/api.config.js';
import { Badge } from '../../../components/ui/badge.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card.jsx';
import { Progress } from '../../../components/ui/progress.jsx';
import TodoForm from './TodoForm.jsx';
import TodoItem from './TodoItem.jsx';
import TodoListSkeleton from './TodoListSkeleton.jsx';
import TodosEmpty from './TodosEmpty.jsx';

const todayLabel = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date());

export default function TodosPage() {
  const { data: todos = [], isLoading, isError, error } = useTodos();
  const done = todos.filter((todo) => todo.completed).length;
  const percent = todos.length ? Math.round((done / todos.length) * 100) : 0;
  const allDone = todos.length > 0 && done === todos.length;

  return (
    <div className="min-h-svh bg-gradient-to-b from-accent/60 via-background to-background">
      <main className="mx-auto max-w-xl px-4 py-10 sm:py-16">
        <Card className="gap-5 shadow-lg shadow-primary/5">
          <CardHeader className="gap-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-semibold tracking-tight">My Todos</CardTitle>
                <CardDescription>{todayLabel}</CardDescription>
              </div>
              {todos.length > 0 && (
                <Badge variant={allDone ? 'default' : 'secondary'} className="mt-1">
                  {allDone && <CheckCheck />}
                  {allDone ? 'All done' : `${todos.length - done} left`}
                </Badge>
              )}
            </div>

            {todos.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {done} of {todos.length} completed
                  </span>
                  <span>{percent}%</span>
                </div>
                <Progress value={percent} className="h-1.5" />
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <TodoForm />

            {isLoading && <TodoListSkeleton />}

            {isError && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {apiErrorMessage(error)}
              </div>
            )}

            {!isLoading && !isError && todos.length === 0 && <TodosEmpty />}

            {todos.length > 0 && (
              <ul className="-mx-3 space-y-0.5">
                {todos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
