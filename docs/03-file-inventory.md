# File Inventory

Detailed information for every source file in the project.

## Root Level Files

### App.js
- **Path**: `src/App.js`
- **Exports**: Default export (App component)
- **Responsibilities**: Main application component with routing, context providers, and layout
- **Dependencies**: React, React Router (BrowserRouter, Routes, Route, Navigate), AuthContext, AppContext, TourContext, Navbar, TourBanner, DailyQuoteCard, Walkthrough, ProtectedRoute, Home, SimilarityPage, DiaryPage, LoginPage, SignupPage, FlashcardsPage, BestMethodPage, CoachPage
- **Complexity**: High (116 lines, multiple route definitions, context providers)
- **Issues**: None

### index.js
- **Path**: `src/index.js`
- **Exports**: None (entry point)
- **Responsibilities**: Application entry point, renders App component, imports CSS files
- **Dependencies**: React, ReactDOM, App, multiple CSS files
- **Complexity**: Low (32 lines)
- **Issues**: None

### App.css
- **Path**: `src/App.css`
- **Exports**: None (CSS)
- **Responsibilities**: Global application styles
- **Dependencies**: None
- **Complexity**: N/A (CSS)
- **Issues**: None

### index.css
- **Path**: `src/index.css`
- **Exports**: None (CSS)
- **Responsibilities**: Base styles
- **Dependencies**: None
- **Complexity**: N/A (CSS)
- **Issues**: None

## Components (Root Level)

### TourBanner.jsx
- **Path**: `src/components/TourBanner.jsx`
- **Exports**: Default export (TourBanner component)
- **Responsibilities**: Displays tour progress and controls, handles tour navigation
- **Dependencies**: React, ReactDOM, React Router (useNavigate), TourContext
- **Complexity**: Medium (157 lines, conditional rendering for action/manual steps)
- **Issues**: None

### Walkthrough.jsx
- **Path**: `src/components/Walkthrough.jsx`
- **Exports**: Default export (Walkthrough component)
- **Responsibilities**: Welcome modal for new users, starts or skips tour
- **Dependencies**: React, React Router (useNavigate, Link), TourContext
- **Complexity**: Low (140 lines, simple modal)
- **Issues**: None

## Data

### dailyQuotes.js
- **Path**: `src/data/dailyQuotes.js`
- **Exports**: `dailyQuotes` (array of quote objects)
- **Responsibilities**: Provides daily Quranic quotes for the DailyQuoteCard
- **Dependencies**: None
- **Complexity**: Low (148 lines, static data)
- **Issues**: None

## Features - Analytics

### PerformanceAnalyticsView.jsx
- **Path**: `src/features/analytics/PerformanceAnalyticsView.jsx`
- **Exports**: Default export (PerformanceAnalyticsView component)
- **Responsibilities**: Displays performance analytics with trend charts and deep-dive analysis
- **Dependencies**: React, Recharts, analyticsApi, QuranMapView
- **Complexity**: High (299 lines, chart rendering, data fetching, state management)
- **Issues**: None

### QuranMapView.jsx
- **Path**: `src/features/analytics/components/QuranMapView.jsx`
- **Exports**: Default export (QuranMapView component)
- **Responsibilities**: Displays Quran Map heatmap visualization of page scores
- **Dependencies**: React, analyticsApi, scoreColors utility
- **Complexity**: High (195 lines, heatmap rendering, data mapping, print support)
- **Issues**: Previously had bug with `d.juzz` vs `d.juz` (fixed in code)

## Features - Auth

### DashboardCard.jsx
- **Path**: `src/features/auth/components/DashboardCard.jsx`
- **Exports**: Default export (DashboardCard component)
- **Responsibilities**: Reusable card component for dashboard feature links
- **Dependencies**: React, React Router (Link)
- **Complexity**: Low (52 lines, simple presentation component)
- **Issues**: None

### Home.jsx
- **Path**: `src/features/auth/pages/Home.jsx`
- **Exports**: Default export (Home component)
- **Responsibilities**: Home page with feature cards, daily quote, tour completion modal
- **Dependencies**: React, React Router (useNavigate), AuthContext, TourContext, dailyQuotes, DashboardCard
- **Complexity**: Medium (291 lines, conditional tour modal, quote rotation)
- **Issues**: None

### LoginPage.jsx
- **Path**: `src/features/auth/pages/LoginPage.jsx`
- **Exports**: Default export (LoginPage component)
- **Responsibilities**: User login form with authentication
- **Dependencies**: React, React Router (useNavigate, Link), AuthContext, authApi
- **Complexity**: Low (38 lines, simple form)
- **Issues**: None

