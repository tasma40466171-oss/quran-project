import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { schedulerApi } from './services/schedulerApi';
import { authFetch } from '../../shared/services/http';
import { useTour } from '../../shared/context/TourContext';
import './styles/wizard.css';

// Screen components
import ProgressAnalysis from './wizard/ProgressAnalysis';
import WeeklyCycle from './wizard/WeeklyCycle';
import BuildMyWeek from './wizard/BuildMyWeek';
import Exceptions from './wizard/Exceptions';
import Review from './wizard/Review';
import GeneratedSchedule from './wizard/GeneratedSchedule';
import UnitDetails from './wizard/UnitDetails';
import AdjustUnit from './wizard/AdjustUnit';

const STEPS = {
  PROGRESS_ANALYSIS: 1,
  WEEKLY_CYCLE: 2,
  BUILD_WEEK: 3,
  EXCEPTIONS: 4,
  REVIEW: 5,
  GENERATED_SCHEDULE: 6,
  UNIT_DETAILS: 7,
  ADJUST_UNIT: 8
};

export default function SchedulerWizard({ onBack }) {
  const navigate = useNavigate();
  const { isActive, isActiveRef, dispatchTourEvent } = useTour();
  const [currentStep, setCurrentStep] = useState(STEPS.PROGRESS_ANALYSIS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Wizard data
  const [analysis, setAnalysis] = useState(null);
  const [weeklyCycle, setWeeklyCycle] = useState(null);
  const [events, setEvents] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    loadProgressAnalysis();
  }, []);

  const loadProgressAnalysis = async () => {
    try {
      setLoading(true);
      // Call the actual progress analysis API
      const analysisJson = await authFetch('/coach/wizard/tm/analyze', {
        method: 'POST',
        body: JSON.stringify({ useCurrentLogs: true }),
      }, 'loadProgressAnalysis');
      
      if (analysisJson?.success && analysisJson?.data) {
        setAnalysis(analysisJson.data);
      } else {
        setError('Failed to load analysis data');
      }
    } catch (err) {
      console.error('Failed to load progress analysis:', err);
      setError('Failed to analyze logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyCycle = async () => {
    try {
      setLoading(true);
      // Call the actual weekly cycle API
      const cycleJson = await authFetch('/coach/wizard/tm/cycle', {
        method: 'POST',
        body: JSON.stringify({ analysisData: analysis }),
      }, 'loadWeeklyCycle');
      
      if (cycleJson?.success && cycleJson?.data) {
        setWeeklyCycle(cycleJson.data);
      } else {
        setError('Failed to load weekly cycle');
      }
    } catch (err) {
      console.error('Failed to load weekly cycle:', err);
      setError('Failed to generate weekly cycle');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await schedulerApi.getEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    }
  };

  const generateSchedule = async () => {
    try {
      setLoading(true);
      const scheduleData = await schedulerApi.generateSchedule({
        events,
        exceptions,
        progressAnalysis: analysis,
        weeklyCycle
      });
      setSchedule(scheduleData);
    } catch (err) {
      console.error('Generate schedule error:', err);
      setError('Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoutine = () => {
    setCurrentStep(STEPS.BUILD_WEEK);
  };

  const handleNext = () => {
    // Dispatch tour event for auto-advance
    if (isActiveRef.current) {
      dispatchTourEvent('coach:continue');
    }
    
    if (currentStep === STEPS.PROGRESS_ANALYSIS) {
      loadWeeklyCycle();
      setCurrentStep(STEPS.WEEKLY_CYCLE);
    } else if (currentStep === STEPS.WEEKLY_CYCLE) {
      loadEvents();
      setCurrentStep(STEPS.BUILD_WEEK);
    } else if (currentStep === STEPS.BUILD_WEEK) {
      setCurrentStep(STEPS.EXCEPTIONS);
    } else if (currentStep === STEPS.EXCEPTIONS) {
      setCurrentStep(STEPS.REVIEW);
    } else if (currentStep === STEPS.REVIEW) {
      generateSchedule();
      setCurrentStep(STEPS.GENERATED_SCHEDULE);
    } else if (currentStep === STEPS.GENERATED_SCHEDULE) {
      setCurrentStep(STEPS.UNIT_DETAILS);
    } else if (currentStep === STEPS.UNIT_DETAILS) {
      setCurrentStep(STEPS.ADJUST_UNIT);
    }
  };

  const handleBack = () => {
    if (currentStep === STEPS.PROGRESS_ANALYSIS) {
      navigate(-1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    setCurrentStep(STEPS.UNIT_DETAILS);
  };

  if (loading) {
    return (
      <div className="scheduler-wizard loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scheduler-wizard error">
        <div className="error-message">{error}</div>
        <button onClick={handleBack}>Back</button>
      </div>
    );
  }

  return (
    <div className="scheduler-wizard">
      <div className="wizard-header">
        {currentStep !== STEPS.PROGRESS_ANALYSIS && (
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
        )}
        <div className="step-indicator">
          Step {currentStep} of 8
        </div>
      </div>

      <div className="wizard-content">
        {currentStep === STEPS.PROGRESS_ANALYSIS && (
          <ProgressAnalysis analysis={analysis} onNext={handleNext} />
        )}

        {currentStep === STEPS.WEEKLY_CYCLE && (
          <WeeklyCycle weeklyCycle={weeklyCycle} analysis={analysis} onNext={handleNext} onBack={handleBack} />
        )}

        {currentStep === STEPS.BUILD_WEEK && (
          <BuildMyWeek 
            events={events} 
            onEventsChange={loadEvents} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}

        {currentStep === STEPS.EXCEPTIONS && (
          <Exceptions 
            exceptions={exceptions} 
            onExceptionsChange={setExceptions}
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}

        {currentStep === STEPS.REVIEW && (
          <Review 
            events={events}
            exceptions={exceptions}
            onNext={handleNext} 
            onBack={handleBack}
            onEditRoutine={handleEditRoutine}
          />
        )}

        {currentStep === STEPS.GENERATED_SCHEDULE && (
          <GeneratedSchedule 
            schedule={schedule} 
            weeklyCycle={weeklyCycle}
            onSelectUnit={handleSelectUnit}
            onBack={handleBack} 
          />
        )}

        {currentStep === STEPS.UNIT_DETAILS && (
          <UnitDetails 
            unit={selectedUnit} 
            onNext={handleNext} 
            onBack={() => setCurrentStep(STEPS.GENERATED_SCHEDULE)} 
          />
        )}

        {currentStep === STEPS.ADJUST_UNIT && (
          <AdjustUnit 
            unit={selectedUnit}
            onBack={() => setCurrentStep(STEPS.UNIT_DETAILS)} 
          />
        )}
      </div>
    </div>
  );
}
