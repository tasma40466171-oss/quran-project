// FILE 3: frontend/src/features/similarity/SimilarityPage.jsx
// Keeps your existing SearchBar/AyahDisplay/SimilarityList components,
// adds coach tip injection and auto-search on navigate from CoachPage.

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../shared/context/AppContext';
import { useTour } from '../../shared/context/TourContext';
import SearchBar from './components/SearchBar';
import AyahDisplay from './components/AyahDisplay';
import SimilarityList from './components/SimilaritiesList';
import SidePanel from './components/SidePanel';

export default function SimilarityPage() {
  const location = useLocation();
  const { results, setSelectedResult } = useAppContext();
  const { isActive, currentStep, onResultsFound, onResultClicked } = useTour();
  const [hasSearched, setHasSearched] = useState(false);
  const [autoSearchError, setAutoSearchError] = useState(null);

  // Passed from CoachPage via navigate('/similarity', { state: { ... } })
  const autoSearch = location.state?.autoSearch || false;
  const autoSurah  = location.state?.surah      || null;
  const autoAyah   = location.state?.ayah       || null;
  const autoTargetSurah = location.state?.targetSurah || null;
  const autoTargetAyah  = location.state?.targetAyah  || null;

  console.log('SimilarityPage state:', { autoSearch, autoSurah, autoAyah, autoTargetSurah, autoTargetAyah });

  // SearchBar exposes a trigger function through this ref
  const searchRef = useRef(null);

  useEffect(() => {
    if (autoSearch && autoSurah && autoAyah) {
      const timer = setTimeout(() => {
        console.log('searchRef.current:', searchRef.current);
        if (searchRef.current && searchRef.current.triggerSearch) {
          try {
            searchRef.current.triggerSearch(String(autoSurah), String(autoAyah));
          } catch (e) {
            console.error('[SimilarityPage] Auto-search failed:', e);
            setAutoSearchError('Auto-search failed. Please try searching manually.');
          }
        } else {
          console.error('searchRef.current.triggerSearch is not available:', searchRef.current);
          setAutoSearchError('Search component not ready. Please try searching manually.');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSearch, autoSurah, autoAyah]);

  // Auto-select the target result if specified
  useEffect(() => {
    console.log('Auto-select target result:', { autoTargetSurah, autoTargetAyah, resultsCount: results.length });
    if (autoTargetSurah && autoTargetAyah && results.length > 0) {
      const targetResult = results.find(
        r => r.target_surah === Number(autoTargetSurah) && r.target_ayah === Number(autoTargetAyah)
      );
      console.log('Found target result:', targetResult);
      if (targetResult) {
        setSelectedResult(targetResult);
      } else {
        console.log('Target result not found in results');
      }
    }
  }, [results, autoTargetSurah, autoTargetAyah, setSelectedResult]);

  // Tour step 1: Detect when results appear
  useEffect(() => {
    if (isActive && currentStep === 3 && results.length > 0 && !hasSearched) {
      setHasSearched(true);
      onResultsFound();
    }
  }, [isActive, currentStep, results.length, hasSearched, onResultsFound]);

  // Tour step 3: Detect when result is clicked
  const handleResultClick = (result) => {
    setSelectedResult(result);
    if (isActive && currentStep === 4) {
      onResultClicked();
    }
  };

  return (
    <div className="similarity-page-wrapper">
      {autoSearchError && (
        <div style={{
          padding: '12px 16px',
          background: '#FEF2F2',
          borderBottom: '1px solid #FECACA',
          color: '#991B1B',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>{autoSearchError}</span>
          <button
            onClick={() => setAutoSearchError(null)}
            style={{
              padding: '4px 8px',
              background: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      <SearchBar ref={searchRef} />

      <div className="similarity-main-grid">
        <div className="similarity-left-col">
          <AyahDisplay />
          <SimilarityList onResultClick={handleResultClick} />
        </div>
        <div className="similarity-right-col">
          <SidePanel />
        </div>
      </div>
    </div>
  );
}