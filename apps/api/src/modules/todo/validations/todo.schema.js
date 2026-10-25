import { z } from 'zod';

export { createTodoSchema } from '@repo/shared';

export const listTodosSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const todoParamsSchema = z.object({
  id: z.uuid('Invalid todo id'),
});
