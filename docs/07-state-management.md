# State Management

Contexts, Redux, Zustand, React Query, local and shared state, and data flow.

## Overview

The application uses **React Context API** for global state management. No Redux, Zustand, or React Query is used. Local component state is managed with React's `useState` and `useEffect` hooks.

## Context Providers

### AuthContext

**File**: `src/shared/context/AuthContext.js`

**Purpose**: Manages user authentication state, JWT token, and logout functionality.

**State**:
- `user` (object | null): Current user object with username
- `token` (string | null): JWT authentication token
- `loading` (boolean): Loading state during auth check

**Functions**:
- `login(token, username)`: Sets token and username in state and localStorage
- `logout()`: Clears token and username from state and localStorage
- `checkAuth()`: Validates stored token and sets user state

**Persistence**:
- Token stored in `localStorage` as `token`
- Username stored in `localStorage` as `username`
- Token expiration checked on mount, auto-logout if expired

**Usage**:
```jsx
const { user, token, login, logout } = useAuthContext();
```

**Consumers**:
- Navbar
- ProtectedRoute
- LoginPage
- Home
- All protected pages

---

### AppContext

**File**: `src/shared/context/AppContext.js`

**Purpose**: Manages similarity search state (source ayah, results, selected result, tips).

**State**:
- `sourceAyah` (object | null): Source ayah data
- `results` (array): Array of similar verse results
- `selectedResult` (object | null): Currently selected similarity result
- `isLoading` (boolean): Loading state for search
- `tips` (array): Array of memory tips for selected pair

**Setters**:
- `setSourceAyah()`: Sets source ayah
- `setResults()`: Sets results array
- `setSelectedResult()`: Sets selected result
- `setIsLoading()`: Sets loading state
- `setTips()`: Sets tips array

**Persistence**: None (session-only)

**Usage**:
```jsx
const { sourceAyah, results, selectedResult, setResults, setSelectedResult, setTips } = useAppContext();
```

**Consumers**:
- SimilarityPage
- SearchBar
- AyahDisplay
- SimilarityList
- SidePanel

---

### TourContext

**File**: `src/shared/context/TourContext.jsx`

**Purpose**: Manages interactive onboarding tour with 32 steps, event dispatching, and navigation.

**State**:
- `isActive` (boolean): Whether tour is currently active
- `currentStep` (number): Current step number (1-32)
- `tourSteps` (array): Array of step definitions with page, content, trigger
- `navigate` (function): React Router navigate function (registered by TourBanner)

**Functions**:
- `startTour()`: Starts tour from step 1
- `advanceStep()`: Advances to next step, handles navigation
- `exitTour()`: Exits tour mid-way
- `completeTour()`: Marks tour as completed
- `dispatchTourEvent(event)`: Dispatches event for auto-advance
- `registerNavigate(nav)`: Registers navigate function for auto-navigation
- `onAqmosTestStarted()`: Callback for AQMOS test start
- `onAqmosProfileSaved()`: Callback for AQMOS profile save

**Persistence**:
- Tour completion stored in `localStorage` as `tourCompleted`

**Tour Steps**:
32 steps covering:
- Home page (steps 1-2)
- Similarity search (steps 3-12)
- Diary entry (steps 13-18)
- Task management (steps 19-21)
- Flashcards (steps 22-27)
- Coach (steps 28-32)

**Usage**:
```jsx
const { isActive, currentStep, advanceStep, dispatchTourEvent } = useTour();
```

**Consumers**:
- TourBanner
- Walkthrough
- Home
- SimilarityPage
- DiaryPage
- FlashcardsPage
- CoachPage
- DailyTask
- SidePanel

---

## Local Component State

### useState Usage

Most components use `useState` for local state management:

**Examples**:
- **LoginPage**: username, password, error state
- **SignupPage**: username, email, password, error, success state
- **SearchBar**: surahs, ayahs, selectedSurah, selectedAyah, inputError, marhala, juzz
- **SidePanel**: saving, status, context, loadingContext, generatingTip, tipError
- **DailyTask**: tasks, isLoading, newTask, category, editingId, editText
- **FolderGrid**: creating, newFolderName, deletingFolder
- **CreateFlashcardModal**: step, selectedSetType, mode, input, loading, error

### useEffect Usage

Used for:
- Data fetching on mount
- Cleanup on unmount
- Responding to prop changes
- Setting up timers and intervals

**Examples**:
- **SearchBar**: Fetch ayahs when surah changes
- **StreakBanner**: Fetch streak on mount
- **DailyTask**: Refresh tasks when activeDate changes
- **SidePanel**: Load context when selectedResult changes
- **TourBanner**: Register navigate function on mount

### Custom Hooks

Feature-specific custom hooks encapsulate complex logic:

**Diary Hooks**:
- `useMurajahForm.js`: Murajah form state and submission
- `useTasmeeForm.js`: Tasmee form state and submission
- `useIkhtebarForm.js`: Ikhtebar form state and submission
- `useJadeedForm.js`: Jadeed form state and submission
- `useJuzHaliForm.js`: Juz Hali form state and submission
- `useRangeForm.js`: Range form state

**Coach Hooks**:
- `useCoachStateMachine.js`: Complex state machine for coach workflow
- `useCoachChat.js`: Chat interaction logic
- `useCoachSessions.js`: Session management

**ImmersiveView Hooks**:
- `useCanvasScene.js`: Canvas scene management
- `useParallax.js`: Parallax effects

---

## State Flow Patterns

### Authentication Flow

