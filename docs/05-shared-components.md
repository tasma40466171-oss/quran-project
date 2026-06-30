# Shared Components

Reusable components with their purpose, props, usage, and reusability.

## Navbar

### Purpose
Main navigation bar with logo, navigation links, and authentication controls.

### File
`src/shared/components/Navbar.jsx`

### Props
- `onOpenWalkthrough` (function): Callback to open walkthrough modal

### Usage
```jsx
<Navbar onOpenWalkthrough={() => setWalkthroughOpen(true)} />
```

### Reusability
- **High**: Used in App.js for all pages except login/signup
- **Dependencies**: React Router (Link, useLocation, useNavigate), AuthContext
- **Customization**: Displays different links based on auth state, shows username and logout button for authenticated users

---

## ProtectedRoute

### Purpose
Route guard component that redirects unauthenticated users to login page.

### File
`src/shared/components/ProtectedRoute.jsx`

### Props
- `children` (ReactNode): Child components to render if authenticated

### Usage
```jsx
<ProtectedRoute>
  <SimilarityPage />
</ProtectedRoute>
```

### Reusability
- **Very High**: Used in App.js to wrap all protected routes
- **Dependencies**: React Router (Navigate), AuthContext
- **Customization**: Minimal, simple guard pattern

---

## ErrorBoundary

### Purpose
Error boundary component that catches React errors and displays a user-friendly error message with retry option.

### File
`src/shared/components/ErrorBoundary.jsx`

### Props
- `children` (ReactNode): Child components to monitor for errors

### Usage
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Reusability
- **High**: Used in App.js as top-level error boundary
- **Dependencies**: React only
- **Customization**: Displays error details in development mode only

---

## DailyQuoteCard

### Purpose
Full-screen daily Quranic quote card with countdown timer and skip functionality.

### File
`src/shared/components/DailyQuoteCard.jsx`

### Props
- `onDismiss` (function): Callback when user dismisses the quote

### Usage
```jsx
<DailyQuoteCard onDismiss={() => setShowQuote(false)} />
```

### Reusability
- **Low**: Used in App.js conditionally based on localStorage check
- **Dependencies**: React, dailyQuotes data
- **Customization**: Fixed design, 15-second countdown, 10-second skip delay

---

## StreakBanner

### Purpose
Streak display banner with tiered progress system (7 tiers from "Getting Started" to "Immortal").

### File
`src/shared/components/StreakBanner.jsx`

### Props
None (uses taskApi internally)

### Usage
```jsx
<StreakBanner />
```

### Reusability
- **Medium**: Used in DiaryPage
- **Dependencies**: React, taskApi
- **Customization**: Automatic tier calculation based on streak count, progress bar to next tier

---

## ThemeBanner

### Purpose
Theme display banner showing current theme information.

### File
`src/shared/components/ThemeBanner.jsx` (not read, inferred)

### Props
Not assessed

### Usage
```jsx
<ThemeBanner />
```

### Reusability
- **Medium**: Used in DiaryPage
- **Dependencies**: Assumed React, themeApi
- **Customization**: Not assessed

---

## ThemeSelector

### Purpose
Theme selection UI for changing application theme.

### File
`src/shared/components/ThemeSelector.jsx` (not read, inferred)

### Props
Not assessed

### Usage
```jsx
<ThemeSelector />
```

### Reusability
- **Medium**: Used in various pages (assumed)
- **Dependencies**: Assumed React, themeApi
- **Customization**: Not assessed

---

## TourBanner

### Purpose
Tour progress display with step counter, content, and navigation controls. Supports two modes: manual (centered modal) and action (docked bottom-right).

### File
`src/components/TourBanner.jsx`

### Props
None (uses TourContext internally)

### Usage
```jsx
<TourBanner />
```

### Reusability
- **Low**: Used in App.js, tightly coupled to TourContext
- **Dependencies**: React, ReactDOM, React Router, TourContext
- **Customization**: Two rendering modes based on step trigger type, auto-advance for action steps

---

## Walkthrough

### Purpose
Welcome modal for new users with options to start interactive tour or skip.

### File
`src/components/Walkthrough.jsx`

### Props
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Callback when modal is closed

### Usage
```jsx
<Walkthrough isOpen={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />
```

### Reusability
- **Low**: Used in App.js for new user onboarding
- **Dependencies**: React, React Router, TourContext
- **Customization**: Fixed design, starts tour on similarity page

---

## DashboardCard

### Purpose
Reusable card component for dashboard feature links with hover effects.

### File
`src/features/auth/components/DashboardCard.jsx`

### Props
- `title` (string): Card title
- `description` (string): Card description
- `linkTo` (string): Navigation path or URL
- `buttonText` (string): Button text
- `color` (string): Accent color for border and button
- `isExternal` (boolean, optional): If true, opens in new tab

### Usage
```jsx
<DashboardCard
  title="Mutashābihāt"
  description="Search for any Ayah and find its structurally similar pairs."
  linkTo="/similarity"
  buttonText="Open Tool"
  color="#F2C94C"
/>
```