### SignupPage.jsx
- **Path**: `src/features/auth/pages/SignupPage.jsx`
- **Exports**: Default export (SignupPage component)
- **Responsibilities**: User registration form with password validation
- **Dependencies**: React, React Router (useNavigate, Link), authApi
- **Complexity**: Low (41 lines, simple form)
- **Issues**: None

### BestMethodPage.jsx
- **Path**: `src/features/auth/pages/BestMethodPage.jsx`
- **Exports**: Default export (BestMethodPage component)
- **Responsibilities**: Static content page explaining Quran memorization methods
- **Dependencies**: React, React Router (Link)
- **Complexity**: Low (70 lines, static content)
- **Issues**: None

## Features - Coach

### coachConstants.js
- **Path**: `src/features/coach/coachConstants.js`
- **Exports**: HOME_OPTIONS, QUICK_CHIPS, scoreLabel, timeAgo, SYSTEM_PROMPT_BASE, buildDiaryContext, buildMutashabihatContext, buildSimilarityContextForPrompt, fetchSimilarityForPairs, injectCoachStyles, API_BASE, getAuthHeader, authFetch
- **Responsibilities**: Constants, helpers, and context builders for AI Coach
- **Dependencies**: apiConfig, http
- **Complexity**: High (265 lines, multiple helper functions, context builders)
- **Issues**: None

### coachStates.js
- **Path**: `src/features/coach/coachStates.js`
- **Exports**: COACH_STATES, SEQUENCE_MODES, TIME_PREFERENCES, ACCEPTED_PROFILES
- **Responsibilities**: State machine constants for coach workflow
- **Dependencies**: None
- **Complexity**: Low (73 lines, constant definitions)
- **Issues**: SEQUENCE_MODES and TIME_PREFERENCES marked as deprecated/unused

### CoachPage.jsx
- **Path**: `src/features/coach/pages/CoachPage.jsx`
- **Exports**: Default export (CoachPage component)
- **Responsibilities**: Main AI Coach page with state machine orchestration
- **Dependencies**: React, React Router, CoachStateMachine, CoachComponents, GlobalSidePanel, AQMOSProfileModal, AQMOSAssessmentModal, TourContext
- **Complexity**: Very High (410 lines, state machine, multiple screens, modals)
- **Issues**: None

### useCoachStateMachine.js
- **Path**: `src/features/coach/hooks/useCoachStateMachine.js`
- **Exports**: useCoachStateMachine hook
- **Responsibilities**: State machine hook managing coach workflow transitions
- **Dependencies**: React, React Router, coachStates, coachConstants, TourContext
- **Complexity**: Very High (585 lines, complex state transitions, API calls, flashcard generation)
- **Issues**: None

