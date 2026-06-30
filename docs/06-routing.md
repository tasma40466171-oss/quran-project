# Routing

Complete routing configuration including routes, protected routes, nested routes, layouts, and guards.

## Routing Configuration

### Router Setup
The application uses React Router v7 with `BrowserRouter` as the router provider.

**File**: `src/App.js`

```jsx
<BrowserRouter>
  <Routes>
    {/* Route definitions */}
  </Routes>
</BrowserRouter>
```

## Route Definitions

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Home page with feature cards and daily quote |
| `/login` | `LoginPage` | User login form |
| `/signup` | `SignupPage` | User registration form |
| `/best-method` | `BestMethodPage` | Static content about Quran memorization methods |

### Protected Routes

| Path | Component | Protection |
|------|-----------|------------|
| `/similarity` | `SimilarityPage` | ProtectedRoute wrapper |
| `/diary` | `DiaryPage` | ProtectedRoute wrapper |
| `/flashcards` | `FlashcardsPage` | ProtectedRoute wrapper |
| `/coach` | `CoachPage` | ProtectedRoute wrapper |

### Route with Query Parameters

| Path | Query Param | Usage |
|------|-------------|-------|
| `/coach` | `?start=wizard` | Starts coach wizard directly |
| `/similarity` | `location.state` | Auto-search parameters from coach |

## Route Guards

### ProtectedRoute Component

**File**: `src/shared/components/ProtectedRoute.jsx`

**Purpose**: Redirects unauthenticated users to login page with return URL.

**Implementation**:
```jsx
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  return children;
};
```

**Behavior**:
- Checks `user` from AuthContext
- If no user, redirects to `/login`
- Stores intended destination in `location.state.from`
- Uses `replace` to prevent back button issues

### Auth State Check

**File**: `src/shared/context/AuthContext.js`

**Behavior**:
- On mount, checks localStorage for `token` and `username`
- Validates JWT token expiration
- Automatically logs out if token is expired
- Sets `user` state if valid token exists

## Layout Components

### App Layout

**File**: `src/App.js`

**Layout Structure**:
```
ErrorBoundary
└── AuthProvider
    └── AppProvider
        └── TourProvider
            └── BrowserRouter
                └── Routes
                    └── [Conditional Navbar]
                    └── [Conditional TourBanner]
                    └── [Conditional DailyQuoteCard]
                    └── [Conditional Walkthrough]
                    └── Route Components
```

### Conditional Rendering Based on Route

**Navbar**: Hidden on `/login` and `/signup` routes
```jsx
{location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}
```

**TourBanner**: Hidden on `/login` and `/signup` routes
```jsx
{location.pathname !== '/login' && location.pathname !== '/signup' && <TourBanner />}
```

**DailyQuoteCard**: Conditionally rendered based on localStorage check
```jsx
{showDailyQuote && <DailyQuoteCard onDismiss={() => setShowQuote(false)} />}
```

**Walkthrough**: Modal overlay, not tied to specific route

## Navigation Patterns

### Programmatic Navigation

**Using React Router hooks**:
- `useNavigate()` for imperative navigation
- `navigate('/path')` for simple navigation
- `navigate('/path', { state: {... })` for state passing
- `navigate(-1)` for back navigation

**Examples**:
```jsx
// Login page - redirect after login
const navigate = useNavigate();
if (data.success) {
  login(data.data.token, data.data.username);
  navigate('/');
}

// Coach - navigate with auto-search
navigate('/similarity', {
  state: {
    autoSearch: true,
    surah: surah,
    ayah: ayah
  }
});

// Logout - redirect to login
const handleLogout = () => {
  logout();
  navigate('/login');
};
```

### Link Navigation

**Using Link component**:
```jsx
<Link to="/similarity">Mutashābihāt</Link>
<Link to="/diary">My Diary</Link>
```

**External links**:
```jsx
<a href="https://forms.gle/..." target="_blank" rel="noopener noreferrer">
  Take Assessment
</a>
```

## State Passing via Navigation

