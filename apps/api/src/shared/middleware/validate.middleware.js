import { httpError } from '../utils/response.js';

const validateRequest = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || source}: ${issue.message}`)
      .join(', ');
    return httpError(req, res, new Error(message), 400);
  }

  Object.defineProperty(req, source, {
    value: result.data,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return next();
};

export { validateRequest };