### useCoachChat.js
- **Path**: `src/features/coach/hooks/useCoachChat.js`
- **Exports**: Not read (assumed chat hook)
- **Responsibilities**: Manages AI chat interactions
- **Dependencies**: Assumed coachApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### useCoachSessions.js
- **Path**: `src/features/coach/hooks/useCoachSessions.js`
- **Exports**: Not read (assumed sessions hook)
- **Responsibilities**: Manages chat sessions
- **Dependencies**: Assumed coachApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### CoachComponents.jsx
- **Path**: `src/features/coach/components/CoachComponents.jsx`
- **Exports**: Not read (assumed coach UI components)
- **Responsibilities**: Reusable coach UI components
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### CoachSidebar.jsx
- **Path**: `src/features/coach/components/CoachSidebar.jsx`
- **Exports**: Not read (assumed sidebar component)
- **Responsibilities**: Coach sidebar navigation
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### GlobalSidePanel.jsx
- **Path**: `src/features/coach/components/GlobalSidePanel.jsx`
- **Exports**: Not read (assumed side panel component)
- **Responsibilities**: Global side panel for coach
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### SequenceScreens.jsx
- **Path**: `src/features/coach/components/SequenceScreens.jsx`
- **Exports**: Not read (assumed sequence wizard screens)
- **Responsibilities**: Sequence wizard UI screens
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### SequenceWizard.jsx
- **Path**: `src/features/coach/components/SequenceWizard.jsx`
- **Exports**: Not read (assumed sequence wizard)
- **Responsibilities**: Sequence wizard wrapper
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### MutashabihatScreens.jsx
- **Path**: `src/features/coach/components/MutashabihatScreens.jsx`
- **Exports**: Not read (assumed mutashabihat screens)
- **Responsibilities**: Mutashabihat wizard UI screens
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### BestMethodScreens.jsx
- **Path**: `src/features/coach/components/BestMethodScreens.jsx`
- **Exports**: Not read (assumed best method screens)
- **Responsibilities**: Best method wizard UI screens
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### TimeManagementScreens.jsx
- **Path**: `src/features/coach/components/TimeManagementScreens.jsx`
- **Exports**: Not read (assumed time management screens)
- **Responsibilities**: Time management wizard UI screens
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### TimeManagementWizard.jsx
- **Path**: `src/features/coach/components/TimeManagementWizard.jsx`
- **Exports**: Not read (assumed time management wizard)
- **Responsibilities**: Time management wizard wrapper
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### AQMOSProfileModal.jsx
- **Path**: `src/features/coach/components/AQMOSProfileModal.jsx`
- **Exports**: Not read (assumed AQMOS profile modal)
- **Responsibilities**: AQMOS profile input modal
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### AQMOSAssessmentModal.jsx
- **Path**: `src/features/coach/components/AQMOSAssessmentModal.jsx`
- **Exports**: Not read (assumed AQMOS assessment modal)
- **Responsibilities**: AQMOS assessment modal
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### AQMOSWizard.jsx
- **Path**: `src/features/coach/components/AQMOSWizard.jsx`
- **Exports**: Not read (assumed AQMOS wizard)
- **Responsibilities**: AQMOS wizard wrapper
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### AIErrorDisplay.jsx
- **Path**: `src/features/coach/components/AIErrorDisplay.jsx`
- **Exports**: Not read (assumed error display component)
- **Responsibilities**: AI error display component
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### tipParser.js
- **Path**: `src/features/coach/parsers/tipParser.js`
- **Exports**: Not read (assumed tip parser)
- **Responsibilities**: Parses AI-generated tips
- **Dependencies**: Assumed none
- **Complexity**: Not assessed
- **Issues**: Not assessed

### useCoachParsers.js
- **Path**: `src/features/coach/parsers/useCoachParsers.js`
- **Exports**: Not read (assumed parsers hook)
- **Responsibilities**: Coach response parsers
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### quranCache.js
- **Path**: `src/features/coach/utils/quranCache.js`
- **Exports**: Not read (assumed Quran cache utility)
- **Responsibilities**: Quran data caching
- **Dependencies**: Assumed none
- **Complexity**: Not assessed
- **Issues**: Not assessed

### quranContextBuilder.js
- **Path**: `src/features/coach/utils/quranContextBuilder.js`
- **Exports**: Not read (assumed context builder)
- **Responsibilities**: Builds Quran context for AI
- **Dependencies**: Assumed none
- **Complexity**: Not assessed
- **Issues**: Not assessed

## Features - Diary

### DiaryPage.jsx
- **Path**: `src/features/diary/DiaryPage.jsx`
- **Exports**: Default export (DiaryPage component)
- **Responsibilities**: Main diary page with 5 entry types, log history, analytics
- **Dependencies**: React, diaryApi, custom form hooks, ThemeBanner, DailyTask, PerformanceAnalyticsView, LogHistory
- **Complexity**: High (297 lines, multiple forms, state management, tour integration)
- **Issues**: None

### LogHistory.jsx
- **Path**: `src/features/diary/components/LogHistory.jsx`
- **Exports**: Default export (LogHistory component)
- **Responsibilities**: Displays and manages diary log history with edit/delete
- **Dependencies**: React, diaryApi, scoreColors utility
- **Complexity**: Medium (103 lines, edit mode, delete confirmation)
- **Issues**: None

### MurajahForm.jsx
- **Path**: `src/features/diary/components/forms/MurajahForm.jsx`
- **Exports**: Not read (assumed Murajah form component)
- **Responsibilities**: Murajah entry form
- **Dependencies**: Assumed React, useMurajahForm
- **Complexity**: Not assessed
- **Issues**: Not assessed

### TasmeeForm.jsx
- **Path**: `src/features/diary/components/forms/TasmeeForm.jsx`
- **Exports**: Not read (assumed Tasmee form component)
- **Responsibilities**: Tasmee entry form
- **Dependencies**: Assumed React, useTasmeeForm
- **Complexity**: Not assessed
- **Issues**: Not assessed

### IkhtebarForm.jsx
- **Path**: `src/features/diary/components/forms/IkhtebarForm.jsx`
- **Exports**: Not read (assumed Ikhtebar form component)
- **Responsibilities**: Ikhtebar entry form
- **Dependencies**: Assumed React, useIkhtebarForm
- **Complexity**: Not assessed
- **Issues**: Not assessed

