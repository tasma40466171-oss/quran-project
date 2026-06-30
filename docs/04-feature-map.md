# Feature Map

Logical features and their related files in the project.

## Feature 1: Mutashabihat (Similar Verses)

### Description
Search for structurally similar verses in the Quran to identify patterns that can cause confusion during memorization. Includes AI-generated memory tips and context display.

### Related Files
- **Page**: `src/features/similarity/SimilarityPage.jsx`
- **Components**:
  - `src/features/similarity/components/SearchBar.jsx` - Surah/Ayah selection with marhala and juz filters
  - `src/features/similarity/components/AyahDisplay.jsx` - Source ayah display with metadata
  - `src/features/similarity/components/SimilaritiesList.jsx` - List of similar verse results
  - `src/features/similarity/components/SidePanel.jsx` - AI tips, context, and match analysis
  - `src/features/similarity/components/MutashabihatWizard.jsx` - Wizard for guided similarity search
- **Services**:
  - `src/shared/services/similarityApi.js` - API calls for surahs, ayahs, similarities, context
- **Context**:
  - `src/shared/context/AppContext.js` - Manages similarity search state (sourceAyah, results, selectedResult, tips)
- **Utils**:
  - `src/shared/utils/marhalaMapper.js` - Maps marhala to juzz for filtering
- **Styles**:
  - `src/styles/SearchBar.css`
  - `src/styles/AyahDisplay.css`
  - `src/styles/SidePanel.css`
  - `src/styles/SimilarityList.css`

### Integration Points
- **Coach Feature**: Coach can navigate to similarity page with auto-search parameters
- **Tour System**: Tour steps include similarity search and tip editing
- **AI Coach**: SidePanel uses coachApi for AI tip generation

---

## Feature 2: Flashcards

### Description
Create, organize, and study flashcard sets for Quran memorization. Includes built-in categories, user-created sets, folder organization, sequence flowcharts, and AI-generated mnemonic stories.

### Related Files
- **Page**: `src/features/flashcards/FlashcardsPage.jsx`
- **Components**:
  - `src/features/flashcards/components/StudyView.jsx` - Study material display with ayah parsing
  - `src/features/flashcards/components/TestView.jsx` - Quiz/flip card view
  - `src/features/flashcards/components/SequenceFlowchart.jsx` - Visual sequence flowchart with AI stories
  - `src/features/flashcards/components/CreateFlashcardModal.jsx` - AI-powered flashcard set creation
  - `src/features/flashcards/components/FolderGrid.jsx` - Folder management grid
  - `src/features/flashcards/components/AddSetsToFolderModal.jsx` - Add sets to folders
  - `src/features/flashcards/components/QuestionEditor.jsx` - Edit flashcard questions
- **Data**:
  - `src/features/flashcards/data/flashcardsData.jsx` - Built-in flashcard categories (9 categories)
- **Services**:
  - `src/shared/services/flashcardApi.js` - Flashcard CRUD operations (stubs)
  - `src/shared/services/folderApi.js` - Folder management API
  - `src/shared/services/http.js` - Direct authFetch calls in components
- **Context**:
  - TourContext for tour integration
- **Styles**:
  - `src/styles/Flashcards.css`

### Integration Points
- **Coach Feature**: Coach wizard generates flashcard sets and navigates to flashcards page
- **Tour System**: Tour steps include flashcard creation and study
- **AI Coach**: SequenceFlowchart uses coachApi for AI mnemonic story generation

---

## Feature 3: My Diary (Hifz Diary)

### Description
Track daily Hifz progress with 5 entry types (MURAJAH, TASMEE, IKHTEBAR, JADEED, JUZ HALI). Includes log history, editing, deletion, daily tasks, and performance analytics.

### Related Files
- **Page**: `src/features/diary/DiaryPage.jsx`
- **Components**:
  - `src/features/diary/components/LogHistory.jsx` - Log history with edit/delete
  - `src/features/diary/components/forms/MurajahForm.jsx` - Murajah entry form
  - `src/features/diary/components/forms/TasmeeForm.jsx` - Tasmee entry form
  - `src/features/diary/components/forms/IkhtebarForm.jsx` - Ikhtebar entry form
  - `src/features/diary/components/forms/JadeedForm.jsx` - Jadeed entry form
  - `src/features/diary/components/forms/JuzHaliForm.jsx` - Juz Hali entry form
- **Hooks**:
  - `src/features/diary/hooks/useMurajahForm.js` - Murajah form logic
  - `src/features/diary/hooks/useTasmeeForm.js` - Tasmee form logic
  - `src/features/diary/hooks/useIkhtebarForm.js` - Ikhtebar form logic
  - `src/features/diary/hooks/useJadeedForm.js` - Jadeed form logic
  - `src/features/diary/hooks/useJuzHaliForm.js` - Juz Hali form logic
  - `src/features/diary/hooks/useRangeForm.js` - Range form logic
