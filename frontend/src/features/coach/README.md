# Coach Feature

## Purpose

The Coach feature (Ustadh AI) is an AI-powered Quran memorization assistant that provides personalized guidance through multiple capabilities:
- **Sequence Generation**: Create flashcard sequences for surahs, pages, and juz with AI-generated mnemonic stories
- **Mutashabihat Recommendations**: Find similar verses and get AI-generated memory tips
- **Assessment**: AQMOS learning style assessment to personalize recommendations
- **Planning**: Time management wizard to generate personalized weekly study schedules

## Architecture

The Coach feature is organized around **capabilities** rather than generic component groupings. Each capability contains its own components, hooks, utilities, and styles.

### Capability-Based Structure

```
coach/
├── pages/              # Main page and routing
├── assessment/         # AQMOS learning style assessment
├── planning/           # Time management and scheduling
├── sequence/           # Sequence generation and flashcards
├── recommendations/    # Mutashabihat (similarity) recommendations
└── shared/            # Reusable components, hooks, utilities, constants
```

## Folder Structure

### pages/
- `CoachPage.jsx` - Main coach page with state machine orchestration

### assessment/
- `components/`
  - `AQMOSAssessmentModal.jsx` - Modal for AQMOS assessment
  - `AQMOSProfileModal.jsx` - Modal for AQMOS profile input
  - `AQMOSWizard.jsx` - AQMOS wizard wrapper
  - `BestMethodScreens.jsx` - Assessment screens
- `hooks/` - (empty, future use)
- `styles/` - (empty, future use)
- `utils/` - (empty, future use)

### planning/
- `components/`
  - `TimeManagementScreens.jsx` - Time management wizard screens
  - `TimeManagementWizard.jsx` - Time management wizard wrapper
- `hooks/` - (empty, future use)
- `styles/` - (empty, future use)
- `utils/` - (empty, future use)

### sequence/
- `components/`
  - `SequenceScreens.jsx` - Sequence wizard screens
  - `SequenceWizard.jsx` - Sequence wizard wrapper
- `hooks/` - (empty, future use)
- `styles/` - (empty, future use)
- `prompts/` - (empty, future use for prompt organization)
- `utils/` - (empty, future use)

### recommendations/
- `components/`
  - `MutashabihatScreens.jsx` - Mutashabihat wizard screens
- `styles/` - (empty, future use)
- `utils/`
  - `tipParser.js` - Parse AI-generated tips from responses

### shared/
- `components/`
  - `AIErrorDisplay.jsx` - AI error display component
  - `CoachComponents.jsx` - Reusable coach UI components (TypingIndicator, FormattedText, etc.)
  - `CoachSidebar.jsx` - Session sidebar
  - `GlobalSidePanel.jsx` - Global side panel for tips and context
- `hooks/`
  - `useCoachChat.js` - Chat interaction logic
  - `useCoachParsers.js` - Coach response parsers
  - `useCoachSessions.js` - Session management
  - `useCoachStateMachine.js` - State machine for coach workflow
- `styles/`
  - `AIErrorDisplay.css` - AI error display styles
- `utils/`
  - `quranCache.js` - Quran data caching
  - `quranContextBuilder.js` - Build Quran context for AI
- `constants/`
  - `coachConstants.js` - API configuration, system prompts, context builders
  - `coachStates.js` - State machine constants

## Capability Overview

### Assessment (AQMOS)
**Purpose**: Assess user's learning style to personalize recommendations

**Components**:
- AQMOSAssessmentModal - Links to external Google Form assessment
- AQMOSProfileModal - Collects user profile data
- BestMethodScreens - Assessment flow screens

**States**:
- STYLE_ASSESSMENT_CHECK
- STYLE_PROFILE_INPUT

**Integration**: Uses coachApi for profile storage, integrates with TourContext

### Planning (Time Management)
**Purpose**: Generate personalized weekly study schedules based on heatmap data

**Components**:
- TimeManagementScreens - 8-step wizard screens
- TimeManagementWizard - Wizard wrapper

**States**:
- TIME_MANAGEMENT_START
- TIME_MANAGEMENT_ANALYSIS
- TIME_MANAGEMENT_WEEKLY_CYCLE
- TIME_MANAGEMENT_DAILY_ROUTINE
- TIME_MANAGEMENT_DAYS
- TIME_MANAGEMENT_EXCEPTIONS
- TIME_MANAGEMENT_STUDY_SETTINGS
- TIME_MANAGEMENT_PREFERRED_TIMES
- TIME_MANAGEMENT_SCHEDULE
- TIME_MANAGEMENT_FINAL
- TIME_MANAGEMENT_MODIFICATION

**Integration**: Uses diaryApi for logs, analyticsApi for heatmap data, coachApi for schedule generation

### Sequence
**Purpose**: Generate flashcard sequences with AI mnemonic stories

**Components**:
- SequenceScreens - Sequence input and mode selection screens
- SequenceWizard - Wizard wrapper

**States**:
- SEQUENCE_HOME
- SEQUENCE_SURAH_MODE
- SEQUENCE_SURAH_INPUT
- SEQUENCE_PAGE_MODE
- SEQUENCE_PAGE_INPUT
- SEQUENCE_JUZ_PAGE_MODE
- SEQUENCE_JUZ_PAGE_INPUT
- SEQUENCE_JUZ_SURAH_INPUT

