import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Failed to initialize ChronoX:', error);
  
  // Fallback rendering
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>ChronoX Loading Error</h1>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <p>Check the browser console for more details.</p>
      <button onclick="window.location.reload()">Reload Page</button>
    </div>
  `;
}
