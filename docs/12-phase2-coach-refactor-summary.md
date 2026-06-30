# Phase 2 – Coach Feature Architecture Refactor Summary

## Overview

Successfully refactored the Coach feature into a capability-based architecture. The Coach is no longer organized as a generic component/hook/utility structure, but is now organized around its core capabilities: Assessment, Planning, Sequence, and Recommendations.

---

## 1. Complete Coach Folder Tree

```
coach/
├── README.md
│
├── pages/
│   └── CoachPage.jsx
│
├── assessment/
│   ├── components/
│   │   ├── AQMOSAssessmentModal.jsx
│   │   ├── AQMOSProfileModal.jsx
│   │   ├── AQMOSWizard.jsx
│   │   └── BestMethodScreens.jsx
│   ├── hooks/ (empty)
│   ├── styles/ (empty)
│   └── utils/ (empty)
│
├── planning/
│   ├── components/
│   │   ├── TimeManagementScreens.jsx
│   │   └── TimeManagementWizard.jsx
│   ├── hooks/ (empty)
│   ├── styles/ (empty)
│   └── utils/ (empty)
│
├── sequence/
│   ├── components/
│   │   ├── SequenceScreens.jsx
│   │   └── SequenceWizard.jsx
│   ├── hooks/ (empty)
│   ├── styles/ (empty)
│   ├── prompts/ (empty)
│   └── utils/ (empty)
│
├── recommendations/
│   ├── components/
│   │   └── MutashabihatScreens.jsx
│   ├── styles/ (empty)
│   └── utils/
│       └── tipParser.js
│
└── shared/
    ├── components/
    │   ├── AIErrorDisplay.jsx
    │   ├── CoachComponents.jsx
    │   ├── CoachSidebar.jsx
    │   └── GlobalSidePanel.jsx
    ├── constants/
    │   ├── coachConstants.js
    │   └── coachStates.js
    ├── hooks/
    │   ├── useCoachChat.js
    │   ├── useCoachParsers.js
    │   ├── useCoachSessions.js
    │   └── useCoachStateMachine.js
    ├── styles/
    │   └── AIErrorDisplay.css
    └── utils/
        ├── quranCache.js
        └── quranContextBuilder.js
```

---

## 2. Files Moved

| Old Location | New Location |
| -------------- | -------------- |
| `components/AQMOSAssessmentModal.jsx` | `assessment/components/AQMOSAssessmentModal.jsx` |
| `components/AQMOSProfileModal.jsx` | `assessment/components/AQMOSProfileModal.jsx` |
| `components/AQMOSWizard.jsx` | `assessment/components/AQMOSWizard.jsx` |
| `components/BestMethodScreens.jsx` | `assessment/components/BestMethodScreens.jsx` |
| `components/TimeManagementScreens.jsx` | `planning/components/TimeManagementScreens.jsx` |
| `components/TimeManagementWizard.jsx` | `planning/components/TimeManagementWizard.jsx` |
| `components/SequenceScreens.jsx` | `sequence/components/SequenceScreens.jsx` |
| `components/SequenceWizard.jsx` | `sequence/components/SequenceWizard.jsx` |
| `components/MutashabihatScreens.jsx` | `recommendations/components/MutashabihatScreens.jsx` |
| `components/CoachComponents.jsx` | `shared/components/CoachComponents.jsx` |
| `components/CoachSidebar.jsx` | `shared/components/CoachSidebar.jsx` |
| `components/GlobalSidePanel.jsx` | `shared/components/GlobalSidePanel.jsx` |
| `components/AIErrorDisplay.jsx` | `shared/components/AIErrorDisplay.jsx` |
| `hooks/useCoachStateMachine.js` | `shared/hooks/useCoachStateMachine.js` |
| `hooks/useCoachChat.js` | `shared/hooks/useCoachChat.js` |
| `hooks/useCoachSessions.js` | `shared/hooks/useCoachSessions.js` |
| `utils/quranCache.js` | `shared/utils/quranCache.js` |
| `utils/quranContextBuilder.js` | `shared/utils/quranContextBuilder.js` |
| `parsers/tipParser.js` | `recommendations/utils/tipParser.js` |
| `parsers/useCoachParsers.js` | `shared/hooks/useCoachParsers.js` |
| `coachStates.js` | `shared/constants/coachStates.js` |
| `coachConstants.js` | `shared/constants/coachConstants.js` |
| `AIErrorDisplay.css` | `shared/styles/AIErrorDisplay.css` |

