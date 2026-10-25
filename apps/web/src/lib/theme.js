const query = window.matchMedia('(prefers-color-scheme: dark)');

const apply = () => document.documentElement.classList.toggle('dark', query.matches);

export const syncSystemTheme = () => {
  apply();
  query.addEventListener('change', apply);
};
