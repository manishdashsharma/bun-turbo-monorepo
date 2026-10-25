import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, unwrap } from '../../../config/api.config.js';

const TODOS_KEY = ['todos'];
const TODOS_PAGE_SIZE = 100;

export const useTodos = () =>
  useQuery({
    queryKey: TODOS_KEY,
    queryFn: async () => {
      const data = unwrap(await api.get('/v1/todos', { params: { limit: TODOS_PAGE_SIZE } }));
      return data?.items ?? [];
    },
  });

const useTodoMutation = (mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
  });
};

export const useCreateTodo = () =>
  useTodoMutation(async (payload) => unwrap(await api.post('/v1/todos', payload)));

export const useToggleTodo = () =>
  useTodoMutation(async (id) => unwrap(await api.post(`/v1/todos/${id}/toggle`)));

export const useDeleteTodo = () =>
  useTodoMutation(async (id) => {
    await api.post(`/v1/todos/${id}/delete`);
  });
