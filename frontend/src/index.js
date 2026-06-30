// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

import './shared/styles/Navbar.css';
import './features/auth/styles/page.css';
import './features/auth/styles/components.css';
import './features/auth/styles/best-method.css';
import './features/diary/styles/page.css';
import './features/diary/styles/components.css';
import './features/analytics/styles/page.css';
import './features/analytics/styles/performance-analytics.css';
import './features/similarity/styles/search-bar.css';
import './features/similarity/styles/components.css';
import './features/similarity/styles/similarity-list.css';
import './features/similarity/styles/layout.css';
import './shared/styles/StreakBanner.css';
import './shared/styles/ThemeBanner.css';
import './shared/styles/ThemeSelector.css';
import './shared/styles/LoadingSpinner.css';
import './features/flashcards/styles/page.css';
import './features/scheduler/styles/page.css';
import './features/scheduler/styles/wizard.css';
import './shared/styles/Responsive.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);