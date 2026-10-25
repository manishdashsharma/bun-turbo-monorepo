const required = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const env = {
  apiUrl: required('VITE_API_URL'),
  isDev: import.meta.env.DEV,
};
