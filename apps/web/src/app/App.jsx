import Providers from './providers.jsx';
import TodosPage from '../features/todos/components/TodosPage.jsx';

export default function App() {
  return (
    <Providers>
      <TodosPage />
    </Providers>
  );
}
