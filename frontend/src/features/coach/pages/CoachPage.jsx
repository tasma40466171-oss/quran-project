// features/coach/CoachPage.jsx
//
// State machine-based coach page following the detailed workflow document
// Uses deterministic state transitions instead of AI-driven conversation flow

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { injectCoachStyles, authFetch } from "../shared/constants/coachConstants";
import { useCoachStateMachine } from "../shared/hooks/useCoachStateMachine";
import { COACH_STATES } from "../shared/constants/coachStates";
import { useTour } from "../../../shared/context/TourContext";

// Module screens
import {
  SequenceHome,
  SequenceModeSelect,
  SequenceInput,
} from "../sequence/components/SequenceScreens";

import {
  MutashabihatHome,
  MutashabihatSearch,
  MutashabihatPairInput,
  MutashabihatAllPairs,
} from "../recommendations/components/MutashabihatScreens";

import {
  AssessmentCheck,
  ProfileInput,
} from "../assessment/components/BestMethodScreens";

import {
  TimeManagementStart,
  TimeManagementAnalysis,
  TimeManagementWeeklyCycle,
  TimeManagementDailyRoutine,
  TimeManagementDays,
  TimeManagementExceptions,
  TimeManagementStudySettings,
  TimeManagementPreferredTimes,
  TimeManagementSchedule,
  TimeManagementFinal,
} from "../planning/components/TimeManagementScreens";

import SchedulerWizard from "../../scheduler/SchedulerWizard";

import { GlobalSidePanel } from "../shared/components/GlobalSidePanel";
import AQMOSProfileModal from "../assessment/components/AQMOSProfileModal";
import AQMOSAssessmentModal from "../assessment/components/AQMOSAssessmentModal";

