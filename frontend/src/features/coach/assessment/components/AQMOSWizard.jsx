// frontend/src/features/coach/components/AQMOSWizard.jsx
// Deterministic AQMOS (learning style) wizard with frontend-owned state machine
// STRICT: No LLM control over UI, navigation, or classification

import React, { useState } from 'react';
import { authFetch } from '../../../../shared/services/http';

// Wizard states (frontend-owned)
const AQMOS_STATES = {
  STEP_1: 'aqmos_step_1',
  STEP_2: 'aqmos_step_2',
  STEP_3: 'aqmos_step_3',
};

// Accepted profiles (deterministic validation)
const ACCEPTED_PROFILES = [
  'Exploratory Learner',
  'Repetitive Learner',
  'Sensitive Structured Learner',
  'Balanced Learner',
];

export default function AQMOSWizard() {
  const [currentState, setCurrentState] = useState(AQMOS_STATES.STEP_1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data
  const [assessmentCompleted, setAssessmentCompleted] = useState(null);
  const [profile, setProfile] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  // API calls (backend-only logic)
  const saveProfile = async (profileName) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/coach/wizard/aqmos/save', {
        method: 'POST',
        body: JSON.stringify({ profile: profileName }),
      }, 'saveProfile');
      setRecommendation(res.data);
      setCurrentState(AQMOS_STATES.STEP_3);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setCurrentState(AQMOS_STATES.STEP_1);
    setAssessmentCompleted(null);
    setProfile('');
    setRecommendation(null);
    setError(null);
  };

  // Render based on state
  const renderContent = () => {
    switch (currentState) {
      case AQMOS_STATES.STEP_1:
        return (
          <div className="aqmos-wizard-step">
            <h3>🤖 Have you completed the Cognitive Learning Assessment?</h3>
            <div className="aqmos-options">
              <button onClick={() => { setAssessmentCompleted(true); setCurrentState(AQMOS_STATES.STEP_2); }}>
                1. Yes
              </button>
              <button onClick={() => window.open('/best-method', '_blank')}>
                2. No
              </button>
            </div>
          </div>
        );

      case AQMOS_STATES.STEP_2:
        return (
          <div className="aqmos-wizard-step">
            <h3>🤖 Type the profile headline shown in your assessment report.</h3>
            <p>Examples:</p>
            <ul>
              <li>Exploratory Learner</li>
              <li>Repetitive Learner</li>
              <li>Sensitive Structured Learner</li>
              <li>Balanced Learner</li>
            </ul>
            <input
              type="text"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              placeholder="Enter your profile"
            />
            <button onClick={() => saveProfile(profile)}>
              Save Profile
            </button>
            <button onClick={() => setCurrentState(AQMOS_STATES.STEP_1)}>
              Back
            </button>
          </div>
        );

      case AQMOS_STATES.STEP_3:
        return (
          <div className="aqmos-wizard-results">
            <h3>Profile Saved</h3>
            <p>Your profile: {profile}</p>
            {recommendation && (
              <div className="aqmos-recommendation">
                <h4>Coaching Recommendation</h4>
                <p>{recommendation.message}</p>
              </div>
            )}
            <button onClick={resetWizard}>
              Done
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="aqmos-wizard">
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      {renderContent()}
    </div>
  );
}