### JadeedForm.jsx
- **Path**: `src/features/diary/components/forms/JadeedForm.jsx`
- **Exports**: Not read (assumed Jadeed form component)
- **Responsibilities**: Jadeed entry form
- **Dependencies**: Assumed React, useJadeedForm
- **Complexity**: Not assessed
- **Issues**: Not assessed

### JuzHaliForm.jsx
- **Path**: `src/features/diary/components/forms/JuzHaliForm.jsx`
- **Exports**: Not read (assumed Juz Hali form component)
- **Responsibilities**: Juz Hali entry form
- **Dependencies**: Assumed React, useJuzHaliForm
- **Complexity**: Not assessed
- **Issues**: Not assessed

### useMurajahForm.js
- **Path**: `src/features/diary/hooks/useMurajahForm.js`
- **Exports**: Not read (assumed Murajah form hook)
- **Responsibilities**: Murajah form state and logic
- **Dependencies**: Assumed React, diaryApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### useTasmeeForm.js
- **Path**: `src/features/diary/hooks/useTasmeeForm.js`
- **Exports**: Not read (assumed Tasmee form hook)
- **Responsibilities**: Tasmee form state and logic
- **Dependencies**: Assumed React, diaryApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### useIkhtebarForm.js
- **Path**: `src/features/diary/hooks/useIkhtebarForm.js`
- **Exports**: Not read (assumed Ikhtebar form hook)
- **Responsibilities**: Ikhtebar form state and logic
- **Dependencies**: Assumed React, diaryApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### useJadeedForm.js
- **Path**: `src/features/diary/hooks/useJadeedForm.js`
- **Exports**: Not read (assumed Jadeed form hook)
- **Responsibilities**: Jadeed form state and logic
- **Dependencies**: Assumed React, diaryApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### useJuzHaliForm.js
- **Path**: `src/features/diary/hooks/useJuzHaliForm.js`
- **Exports**: Not read (assumed Juz Hali form hook)
- **Responsibilities**: Juz Hali form state and logic
- **Dependencies**: Assumed React, diaryApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### useRangeForm.js
- **Path**: `src/features/diary/hooks/useRangeForm.js`
- **Exports**: Not read (assumed range form hook)
- **Responsibilities**: Range form state and logic
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

## Features - Flashcards

### FlashcardsPage.jsx
- **Path**: `src/features/flashcards/FlashcardsPage.jsx`
- **Exports**: Default export (FlashcardsPage component)
- **Responsibilities**: Main flashcards page with folder system, set viewer, modals
- **Dependencies**: React, authFetch, folderApi, flashcardApi, TourContext, StudyView, TestView, SequenceFlowchart, CreateFlashcardModal, FolderGrid, AddSetsToFolderModal
- **Complexity**: Very High (788 lines, multiple views, folder management, tour integration)
- **Issues**: None

### flashcardsData.jsx
- **Path**: `src/features/flashcards/data/flashcardsData.jsx`
- **Exports**: flashcardsData (array of built-in flashcard categories)
- **Responsibilities**: Provides built-in flashcard categories with study material and cards
- **Dependencies**: None
- **Complexity**: Medium (309 lines, static data with HTML content)
- **Issues**: None

### CreateFlashcardModal.jsx
- **Path**: `src/features/flashcards/components/CreateFlashcardModal.jsx`
- **Exports**: Default export (CreateFlashcardModal component)
- **Responsibilities**: Modal for creating AI-generated flashcard sets
- **Dependencies**: React, authFetch
- **Complexity**: High (358 lines, multi-step wizard, API calls, question generation)
- **Issues**: None

### FolderGrid.jsx
- **Path**: `src/features/flashcards/components/FolderGrid.jsx`
- **Exports**: Default export (FolderGrid component)
- **Responsibilities**: Displays folder grid with create/rename/delete functionality
- **Dependencies**: React, folderApi
- **Complexity**: Medium (265 lines, folder management, delete confirmation)
- **Issues**: None

### AddSetsToFolderModal.jsx
- **Path**: `src/features/flashcards/components/AddSetsToFolderModal.jsx`
- **Exports**: Not read (assumed add sets modal)
- **Responsibilities**: Modal for adding sets to folders
- **Dependencies**: Assumed React, folderApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### QuestionEditor.jsx
- **Path**: `src/features/flashcards/components/QuestionEditor.jsx`
- **Exports**: Not read (assumed question editor)
- **Responsibilities**: Edit flashcard questions
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### StudyView.jsx
- **Path**: `src/features/flashcards/components/StudyView.jsx`
- **Exports**: Default export (StudyView component)
- **Responsibilities**: Displays flashcard study material or parsed ayahs
- **Dependencies**: React, apiConfig
- **Complexity**: Medium (150 lines, ayah parsing, parallel fetching)
- **Issues**: None