### Reusability
- **High**: Used in Home.jsx for all feature cards
- **Dependencies**: React, React Router (Link)
- **Customization**: Flexible title, description, colors, supports external links

---

## ImmersiveView

### Purpose
3D immersive view with canvas rendering and parallax effects for enhanced Quran visualization.

### File
`src/shared/components/ImmersiveView/ImmersiveView.jsx` (not read, inferred)

### Props
Not assessed

### Usage
```jsx
<ImmersiveView />
```

### Reusability
- **Low**: Usage location not identified (may be unused or in development)
- **Dependencies**: Assumed React, Three.js
- **Customization**: Includes subfolder with hooks, scenes, and utilities

---

## ImmersiveView Sub-components

### useCanvasScene
- **File**: `src/shared/components/ImmersiveView/hooks/useCanvasScene.js`
- **Purpose**: Canvas scene management hook
- **Reusability**: Low, specific to ImmersiveView

### useParallax
- **File**: `src/shared/components/ImmersiveView/hooks/useParallax.js`
- **Purpose**: Parallax effects hook
- **Reusability**: Low, specific to ImmersiveView

### Sky
- **File**: `src/shared/components/ImmersiveView/scenes/Sky.js`
- **Purpose**: Sky scene component
- **Reusability**: Low, specific to ImmersiveView

### canvasUtils
- **File**: `src/shared/components/ImmersiveView/utils/canvasUtils.js`
- **Purpose**: Canvas utility functions
- **Reusability**: Low, specific to ImmersiveView

### sceneHelpers
- **File**: `src/shared/components/ImmersiveView/utils/sceneHelpers.js`
- **Purpose**: Scene helper functions
- **Reusability**: Low, specific to ImmersiveView

---

## Feature-Specific Shared Components

### LogHistory
- **File**: `src/features/diary/components/LogHistory.jsx`
- **Purpose**: Displays diary log history with edit/delete functionality
- **Props**: logs, activeDate, logsLoading, logsError, reload, showToast, requestConfirm
- **Reusability**: Medium, specific to diary feature but could be adapted for other list views

### FolderGrid
- **File**: `src/features/flashcards/components/FolderGrid.jsx`
- **Purpose**: Displays folder grid with create/rename/delete functionality
- **Props**: folders, onFolderClick, onCreateFolder, onRefresh
- **Reusability**: Medium, specific to flashcards but could be adapted for other folder systems

### StudyView
- **File**: `src/features/flashcards/components/StudyView.jsx`
- **Purpose**: Displays flashcard study material or parsed ayahs
- **Props**: category (with cards or study HTML)
- **Reusability**: Low, specific to flashcards feature

### TestView
- **File**: `src/features/flashcards/components/TestView.jsx`
- **Purpose**: Flashcard quiz/flip card view
- **Props**: cards array
- **Reusability**: Medium, could be used for any flashcard/quiz system

### SequenceFlowchart
- **File**: `src/features/flashcards/components/SequenceFlowchart.jsx`
- **Purpose**: Visualizes sequence flowchart with mnemonic/story views
- **Props**: setName, cards (optional)
- **Reusability**: Low, highly specific to Quran sequence visualization

---

## Component Reusability Summary

### Highly Reusable
- **ProtectedRoute**: Simple guard pattern, can protect any route
- **DashboardCard**: Flexible card component for any dashboard
- **ErrorBoundary**: Standard error boundary pattern
- **Navbar**: Standard navigation pattern with auth integration

### Moderately Reusable
- **StreakBanner**: Could be adapted for any gamification system
- **ThemeBanner/ThemeSelector**: Could be used in any theming system
- **LogHistory**: Could be adapted for any CRUD list with edit/delete
- **FolderGrid**: Could be adapted for any folder management system
- **TestView**: Could be used for any flashcard/quiz system

### Low Reusability (Feature-Specific)
- **DailyQuoteCard**: Specific to daily quote feature
- **TourBanner**: Tightly coupled to TourContext
- **Walkthrough**: Specific to onboarding flow
- **ImmersiveView**: Specific to 3D visualization
- **StudyView**: Specific to flashcard study
- **SequenceFlowchart**: Specific to Quran sequence visualization

---

## Component Dependencies

### React Router Dependencies
- Navbar (Link, useLocation, useNavigate)
- ProtectedRoute (Navigate)
- DashboardCard (Link)
- Walkthrough (useNavigate, Link)
- TourBanner (useNavigate)

### Context Dependencies
- Navbar (AuthContext)
- ProtectedRoute (AuthContext)
- Walkthrough (TourContext)
- TourBanner (TourContext)

### API Dependencies
- StreakBanner (taskApi)
- ThemeBanner (themeApi, inferred)
- ThemeSelector (themeApi, inferred)

### Data Dependencies
- DailyQuoteCard (dailyQuotes)

---

## Component Styling

Each component has its own CSS file:
- Navbar.css
- StreakBanner.css
- ThemeBanner.css
- ThemeSelector.css
- DashboardCard.css
- ImmersiveView.css
- DiaryPage.css (includes LogHistory styles)
- Flashcards.css (includes StudyView, TestView styles)
