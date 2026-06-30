# Coach Feature – Wizard Naming Report

## Overview

This report identifies all occurrences of "Wizard" in the Coach feature and suggests replacements for Phase 3.

---

## File: SequenceWizard.jsx

### Current Name | Purpose | Suggested Replacement
| -------------- | ------- | ------------------- |
| `SequenceWizard` (component) | Sequence generation wizard | `SequenceFlow` or `SequenceBuilder`
| `SEQ_STATES` (constant) | Sequence wizard states | `SEQ_FLOW_STATES` or `SEQUENCE_STEPS`
| `resetWizard` (function) | Reset wizard state | `resetFlow` or `resetSequence`
| `seq-wizard-menu` (CSS class) | Wizard menu styling | `seq-flow-menu` or `sequence-menu`
| `seq-wizard-step` (CSS class) | Wizard step styling | `seq-flow-step` or `sequence-step`
| `seq-wizard-results` (CSS class) | Wizard results styling | `seq-flow-results` or `sequence-results`
| `seq-options` (CSS class) | Wizard options styling | `seq-options` (keep - not wizard-specific)
| `seq-output` (CSS class) | Wizard output styling | `seq-output` (keep - not wizard-specific)

### API Endpoints
| Current | Purpose | Suggested Replacement |
|---------| ------- | ------------------- |
| `/coach/wizard/sequence/surah` | Get surah sequence | `/coach/sequence/surah` |
| `/coach/wizard/sequence/page` | Get page sequence | `/coach/sequence/page` |
| `/coach/wizard/sequence/juz-pages` | Get juz pages sequence | `/coach/sequence/juz-pages` |
| `/coach/wizard/sequence/juz-surahs` | Get juz surahs sequence | `/coach/sequence/juz-surahs` |

### Comments
| Current | Suggested Replacement |
|---------| ------------------- |
| "Wizard states (frontend-owned - exact specification)" | "Flow states (frontend-owned - exact specification)" |
| "resetWizard" | "resetFlow" |
| "Failed to fetch surah sequence" | (keep - not wizard-specific) |

---

## File: TimeManagementWizard.jsx

### Current Name | Purpose | Suggested Replacement
| -------------- | ------- | ------------------- |
| `TimeManagementWizard` (component) | Time management wizard | `TimeManagementFlow` or `ScheduleBuilder`
| `TM_STATES` (constant) | Time management wizard states | `TM_FLOW_STATES` or `TIME_MANAGEMENT_STEPS`
| `resetWizard` (function) | Reset wizard state | `resetFlow` or `resetSchedule`
| `tm-wizard-step` (CSS class) | Wizard step styling | `tm-flow-step` or `schedule-step`
| `tm-options` (CSS class) | Wizard options styling | `tm-options` (keep - not wizard-specific)
| `tm-analysis` (CSS class) | Analysis styling | `tm-analysis` (keep - not wizard-specific)
| `tm-cycle` (CSS class) | Cycle styling | `tm-cycle` (keep - not wizard-specific)
| `tm-multi-select` (CSS class) | Multi-select styling | `tm-multi-select` (keep - not wizard-specific)
| `tm-schedule` (CSS class) | Schedule styling | `tm-schedule` (keep - not wizard-specific)

### API Endpoints
| Current | Purpose | Suggested Replacement |
|---------| ------- | ------------------- |
| `/coach/wizard/tm/analyze` | Analyze progress | `/coach/planning/analyze` |
| `/coach/wizard/tm/cycle` | Generate weekly cycle | `/coach/planning/cycle` |
| `/coach/wizard/tm/generate` | Generate schedule | `/coach/planning/generate` |
| `/coach/wizard/tm/save` | Save schedule | `/coach/planning/save` |

### Comments
| Current | Suggested Replacement |
|---------| ------------------- |
| "Deterministic Time Management wizard" | "Deterministic Time Management flow" |
| "Wizard states (frontend-owned - exact specification)" | "Flow states (frontend-owned - exact specification)" |
| "resetWizard" | "resetFlow" |
| "Failed to analyze progress" | (keep - not wizard-specific) |

---

## File: AQMOSWizard.jsx

### Current Name | Purpose | Suggested Replacement
| -------------- | ------- | ------------------- |
| `AQMOSWizard` (component) | AQMOS assessment wizard | `AQMOSFlow` or `AssessmentFlow`
| `AQMOS_STATES` (constant) | AQMOS wizard states | `AQMOS_FLOW_STATES` or `ASSESSMENT_STEPS`
| `resetWizard` (function) | Reset wizard state | `resetFlow` or `resetAssessment`
| `aqmos-wizard-step` (CSS class) | Wizard step styling | `aqmos-flow-step` or `assessment-step`
| `aqmos-options` (CSS class) | Wizard options styling | `aqmos-options` (keep - not wizard-specific)
| `aqmos-wizard-results` (CSS class) | Wizard results styling | `aqmos-flow-results` or `assessment-results`