### TestView.jsx
- **Path**: `src/features/flashcards/components/TestView.jsx`
- **Exports**: Default export (TestView component)
- **Responsibilities**: Flashcard test/quiz view with flip animation
- **Dependencies**: React
- **Complexity**: Low (33 lines, simple flip card)
- **Issues**: None

### SequenceFlowchart.jsx
- **Path**: `src/features/flashcards/components/SequenceFlowchart.jsx`
- **Exports**: Default export (SequenceFlowchart component)
- **Responsibilities**: Visualizes sequence flowchart with mnemonic/story views
- **Dependencies**: React, authFetch
- **Complexity**: Very High (679 lines, complex visualization, AI story generation, print/download)
- **Issues**: None

## Features - Scheduler

### SchedulerPage.jsx
- **Path**: `src/features/scheduler/SchedulerPage.jsx`
- **Exports**: Default export (SchedulerPage component)
- **Responsibilities**: Main scheduler page with tabs for events, revision units, schedule
- **Dependencies**: React, schedulerApi, EventBuilder, RevisionUnits, ScheduleView
- **Complexity**: Medium (120 lines, tab management, API calls)
- **Issues**: None

### SchedulerPage.css
- **Path**: `src/features/scheduler/SchedulerPage.css`
- **Exports**: None (CSS)
- **Responsibilities**: Scheduler page styles
- **Dependencies**: None
- **Complexity**: N/A (CSS)
- **Issues**: None

### SchedulerWizard.jsx
- **Path**: `src/features/scheduler/SchedulerWizard.jsx`
- **Exports**: Not read (assumed scheduler wizard)
- **Responsibilities**: Scheduler wizard component
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### SchedulerWizard.css
- **Path**: `src/features/scheduler/SchedulerWizard.css`
- **Exports**: None (CSS)
- **Responsibilities**: Scheduler wizard styles
- **Dependencies**: None
- **Complexity**: N/A (CSS)
- **Issues**: None

### EventBuilder.jsx
- **Path**: `src/features/scheduler/components/EventBuilder.jsx`
- **Exports**: Not read (assumed event builder)
- **Responsibilities**: Event builder component
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### RevisionUnits.jsx
- **Path**: `src/features/scheduler/components/RevisionUnits.jsx`
- **Exports**: Not read (assumed revision units)
- **Responsibilities**: Revision units component
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### ScheduleView.jsx
- **Path**: `src/features/scheduler/components/ScheduleView.jsx`
- **Exports**: Not read (assumed schedule view)
- **Responsibilities**: Schedule view component
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### schedulerApi.js
- **Path**: `src/features/scheduler/services/schedulerApi.js`
- **Exports**: Not read (assumed scheduler API)
- **Responsibilities**: Scheduler API functions
- **Dependencies**: Assumed http
- **Complexity**: Not assessed
- **Issues**: Not assessed

### AdjustUnit.jsx
- **Path**: `src/features/scheduler/wizard/AdjustUnit.jsx`
- **Exports**: Not read (assumed adjust unit step)
- **Responsibilities**: Adjust unit wizard step
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### BuildMyWeek.jsx
- **Path**: `src/features/scheduler/wizard/BuildMyWeek.jsx`
- **Exports**: Not read (assumed build week step)
- **Responsibilities**: Build week wizard step
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### Exceptions.jsx
- **Path**: `src/features/scheduler/wizard/Exceptions.jsx`
- **Exports**: Not read (assumed exceptions step)
- **Responsibilities**: Exceptions wizard step
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### GeneratedSchedule.jsx
- **Path**: `src/features/scheduler/wizard/GeneratedSchedule.jsx`
- **Exports**: Not read (assumed generated schedule step)
- **Responsibilities**: Generated schedule wizard step
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### ProgressAnalysis.jsx
- **Path**: `src/features/scheduler/wizard/ProgressAnalysis.jsx`
- **Exports**: Not read (assumed progress analysis step)
- **Responsibilities**: Progress analysis wizard step
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### Review.jsx
- **Path**: `src/features/scheduler/wizard/Review.jsx`
- **Exports**: Not read (assumed review step)
- **Responsibilities**: Review wizard step
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### UnitDetails.jsx
- **Path**: `src/features/scheduler/wizard/UnitDetails.jsx`
- **Exports**: Not read (assumed unit details step)
- **Responsibilities**: Unit details wizard step
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### WeeklyCycle.jsx
- **Path**: `src/features/scheduler/wizard/WeeklyCycle.jsx`
- **Exports**: Not read (assumed weekly cycle step)
- **Responsibilities**: Weekly cycle wizard step
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

