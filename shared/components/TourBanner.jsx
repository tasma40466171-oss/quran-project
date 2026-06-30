import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTour } from '../context/TourContext';

export default function TourBanner() {
  const navigate = useNavigate();
  const { isActive, currentStep, advanceStep, exitTour, completeTour, tourSteps, registerNavigate } = useTour();

  // Register navigate function with TourContext
  useEffect(() => {
    if (registerNavigate) {
      registerNavigate(navigate);
    }
  }, [navigate, registerNavigate]);

  console.log('[TourBanner] Rendering - isActive:', isActive, 'currentStep:', currentStep);

  if (!isActive) return null;

  const currentStepData = tourSteps[currentStep - 1];
  const stepContent = currentStepData?.content || 'Follow the steps to explore the app';
  const isActionStep = currentStepData?.trigger === 'action';
  const isSimilarityPage = currentStepData?.page === '/similarity';

  const handleNext = () => {
    console.log('[TourBanner] Next clicked, currentStep:', currentStep);
    if (currentStep >= tourSteps.length) {
      completeTour();
    } else {
      advanceStep();
    }
  };

  const handleExit = () => {
    console.log('[TourBanner] Exit clicked');
    exitTour();
  };

  return ReactDOM.createPortal(
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1 }
            50% { opacity: 0.4 }
          }
          @keyframes tourPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
           }
          .tour-pulse { animation: tourPulse 1.8s ease-in-out infinite; }
        `}
      </style>
      {isActionStep ? (
        // MODE 2: ACTION steps - compact docked bottom-right bar
        <div style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          width: '280px',
          maxWidth: '90vw',
          background: '#1B4332',
          border: '1.5px solid #C9A84C',
          borderRadius: '12px',
          padding: '10px 14px',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          <div style={{ fontSize: '0.7rem', color: '#C9A84C', letterSpacing: '0.05em', fontWeight: 600 }}>
            STEP {currentStep} OF {tourSteps.length}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#F5F0E8', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {stepContent}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
            <div style={{ fontSize: '0.75rem', color: '#C9A84C', fontStyle: 'italic', animation: 'tourPulse 1.8s ease-in-out infinite' }}>
              👆 Go ahead — we'll continue automatically...
            </div>
            <span
              onClick={handleNext}
              style={{ fontSize: '0.72rem', color: '#aaa', cursor: 'pointer' }}
            >
              Skip →
            </span>
          </div>
          <button onClick={handleExit} style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.2)',
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontSize: '10px',
            lineHeight: 1,
          }}>✕</button>
        </div>
      ) : (
        // MODE 1: MANUAL steps - centered modal tooltip
        <div style={{
          position: 'fixed',
          top: isSimilarityPage ? 'auto' : '75px',
          bottom: isSimilarityPage ? '20px' : 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2147483647,
          backgroundColor: '#1B4332',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          minWidth: '400px',
          maxWidth: '550px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontFamily: 'sans-serif',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', color: '#C9A84C', marginBottom: '2px', fontWeight: 600 }}>
              STEP {currentStep} OF {tourSteps.length}
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
              {stepContent}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'center' }}>
            <button onClick={handleNext} style={{
              padding: '6px 16px', borderRadius: '6px',
              border: 'none', backgroundColor: '#C9A84C',
              color: '#1A1A2E', cursor: 'pointer',
              fontSize: '12px', fontWeight: 700
            }}>
              {currentStep === tourSteps.length ? 'Finish 🎉' : 'Next →'}
            </button>
            <button onClick={handleExit} style={{
              padding: '6px 10px', borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: '12px'
            }}>✕</button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}