### Similarity Page Auto-Search

**From Coach Feature**:
```jsx
navigate('/similarity', {
  state: {
    autoSearch: true,
    surah: pair.a.surah,
    ayah: pair.a.ayah,
    targetSurah: pair.b.surah,
    targetAyah: pair.b.ayah,
    coachTips: {
      [`${pair.b.surah}:${pair.b.ayah}`]: tip
    }
  }
});
```

**In SimilarityPage**:
```jsx
const location = useLocation();
const { autoSearch, surah, ayah, coachTips } = location.state || {};

useEffect(() => {
  if (autoSearch && surahRef.current) {
    searchBarRef.current?.triggerSearch(surah, ayah);
  }
}, [autoSearch, surah, ayah]);
```

### Login Return URL

**From ProtectedRoute**:
```jsx
<Navigate to="/login" state={{ from: window.location.pathname }} replace />
```

**In LoginPage** (potential implementation):
```jsx
const location = useLocation();
const from = location.state?.from || '/';
// After successful login:
navigate(from);
```

## Tour Integration with Routing

### Tour Step Navigation

**TourContext** includes page associations for each step:
```jsx
const tourSteps = [
  { step: 1, page: '/', content: '...' },
  { step: 2, page: '/similarity', content: '...' },
  { step: 3, page: '/similarity', content: '...' },
  // ... more steps
];
```

**Auto-navigation**:
```jsx
const advanceStep = () => {
  const nextStep = currentStep + 1;
  const nextStepData = tourSteps[nextStep - 1];
  
  if (nextStepData?.page && location.pathname !== nextStepData.page) {
    navigate(nextStepData.page);
  }
  
  setCurrentState(nextStep);
};
```

### Tour Event Dispatching

Components dispatch tour events that trigger step advancement:
```jsx
dispatchTourEvent('similarity:search:complete');
dispatchTourEvent('diary:task:added');
dispatchTourEvent('tip:edit:opened');
```

## Route-Specific Behaviors

### Home Page
- Displays tour completion modal when tour reaches step 36
- Shows "Take a Tour" button if tour not completed
- Feature cards link to protected routes (redirect to login if not authenticated)

### Similarity Page
- Supports auto-search via `location.state`
- Integrates with TourContext for step tracking
- Can be navigated to from Coach with pre-filled search

### Diary Page
- Embedded DailyTask component
- Embedded PerformanceAnalyticsView component
- Tour integration for entry forms and task management

### Flashcards Page
- Supports folder-based navigation
- Can be navigated to from Coach after flashcard generation
- Tour integration for creation and study

### Coach Page
- Supports `?start=wizard` query parameter
- Navigates to other features (similarity, flashcards) with state
- Complex state machine with internal navigation

## Error Handling in Routing

### 401 Redirect

**File**: `src/shared/services/http.js`

**Behavior**:
```jsx
if (res.status === 401) {
  // Clear auth state
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  // Redirect to login
  window.location.href = '/login';
}
```

### 404 Handling

Not explicitly implemented - relies on React Router's default behavior (no match = nothing rendered).

## Future Routing Considerations

### Potential Nested Routes
Currently using flat routing structure. Could benefit from nested routes for:
- `/coach/wizard/*` for coach wizard steps
- `/flashcards/folders/:id` for folder views
- `/diary/:date` for specific date views

### Lazy Loading
Not currently implemented. Could add for performance:
```jsx
const SimilarityPage = lazy(() => import('./features/similarity/SimilarityPage'));
```

### Route Guards Enhancement
Could add role-based guards or permission checks in ProtectedRoute.

## Routing Summary

- **Total Routes**: 8 (4 public, 4 protected)
- **Router**: React Router v7 BrowserRouter
- **Guard Component**: ProtectedRoute (auth check)
- **State Passing**: Via location.state for cross-feature communication
- **Tour Integration**: Auto-navigation based on step page association
- **Error Handling**: 401 auto-redirect to login
- **Layout**: Conditional rendering of Navbar and TourBanner based on route