## Features - Similarity

### SimilarityPage.jsx
- **Path**: `src/features/similarity/SimilarityPage.jsx`
- **Exports**: Default export (SimilarityPage component)
- **Responsibilities**: Main similarity search page with search bar, results, side panel
- **Dependencies**: React, React Router, AppContext, TourContext, SearchBar, AyahDisplay, SimilarityList, SidePanel
- **Complexity**: Low (129 lines, auto-search support, tour integration)
- **Issues**: None

### SearchBar.jsx
- **Path**: `src/features/similarity/components/SearchBar.jsx`
- **Exports**: Default export (SearchBar component, forwardRef)
- **Responsibilities**: Search bar with surah/ayah selection and filters
- **Dependencies**: React, similarityApi, AppContext, marhalaMapper
- **Complexity**: Medium (160 lines, programmatic search trigger, filters)
- **Issues**: None

### AyahDisplay.jsx
- **Path**: `src/features/similarity/components/AyahDisplay.jsx`
- **Exports**: Default export (AyahDisplay component)
- **Responsibilities**: Displays source ayah with metadata
- **Dependencies**: React, AppContext
- **Complexity**: Low (21 lines, simple display)
- **Issues**: None

### SidePanel.jsx
- **Path**: `src/features/similarity/components/SidePanel.jsx`
- **Exports**: Default export (SidePanel component)
- **Responsibilities**: Side panel with AI tips, context, and match analysis
- **Dependencies**: React, AppContext, TourContext, similarityApi, coachApi, apiConfig, http
- **Complexity**: Very High (405 lines, AI tip generation, caching, context fetching, edit functionality)
- **Issues**: None

### SimilaritiesList.jsx
- **Path**: `src/features/similarity/components/SimilaritiesList.jsx`
- **Exports**: Default export (SimilarityList component)
- **Responsibilities**: Displays list of similar verse results
- **Dependencies**: React, AppContext
- **Complexity**: Low (57 lines, simple list rendering)
- **Issues**: None

### MutashabihatWizard.jsx
- **Path**: `src/features/similarity/components/MutashabihatWizard.jsx`
- **Exports**: Not read (assumed wizard component)
- **Responsibilities**: Mutashabihat wizard
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

## Features - Tasks

### DailyTask.jsx
- **Path**: `src/features/tasks/components/DailyTask.jsx`
- **Exports**: Default export (DailyTask component)
- **Responsibilities**: Daily tasks management with add/edit/delete/status
- **Dependencies**: React, TourContext, taskApi
- **Complexity**: Medium (171 lines, skeleton loading, task CRUD, tour integration)
- **Issues**: Previously had flash issue (fixed with skeleton loading)

## Shared - Components

### Navbar.jsx
- **Path**: `src/shared/components/Navbar.jsx`
- **Exports**: Default export (Navbar component)
- **Responsibilities**: Main navigation bar with logo, links, auth state
- **Dependencies**: React, React Router (Link, useLocation, useNavigate), AuthContext
- **Complexity**: Low (51 lines, simple navigation)
- **Issues**: None

### ProtectedRoute.jsx
- **Path**: `src/shared/components/ProtectedRoute.jsx`
- **Exports**: Default export (ProtectedRoute component)
- **Responsibilities**: Route guard for authenticated pages
- **Dependencies**: React, React Router (Navigate), AuthContext
- **Complexity**: Very Low (10 lines, simple guard)
- **Issues**: None

### ErrorBoundary.jsx
- **Path**: `src/shared/components/ErrorBoundary.jsx`
- **Exports**: Default export (ErrorBoundary component)
- **Responsibilities**: Error boundary for catching React errors
- **Dependencies**: React
- **Complexity**: Medium (118 lines, class component, error display, reset)
- **Issues**: None

### DailyQuoteCard.jsx
- **Path**: `src/shared/components/DailyQuoteCard.jsx`
- **Exports**: Default export (DailyQuoteCard component)
- **Responsibilities**: Full-screen daily quote card with countdown timer
- **Dependencies**: React, dailyQuotes
- **Complexity**: Medium (251 lines, timer logic, localStorage persistence)
- **Issues**: None