### API Endpoints
| Current | Purpose | Suggested Replacement |
|---------| ------- | ------------------- |
| `/coach/wizard/aqmos/save` | Save AQMOS profile | `/coach/assessment/save` |

### Comments
| Current | Suggested Replacement |
|---------| ------------------- |
| "Deterministic AQMOS (learning style) wizard" | "Deterministic AQMOS (learning style) flow" |
| "Wizard states (frontend-owned)" | "Flow states (frontend-owned)" |
| "resetWizard" | "resetFlow" |

---

## File: useCoachStateMachine.js

### Current Name | Purpose | Suggested Replacement
| -------------- | ------- | ------------------- |
| `/coach/wizard/sequence/surah` | API endpoint | `/coach/sequence/surah` |
| `/coach/wizard/sequence/page` | API endpoint | `/coach/sequence/page` |
| `/coach/wizard/sequence/juz-pages` | API endpoint | `/coach/sequence/juz-pages` |
| `/coach/wizard/sequence/juz-surahs` | API endpoint | `/coach/sequence/juz-surahs` |
| `/coach/wizard/tm/analyze` | API endpoint | `/coach/planning/analyze` |
| `/coach/wizard/tm/cycle` | API endpoint | `/coach/planning/cycle` |

---

## File: CoachPage.jsx

### Current Name | Purpose | Suggested Replacement
| -------------- | ------- | ------------------- |
| `SequenceWizard` (import) | Sequence wizard component | `SequenceFlow` or `SequenceBuilder`
| `TimeManagementWizard` (import) | Time management wizard component | `TimeManagementFlow` or `ScheduleBuilder`
| `AQMOSWizard` (import) | AQMOS wizard component | `AQMOSFlow` or `AssessmentFlow`

---

## File: AQMOSAssessmentModal.jsx

### Current Name | Purpose | Suggested Replacement
| -------------- | ------- | ------------------- |
| `/coach/wizard/aqmos/save` | API endpoint | `/coach/assessment/save` |

---

## Summary

### Total "Wizard" Occurrences: 86

### Breakdown:
- **SequenceWizard.jsx**: 30 occurrences
- **TimeManagementWizard.jsx**: 24 occurrences
- **AQMOSWizard.jsx**: 11 occurrences
- **README.md**: 10 occurrences (documentation)
- **useCoachStateMachine.js**: 6 occurrences (API endpoints)
- **CoachPage.jsx**: 4 occurrences (imports)
- **AQMOSAssessmentModal.jsx**: 1 occurrence (API endpoint)

### Naming Patterns Identified:

1. **Component Names**: `*Wizard` → `*Flow` or `*Builder`
2. **State Constants**: `*_STATES` → `*_FLOW_STATES` or `*_STEPS`
3. **Functions**: `resetWizard` → `resetFlow`
4. **CSS Classes**: `*-wizard-*` → `*-flow-*`
5. **API Endpoints**: `/coach/wizard/*` → `/coach/{capability}/*`

### Recommended Naming Convention:

**Primary Recommendation**: Use `Flow` for multi-step processes
- `SequenceWizard` → `SequenceFlow`
- `TimeManagementWizard` → `TimeManagementFlow`
- `AQMOSWizard` → `AQMOSFlow`

**Alternative Recommendation**: Use `Builder` for construction processes
- `SequenceWizard` → `SequenceBuilder`
- `TimeManagementWizard` → `ScheduleBuilder`
- `AQMOSWizard` → `AssessmentBuilder`

### Phase 3 Action Items:

1. Rename all `*Wizard` components to `*Flow`
2. Rename all `*_STATES` constants to `*_FLOW_STATES`
3. Rename all `resetWizard` functions to `resetFlow`
4. Rename all CSS classes from `*-wizard-*` to `*-flow-*`
5. Update all API endpoints from `/coach/wizard/*` to `/coach/{capability}/*`
6. Update all imports in CoachPage.jsx
7. Update README.md documentation

### Notes:

- The term "Wizard" implies a guided step-by-step process, which is accurate for these components
- "Flow" is a more modern term for multi-step processes
- "Builder" is more specific to construction/creation processes
- API endpoint changes require backend coordination