**Total Files Moved: 23**

---

## 3. Import Update Summary

### Files with Updated Imports

| File | Imports Updated |
| ---- | --------------- |
| `pages/CoachPage.jsx` | 10 imports (constants, hooks, components) |
| `shared/constants/coachConstants.js` | 2 imports (apiConfig, http) |
| `shared/hooks/useCoachStateMachine.js` | 3 imports (constants, TourContext) |
| `shared/hooks/useCoachSessions.js` | 1 import (constants) |
| `shared/hooks/useCoachChat.js` | 5 imports (constants, utils, parsers) |
| `shared/utils/quranContextBuilder.js` | 2 imports (constants, utils) |
| `shared/components/CoachSidebar.jsx` | 1 import (constants) |
| `shared/components/CoachComponents.jsx` | 1 import (constants) |
| `shared/components/AIErrorDisplay.jsx` | 1 import (CSS) |
| `recommendations/utils/tipParser.js` | 1 import (constants) |
| `assessment/components/AQMOSAssessmentModal.jsx` | 1 import (http) |
| `assessment/components/AQMOSWizard.jsx` | 1 import (http) |
| `planning/components/TimeManagementWizard.jsx` | 1 import (http) |
| `sequence/components/SequenceWizard.jsx` | 1 import (http) |

**Total Import Updates: 31**

### Import Path Patterns Changed

- `../coachConstants` → `../shared/constants/coachConstants`
- `../coachStates` → `../shared/constants/coachStates`
- `../hooks/*` → `../shared/hooks/*`
- `../components/*` → `../{capability}/components/*` or `../shared/components/*`
- `../utils/*` → `../shared/utils/*` or `../recommendations/utils/*`
- `../parsers/*` → `../shared/hooks/*` or `../recommendations/utils/*`
- `../../shared/services/*` → `../../../../shared/services/*` (for capability components)
- `../AIErrorDisplay.css` → `../styles/AIErrorDisplay.css`

---

## 4. Components That Could Become Shared Later

### Currently in Coach Shared (Potential Global Shared)

| Component | Current Location | Potential Global Shared Location | Notes |
| --------- | ---------------- | -------------------------------- | ----- |
| `AIErrorDisplay` | `coach/shared/components/` | `src/shared/components/` | Generic AI error display, used across features |
| `TypingIndicator` | `coach/shared/components/CoachComponents.jsx` | `src/shared/components/` | Generic typing indicator for AI interactions |
| `FormattedText` | `coach/shared/components/CoachComponents.jsx` | `src/shared/components/` | Safe markdown renderer, reusable across app |

### Currently Capability-Specific (Stay in Coach)

| Component | Location | Reason to Stay in Coach |
| --------- | -------- | ----------------------- |
| `CoachSidebar` | `coach/shared/components/` | Coach-specific session management |
| `GlobalSidePanel` | `coach/shared/components/` | Coach-specific tip display |
| `AQMOSAssessmentModal` | `assessment/components/` | Assessment-specific UI |
| `TimeManagementScreens` | `planning/components/` | Planning-specific UI |
| `SequenceScreens` | `sequence/components/` | Sequence-specific UI |
| `MutashabihatScreens` | `recommendations/components/` | Recommendations-specific UI |

### Recommendation for Phase 3

Consider moving these to `src/shared/components/`:
1. `AIErrorDisplay` - Generic error display for AI features
2. `TypingIndicator` - Generic typing indicator
3. `FormattedText` - Safe markdown renderer

These components are generic enough to be used by other AI-powered features beyond Coach.

