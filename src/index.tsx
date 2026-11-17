import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GraphProvider } from './contexts/GraphContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Elemento #root não encontrado');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GraphProvider>
        <App />
      </GraphProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
