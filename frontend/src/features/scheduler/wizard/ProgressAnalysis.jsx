import React from 'react';

export default function ProgressAnalysis({ analysis, onNext }) {
  if (!analysis) {
    return <div className="loading">Loading analysis...</div>;
  }

  const completedSiparas = analysis.completedMarhalas || analysis.completedSiparas;
  const completedSiparasCount = Array.isArray(completedSiparas) ? completedSiparas.length : (completedSiparas || 0);
  const currentSipara = analysis.currentMarhala || analysis.currentSipara;
  const currentPage = analysis.currentPage;
  const totalPages = analysis.totalPages || 20;
  const strongPages = analysis.strongPages || [];
  const weakPages = analysis.weakPages || [];
  const veryWeakPages = analysis.veryWeakPages || [];
  const estimatedWorkload = analysis.estimatedWorkload || { totalMinutes: 0, dailyMinutes: 0 };

  return (
    <div className="progress-analysis">
      <div className="banner success">
        <div className="banner-icon">✓</div>
        <div className="banner-text">Analysis complete</div>
      </div>

      <div className="card">
        <h2 className="card-title">Your Progress</h2>
        
        <div className="stat-row">
          <span className="stat-label">COMPLETED SIPARAS</span>
          <span className="stat-value">{completedSiparasCount > 0 ? completedSiparasCount : 'Not set'}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">CURRENT SIPARA</span>
          <span className="stat-value">{currentSipara ? `Juz ${currentSipara}` : 'Not set'}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">CURRENT PAGE</span>
          <span className="stat-value">{currentPage ? `${currentPage} / ${totalPages}` : 'No data yet'}</span>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Page Strength</h2>
        
        <div className="stat-row">
          <span className="stat-label">Strong Pages</span>
          <span className="stat-value">{strongPages.length}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Weak Pages</span>
          <span className="stat-value">{weakPages.length}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Very Weak Pages</span>
          <span className="stat-value">{veryWeakPages.length}</span>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Estimated Workload</h2>
        
        <div className="stat-row">
          <span className="stat-label">Total Time</span>
          <span className="stat-value">{estimatedWorkload.totalMinutes} min</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Daily Time</span>
          <span className="stat-value">{estimatedWorkload.dailyMinutes} min</span>
        </div>
      </div>

      <div className="card" style={{ background: '#FEF3C7' }}>
        <p style={{ margin: 0, fontSize: 14, color: '#92400E', lineHeight: 1.5 }}>
          💡 You're making great progress! Focus on the weak pages to strengthen your memorization.
        </p>
      </div>

      <button className="pill-button" onClick={onNext}>
        Continue
      </button>
    </div>
  );
}