### StreakBanner.jsx
- **Path**: `src/shared/components/StreakBanner.jsx`
- **Exports**: Default export (StreakBanner component)
- **Responsibilities**: Streak banner with tiered progress display
- **Dependencies**: React, taskApi
- **Complexity**: Medium (74 lines, tier calculation, progress bar)
- **Issues**: Previously had timezone bug (fixed with UTC-based dayOfYear)

### ThemeBanner.jsx
- **Path**: `src/shared/components/ThemeBanner.jsx`
- **Exports**: Not read (assumed theme banner)
- **Responsibilities**: Theme banner display
- **Dependencies**: Assumed React
- **Complexity**: Not assessed
- **Issues**: Not assessed

### ThemeSelector.jsx
- **Path**: `src/shared/components/ThemeSelector.jsx`
- **Exports**: Not read (assumed theme selector)
- **Responsibilities**: Theme selection UI
- **Dependencies**: Assumed React, themeApi
- **Complexity**: Not assessed
- **Issues**: Not assessed

### ImmersiveView/
- **Path**: `src/shared/components/ImmersiveView/`
- **Exports**: Multiple components (ImmersiveView, hooks, scenes)
- **Responsibilities**: Immersive 3D view with canvas and parallax
- **Dependencies**: Assumed React, Three.js
- **Complexity**: Not assessed
- **Issues**: Not assessed

## Shared - Context

### AuthContext.js
- **Path**: `src/shared/context/AuthContext.js`
- **Exports**: AuthProvider, useAuthContext
- **Responsibilities**: Authentication state management (user, token, login, logout)
- **Dependencies**: React
- **Complexity**: Medium (93 lines, localStorage persistence, JWT validation)
- **Issues**: None

### AppContext.js
- **Path**: `src/shared/context/AppContext.js`
- **Exports**: AppProvider, useAppContext
- **Responsibilities**: Similarity search state management
- **Dependencies**: React
- **Complexity**: Very Low (16 lines, simple context)
- **Issues**: None

### TourContext.jsx
- **Path**: `src/shared/context/TourContext.jsx`
- **Exports**: TourProvider, useTour
- **Responsibilities**: Interactive tour state management with 32 steps
- **Dependencies**: React, React Router
- **Complexity**: High (223 lines, step definitions, event dispatching, navigation)
- **Issues**: None

## Shared - Services

### http.js
- **Path**: `src/shared/services/http.js`
- **Exports**: authFetch, publicFetch
- **Responsibilities**: HTTP client with auth header, error handling, 401 redirect
- **Dependencies**: None
- **Complexity**: Medium (128 lines, fetch wrappers, error normalization)
- **Issues**: None

### apiConfig.js
- **Path**: `src/shared/services/apiConfig.js`
- **Exports**: API_BASE, getAuthHeader, authFetch (re-export)
- **Responsibilities**: API configuration and auth header helper
- **Dependencies**: http
- **Complexity**: Very Low (14 lines, configuration)
- **Issues**: None

### index.js
- **Path**: `src/shared/services/index.js`
- **Exports**: All API service modules (barrel file)
- **Responsibilities**: Re-exports all API services for simplified imports
- **Dependencies**: All API service modules
- **Complexity**: Very Low (19 lines, barrel file)
- **Issues**: None

### authApi.js
- **Path**: `src/shared/services/authApi.js`
- **Exports**: signupUser, loginUser
- **Responsibilities**: Authentication API functions
- **Dependencies**: http
- **Complexity**: Very Low (29 lines, simple API calls)
- **Issues**: None

### similarityApi.js
- **Path**: `src/shared/services/similarityApi.js`
- **Exports**: fetchSurahs, fetchAyahs, fetchSimilarities, fetchAyahContext, fetchPageDetails, fetchJuzPages, fetchPagesInRange
- **Responsibilities**: Similarity search API functions
- **Dependencies**: http
- **Complexity**: Medium (89 lines, multiple endpoints, query parameters)
- **Issues**: None

### diaryApi.js
- **Path**: `src/shared/services/diaryApi.js`
- **Exports**: addLog, getLogs, deleteLog, updateLog
- **Responsibilities**: Diary entry API functions
- **Dependencies**: http
- **Complexity**: Low (48 lines, CRUD operations)
- **Issues**: None

### flashcardApi.js
- **Path**: `src/shared/services/flashcardApi.js`
- **Exports**: getDueCards, getCardsByJuz, submitReview, resetCard
- **Responsibilities**: Flashcard API functions (stubs)
- **Dependencies**: http
- **Complexity**: Very Low (42 lines, stub implementations)
- **Issues**: Functions appear to be stubs, may need implementation