---

## 5. Wizard Naming Report

A detailed Wizard naming report has been generated in `docs/11-coach-wizard-naming-report.md`.

### Summary

**Total "Wizard" Occurrences: 86**

**Breakdown:**
- SequenceWizard.jsx: 30 occurrences
- TimeManagementWizard.jsx: 24 occurrences
- AQMOSWizard.jsx: 11 occurrences
- README.md: 10 occurrences (documentation)
- useCoachStateMachine.js: 6 occurrences (API endpoints)
- CoachPage.jsx: 4 occurrences (imports)
- AQMOSAssessmentModal.jsx: 1 occurrence (API endpoint)

**Recommended Naming Convention:** Use `Flow` for multi-step processes
- `SequenceWizard` → `SequenceFlow`
- `TimeManagementWizard` → `TimeManagementFlow`
- `AQMOSWizard` → `AQMOSFlow`

**API Endpoint Changes Required:**
- `/coach/wizard/sequence/*` → `/coach/sequence/*`
- `/coach/wizard/tm/*` → `/coach/planning/*`
- `/coach/wizard/aqmos/*` → `/coach/assessment/*`

---

## 6. Suggestions for Phase 3

### 6.1 Wizard Renaming

1. Rename all `*Wizard` components to `*Flow`
2. Rename all `*_STATES` constants to `*_FLOW_STATES`
3. Rename all `resetWizard` functions to `resetFlow`
4. Rename all CSS classes from `*-wizard-*` to `*-flow-*`
5. Update all API endpoints from `/coach/wizard/*` to `/coach/{capability}/*`
6. Update all imports in CoachPage.jsx
7. Update README.md documentation

### 6.2 Prompt Organization

**Current State:** Prompts are embedded in `shared/constants/coachConstants.js` as system prompt builders.

**Target State:** Extract prompts into capability-specific `prompts/` folders:

```
sequence/
└── prompts/
    ├── sequenceGenerationPrompt.js
    ├── mnemonicStoryPrompt.js
    └── promptTemplates.js

recommendations/
└── prompts/
    ├── tipGenerationPrompt.js
    ├── similarityAnalysisPrompt.js
    └── promptTemplates.js

planning/
└── prompts/
    ├── scheduleGenerationPrompt.js
    ├── weeklyCyclePrompt.js
    └── promptTemplates.js

assessment/
└── prompts/
    ├── profileAnalysisPrompt.js
    └── promptTemplates.js
```

**Benefits:**
- Easier to maintain and update prompts
- Clear separation of concerns
- Easier to A/B test different prompts
- Better organization for prompt versioning

### 6.3 Component Extraction to Global Shared

Move these components to `src/shared/components/`:
1. `AIErrorDisplay` - Generic AI error display
2. `TypingIndicator` - Generic typing indicator
3. `FormattedText` - Safe markdown renderer

### 6.4 Empty Folder Cleanup

The following empty folders were created for future use and can be kept or removed:

**Keep for Future Use:**
- `assessment/hooks/` - For assessment-specific hooks
- `assessment/styles/` - For assessment-specific styles
- `assessment/utils/` - For assessment-specific utilities
- `planning/hooks/` - For planning-specific hooks
- `planning/styles/` - For planning-specific styles
- `planning/utils/` - For planning-specific utilities
- `sequence/hooks/` - For sequence-specific hooks
- `sequence/styles/` - For sequence-specific styles
- `sequence/prompts/` - For prompt organization (Phase 3)
- `sequence/utils/` - For sequence-specific utilities
- `recommendations/styles/` - For recommendations-specific styles

### 6.5 State Machine Refinement

Consider breaking down the monolithic `useCoachStateMachine` into capability-specific state machines:

```
sequence/
└── hooks/
    └── useSequenceStateMachine.js

planning/
└── hooks/
    └── usePlanningStateMachine.js

assessment/
└── hooks/
    └── useAssessmentStateMachine.js

recommendations/
└── hooks/
    └── useRecommendationsStateMachine.js
```