**Integration**: Uses coachApi for sequence generation, navigates to flashcards page with generated sets

### Recommendations (Mutashabihat)
**Purpose**: Find similar verses and generate AI memory tips

**Components**:
- MutashabihatScreens - Mutashabihat search and pair input screens

**States**:
- MUTASHABIHAT_HOME
- MUTASHABIHAT_SEARCH_SURAH
- MUTASHABIHAT_SEARCH_AYAH
- MUTASHABIHAT_RESULTS
- MUTASHABIHAT_PAIR_A_SURAH
- MUTASHABIHAT_PAIR_A_AYAH
- MUTASHABIHAT_PAIR_B_SURAH
- MUTASHABIHAT_PAIR_B_AYAH
- MUTASHABIHAT_PAIR_TIP_RESULT
- MUTASHABIHAT_ALL_PAIRS_SURAH
- MUTASHABIHAT_ALL_PAIRS_AYAH

**Integration**: Uses similarityApi for verse search, coachApi for tip generation, navigates to similarity page

## Data Flow

### State Machine Flow

```
CoachPage
  ↓
useCoachStateMachine (shared/hooks/)
  ↓
Current State → Render Capability Screen
  ↓
User Input → Handle Option/Input
  ↓
API Call → Update State Data
  ↓
Transition to Next State
```

### Chat Flow

```
useCoachChat (shared/hooks/)
  ↓
Build Context (quranContextBuilder, coachConstants)
  ↓
Send to AI (coachApi)
  ↓
Parse Response (useCoachParsers, tipParser)
  ↓
Update Messages
```

### Session Flow

```
useCoachSessions (shared/hooks/)
  ↓
Load Sessions (API)
  ↓
Select Active Session
  ↓
Load Messages (API)
  ↓
Save Message (API)
```

## How to Add a New Capability

1. **Create capability folder**:
   ```
   coach/
   └── new-capability/
       ├── components/
       ├── hooks/
       ├── styles/
       └── utils/
   ```

2. **Add state constants** to `shared/constants/coachStates.js`:
   ```js
   export const COACH_STATES = {
     NEW_CAPABILITY_HOME: 'new_capability_home',
     NEW_CAPABILITY_STEP: 'new_capability_step',
   };
   ```

3. **Create screens** in `new-capability/components/`

4. **Add state handlers** to `shared/hooks/useCoachStateMachine.js`

5. **Import screens** in `pages/CoachPage.jsx`

6. **Add render logic** in CoachPage based on state

## Prompt Organization

**Future Phase**: Prompts will be organized in capability-specific `prompts/` folders:
- `sequence/prompts/` - Sequence generation prompts
- `recommendations/prompts/` - Tip generation prompts
- `planning/prompts/` - Schedule generation prompts

Currently, prompts are embedded in `shared/constants/coachConstants.js` as system prompt builders.

## Key Constants

### coachStates.js
- `COACH_STATES` - All state machine states
- `ACCEPTED_PROFILES` - Valid AQMOS learning style profiles

### coachConstants.js
- `API_BASE` - API base URL
- `authFetch` - Authenticated fetch function
- `HOME_OPTIONS` - Home screen options
- `QUICK_CHIPS` - Quick action chips
- Context builders: `buildDiaryContext`, `buildMutashabihatContext`, `buildQuranContext`

## Shared Components

### CoachComponents.jsx
- `TypingIndicator` - Bouncing dots for AI typing state
- `FormattedText` - Safe markdown renderer (bold, italic)
- `QuickChips` - Quick action buttons
- `OptionButton` - Option selection button

### CoachSidebar.jsx
- `SessionSidebar` - Session list and management
- `GlobalSidePanel` - Right panel for tips and context

### AIErrorDisplay.jsx
- Displays user-friendly AI error information with diagnosis

## Hooks

### useCoachStateMachine
Manages the entire coach workflow state machine with transitions for all capabilities.

### useCoachChat
Handles chat interactions with AI, context building, and response parsing.

### useCoachSessions
Manages session CRUD operations and message persistence.

### useCoachParsers
Parses AI responses for commands and structured data.

## Utilities

### quranCache.js
Caches Quran data to avoid repeated API calls.

### quranContextBuilder.js
Builds Quran context for AI prompts with character limits and ayah limits.

### tipParser.js (recommendations/utils)
Parses AI-generated tips from similarity responses.

## Integration Points

### TourContext
- Coach integrates with the interactive tour system
- Tour steps cover all capabilities
- `dispatchTourEvent` for auto-advancement

### React Router
- Navigates to similarity page with auto-search parameters
- Navigates to flashcards page with generated sequences
- Navigates to scheduler page for time management

### API Services
- `coachApi` - Chat and quota management
- `similarityApi` - Verse search and context
- `diaryApi` - Diary logs for analysis
- `analyticsApi` - Heatmap data for planning

## Notes

- The Coach feature is **not a landing page or chat application** - it's a state machine-driven workflow system
- All capabilities are orchestrated through the central state machine in `useCoachStateMachine`
- AI interactions are deterministic and controlled by the frontend, not by the AI
- Prompts are currently embedded in constants and will be extracted in a future phase
