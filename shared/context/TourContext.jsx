import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const navigateRef = useRef(null);
  const currentStepRef = useRef(0);
  const isActiveRef = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Tour steps with page assignments
  const tourSteps = [
    { step: 1, page: '/similarity', trigger: 'manual', content: "Welcome to the Mutashābihāt tool. Find structurally similar verses that are easy to confuse." },
    { step: 2, page: '/similarity', trigger: 'manual', content: "Use this dropdown to filter by your memorisation stage. Try switching it now!" },
    { step: 3, page: '/similarity', trigger: 'action', triggerEvent: 'similarity:searched', content: "Enter any Surah and Ayah number, then click 'Find Similarities'. Try it now!" },
    { step: 4, page: '/similarity', trigger: 'action', triggerEvent: 'similarity:result:selected', content: "Click on any result in the list to open its details in the side panel." },
    { step: 5, page: '/similarity', trigger: 'manual', content: "Mutashabiha Score 0–100: higher = more confusable. Scores above 70 need careful attention." },
    { step: 6, page: '/similarity', trigger: 'action', triggerEvent: 'tip:edit:opened', content: "Click the ✏️ edit icon on the Memory Tip to personalise it." },
    { step: 7, page: '/similarity', trigger: 'manual', content: "Every pair is bidirectional — Verse A ↔ Verse B. You'll always see both sides." },
    { step: 8, page: '/flashcards', trigger: 'manual', content: "4 flashcard types: Ayah in Surah, Ayah in Page, Pages in Juz, Surahs in Juz." },
    { step: 9, page: '/flashcards', trigger: 'action', triggerEvent: 'flashcard:created', content: "Click '+ Create Flashcard Set', configure it, and click Generate." },
    { step: 10, page: '/flashcards', trigger: 'action', triggerEvent: 'flashcard:opened', content: "Click on your new flashcard set from the list to open it." },
    { step: 11, page: '/flashcards', trigger: 'manual', content: "You can see the Memory Aid and Study questions. Click 'Next' to continue." },
    { step: 12, page: '/flashcards', trigger: 'manual', content: "Memory Aid has 3 tabs: Flowchart, First Words, AI Story. Each helps you memorise differently." },
    { step: 13, page: '/flashcards', trigger: 'action', triggerEvent: 'flashcard:test:opened', content: "Click the 'Test Yourself' tab to see how it works." },
    { step: 14, page: '/flashcards', trigger: 'manual', content: "✏️ Pencil icon = rename the set. 'Delete Set' button = delete it when the set is open." },
    { step: 15, page: '/flashcards', trigger: 'action', triggerEvent: 'folder:created', content: "Click '+ New Folder' to create a folder. Type a name and press Enter." },
    { step: 16, page: '/flashcards', trigger: 'action', triggerEvent: 'folder:item:added', content: "Click a folder to open it, then click '+ Add Sets to Folder'. Select sets and click Add." },
    { step: 17, page: '/flashcards', trigger: 'manual', content: "Built-in Categories are always on the left sidebar — Surah Openings, Verses Twice, Mnemonics & more." },
    { step: 18, page: '/diary', trigger: 'manual', content: "This is your Hifz Diary. It has 5 entry types and powerful analysis tools." },
    { step: 19, page: '/diary', trigger: 'manual', content: "5 entry types: MURAJAH, TASMEE, IKHTEBAR, JADEED, JUZ HALI. Try filling one entry." },
    { step: 20, page: '/diary', trigger: 'action', triggerEvent: 'task:added', content: "Choose a type, type a task name, and click Add." },
    { step: 21, page: '/diary', trigger: 'action', triggerEvent: 'task:status:changed', content: "Click the status badge on any task to update it (Pending → In Progress → Completed)." },
    { step: 22, page: '/diary', trigger: 'manual', content: "🔥 Log any entry daily to grow your streak. Miss a day = streak freezes (not reset)." },
    { step: 23, page: '/diary', trigger: 'manual', content: "🗺️ Qur'an Map: green = strong, orange = fair, red = urgent. Updates as you log entries." },
    { step: 24, page: '/diary', trigger: 'manual', content: "Every entry you log is saved to your diary timeline. Track your hifz progress over time." },
    { step: 25, page: '/diary', trigger: 'manual', content: "🗺️ Reading the Qur'an Map: green pages are strong (7-10), orange are fair (3-6), red need urgent revision (1-2)." },
    { step: 26, page: '/coach', trigger: 'action', triggerEvent: 'coach:continue', content: "📊 This is your Progress Overview — completed Siparas, current page, and page strength scores. Click Continue to proceed." },
    { step: 27, page: '/coach', trigger: 'action', triggerEvent: 'coach:continue', content: "⏰ Weekly Cycle sets how many days per week you study. It generates your schedule from page strength scores. Click Continue." },
    { step: 28, page: '/coach', trigger: 'action', triggerEvent: 'coach:continue', content: "🗓️ Add your fixed events like prayers and school. The wizard fills in Quran study slots automatically. Click Continue." },
    { step: 29, page: '/coach', trigger: 'action', triggerEvent: 'coach:continue', content: "📅 Each day's routine is built around your locked events. Weaker pages get longer revision slots. Click Continue." },
    { step: 30, page: '/coach', trigger: 'action', triggerEvent: 'coach:continue', content: "📆 Review your full weekly schedule here. Adjust any day by going back. Click Continue." },
    { step: 31, page: '/coach', trigger: 'manual', content: "✅ Your Hifz schedule is ready! Check the side panel for your AQMOS Profile and Current Schedule." },
    { step: 32, page: '/', trigger: 'manual', content: "🎉 Tour complete! You're all set to start your Hifz journey. May Allah make it easy for you. آمين" },
  ];

  // Check localStorage on mount
  useEffect(() => {
    const tourCompleted = localStorage.getItem('hifz_tour_completed') === 'true';
    if (tourCompleted) {
      setIsActive(false);
    }
  }, []);

  // Navigate to current step's page when tour becomes active
  useEffect(() => {
    if (isActive && currentStep > 0 && tourSteps[currentStep - 1]?.page && navigateRef.current) {
      navigateRef.current(tourSteps[currentStep - 1].page);
    }
  }, [isActive, currentStep]);

  // Keep refs in sync with state to avoid stale closures
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const startTour = () => {
    console.log('[TourContext] Starting tour');
    // Log all tour steps for debugging
    tourSteps.forEach((s, i) => console.log(`Step ${i+1}: page=${s.page} trigger=${s.trigger} content=${s.content.substring(0, 50)}...`));
    setCurrentStep(1);
    currentStepRef.current = 1;
    setCompletedSteps([]);
    setIsActive(true);
    // Navigate to first step's page
    const firstStep = tourSteps[0];
    if (firstStep?.page && navigateRef.current) {
      navigateRef.current(firstStep.page);
    }
  };

  const advanceStep = useCallback(() => {
    const nextStepIndex = currentStepRef.current + 1;
    const nextStepData = tourSteps[nextStepIndex - 1];
    const currentStepData = tourSteps[currentStepRef.current - 1];

    console.log('[TourContext] Advancing from step', currentStepRef.current, 'to', nextStepIndex);

    // If next step is on a different page, navigate there first
    if (nextStepData && currentStepData && nextStepData.page !== currentStepData.page) {
      console.log('[TourContext] Navigating to', nextStepData.page);
      if (navigateRef.current) {
        navigateRef.current(nextStepData.page);
        // Delay for page to mount before incrementing step
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, currentStepRef.current]);
          setCurrentStep(nextStepIndex);
          currentStepRef.current = nextStepIndex;
        }, 400);
      }
    } else {
      setCompletedSteps(prev => [...prev, currentStepRef.current]);
      setCurrentStep(nextStepIndex);
      currentStepRef.current = nextStepIndex;
    }
  }, [tourSteps]);

  // Event system for action-triggered steps
  const dispatchTourEvent = useCallback((eventName) => {
    try {
      const currentStepData = tourSteps[currentStepRef.current - 1];
      console.log('[TourContext] Event dispatched:', eventName, 'Current step:', currentStepRef.current, 'Expected:', currentStepData?.triggerEvent);
      
      if (
        isActiveRef.current &&
        currentStepData?.trigger === 'action' &&
        currentStepData?.triggerEvent === eventName
      ) {
        console.log('[TourContext] Action matched, auto-advancing after 600ms');
        // Auto-advance after brief delay so user sees their action completed
        setTimeout(() => {
          advanceStep();
        }, 600);
      }
    } catch (error) {
      console.error('[TourContext] Error in dispatchTourEvent:', error);
    }
  }, [tourSteps, advanceStep]);

  const registerNavigate = (fn) => {
    navigateRef.current = fn;
  };

  const goToStep = (step) => {
    console.log('[TourContext] Going to step', step);
    setCurrentStep(step);
  };

  const exitTour = () => {
    console.log('[TourContext] Exiting tour');
    setIsActive(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const completeTour = async () => {
    console.log('[TourContext] Completing tour');
    localStorage.setItem('hifz_tour_completed', 'true');
    setIsActive(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  // Step detection callbacks for auto-advance (backward compatibility)
  const onResultsFound = useCallback(() => {
    console.log('[TourContext] onResultsFound called - currentStep:', currentStepRef.current);
    dispatchTourEvent('similarity:searched');
  }, [dispatchTourEvent]);

  const onResultClicked = useCallback(() => {
    console.log('[TourContext] onResultClicked called - currentStep:', currentStepRef.current);
    dispatchTourEvent('similarity:result:selected');
  }, [dispatchTourEvent]);

  const onModalOpened = useCallback(() => {
    console.log('[TourContext] onModalOpened called - currentStep:', currentStepRef.current);
    // No specific event for modal opened in new system
  }, [dispatchTourEvent]);

  const onSetCreated = useCallback(() => {
    console.log('[TourContext] onSetCreated called - currentStep:', currentStepRef.current);
    dispatchTourEvent('flashcard:created');
  }, [dispatchTourEvent]);

  const onSetOpened = useCallback(() => {
    console.log('[TourContext] onSetOpened called - currentStep:', currentStepRef.current);
    dispatchTourEvent('flashcard:opened');
  }, [dispatchTourEvent]);

  // Log state changes
  useEffect(() => {
    console.log('[TourContext] State changed:', { isActive, currentStep, completedSteps });
  }, [isActive, currentStep, completedSteps]);

  const value = {
    isActive,
    currentStep,
    currentStepRef,
    isActiveRef,
    completedSteps,
    tourSteps,
    startTour,
    advanceStep,
    goToStep,
    exitTour,
    completeTour,
    registerNavigate,
    dispatchTourEvent,
    // Backward compatibility callbacks
    onResultsFound,
    onResultClicked,
    onModalOpened,
    onSetCreated,
    onSetOpened,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};