- **Services**:
  - `src/shared/services/diaryApi.js` - Diary entry CRUD operations
- **Shared Components**:
  - `src/shared/components/ThemeBanner.jsx` - Theme display banner
  - `src/features/tasks/components/DailyTask.jsx` - Daily tasks component
  - `src/features/analytics/PerformanceAnalyticsView.jsx` - Performance analytics
- **Context**:
  - TourContext for tour integration
- **Styles**:
  - `src/styles/DiaryPage.css`
  - `src/styles/DailyTasks.css`

### Integration Points
- **Coach Feature**: Coach analyzes diary data for time management suggestions
- **Tour System**: Tour steps include diary entry and task management
- **Analytics**: Diary data feeds into performance analytics and heatmap

---

## Feature 4: Time Management (Ustadh AI Scheduler)

### Description
8-step wizard to generate personalized weekly study schedules based on page strength scores. Includes progress analysis, weekly cycle, daily routine, exceptions, study settings, and schedule generation.

### Related Files
- **Page**: `src/features/coach/pages/CoachPage.jsx` (main orchestrator)
- **State Machine**:
  - `src/features/coach/hooks/useCoachStateMachine.js` - Manages time management workflow states
- **Constants**:
  - `src/features/coach/coachStates.js` - Time management state definitions
  - `src/features/coach/coachConstants.js` - Context builders for diary data
- **Components**:
  - `src/features/coach/components/TimeManagementScreens.jsx` - Time management wizard screens
  - `src/features/coach/components/TimeManagementWizard.jsx` - Wizard wrapper
  - `src/features/scheduler/SchedulerPage.jsx` - Alternative scheduler page
  - `src/features/scheduler/SchedulerWizard.jsx` - Scheduler wizard
  - `src/features/scheduler/components/EventBuilder.jsx` - Event builder
  - `src/features/scheduler/components/RevisionUnits.jsx` - Revision units
  - `src/features/scheduler/components/ScheduleView.jsx` - Schedule view
  - `src/features/scheduler/wizard/AdjustUnit.jsx` - Adjust unit step
  - `src/features/scheduler/wizard/BuildMyWeek.jsx` - Build week step
  - `src/features/scheduler/wizard/Exceptions.jsx` - Exceptions step
  - `src/features/scheduler/wizard/GeneratedSchedule.jsx` - Generated schedule step
  - `src/features/scheduler/wizard/ProgressAnalysis.jsx` - Progress analysis step
  - `src/features/scheduler/wizard/Review.jsx` - Review step
  - `src/features/scheduler/wizard/UnitDetails.jsx` - Unit details step
  - `src/features/scheduler/wizard/WeeklyCycle.jsx` - Weekly cycle step
- **Services**:
  - `src/features/scheduler/services/schedulerApi.js` - Scheduler API functions
  - `src/shared/services/coachApi.js` - Coach API for wizard steps
  - `src/shared/services/diaryApi.js` - Diary data for analysis
  - `src/shared/services/analyticsApi.js` - Heatmap data for analysis
- **Context**:
  - TourContext for tour integration
- **Styles**:
  - `src/features/scheduler/SchedulerPage.css`
  - `src/features/scheduler/SchedulerWizard.css`

### Integration Points
- **Diary Feature**: Uses diary logs and heatmap data for progress analysis
- **Analytics Feature**: Uses heatmap data for schedule generation
- **Tour System**: Tour steps include time management wizard

---

## Feature 5: AI Coach (Ustadh AI)

### Description
AI-powered Quran memorization coach with chat interface, session management, and multiple wizard workflows (Sequence, Mutashabihat, Best Method/AQMOS, Time Management).

### Related Files
- **Page**: `src/features/coach/pages/CoachPage.jsx`
- **State Machine**:
  - `src/features/coach/hooks/useCoachStateMachine.js` - Main workflow orchestration
- **Constants**:
  - `src/features/coach/coachStates.js` - All workflow state definitions
  - `src/features/coach/coachConstants.js` - System prompt, context builders, helpers
- **Hooks**:
  - `src/features/coach/hooks/useCoachChat.js` - Chat interaction logic
  - `src/features/coach/hooks/useCoachSessions.js` - Session management