**Benefits:**
- Smaller, more focused hooks
- Easier to test individual capabilities
- Better separation of concerns
- Easier to add new capabilities

### 6.6 API Endpoint Refactoring

Coordinate with backend to restructure API endpoints:

**Current:**
```
/coach/wizard/sequence/*
/coach/wizard/tm/*
/coach/wizard/aqmos/*
```

**Target:**
```
/coach/sequence/*
/coach/planning/*
/coach/assessment/*
```

### 6.7 CSS Organization

Currently, most capabilities don't have dedicated CSS files. Consider:

1. Extract inline styles to capability-specific CSS files
2. Move capability-specific CSS to `{capability}/styles/`
3. Create a `shared/styles/` for common Coach styles

### 6.8 Testing

Add capability-specific tests:

```
sequence/
└── __tests__/
    ├── SequenceWizard.test.js
    └── SequenceScreens.test.js

planning/
└── __tests__/
    ├── TimeManagementWizard.test.js
    └── TimeManagementScreens.test.js

assessment/
└── __tests__/
    ├── AQMOSWizard.test.js
    └── BestMethodScreens.test.js

recommendations/
└── __tests__/
    └── MutashabihatScreens.test.js
```

---

## 7. Validation Results

### Build Status

✅ **Build Successful** (with warnings)

```
File sizes after gzip:
  263.55 kB  build\static\js\main.87020847.js
  11.73 kB   build\static\css\main.b6205a8d.css
```

### Warnings (Pre-existing, not introduced by refactor)

The build warnings are pre-existing ESLint warnings unrelated to the refactoring:
- Unused variables in multiple files
- React hooks exhaustive-deps warnings
- Missing dependencies in useEffect

**No new warnings were introduced by the Phase 2 refactor.**

### Verification Checklist

✅ Project builds successfully
✅ No broken imports
✅ No routing changes
✅ No API changes
✅ No functionality changes
✅ All files moved to capability folders
✅ All imports updated
✅ Empty folders deleted
✅ README.md created
✅ Wizard naming report generated

---

## 8. Issues Found

### 8.1 Empty Folders

The following empty folders were created for future use:
- `assessment/hooks/`
- `assessment/styles/`
- `assessment/utils/`
- `planning/hooks/`
- `planning/styles/`
- `planning/utils/`
- `sequence/hooks/`
- `sequence/styles/`
- `sequence/prompts/`
- `sequence/utils/`
- `recommendations/styles/`

**Status:** These are intentional placeholders for future development. No action needed.

### 8.2 Pre-existing ESLint Warnings

Multiple files have unused variables and React hooks warnings. These existed before the refactor and were not introduced by Phase 2.

**Status:** Documented for future cleanup. Not blocking.

### 8.3 No CSS Files for Most Capabilities

Most capabilities don't have dedicated CSS files yet. Styles are either inline or shared.

**Status:** Expected for current state. Can be addressed in Phase 3.

---

## 9. Summary

### Files Moved: 23
### Import Updates: 31
### Build Status: ✅ Successful
### New Folders Created: 22
### Empty Folders Deleted: 4

### Key Achievements

1. **Capability-Based Architecture**: Coach is now organized around its core capabilities (Assessment, Planning, Sequence, Recommendations) instead of generic component/hook/utility groupings.

2. **Clear Separation of Concerns**: Each capability has its own components, hooks, styles, and utilities.

3. **Shared Code Properly Organized**: Truly shared code is in `shared/`, while capability-specific code is in capability folders.

4. **Documentation**: Comprehensive README.md explains the architecture, data flow, and how to add new capabilities.

5. **Wizard Naming Report**: Detailed report generated for Phase 3 renaming work.

6. **Build Verification**: Project builds successfully with no new errors.

### Next Steps (Phase 3)

1. Implement Wizard renaming (Wizard → Flow)
2. Extract prompts to capability-specific folders
3. Move generic components to global shared
4. Refactor API endpoints (backend coordination required)
5. Add capability-specific tests
6. Extract inline styles to CSS files
