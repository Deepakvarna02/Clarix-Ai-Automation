import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastProvider } from './contexts/ToastContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import CookieConsent from './components/CookieConsent';

const ensurePerformanceCompatibility = () => {
  if (typeof window === 'undefined') return;

  const perf = window.performance || globalThis.performance;
  if (!perf) return;

  const noOp = () => {};
  const ensureFn = (target, key) => {
    if (!target || typeof target[key] === 'function') return;

    try {
      target[key] = noOp;
      if (typeof target[key] === 'function') return;
    } catch (error) {
      // Ignore assignment errors and try defineProperty next.
    }

    try {
      Object.defineProperty(target, key, { value: noOp, configurable: true });
    } catch (error) {
      // Ignore if object is locked.
    }
  };

  // Some runtimes/tools expose partial Performance APIs. Guard them to avoid crashes.
  try {
    ensureFn(perf, 'mark');
    ensureFn(perf, 'measure');
    ensureFn(perf, 'clearMarks');
    ensureFn(perf, 'clearMeasures');

    const proto = Object.getPrototypeOf(perf);
    ensureFn(proto, 'mark');
    ensureFn(proto, 'measure');
    ensureFn(proto, 'clearMarks');
    ensureFn(proto, 'clearMeasures');
  } catch (error) {
    // Ignore if Performance object is locked in the current browser runtime.
  }
};

ensurePerformanceCompatibility();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <ToastProvider>
        <App />
        <CookieConsent />
      </ToastProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
