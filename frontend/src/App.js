import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './shared/context/AuthContext';
import { AppProvider } from './shared/context/AppContext';
import { TourProvider, useTour } from './shared/context/TourContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import ErrorBoundary from './shared/components/ErrorBoundary';
import Navbar from './shared/components/Navbar';
import Walkthrough from './shared/components/Walkthrough';
import TourBanner from './shared/components/TourBanner';
import DailyQuoteCard from './shared/components/DailyQuoteCard';

import Home from './features/home/pages/Home';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import SimilarityPage from './features/similarity/SimilarityPage';
import DiaryPage from './features/diary/DiaryPage';
import FlashcardsPage from './features/flashcards/FlashcardsPage';
import BestMethodPage from './features/auth/pages/BestMethodPage';
import CoachPage from './features/coach/pages/CoachPage';
import './App.css';

function AppContent() {
  const { user } = useAuthContext();
  const location = useLocation();
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [hasSeenWalkthrough, setHasSeenWalkthrough] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const { startTour, isActive } = useTour();

  // Routes where navbar and tour should be hidden
  const hideNavbarRoutes = ['/login', '/signup', '/register'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    // Check if daily quote should be shown today
    const lastQuoteDate = localStorage.getItem('lastQuoteDate');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastQuoteDate !== today) {
      setShowQuote(true);
    }
  }, []);

  useEffect(() => {
    // Check localStorage for tour completion only
    const tourCompleted = localStorage.getItem('hifz_tour_completed') === 'true';
    setHasSeenWalkthrough(tourCompleted);
    
    // Auto-start tour for logged-in users who haven't completed it and not on auth pages
    if (user && !tourCompleted && !isActive && !shouldHideNavbar) {
      const timer = setTimeout(() => {
        console.log('[App] Auto-starting tour for new user');
        startTour();
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    // Show walkthrough modal for non-logged-in users or if tour not completed (not on auth pages)
    if (!tourCompleted && !user && !shouldHideNavbar) {
      const timer = setTimeout(() => {
        setIsWalkthroughOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isActive, startTour, shouldHideNavbar]);

  const handleWalkthroughClose = () => {
    setIsWalkthroughOpen(false);
  };

  const handleOpenWalkthrough = () => {
    setIsWalkthroughOpen(true);
  };

  return (
    <div className="app-layout" id="app-root">
      {showQuote && <DailyQuoteCard onDismiss={() => setShowQuote(false)} />}
      {!shouldHideNavbar && <TourBanner />}
      {!shouldHideNavbar && <Navbar onOpenWalkthrough={handleOpenWalkthrough} />}
      <main className="app-content">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/similarity" element={<ProtectedRoute><SimilarityPage /></ProtectedRoute>} />
            <Route path="/diary" element={<ProtectedRoute><DiaryPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
            <Route path="/best-method" element={<BestMethodPage />} />
            <Route path="/coach" element={<ProtectedRoute><CoachPage /></ProtectedRoute>} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Walkthrough
        isOpen={isWalkthroughOpen}
        onClose={handleWalkthroughClose}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <TourProvider>
            <AppContent />
          </TourProvider>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
export default App;