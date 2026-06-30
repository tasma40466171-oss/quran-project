# Project Overview

## Project Purpose

The **Hifz al-Quran Platform** is a comprehensive React + Node.js web application designed to assist Quran memorization (Hifz) students through AI-powered tools and structured learning aids. The platform provides four core features:

1. **Mutashabihat (Similar Verses)** - Search for structurally similar verses to identify patterns that can cause confusion during memorization
2. **Flashcards** - Create and study flashcard sets with memory aids, flowcharts, and AI-generated stories
3. **My Diary** - Track daily Hifz progress with 5 entry types (MURAJAH, TASMEE, IKHTEBAR, JADEED, JUZ HALI), tasks, and streak tracking
4. **Time Management (Ustadh AI Scheduler)** - 8-step wizard to generate personalized weekly study schedules based on page strength scores

Additional features include:
- **AQMOS Profile** - Learning style assessment and profile management
- **Interactive Onboarding Tour** - 24-step guided tour for new users
- **Performance Analytics** - Trend charts, deep-dive analysis, and Quran Map visualization

## Technologies Used

### Frontend
- **React**: 19.2.5
- **React Router**: 7.14.1
- **React Scripts**: 5.0.1
- **Framer Motion**: 12.40.0 (animations)
- **ECharts**: 6.1.0 (charts)
- **ECharts for React**: 3.0.6
- **Recharts**: 3.8.1 (additional charts)
- **Three.js**: 0.77.0 (3D graphics for immersive views)

### Backend (Referenced)
- **Node.js** with Express
- **SQLite** database
- **Anthropic Claude API** (claude-sonnet-4-6) for AI features

### Development Tools
- **ESLint**: 8.57.1
- **Testing Library**: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event

## Folder Overview

```
frontend/src/
├── App.js                    # Main application component with routing
├── index.js                  # Application entry point
├── App.css                   # Global styles
├── index.css                 # Base styles
├── components/               # Root-level components (TourBanner, Walkthrough)
├── data/                     # Static data (dailyQuotes.js)
├── features/                 # Feature-based modules
│   ├── analytics/            # Performance analytics and Quran Map
│   ├── auth/                 # Authentication pages and components
│   ├── coach/                # AI Coach/Hifz Planner with state machine
│   ├── diary/                # Hifz diary with 5 entry types
│   ├── flashcards/           # Flashcard system with folders
│   ├── scheduler/            # Time management wizard
│   ├── similarity/           # Mutashabihat similar verses finder
│   └── tasks/                # Daily tasks component
├── shared/                   # Shared utilities and components
│   ├── components/           # Reusable components (Navbar, ErrorBoundary, etc.)
│   ├── context/              # React Context providers
│   ├── services/             # API service layer
│   └── utils/                # Utility functions
└── styles/                   # CSS modules for components
```

## Main Application Flow

1. **Application Entry**: `index.js` → `App.js`
2. **Context Providers**: AuthProvider → AppProvider → TourProvider → Router
3. **Route Matching**: React Router matches URL to page components
4. **Authentication Check**: ProtectedRoute wraps protected pages
5. **Tour System**: TourContext manages interactive walkthrough
6. **API Communication**: Services layer uses authFetch/publicFetch
7. **State Management**: Context API for global state, local state for components

## Routing Summary

### Public Routes
- `/` - Home page with feature cards
- `/login` - Login page
- `/signup` - Signup page
- `/best-method` - Best Method/Learning style page

### Protected Routes
- `/similarity` - Mutashabihat similar verses finder
- `/diary` - Hifz diary with entry logging
- `/flashcards` - Flashcard system
- `/coach` - AI Coach/Hifz Planner

### Route Guards
- **ProtectedRoute**: Wraps protected routes, redirects to `/login` if not authenticated
- **Navbar hiding**: Navbar and tour are hidden on `/login` and `/signup` routes

## State Management Summary

### Context API
- **AuthContext**: Manages user authentication state, JWT token, and logout
- **AppContext**: Manages similarity search state (sourceAyah, results, selectedResult, tips)
- **TourContext**: Manages interactive tour state (32 steps, event dispatching, navigation)

### Local Component State
- Most components use React's `useState` for local state management
- Custom hooks for complex logic (e.g., `useCoachStateMachine`, `useMurajahForm`, etc.)
- No Redux or Zustand stores are used

### State Flow
1. **User actions** → Component state updates
2. **Context updates** → Re-renders consuming components
3. **API calls** → Service layer → Context/Component state
4. **Tour events** → TourContext dispatch → Auto-advance steps

## API Communication Summary

### HTTP Client
- **authFetch**: Authenticated requests with JWT token in Authorization header
- **publicFetch**: Unauthenticated requests (login, signup)
- **Base URL**: `http://localhost:5000/api` (configurable via REACT_APP_API_URL)

### Service Layer
All API calls are organized in `shared/services/`:
- `authApi.js` - Authentication (login, signup)
- `similarityApi.js` - Similar verses, surahs, ayahs, page details
- `diaryApi.js` - Diary entries (add, get, update, delete)
- `flashcardApi.js` - Flashcard operations
- `analyticsApi.js` - Trend data, deep-dive, heatmap
- `coachApi.js` - AI coach chat and quota
- `taskApi.js` - Daily tasks and streak
- `themeApi.js` - Theme management
- `folderApi.js` - Folder operations for flashcards
- `schedulerApi.js` - Time management scheduling

### Error Handling
- 401 responses trigger automatic logout and redirect to `/login`
- Non-JSON responses show "Is the backend running?" error
- All errors are normalized to consistent `{ success, message, statusCode }` shape
- Error logging with context for debugging

### Authentication
- JWT stored in localStorage as `token`
- Username stored in localStorage as `username`
- Token automatically attached to all authenticated requests
- Token expiration handled with automatic logout
