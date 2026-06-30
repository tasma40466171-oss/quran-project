# Project Tree

Complete folder tree of the `src` directory.

```
src/
├── App.css
├── App.js
├── index.css
├── index.js
├── components/
│   ├── TourBanner.jsx
│   └── Walkthrough.jsx
├── data/
│   └── dailyQuotes.js
├── features/
│   ├── analytics/
│   │   ├── PerformanceAnalyticsView.jsx
│   │   └── components/
│   │       └── QuranMapView.jsx
│   ├── auth/
│   │   ├── components/
│   │   │   └── DashboardCard.jsx
│   │   └── pages/
│   │       ├── BestMethodPage.jsx
│   │       ├── Home.jsx
│   │       ├── LoginPage.jsx
│   │       └── SignupPage.jsx
│   ├── coach/
│   │   ├── coachConstants.js
│   │   ├── coachStates.js
│   │   ├── components/
│   │   │   ├── AIErrorDisplay.jsx
│   │   │   ├── AQMOSAssessmentModal.jsx
│   │   │   ├── AQMOSProfileModal.jsx
│   │   │   ├── AQMOSWizard.jsx
│   │   │   ├── BestMethodScreens.jsx
│   │   │   ├── CoachComponents.jsx
│   │   │   ├── CoachSidebar.jsx
│   │   │   ├── GlobalSidePanel.jsx
│   │   │   ├── MutashabihatScreens.jsx
│   │   │   ├── SequenceScreens.jsx
│   │   │   ├── SequenceWizard.jsx
│   │   │   ├── TimeManagementScreens.jsx
│   │   │   └── TimeManagementWizard.jsx
│   │   ├── hooks/
│   │   │   ├── useCoachChat.js
│   │   │   ├── useCoachSessions.js
│   │   │   └── useCoachStateMachine.js
│   │   ├── pages/
│   │   │   └── CoachPage.jsx
│   │   ├── parsers/
│   │   │   ├── tipParser.js
│   │   │   └── useCoachParsers.js
│   │   └── utils/
│   │       ├── quranCache.js
│   │       └── quranContextBuilder.js
│   ├── diary/
│   │   ├── DiaryPage.jsx
│   │   ├── components/
│   │   │   ├── LogHistory.jsx
│   │   │   └── forms/
│   │   │       ├── IkhtebarForm.jsx
│   │   │       ├── JadeedForm.jsx
│   │   │       ├── JuzHaliForm.jsx
│   │   │       ├── MurajahForm.jsx
│   │   │       └── TasmeeForm.jsx
│   │   └── hooks/
│   │       ├── useIkhtebarForm.js
│   │       ├── useJadeedForm.js
│   │       ├── useJuzHaliForm.js
│   │       ├── useMurajahForm.js
│   │       ├── useRangeForm.js
│   │       └── useTasmeeForm.js
│   ├── flashcards/
│   │   ├── FlashcardsPage.jsx
│   │   ├── components/
│   │   │   ├── AddSetsToFolderModal.jsx
│   │   │   ├── CreateFlashcardModal.jsx
│   │   │   ├── FolderGrid.jsx
│   │   │   ├── QuestionEditor.jsx
│   │   │   ├── SequenceFlowchart.jsx
│   │   │   ├── StudyView.jsx
│   │   │   └── TestView.jsx
│   │   └── data/
│   │       └── flashcardsData.jsx
│   ├── scheduler/
│   │   ├── SchedulerPage.css
│   │   ├── SchedulerPage.jsx
│   │   ├── SchedulerWizard.css
│   │   ├── SchedulerWizard.jsx
│   │   ├── components/
│   │   │   ├── EventBuilder.jsx
│   │   │   ├── RevisionUnits.jsx
│   │   │   └── ScheduleView.jsx
│   │   ├── services/
│   │   │   └── schedulerApi.js
│   │   └── wizard/
│   │       ├── AdjustUnit.jsx
│   │       ├── BuildMyWeek.jsx
│   │       ├── Exceptions.jsx
│   │       ├── GeneratedSchedule.jsx
│   │       ├── ProgressAnalysis.jsx
│   │       ├── Review.jsx
│   │       ├── UnitDetails.jsx
│   │       └── WeeklyCycle.jsx
│   ├── similarity/
│   │   ├── SimilarityPage.jsx
│   │   └── components/
│   │       ├── AyahDisplay.jsx
│   │       ├── MutashabihatWizard.jsx
│   │       ├── SearchBar.jsx
│   │       ├── SidePanel.jsx
│   │       └── SimilaritiesList.jsx
│   └── tasks/
│       └── components/
│           └── DailyTask.jsx
├── shared/
│   ├── components/
│   │   ├── DailyQuoteCard.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── ImmersiveView/
│   │   │   ├── ImmersiveView.css
│   │   │   ├── ImmersiveView.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCanvasScene.js
│   │   │   │   └── useParallax.js
│   │   │   ├── scenes/
│   │   │   │   ├── Sky.js
│   │   │   │   └── index.js
│   │   │   └── utils/
│   │   │       ├── canvasUtils.js
│   │   │       └── sceneHelpers.js
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── StreakBanner.jsx
│   │   ├── ThemeBanner.jsx
│   │   └── ThemeSelector.jsx
│   ├── context/
│   │   ├── AppContext.js
│   │   ├── AuthContext.js
│   │   └── TourContext.jsx
│   ├── services/
│   │   ├── analyticsApi.js
│   │   ├── apiConfig.js
│   │   ├── authApi.js
│   │   ├── coachApi.js
│   │   ├── diaryApi.js
│   │   ├── flashcardApi.js
│   │   ├── folderApi.js
│   │   ├── http.js
│   │   ├── index.js
│   │   ├── similarityApi.js
│   │   ├── taskApi.js
│   │   └── themeApi.js
│   └── utils/
│       ├── marhalaMapper.js
│       ├── scoreColors.js
│       ├── themeRegistry.js
│       └── themeVisuals.js
└── styles/
    ├── AIErrorDisplay.css
    ├── AnalyticsView.css
    ├── AuthPages.css
    ├── AyahDisplay.css
    ├── BestMethodPage.css
    ├── DailyTasks.css
    ├── DashboardCard.css
    ├── DiaryPage.css
    ├── Flashcards.css
    ├── ImmersiveView.css
    ├── LoadingSpinner.css
    ├── Navbar.css
    ├── PerformanceAnalyticsView.css
    ├── QuranMapView.css
    ├── Responsive.css
    ├── SearchBar.css
    ├── SidePanel.css
    ├── SimilarityList.css
    ├── StreakBanner.css
    ├── ThemeBanner.css
    ├── ThemeSelector.css
    └── theme-variables.css
```

## Statistics

- **Total Files**: 89 source files
- **Total Directories**: 28 directories
- **Features**: 7 feature modules
- **Shared Components**: 7 main components + ImmersiveView subfolder (6 files)
- **Services**: 12 API service files
- **Hooks**: 9 custom hooks
- **Styles**: 22 CSS files
