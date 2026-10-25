import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './config/zod.js';
import { syncSystemTheme } from './lib/theme.js';
import App from './app/App.jsx';
import './index.css';

syncSystemTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