### analyticsApi.js
- **Path**: `src/shared/services/analyticsApi.js`
- **Exports**: getTrend, getDeepDive, getHeatmapData
- **Responsibilities**: Analytics API functions
- **Dependencies**: http
- **Complexity**: Low (46 lines, data fetching)
- **Issues**: None

### coachApi.js
- **Path**: `src/shared/services/coachApi.js`
- **Exports**: getRemainingQuota, sendChat
- **Responsibilities**: AI coach API functions
- **Dependencies**: http
- **Complexity**: Very Low (28 lines, chat API)
- **Issues**: None

### taskApi.js
- **Path**: `src/shared/services/taskApi.js`
- **Exports**: getStreak, getTasks, addTask, updateTask, editTaskTitle, deleteTask
- **Responsibilities**: Task and streak API functions
- **Dependencies**: http
- **Complexity**: Low (52 lines, CRUD operations, error handling)
- **Issues**: None

### themeApi.js
- **Path**: `src/shared/services/themeApi.js`
- **Exports**: getCurrentTheme, getAllThemes, selectTheme, checkPreview
- **Responsibilities**: Theme management API functions
- **Dependencies**: http
- **Complexity**: Very Low (30 lines, theme operations)
- **Issues**: None

### folderApi.js
- **Path**: `src/shared/services/folderApi.js`
- **Exports**: getFolders, getFolderSets, getUncategorisedSets, createFolder, renameFolder, deleteFolder, addItemToFolder, addItemsToFolder, removeItemFromFolder
- **Responsibilities**: Folder management API functions
- **Dependencies**: http
- **Complexity**: Low (103 lines, folder CRUD, item management)
- **Issues**: None

## Shared - Utils

### marhalaMapper.js
- **Path**: `src/shared/utils/marhalaMapper.js`
- **Exports**: Not read (assumed marhala mapping)
- **Responsibilities**: Maps marhala to juzz
- **Dependencies**: Assumed none
- **Complexity**: Not assessed
- **Issues**: Not assessed

### scoreColors.js
- **Path**: `src/shared/utils/scoreColors.js`
- **Exports**: Not read (assumed score color utilities)
- **Responsibilities**: Score to color mapping
- **Dependencies**: Assumed none
- **Complexity**: Not assessed
- **Issues**: Not assessed

### themeRegistry.js
- **Path**: `src/shared/utils/themeRegistry.js`
- **Exports**: Not read (assumed theme registry)
- **Responsibilities**: Theme definitions
- **Dependencies**: Assumed none
- **Complexity**: Not assessed
- **Issues**: Not assessed

### themeVisuals.js
- **Path**: `src/shared/utils/themeVisuals.js`
- **Exports**: Not read (assumed theme visuals)
- **Responsibilities**: Theme visual configurations
- **Dependencies**: Assumed none
- **Complexity**: Not assessed
- **Issues**: Not assessed

## Styles

All CSS files in `src/styles/`:
- AIErrorDisplay.css, AnalyticsView.css, AuthPages.css, AyahDisplay.css, BestMethodPage.css, DailyTasks.css, DashboardCard.css, DiaryPage.css, Flashcards.css, ImmersiveView.css, LoadingSpinner.css, Navbar.css, PerformanceAnalyticsView.css, QuranMapView.css, Responsive.css, SearchBar.css, SidePanel.css, SimilarityList.css, StreakBanner.css, ThemeBanner.css, ThemeSelector.css, theme-variables.css

- **Exports**: None (CSS)
- **Responsibilities**: Styling for respective components
- **Dependencies**: None
- **Complexity**: N/A (CSS)
- **Issues**: None

## Summary Statistics

- **Total Files**: 89 source files
- **Components**: 35+ React components
- **Hooks**: 9 custom hooks
- **Services**: 12 API service modules
- **Context Providers**: 3 (Auth, App, Tour)
- **CSS Files**: 22
- **High Complexity Files**: CoachPage.jsx (410), FlashcardsPage.jsx (788), useCoachStateMachine.js (585), SequenceFlowchart.jsx (679), SidePanel.jsx (405)
- **Low Complexity Files**: ProtectedRoute.jsx (10), AppContext.js (16), TestView.jsx (33), AyahDisplay.jsx (21)
- **Potential Issues**: flashcardApi.js functions appear to be stubs, SEQUENCE_MODES and TIME_PREFERENCES marked as deprecated
