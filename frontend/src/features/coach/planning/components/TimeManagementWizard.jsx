// frontend/src/features/coach/components/TimeManagementWizard.jsx
// Deterministic Time Management wizard with frontend-owned state machine
// STRICT: No LLM control over UI, navigation, or step logic

import React, { useState } from 'react';
import { authFetch } from '../../../../shared/services/http';

// Wizard states (frontend-owned - exact specification)
const TM_STATES = {
  STEP_1: 'tm_step_1',
  STEP_2_ANALYSIS: 'tm_step_2_analysis',
  STEP_3_WEEKLY_CYCLE: 'tm_step_3_weekly_cycle',
  STEP_4_DAILY_SCHEDULE: 'tm_step_4_daily_schedule',
  STEP_5_FREQUENCY: 'tm_step_5_frequency',
  STEP_6_EXCEPTIONS: 'tm_step_6_exceptions',
  STEP_7_TIME_INPUTS: 'tm_step_7_time_inputs',
  STEP_8_PREFERENCES: 'tm_step_8_preferences',
  STEP_9_GENERATE: 'tm_step_9_generate',
  STEP_10_CONFIRMATION: 'tm_step_10_confirmation',
};

export default function TimeManagementWizard() {
  const [currentState, setCurrentState] = useState(TM_STATES.STEP_1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data
  const [useCurrentLogs, setUseCurrentLogs] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [weeklyCycle, setWeeklyCycle] = useState(null);
  const [dailySchedule, setDailySchedule] = useState({
    wake: '',
    school: '',
    work: '',
    sleep: '',
  });
  const [frequency, setFrequency] = useState(null);
  const [exceptions, setExceptions] = useState('');
  const [timeInputs, setTimeInputs] = useState({
    jadeedMinutes: '',
    juzHaliPages: '',
  });
  const [preferences, setPreferences] = useState({
    murajaah: [],
    jadeed: [],
    juzHali: [],
  });
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [scheduleSatisfied, setScheduleSatisfied] = useState(null);

  // API calls (backend-only scheduling logic)
  const analyzeProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/coach/wizard/tm/analyze', {
        method: 'POST',
        body: JSON.stringify({ useCurrentLogs }),
      }, 'analyzeProgress');
      setAnalysisData(res.data);
      setCurrentState(TM_STATES.STEP_2_ANALYSIS);
    } catch (err) {
      console.error('[TimeManagementWizard] Failed to analyze progress:', err);
      setError('Failed to analyze progress');
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyCycle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/coach/wizard/tm/cycle', {
        method: 'POST',
        body: JSON.stringify({ analysisData }),
      }, 'generateWeeklyCycle');
      setWeeklyCycle(res.data);
      setCurrentState(TM_STATES.STEP_4_DAILY_SCHEDULE);
    } catch (err) {
      console.error('[TimeManagementWizard] Failed to generate weekly cycle:', err);
      setError('Failed to generate weekly cycle');
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/coach/wizard/tm/generate', {
        method: 'POST',
        body: JSON.stringify({
          weeklyCycle,
          dailySchedule,
          frequency,
          exceptions,
          timeInputs,
          preferences,
        }),
      }, 'generateSchedule');
      setGeneratedSchedule(res.data);
      setCurrentState(TM_STATES.STEP_10_CONFIRMATION);
    } catch (err) {
      console.error('[TimeManagementWizard] Failed to generate schedule:', err);
      setError('Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      await authFetch('/coach/wizard/tm/save', {
        method: 'POST',
        body: JSON.stringify({ schedule: generatedSchedule }),
      }, 'saveSchedule');
      // Reset to home or completion state
      setCurrentState(TM_STATES.STEP_1);
    } catch (err) {
      console.error('[TimeManagementWizard] Failed to save schedule:', err);
      setError('Failed to save schedule');
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setCurrentState(TM_STATES.STEP_1);
    setUseCurrentLogs(null);
    setAnalysisData(null);
    setWeeklyCycle(null);
    setDailySchedule({ wake: '', school: '', work: '', sleep: '' });
    setFrequency(null);
    setExceptions('');
    setTimeInputs({ jadeedMinutes: '', juzHaliPages: '' });
    setPreferences({ murajaah: [], jadeed: [], juzHali: [] });
    setGeneratedSchedule(null);
    setScheduleSatisfied(null);
    setError(null);
  };

  // Render based on state (exact specification)
  const renderContent = () => {
    switch (currentState) {
      case TM_STATES.STEP_1:
        return (
          <div className="tm-wizard-step">
            <h2>🤖 Continue using current logs?</h2>
            <div className="tm-options">
              <button onClick={() => { setUseCurrentLogs(true); analyzeProgress(); }}>
                1. Yes
              </button>
              <button onClick={() => window.open('/diary', '_blank')}>
                2. Open Logs Page
              </button>
            </div>
          </div>
        );

      case TM_STATES.STEP_2_ANALYSIS:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Analyzing your current progress...</h3>
            {analysisData && (
              <div className="tm-analysis">
                <h4>Completed</h4>
                {analysisData.completedMarhalas?.map((m, i) => (
                  <div key={i}>✓ {m}</div>
                ))}
                <h4>Current</h4>
                <p>{analysisData.currentMarhala}</p>
                <p>Sipara {analysisData.currentSipara}</p>
                <p>Page {analysisData.currentPage} / {analysisData.totalPages}</p>
              </div>
            )}
            <button onClick={generateWeeklyCycle}>
              Next
            </button>
          </div>
        );

      case TM_STATES.STEP_3_WEEKLY_CYCLE:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Building your weekly revision cycle...</h3>
            {weeklyCycle && (
              <div className="tm-cycle">
                {weeklyCycle.map((day, i) => (
                  <div key={i}>
                    <h4>{day.day}</h4>
                    {day.siparas.map((s, j) => <p key={j}>{s}</p>)}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setCurrentState(TM_STATES.STEP_4_DAILY_SCHEDULE)}>
              Next
            </button>
          </div>
        );

      case TM_STATES.STEP_4_DAILY_SCHEDULE:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Enter your daily routine</h3>
            <p>Example: Wake 5am, School 8am-2pm, Sleep 10pm</p>
            <label>Wake:</label>
            <input
              type="text"
              value={dailySchedule.wake}
              onChange={(e) => setDailySchedule({ ...dailySchedule, wake: e.target.value })}
            />
            <label>School:</label>
            <input
              type="text"
              value={dailySchedule.school}
              onChange={(e) => setDailySchedule({ ...dailySchedule, school: e.target.value })}
            />
            <label>Work:</label>
            <input
              type="text"
              value={dailySchedule.work}
              onChange={(e) => setDailySchedule({ ...dailySchedule, work: e.target.value })}
            />
            <label>Sleep:</label>
            <input
              type="text"
              value={dailySchedule.sleep}
              onChange={(e) => setDailySchedule({ ...dailySchedule, sleep: e.target.value })}
            />
            <button onClick={() => setCurrentState(TM_STATES.STEP_5_FREQUENCY)}>
              Next
            </button>
            <button onClick={() => setCurrentState(TM_STATES.STEP_3_WEEKLY_CYCLE)}>
              Back
            </button>
          </div>
        );

      case TM_STATES.STEP_5_FREQUENCY:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Is this schedule followed on:</h3>
            <div className="tm-options">
              <button onClick={() => { setFrequency('mon-sat'); setCurrentState(TM_STATES.STEP_6_EXCEPTIONS); }}>
                1. Monday-Saturday
              </button>
              <button onClick={() => { setFrequency('mon-sun'); setCurrentState(TM_STATES.STEP_6_EXCEPTIONS); }}>
                2. Monday-Sunday
              </button>
            </div>
            <button onClick={() => setCurrentState(TM_STATES.STEP_4_DAILY_SCHEDULE)}>
              Back
            </button>
          </div>
        );

      case TM_STATES.STEP_6_EXCEPTIONS:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Weekly Exceptions</h3>
            <p>Type any weekly events (sports, classes, meetings)</p>
            <p>Example: Sports Monday 5:00-6:00 PM</p>
            <textarea
              value={exceptions}
              onChange={(e) => setExceptions(e.target.value)}
              placeholder="Enter exceptions..."
            />
            <button onClick={() => setCurrentState(TM_STATES.STEP_7_TIME_INPUTS)}>
              Next
            </button>
            <button onClick={() => setCurrentState(TM_STATES.STEP_5_FREQUENCY)}>
              Back
            </button>
          </div>
        );

      case TM_STATES.STEP_7_TIME_INPUTS:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Time Allocation</h3>
            <label>How many minutes do you have for Jadeed (new) each day?</label>
            <input
              type="number"
              value={timeInputs.jadeedMinutes}
              onChange={(e) => setTimeInputs({ ...timeInputs, jadeedMinutes: e.target.value })}
            />
            <label>How many pages of Juz Hali (recent) this week?</label>
            <input
              type="number"
              value={timeInputs.juzHaliPages}
              onChange={(e) => setTimeInputs({ ...timeInputs, juzHaliPages: e.target.value })}
            />
            <button onClick={() => setCurrentState(TM_STATES.STEP_8_PREFERENCES)}>
              Next
            </button>
            <button onClick={() => setCurrentState(TM_STATES.STEP_6_EXCEPTIONS)}>
              Back
            </button>
          </div>
        );

      case TM_STATES.STEP_8_PREFERENCES:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Preferences (Multi-Select)</h3>
            <h4>Muraja'ah (cumulative revision)</h4>
            <div className="tm-multi-select">
              {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                <label key={time}>
                  <input
                    type="checkbox"
                    checked={preferences.murajaah.includes(time)}
                    onChange={(e) => {
                      const newPrefs = e.target.checked
                        ? [...preferences.murajaah, time]
                        : preferences.murajaah.filter(t => t !== time);
                      setPreferences({ ...preferences, murajaah: newPrefs });
                    }}
                  />
                  {time}
                </label>
              ))}
            </div>
            <h4>Jadeed (new memorization)</h4>
            <div className="tm-multi-select">
              {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                <label key={time}>
                  <input
                    type="checkbox"
                    checked={preferences.jadeed.includes(time)}
                    onChange={(e) => {
                      const newPrefs = e.target.checked
                        ? [...preferences.jadeed, time]
                        : preferences.jadeed.filter(t => t !== time);
                      setPreferences({ ...preferences, jadeed: newPrefs });
                    }}
                  />
                  {time}
                </label>
              ))}
            </div>
            <h4>Juz Hali (recent revision)</h4>
            <div className="tm-multi-select">
              {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                <label key={time}>
                  <input
                    type="checkbox"
                    checked={preferences.juzHali.includes(time)}
                    onChange={(e) => {
                      const newPrefs = e.target.checked
                        ? [...preferences.juzHali, time]
                        : preferences.juzHali.filter(t => t !== time);
                      setPreferences({ ...preferences, juzHali: newPrefs });
                    }}
                  />
                  {time}
                </label>
              ))}
            </div>
            <button onClick={generateSchedule}>
              Generate Schedule
            </button>
            <button onClick={() => setCurrentState(TM_STATES.STEP_7_TIME_INPUTS)}>
              Back
            </button>
          </div>
        );

      case TM_STATES.STEP_9_GENERATE:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Generating your weekly schedule...</h3>
            {loading && <p>Loading...</p>}
          </div>
        );

      case TM_STATES.STEP_10_CONFIRMATION:
        return (
          <div className="tm-wizard-step">
            <h3>🤖 Are you satisfied with this schedule?</h3>
            {generatedSchedule && (
              <div className="tm-schedule">
                <pre>{generatedSchedule.formattedText}</pre>
              </div>
            )}
            <div className="tm-options">
              <button onClick={() => { setScheduleSatisfied(true); saveSchedule(); }}>
                1. Yes
              </button>
              <button onClick={() => { setScheduleSatisfied(false); setCurrentState(TM_STATES.STEP_8_PREFERENCES); }}>
                2. Request Changes
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="time-management-wizard">
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      {renderContent()}
    </div>
  );
}
