import { getWriteDB, getReadDB } from '../../../config/databases.js';

const todoSelect = {
  id: true,
  title: true,
  completed: true,
  createdAt: true,
  updatedAt: true,
};

const todoNotFound = () => {
  const error = new Error('Todo not found');
  error.statusCode = 404;
  return error;
};

const listTodosService = async ({ page, limit }) => {
  const readDb = getReadDB();
  const filter = { isActive: true };

  const [total, items] = await Promise.all([
    readDb.todo.count({ where: filter }),
    readDb.todo.findMany({
      where: filter,
      select: todoSelect,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      hasNextPage: (page - 1) * limit + items.length < total,
    },
  };
};

const createTodoService = async ({ title }) => {
  const db = getWriteDB();
  return db.todo.create({ data: { title }, select: todoSelect });
};

const toggleTodoService = async (id) => {
  const db = getWriteDB();
  const todo = await db.todo.findFirst({
    where: { id, isActive: true },
    select: { completed: true },
  });

  if (!todo) {
    throw todoNotFound();
  }

  return db.todo.update({
    where: { id },
    data: { completed: !todo.completed },
    select: todoSelect,
  });
};

const deleteTodoService = async (id) => {
  const db = getWriteDB();
  const { count } = await db.todo.updateMany({
    where: { id, isActive: true },
    data: { isActive: false },
  });

  if (count === 0) {
    throw todoNotFound();
  }
};

export { listTodosService, createTodoService, toggleTodoService, deleteTodoService };