```
User Action → LoginPage → authApi.loginUser()
                                    ↓
                            AuthContext.login(token, username)
                                    ↓
                            localStorage.setItem('token', token)
                            localStorage.setItem('username', username)
                                    ↓
                            ProtectedRoute checks user
                                    ↓
                            Access granted to protected routes
```

### Similarity Search Flow

```
User Action → SearchBar → similarityApi.fetchSimilarities()
                                    ↓
                            AppContext.setResults(results)
                            AppContext.setSourceAyah(source)
                                    ↓
                            SimilarityList renders results
                            AyahDisplay renders source
                                    ↓
User clicks result → SimilarityList.handleCardClick()
                                    ↓
                            AppContext.setSelectedResult(result)
                            AppContext.setTips([]) // Clear tips
                                    ↓
                            SidePanel loads context
                            SidePanel generates AI tip
                            AppContext.setTips([tip])
```

### Tour Flow

```
User Action → Walkthrough → TourContext.startTour()
                                    ↓
                            TourContext.advanceStep()
                                    ↓
                            Check if step has different page
                                    ↓
                            navigate(step.page)
                                    ↓
                            TourBanner renders step content
                                    ↓
User action → dispatchTourEvent('event:name')
                                    ↓
                            TourContext checks event for current step
                                    ↓
                            Auto-advance to next step
```

### Coach State Machine Flow

```
User Action → CoachPage → useCoachStateMachine.handleOption()
                                    ↓
                            setCurrentState(newState)
                                    ↓
                            renderCurrentScreen() based on state
                                    ↓
                            User input → handleInput()
                                    ↓
                            API call → setStateData(result)
                                    ↓
                            Transition to next state
```

---

## Data Persistence

### localStorage

**AuthContext**:
- `token`: JWT authentication token
- `username`: User's username
- `tourCompleted`: Tour completion flag (TourContext)

**DailyQuoteCard**:
- `lastQuoteDate`: Date of last shown quote

**No persistence for**:
- AppContext (similarity search state)
- Component local state
- Tour active state (only completion flag)

---

## State Management Patterns

### Context Provider Pattern

All contexts follow the same pattern:
```jsx
const ContextNameContext = createContext();

export const ContextNameProvider = ({ children }) => {
  const [state, setState] = useState(initialValue);
  
  const value = {
    state,
    setState,
    // other functions
  };
  
  return (
    <ContextNameContext.Provider value={value}>
      {children}
    </ContextNameContext.Provider>
  );
};

export const useContextName = () => {
  const context = useContext(ContextNameContext);
  if (!context) throw new Error('useContextName must be used within ContextNameProvider');
  return context;
};
```

### State Machine Pattern

Used in Coach feature for complex workflow:
```jsx
const COACH_STATES = {
  HOME: 'home',
  SEQUENCE_HOME: 'sequence_home',
  // ... more states
};

const [currentState, setCurrentState] = useState(COACH_STATES.HOME);
const [stateData, setStateData] = useState({});

const handleOption = (option) => {
  switch (option.key) {
    case '1':
      setCurrentState(COACH_STATES.SEQUENCE_HOME);
      break;
    // ... more cases
  }
};
```

### Module-Level Cache

Used in SidePanel for AI tips:
```jsx
const generatedTipsCache = new Map();

// Check cache first
if (generatedTipsCache.has(pairKey)) {
  setTips(generatedTipsCache.get(pairKey));
  return;
}

// Generate and cache
const tip = await generateTip();
generatedTipsCache.set(pairKey, [tip]);
```

---

## State Synchronization

### Cross-Component State

**AppContext**: Synchronizes similarity state across SearchBar, AyahDisplay, SimilarityList, and SidePanel

**TourContext**: Synchronizes tour state across TourBanner, Walkthrough, and feature pages

**AuthContext**: Synchronizes auth state across Navbar, ProtectedRoute, and auth pages

### Parent-Child State

**DiaryPage → LogHistory**: Parent passes logs and reload function
**FlashcardsPage → FolderGrid**: Parent passes folders and refresh function
**CoachPage → Screen Components**: Parent passes state data and handlers

### Event-Driven State

**Tour Events**: Components dispatch events that trigger tour advancement
```jsx
dispatchTourEvent('task:added');
dispatchTourEvent('similarity:search:complete');
dispatchTourEvent('tip:edit:opened');
```

---

## Performance Considerations

### Context Optimization

- **AppContext**: Minimal state (5 values), no performance issues
- **AuthContext**: Minimal state (3 values), no performance issues
- **TourContext**: Moderate state (tourSteps array with 32 items), could be memoized if needed

### Local State Optimization

- **useCallback**: Used in some components for event handlers (SidePanel, FolderGrid)
- **useMemo**: Used in QuranMapView for data mapping
- **useRef**: Used in SequenceFlowchart for DOM references

### Avoiding Unnecessary Re-renders

- Context providers are at app level, but state changes are infrequent
- Most state is local to components, minimizing context dependency
- Tour steps are static array, not recreated on render

---

## State Management Summary

| Type | Count | Examples |
|------|-------|----------|
| Context Providers | 3 | AuthContext, AppContext, TourContext |
| Custom Hooks | 9+ | useCoachStateMachine, useMurajahForm, etc. |
| Local State | 30+ | useState in most components |
| Module-Level Cache | 1 | generatedTipsCache in SidePanel |
| localStorage Keys | 4 | token, username, tourCompleted, lastQuoteDate |

**No Redux, Zustand, or React Query used** - all state managed with React Context and local state.

**Data Flow**: Unidirectional from user actions → local state → context → API calls → state updates → re-render