export default function CoachPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isActive, currentStep, currentStepRef, isActiveRef, dispatchTourEvent } = useTour();
  
  // ── State machine ───────────────────────────────────────────────────────────
  const {
    currentState,
    stateData,
    loading,
    error,
    setError,
    handleHomeOption,
    goToHome,
    handleSequenceOption,
    handleSequenceMode,
    handleSequenceInput,
    handleMutashabihatOption,
    handleMutashabihatSearch,
    handleMutashabihatPairTip,
    handleMutashabihatAllTips,
    handleAssessmentCheck,
    handleProfileInput,
    handleTimeManagementStep1,
    handleTimeManagementContinue,
    handleTimeManagementInput,
    handleTimeManagementSchedule,
    handleTimeManagementSatisfied,
  } = useCoachStateMachine();

  // ── Student data ───────────────────────────────────────────────────────────
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [weakCount, setWeakCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [simCount, setSimCount] = useState(0);

  // ── Global Side Panel data ───────────────────────────────────────────────────
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelData, setSidePanelData] = useState({
    progress: null,
    aqmosProfile: null,
    weeklyCycle: null,
    schedule: null,
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  useEffect(() => {
    injectCoachStyles();
    loadStudentData();
    loadSidePanelData();
  }, []);

  const loadSidePanelData = async () => {
    try {
      // Fetch AQMOS profile from /me endpoint
      const profileJson = await authFetch('/auth/me');
      
      // Fetch progress data from the same endpoint as the wizard
      let progressData = {
        marhala: null,
        sipara: null,
        page: null,
      };
      
      try {
        const analysisJson = await authFetch('/coach/wizard/tm/analyze', {
          method: 'POST',
          body: JSON.stringify({ useCurrentLogs: true }),
        }, 'loadSidePanelProgress');
        
        if (analysisJson?.success && analysisJson?.data) {
          progressData = {
            marhala: analysisJson.data.currentMarhala || analysisJson.data.currentSipara || null,
            sipara: analysisJson.data.currentSipara || null,
            page: analysisJson.data.currentPage || null,
          };
        }
      } catch (e) {
        console.error('[CoachPage] Failed to load progress data for side panel:', e);
      }
      
      // Schedule - not available via API yet, set to null
      const schedule = null;

      setSidePanelData({
        progress: progressData,
        aqmosProfile: profileJson.success ? profileJson.data?.aqmosProfile : null,
        weeklyCycle: null, // Would be fetched from backend
        schedule: schedule,
      });
    } catch (e) {
      console.error('Failed to load side panel data:', e);
    }
  };

  const handleRetakeTest = async () => {
    // Just open the assessment modal - don't clear profile yet
    // Profile will be overwritten when new test is submitted
    setShowAssessmentModal(true);
  };

  const handleViewProfile = () => {
    setShowProfileModal(true);
  };

  const handleProfileSaved = (newProfile) => {
    setSidePanelData(prev => ({ ...prev, aqmosProfile: newProfile }));
    setShowAssessmentModal(false);
  };

  const loadStudentData = async () => {
    setDataLoaded(false);
    setDataError(null);
    try {
      const logsJson = await authFetch('/diary/logs');
      
      if (logsJson.success && logsJson.data) {
        const logs = logsJson.data;
        const pageMap = {};
        logs.forEach((log) => {
          if (!log.page || log.score == null) return;
          if (!pageMap[log.page]) {
            pageMap[log.page] = { page: log.page, juz: log.juz, scores: [] };
          }
          pageMap[log.page].scores.push(Number(log.score));
        });
        
        const heatmapData = Object.values(pageMap).map((entry) => ({
          page: entry.page,
          juz: entry.juz,
          score: entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length,
        }));
        
        const weakPages = heatmapData.filter((p) => p.score <= 5.75);
        setWeakCount(weakPages.length);
        setTotalPages(heatmapData.length);
      }

      // Similarity count requires surah and ayah params, skip for now
      setSimCount(0);

      setDataLoaded(true);
    } catch (e) {
      console.error('Failed to load student data:', e);
      setDataError('Failed to load your progress data. Please try again.');
      setDataLoaded(true);
    }
  };

  // ── Render current state screen ───────────────────────────────────────────────
  const renderCurrentScreen = () => {
    switch (currentState) {
      // SEQUENCE states
      case COACH_STATES.SEQUENCE_HOME:
        return <SequenceHome onSelect={(key) => key === 'back' ? goToHome() : handleSequenceOption(key)} />;
      case COACH_STATES.SEQUENCE_SURAH_MODE:
      case COACH_STATES.SEQUENCE_PAGE_MODE:
      case COACH_STATES.SEQUENCE_JUZ_PAGE_MODE:
        return <SequenceModeSelect onSelect={(mode) => mode === 'back' ? goToHome() : handleSequenceMode(mode)} />;
      case COACH_STATES.SEQUENCE_SURAH_INPUT:
        return <SequenceInput onSubmit={handleSequenceInput} onBack={goToHome} placeholder="e.g., 36" title="Enter Surah Number or Name" />;
      case COACH_STATES.SEQUENCE_PAGE_INPUT:
        return <SequenceInput onSubmit={handleSequenceInput} onBack={goToHome} placeholder="e.g., 250" title="Enter Page Number" />;
      case COACH_STATES.SEQUENCE_JUZ_PAGE_INPUT:
        return <SequenceInput onSubmit={handleSequenceInput} onBack={goToHome} placeholder="e.g., 10" title="Enter Juz Number" />;
      case COACH_STATES.SEQUENCE_JUZ_SURAH_INPUT:
        return <SequenceInput onSubmit={handleSequenceInput} onBack={goToHome} placeholder="e.g., 30" title="Enter Juz Number" />;

      // MUTASHABIHAT states
      case COACH_STATES.MUTASHABIHAT_HOME:
        return <MutashabihatHome onSelect={(key) => key === 'back' ? goToHome() : handleMutashabihatOption(key)} savedTips={[]} />;
      case COACH_STATES.MUTASHABIHAT_SEARCH_SURAH:
        return <MutashabihatSearch onSurahSubmit={handleMutashabihatSearch} onBack={goToHome} />;
      case COACH_STATES.MUTASHABIHAT_PAIR_A_SURAH:
        return <MutashabihatPairInput onSubmit={handleMutashabihatPairTip} onBack={goToHome} />;
      case COACH_STATES.MUTASHABIHAT_ALL_PAIRS_SURAH:
        return <MutashabihatAllPairs onSubmit={handleMutashabihatAllTips} onBack={goToHome} />;

      // BEST METHOD states
      case COACH_STATES.STYLE_ASSESSMENT_CHECK:
        return <AssessmentCheck onSelect={(hasCompleted) => hasCompleted === 'back' ? goToHome() : handleAssessmentCheck(hasCompleted)} />;
      case COACH_STATES.STYLE_PROFILE_INPUT:
        return <ProfileInput onSubmit={handleProfileInput} onBack={goToHome} saved={stateData.saved} profile={stateData.profile} existingProfile={stateData.existingProfile} />;

      // TIME MANAGEMENT states
      case COACH_STATES.TIME_MANAGEMENT_START:
        return <SchedulerWizard onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_ANALYSIS:
        return <TimeManagementAnalysis analysis={stateData.analysis} onContinue={handleTimeManagementContinue} onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_WEEKLY_CYCLE:
        return <TimeManagementWeeklyCycle weeklyCycle={stateData.weeklyCycle} onContinue={handleTimeManagementContinue} onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_DAILY_ROUTINE:
        return <TimeManagementDailyRoutine data={stateData} onChange={handleTimeManagementInput} onContinue={handleTimeManagementContinue} onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_DAYS:
        return <TimeManagementDays onSelect={(days) => handleTimeManagementInput('days', days)} onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_EXCEPTIONS:
        return <TimeManagementExceptions data={stateData} onChange={handleTimeManagementInput} onContinue={handleTimeManagementContinue} onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_STUDY_SETTINGS:
        return <TimeManagementStudySettings data={stateData} onChange={handleTimeManagementInput} onContinue={handleTimeManagementContinue} onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_PREFERRED_TIMES:
        return <TimeManagementPreferredTimes data={stateData} onChange={handleTimeManagementInput} onContinue={handleTimeManagementSchedule} onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_SCHEDULE:
        return <TimeManagementSchedule schedule={stateData.schedule} onSatisfied={handleTimeManagementSatisfied} onBack={goToHome} />;
      case COACH_STATES.TIME_MANAGEMENT_FINAL:
        return <TimeManagementFinal onBack={goToHome} />;

      default:
        return null;
    }
  };

  // ── Check if current state is MUTASHABIHAT (hide Global Side Panel) ─────────────
  const isMutashabihatState = currentState.startsWith('MUTASHABIHAT') || 
                               currentState === 'mutashabihat_home' ||
                               currentState === 'mutashabihat_search_surah' ||
                               currentState === 'mutashabihat_search_ayah' ||
                               currentState === 'mutashabihat_results' ||
                               currentState === 'pair_a_surah' ||
                               currentState === 'pair_a_ayah' ||
                               currentState === 'pair_b_surah' ||
                               currentState === 'pair_b_ayah' ||
                               currentState === 'pair_tip_result' ||
                               currentState === 'all_pairs_surah' ||
                               currentState === 'all_pairs_ayah';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex", height: "100%", minHeight: 520,
      background: "white", borderRadius: 16,
      border: "1px solid #E5E7EB", overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    }}>
      {/* ── Centre: main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* Header */}
        <div style={{
          padding: "12px 16px", borderBottom: "1px solid #F3F4F6",
          display: "flex", alignItems: "center", gap: 10,
          background: "white", flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "#004D40",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <i className="ti ti-star-filled" style={{ fontSize: 16, color: "#F2C94C" }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Hifz Planner</div>
            <div style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: dataLoaded ? "#10B981" : "#F59E0B",
                display: "inline-block",
              }} />
              {dataLoaded ? "Ready · data loaded" : "Loading your data…"}
            </div>
          </div>

          {!isMutashabihatState && (
            <button
              onClick={() => {
                setSidePanelOpen(!sidePanelOpen);
                if (isActiveRef.current && currentStepRef.current === 26) {
                  dispatchTourEvent('coach:continue');
                }
              }}
              style={{
                padding: "6px 12px",
                background: sidePanelOpen ? "#E6F4F1" : "#F3F4F6",
                border: sidePanelOpen ? "1px solid #004D40" : "1px solid #D1D5DB",
                borderRadius: 6, color: sidePanelOpen ? "#004D40" : "#6B7280",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              {sidePanelOpen ? 'Hide Panel' : 'Show Panel'}
            </button>
          )}
        </div>

        {/* Main content area */}
        <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
          {dataError && (
            <div style={{
              padding: "12px 16px", background: "#FEF2F2",
              borderBottom: "1px solid #FECACA", color: "#991B1B",
              fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>{dataError}</span>
              <button
                onClick={loadStudentData}
                style={{ padding: "4px 8px", background: "#DC2626", color: "white", border: "none", borderRadius: 4, fontSize: 11, cursor: "pointer" }}
              >
                Retry
              </button>
            </div>
          )}
          {error && (
            <div style={{
              padding: "12px 16px", background: "#FEF2F2",
              borderBottom: "1px solid #FECACA", color: "#991B1B",
              fontSize: 13,
            }}>
              {error}
              <button onClick={() => setError(null)} style={{ marginLeft: 12, background: "none", border: "none", color: "#991B1B", cursor: "pointer", fontSize: 12 }}>
                ✕
              </button>
            </div>
          )}
          
          {loading ? (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "100%", fontSize: 14, color: "#6B7280",
            }}>
              Loading...
            </div>
          ) : (
            renderCurrentScreen()
          )}
        </div>
      </div>

      {/* ── Right: Global Side Panel (hidden in MUTASHABIHAT states) ── */}
      {!isMutashabihatState && (
        <GlobalSidePanel
          progress={sidePanelData.progress}
          aqmosProfile={sidePanelData.aqmosProfile}
          weeklyCycle={sidePanelData.weeklyCycle}
          schedule={sidePanelData.schedule}
          isOpen={sidePanelOpen}
          onToggle={() => setSidePanelOpen(!sidePanelOpen)}
          onRetakeTest={handleRetakeTest}
          onViewProfile={handleViewProfile}
        />
      )}

      {/* AQMOS Profile Modal */}
      {showProfileModal && (
        <AQMOSProfileModal
          profile={sidePanelData.aqmosProfile}
          onClose={() => setShowProfileModal(false)}
          onRetakeTest={handleRetakeTest}
        />
      )}

      {/* AQMOS Assessment Modal */}
      {showAssessmentModal && (
        <AQMOSAssessmentModal
          onClose={() => setShowAssessmentModal(false)}
          onProfileSaved={handleProfileSaved}
        />
      )}
    </div>
  );
}