- **Components**:
  - `src/features/coach/components/CoachComponents.jsx` - Reusable coach UI components
  - `src/features/coach/components/CoachSidebar.jsx` - Session sidebar
  - `src/features/coach/components/GlobalSidePanel.jsx` - Global side panel
  - `src/features/coach/components/SequenceScreens.jsx` - Sequence wizard screens
  - `src/features/coach/components/SequenceWizard.jsx` - Sequence wizard wrapper
  - `src/features/coach/components/MutashabihatScreens.jsx` - Mutashabihat wizard screens
  - `src/features/coach/components/BestMethodScreens.jsx` - Best method wizard screens
  - `src/features/coach/components/TimeManagementScreens.jsx` - Time management wizard screens
  - `src/features/coach/components/TimeManagementWizard.jsx` - Time management wizard wrapper
  - `src/features/coach/components/AQMOSProfileModal.jsx` - AQMOS profile modal
  - `src/features/coach/components/AQMOSAssessmentModal.jsx` - AQMOS assessment modal
  - `src/features/coach/components/AQMOSWizard.jsx` - AQMOS wizard wrapper
  - `src/features/coach/components/AIErrorDisplay.jsx` - AI error display
- **Parsers**:
  - `src/features/coach/parsers/tipParser.js` - Parse AI-generated tips
  - `src/features/coach/parsers/useCoachParsers.js` - Coach response parsers
- **Utils**:
  - `src/features/coach/utils/quranCache.js` - Quran data caching
  - `src/features/coach/utils/quranContextBuilder.js` - Build Quran context for AI
- **Services**:
  - `src/shared/services/coachApi.js` - Coach chat and quota API
- **Context**:
  - TourContext for tour integration
- **Styles**:
  - `src/styles/AIErrorDisplay.css`

### Integration Points
- **Similarity Feature**: Can navigate to similarity page with auto-search
- **Flashcards Feature**: Generates flashcard sets from sequence wizard
- **Diary Feature**: Analyzes diary data for suggestions
- **Analytics Feature**: Uses heatmap data for analysis
- **Tour System**: Tour steps include coach interaction

---

## Feature 6: Performance Analytics

### Description
Display performance analytics with trend charts, deep-dive analysis, and Quran Map heatmap visualization of page scores.

### Related Files
- **Component**: `src/features/analytics/PerformanceAnalyticsView.jsx`
- **Sub-component**: `src/features/analytics/components/QuranMapView.jsx` - Quran Map heatmap
- **Services**:
  - `src/shared/services/analyticsApi.js` - Trend, deep-dive, heatmap data API
- **Utils**:
  - `src/shared/utils/scoreColors.js` - Score to color mapping
- **Context**:
  - Used by DiaryPage
- **Styles**:
  - `src/styles/PerformanceAnalyticsView.css`
  - `src/styles/QuranMapView.css`
  - `src/styles/AnalyticsView.css`

### Integration Points
- **Diary Feature**: Embedded in DiaryPage for performance tracking
- **Coach Feature**: Coach uses heatmap data for analysis
- **Tour System**: Tour steps include analytics view

---

## Feature 7: Authentication

### Description
User authentication with login, signup, and protected routes. Includes JWT token management and automatic logout on token expiration.

### Related Files
- **Pages**:
  - `src/features/auth/pages/Home.jsx` - Home page with feature cards
  - `src/features/auth/pages/LoginPage.jsx` - Login form
  - `src/features/auth/pages/SignupPage.jsx` - Signup form
  - `src/features/auth/pages/BestMethodPage.jsx` - Static content page about memorization methods
- **Components**:
  - `src/features/auth/components/DashboardCard.jsx` - Feature link cards
- **Context**:
  - `src/shared/context/AuthContext.js` - Authentication state management
- **Services**:
  - `src/shared/services/authApi.js` - Login and signup API
- **Shared Components**:
  - `src/shared/components/Navbar.jsx` - Navigation with auth state
  - `src/shared/components/ProtectedRoute.jsx` - Route guard
- **Styles**:
  - `src/styles/AuthPages.css`
  - `src/styles/DashboardCard.css`
  - `src/styles/Navbar.css`

### Integration Points
- **All Protected Features**: ProtectedRoute wraps all authenticated pages
- **Navbar**: Displays auth state and logout button
- **Tour System**: Tour completion modal shown on Home page

---

## Feature 8: Interactive Onboarding Tour

### Description
32-step interactive tour guiding users through all platform features with event dispatching for auto-advancement.

### Related Files
- **Components**:
  - `src/components/TourBanner.jsx` - Tour progress display and controls
  - `src/components/Walkthrough.jsx` - Welcome modal for new users
- **Context**:
  - `src/shared/context/TourContext.jsx` - Tour state management with 32 steps
