import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './sw'
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import env from './utils/env';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

Sentry.init({
  dsn: env.SENTRY_DSN,
  integrations: [
    new (BrowserTracing as any)(),
  ],
  tracesSampleRate: 1.0, // Adjust this value in production
  environment: import.meta.env.MODE,
});

// Register service worker for offline sync
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      (registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      },
      (err) => {
        console.error('Service Worker registration failed:', err);
      }
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Sentry.ErrorBoundary fallback={<p>An error has occurred. Our team has been notified.</p>} showDialog>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Sentry.ErrorBoundary>
)
