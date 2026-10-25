import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { createTodoSchema } from '@repo/shared';
import { useCreateTodo } from '../api/todos.api.js';
import { apiErrorMessage } from '../../../config/api.config.js';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';

export default function TodoForm() {
  const create = useCreateTodo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = (values) => create.mutate(values, { onSuccess: () => reset() });
  const error = errors.title?.message ?? (create.isError ? apiErrorMessage(create.error) : null);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1.5">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new todo…"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          className="h-11 text-base"
          {...register('title')}
        />
        <Button type="submit" size="lg" className="h-11 px-5" disabled={create.isPending}>
          {create.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
          Add
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
