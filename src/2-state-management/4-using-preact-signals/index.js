import React from 'react';
import { createRoot } from 'react-dom/client';

// QUICK-OVERVIEW:
import App from './1-counter';

// React 18 - bootstrap
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