- **Integration Points**:
  - **All Features**: Tour steps cover similarity, flashcards, diary, coach, analytics
  - **Home Page**: Tour completion modal
  - **Similarity**: Tour steps for search, filters, tip editing
  - **Diary**: Tour steps for entry forms, task management
  - **Flashcards**: Tour steps for creation, study, folders
  - **Coach**: Tour steps for wizard navigation

---

## Feature 9: Daily Tasks & Streak

### Description
Daily task management with categories (MURAJAH, JUZ HALI, JADEED, TASMEE, GENERAL) and streak tracking with tiered progress display.

### Related Files
- **Component**: `src/features/tasks/components/DailyTask.jsx`
- **Shared Components**:
  - `src/shared/components/StreakBanner.jsx` - Streak display with tiers
- **Services**:
  - `src/shared/services/taskApi.js` - Task and streak API
- **Context**:
  - TourContext for tour integration
- **Styles**:
  - `src/styles/DailyTasks.css`
  - `src/styles/StreakBanner.css`

### Integration Points
- **Diary Feature**: Embedded in DiaryPage
- **Tour System**: Tour steps include task creation and status updates

---

## Feature 10: Theme Management

### Description
UI theme management with theme selection and preview capabilities.

### Related Files
- **Components**:
  - `src/shared/components/ThemeBanner.jsx` - Theme display banner
  - `src/shared/components/ThemeSelector.jsx` - Theme selection UI
- **Services**:
  - `src/shared/services/themeApi.js` - Theme API functions
- **Utils**:
  - `src/shared/utils/themeRegistry.js` - Theme definitions
  - `src/shared/utils/themeVisuals.js` - Theme visual configurations
- **Styles**:
  - `src/styles/ThemeBanner.css`
  - `src/styles/ThemeSelector.css`
  - `src/styles/theme-variables.css`

### Integration Points
- **Diary Feature**: ThemeBanner displayed on DiaryPage
- **All Pages**: Theme variables affect global styling

---

## Feature 11: Immersive View

### Description
3D immersive view with canvas rendering and parallax effects for enhanced Quran visualization.

### Related Files
- **Component**: `src/shared/components/ImmersiveView/ImmersiveView.jsx`
- **Hooks**:
  - `src/shared/components/ImmersiveView/hooks/useCanvasScene.js` - Canvas scene management
  - `src/shared/components/ImmersiveView/hooks/useParallax.js` - Parallax effects
- **Scenes**:
  - `src/shared/components/ImmersiveView/scenes/Sky.js` - Sky scene
  - `src/shared/components/ImmersiveView/scenes/index.js` - Scene exports
- **Utils**:
  - `src/shared/components/ImmersiveView/utils/canvasUtils.js` - Canvas utilities
  - `src/shared/components/ImmersiveView/utils/sceneHelpers.js` - Scene helpers
- **Styles**:
  - `src/styles/ImmersiveView.css`

### Integration Points
- Usage location not identified in reviewed files (may be unused or in development)

---

## Feature 12: Daily Quote

### Description
Full-screen daily Quranic quote card with countdown timer and skip functionality.

### Related Files
- **Component**: `src/shared/components/DailyQuoteCard.jsx`
- **Data**:
  - `src/data/dailyQuotes.js` - Array of 30 Quranic quotes

### Integration Points
- **App.js**: Rendered conditionally based on localStorage check

---

## Cross-Feature Dependencies

### Shared Context
- **AuthContext**: Used by all protected features
- **AppContext**: Used by Similarity feature
- **TourContext**: Used by Similarity, Diary, Flashcards, Coach, Tasks

### Shared Services
- **http.js**: Base HTTP client used by all API services
- **authApi.js**: Used by Authentication feature
- **similarityApi.js**: Used by Similarity and Coach features
- **diaryApi.js**: Used by Diary and Coach features
- **flashcardApi.js**: Used by Flashcards feature
- **analyticsApi.js**: Used by Analytics and Diary features
- **coachApi.js**: Used by Coach, Similarity, and Flashcards features
- **taskApi.js**: Used by Tasks feature
- **themeApi.js**: Used by Theme feature
- **folderApi.js**: Used by Flashcards feature

### Shared Components
- **Navbar**: Used in App.js (all pages except login/signup)
- **ProtectedRoute**: Used in App.js for all protected routes
- **ErrorBoundary**: Used in App.js as error boundary
- **TourWalkthrough**: Used in App.js for new user onboarding
- **StreakBanner**: Used in DiaryPage
- **ThemeBanner**: Used in DiaryPage

### Shared Utilities
- **marhalaMapper.js**: Used by Similarity feature
- **scoreColors.js**: Used by Diary, Analytics, and StreakBanner
- **themeRegistry.js**: Used by Theme feature
- **themeVisuals.js**: Used by Theme feature
