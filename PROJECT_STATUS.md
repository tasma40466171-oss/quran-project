# Quran Hifz App — Master Project Summary
**Stack:** React + Node.js · SQLite · Anthropic Claude API (claude-sonnet-4-6)  
**URLs:** Frontend localhost:3000 · Backend localhost:5000 · IDE: Windsurf

---

## WHAT HAS BEEN BUILT

### 1. MUTASHABIHAT (Similar Verses)
- Search any Surah/Ayah to find structurally similar verses
- "Mutashabiha Score" badge (renamed from Similarity Score)
- Auto-generated AI memory tip on first visit, saved to DB per user
- User can edit tips with pencil icon
- 429 rate limit handling with retry button
- Marhala dropdown filter (Full Quran / Marhala Ula / Saniya etc.)
- `data-tour` attributes: `marhala-filter`, `mutashabiha-score`, `ai-tips-edit`, `pair-bidirectional`

---

### 2. FLASHCARDS
- Create flashcard sets from Flashcards page (NOT from Ustadh AI)
- 4 set types: Ayah in Surah, Ayah in Page, Pages in Juz, Surahs in Juz
- Starting/Ending modes for each set type
- Memory Aid (3 tabs: Flowchart, First/Key Words, AI Story) — shown ONLY in Study tab, not Test Yourself tab
- Study questions specific to each set type using real Quran DB data
- Built-in categories (Surah Openings, Verses Twice, etc.)
- Print support for flowcharts
- Rename sets with pencil icon, Delete with Delete Set button

**FOLDER SYSTEM (file-system style):**
- Folders appear above sets list as grid cards
- Click folder → navigates into it (shows only sets inside)
- "← Back to All Sets" button to return
- "+ New Folder" card ALWAYS visible (never conditional) with inline input on click (no modal)
- "+ Add Sets to Folder" picker inside folder view shows ONLY uncategorised sets (not already-foldered)
- "⤴ Remove" icon removes set from folder back to uncategorised (does NOT delete the set)
- Sets in folders excluded from main uncategorised list
- One set can only be in ONE folder (auto-move on re-assign)
- Deleting a folder DELETES ALL SETS inside it permanently  
  Confirmation: *"All sets inside will also be permanently deleted. Remove sets from the folder first if you want to keep them."*
- Folder colors from DB applied to card border and icon
- Deduplication of sets by id after fetch
- Independent scroll: left sidebar and right content scroll separately  
  Layout: flex, `height: calc(100vh - 64px)`, `overflow: hidden`  
  Left: 280px fixed width, `overflowY: auto` · Right: `flex:1`, `overflowY: auto`  
  "+ Create Flashcard Set" button fixed at top of left sidebar

**Backend tables:** `flashcard_folders`, `flashcard_folder_items`

**Endpoints:**
```
GET    /api/flashcards/user-sets/uncategorised
GET    /api/flashcards/folders
POST   /api/flashcards/folders
DELETE /api/flashcards/folders/:id        (also deletes all sets inside)
POST   /api/flashcards/folders/:id/items  (auto-moves if already in folder)
DELETE /api/flashcards/folders/:id/items/:setId
```
> ⚠️ `/api/flashcards/debug-tables` was a temporary debug route — **confirmed removed** as part of refactor work.

**Uncategorised sets load on mount via `useEffect` with `[]` dependency.**  
Fallback to all-sets is present but should ONLY trigger on actual failure (`res.success === false` or thrown error), NOT on a legitimate empty array `{success: true, data: []}`. This was a confirmed bug and has been fixed.

`data-tour` attributes: `create-flashcard-btn`, `flashcard-set-types`, `flashcard-rename`, `flashcard-delete`, `flashcard-test`, `flashcard-folders`

---

### 3. MY DIARY
- 5 entry types: MURAJAH, TASMEE, IKHTEBAR, JADEED, JUZ HALI
- Tasks & Targets: status cycles Pending → In Progress → Completed
- Streak system: FREEZES on missed day (does NOT reset to zero)
- Streak banner shows: fire emoji + count + tier name + progress bar. NO quotes anywhere in banner
- Quran Map: green=strong (7-10), orange=fair (3-6), red=urgent (1-2). Print button appears when data exists

`data-tour` attributes: `diary-add-task`, `diary-status-update`, `streak-banner`

---

### 4. TIME MANAGEMENT / COACH (`/coach` route)
- `/coach` goes DIRECTLY to wizard Step 1 of 8 (no Ustadh AI landing)
- "Open Planner" on homepage navigates to `/coach?start=planner`
- CoachPage checks URL param and skips chat landing if present
- "← Back" in wizard uses `navigate(-1)` to go to previous page
- 8-step wizard: Progress Analysis → Weekly Cycle → Build My Week → Exceptions → Review → Generated Schedule → Unit Details → Adjust
- Events persist across sessions in DB, deduplicated on load
- Free time calculation per day (floored at 0, no negative values)
- Schedule generated from page scores (1-10): Poor=10min, Fair=7min, Good=5min, VeryGood=4min, Excellent=3min
- AQMOS method badges on sessions
- Continue button does BOTH: advances wizard step AND fires `dispatchTourEvent('coach:continue')` when tour is active

`data-tour` attributes: `daily-routine`, `day-selector`, `add-event-btn`

**CURRENT PROGRESS SIDE PANEL:**
- Reads from same source as weekly cycle (not independent endpoint)
- Shows: Marhala, Current Sipara, Current Page
- If no data: shows "Not set" / "No data yet" (no fake values)
- Fetched once in `CoachPage.jsx` and passed as props to side panel

---

### 5. AQMOS PROFILE
- Shown in side panel on `/coach` page
- "Take the Test" button when no profile exists
- "Retake Test" preserves old profile until new one saved

`data-tour` attributes: `aqmos-profile`, `weekly-cycle`

---

### 6. DAILY QUOTE SPLASH SCREEN
- Shows on first visit each day (`localStorage: 'lastQuoteDate'`)
- 15 second countdown with circular SVG progress ring
- "Continue" button appears after 15 seconds
- "Skip in Xs..." text link visible after 10 seconds
- 30 quotes in `src/data/dailyQuotes.js` (real short ayahs/hadith)

---

### 7. QUOTE OF THE DAY on Homepage
- Same quote as splash (`dayOfYear % totalQuotes`)
- Compact card: gold Arabic text, cream English, green left border
- "✨ QUOTE OF THE DAY" label, no countdown
- Padding `16px 20px`, Arabic `1.2rem`, English `0.875rem`

---

### 8. HOMEPAGE LAYOUT (top to bottom)
1. Welcome heading + subtitle
2. "🗺️ Take a Tour" button INSIDE welcome card (top-right)
3. Quote of the Day card (compact, full width)
4. Four feature cards (Mutashabihat, Flashcards, My Diary, Time Management)
- NO "?" button in navbar (removed)

---

### 9. NAVBAR
- Hidden on `/login` and `/signup` pages
- Logout clears localStorage token + user, navigates to `/login`

---

## INTERACTIVE TOUR (32 steps total)

Auto-starts for new users (`localStorage: 'hifz_tour_completed'`).  
`TourProvider` is INSIDE `BrowserRouter` in `App.js`.  
`useNavigate` via `TourNavigationHandler` component pattern.  
Auto-navigates to correct page on step change with 400ms delay.  
`onResultsFound` kept in context for backward compatibility, wired to `dispatchTourEvent('similarity:searched')`.

**TWO TOOLTIP MODES:**
- **MANUAL steps** → centered modal bottom of screen, "Next →" gold button, "✕" close, max-width 600px, dark green background
- **ACTION steps** → compact docked bar bottom-RIGHT (280px wide), pulsing *"👆 Go ahead — we'll continue automatically..."* italic gold text + "Skip →" grey link, NO Next button

Step advance: when navigating to different page, delay `setCurrentStep` by 400ms after `navigate()` so banner and page stay in sync.

Step 32 (final): Next → calls `completeTour()` not `advanceStep()`. `completeTour()` sets localStorage, clears state, navigates to `'/'`.

**ACTION STEPS (user must perform action to advance):**

| Step | triggerEvent | Content |
|------|-------------|---------|
| 3 | `similarity:searched` | "Enter any Surah and Ayah, click Find Similarities!" |
| 4 | `similarity:result:selected` | "Click a result card to open details." |
| 6 | `tip:edit:opened` | "Click ✏️ to personalise the AI tip." |
| 9 | `flashcard:created` | "Click + Create Flashcard Set, configure, click Generate!" |
| 10 | `flashcard:opened` | "Click your new set from the list to open it." |
| 13 | `flashcard:test:opened` | "Click the Test Yourself tab." |
| 15 | `folder:created` | "Open Folders panel and create a new folder!" |
| 16 | `folder:item:added` | "Click Add to Folder on any set." |
| 20 | `task:added` | "Choose a type, type a task name, click Add!" |
| 21 | `task:status:changed` | "Click the status badge to update it." |
| 26–30 | `coach:continue` | Describes current wizard step, prompts "Click Continue" |

**MANUAL STEPS:** 1, 2, 5, 7, 8, 11, 12, 14, 17, 18, 19, 22, 23, 24, 25, 27(=step31), 32 — all have Next → button

**PAGE ASSIGNMENTS:**
- Steps 1–8: `/similarity`
- Steps 9–18: `/flashcards`
- Steps 19–26: `/diary`
- Steps 27–32: `/coach` (steps 27–30 action:coach:continue, step 31 manual, step 32 manual → completeTour)

**`dispatchTourEvent` calls added in:**
- SearchBar/SimilarityPage: `similarity:searched`
- SimilarityPage: `similarity:result:selected`
- SidePanel: `tip:edit:opened`
- FlashcardsPage: `flashcard:created`, `flashcard:opened`, `flashcard:test:opened`, `folder:created`, `folder:item:added`
- DiaryPage: `task:added`, `task:status:changed`
- CoachPage/wizard Continue button: `coach:continue`

**Stale closure fix in `TourContext.jsx`:**
- `currentStepRef = useRef(currentStep)`, synced via `useEffect`
- `isActiveRef = useRef(isActive)`, synced via `useEffect`
- `dispatchTourEvent` reads from refs, not closed-over state
- Confirmed: the wizard Continue button's `onClick` only calls `dispatchTourEvent` (already ref-safe). It does NOT directly read `currentStep` or `isActive` — stale closure risk is not present at the Continue button level.

**STEP CONTENT:**

| Step | Content |
|------|---------|
| 2 | "Use dropdown to filter by memorisation stage. Try switching!" |
| 5 | "Mutashabiha Score 0-100: higher = more confusable. Scores above 70 need careful attention." |
| 7 | "Every pair is bidirectional — Verse A ↔ Verse B. You'll always see both sides." |
| 8 | "4 flashcard types: Ayah in Surah, Ayah in Page, Pages in Juz, Surahs in Juz." |
| 12 | "Memory Aid: Flowchart, First Words, AI Story tabs. Each helps you memorise differently." |
| 14 | "✏️ Pencil = rename. Delete Set button = delete when open." |
| 17 | "Built-in Categories always on left — Surah Openings, Verses Twice, Mnemonics & more." |
| 22 | "🔥 Log any entry daily to grow streak. Miss a day = streak freezes, not reset." |
| 23 | "🗺️ Green=strong, orange=fair, red=urgent. Updates as you log entries." |
| 27 | "📊 Progress Overview fills up as you log entries. Come back after a week!" |
| 28 | "⏰ Weekly Cycle sets study days. Generates schedule from page scores. Click Continue." |
| 29 | "🗓️ Add fixed events, wizard fills Quran slots. Click Continue." |
| 30 | "📅 Weaker pages get longer revision slots. Click Continue." |
| 31 | "✅ Schedule ready! Check side panel for AQMOS Profile." |
| 32 | "🎉 Tour complete! May Allah make your Hifz easy. آمين" |

---

## ISLAMIC COLOR THEME

| Name | Hex |
|------|-----|
| Deep Green | `#1B4332` |
| Forest Green | `#2D6A4F` |
| Mint Green | `#52B788` |
| Islamic Gold | `#C9A84C` |
| Cream White | `#F5F0E8` |
| Warm Sand | `#E8DCC8` |
| Night Blue | `#1A1A2E` |
| Ruby Accent | `#C0392B` (errors/delete only) |

---

## REFACTOR WORK COMPLETED (Phases 1–5)

### Phase 3 — Centralized Backend Error Handling
- `AppError` class: `backend/src/utils/AppError.js` (statusCode + message for operational errors)
- `asyncHandler` wrapper: `backend/src/utils/asyncHandler.js` (passes thrown errors to `next(err)`)
- `errorHandler.js` middleware registered LAST in `server.js`:
  - `AppError` → returns statusCode + message via `responseFormatter.js`
  - Unexpected errors → logs full error server-side, returns generic 500 to client (no SQLite/stack trace leaks)
- All async route handlers in `backend/src/routes/*.js` and controllers wrapped with `asyncHandler`

### Phase 4 — Centralized Frontend Error Handling
- `src/shared/services/http.js` has single response/error interceptor:
  - Consistent error object shape `{ message, statusCode }`
  - Auto-redirect to `/login` on 401
- `ErrorBoundary` component: `src/shared/components/ErrorBoundary.jsx`, wrapping main routes in `App.jsx`
- `FlashcardsPage.jsx`, `DiaryPage.jsx`, `CoachPage.jsx`, `SimilarityPage.jsx` all have loading state, error state, and retry option
- Tour system event dispatch (`dispatchTourEvent`, `currentStepRef`, `isActiveRef`) untouched

### Phase 5 — Bug Fixes

**Bug #1 — Review.jsx negative free time:** Fixed. Events deduplicated by id/time-range; time overlap checked before subtracting from free time.

**Bug #2 — GeneratedSchedule undefined `schedule` prop:** Fixed. When prop is missing, schedule is derived from current `weeklyCycle` state. Clear fallback UI shown if neither is available.

**Bug #3 — `/api/flashcards/user-sets/uncategorised` table name:** Fixed. Confirmed correct table name via debug-tables output; query corrected. `/api/flashcards/debug-tables` route then removed.

**Bug #4 — Tour stale closures (steps 26–30):** Confirmed safe. The Continue button's `onClick` only calls `dispatchTourEvent` (already ref-safe). All reads of `currentStep`/`isActive` inside callbacks/setTimeout in `TourContext.jsx` confirmed to use `currentStepRef.current`/`isActiveRef.current`.

### Debug Routes Removed
- `/api/flashcards/debug-tables` — removed ✓
- `/debug/ai-status` (chat.routes.js) — removed ✓
- `/debug/token-usage` (chat.routes.js) — removed ✓

### Raw Error Leak Fix
- `flashcard.routes.js` error at (pre-refactor) line 52 that sent raw `err.message` to client — confirmed now routed through `errorHandler` middleware. No raw errors leak to client.

### Broken Module Reference Fix
- `schedule.controller.js` was importing `./services/intelligence/timeEstimation.engine` which did not exist
- Correct file: `timeEstimation.service.js`
- Entire backend codebase searched for other broken `require`/`import` paths — fixed all found
- Server now starts cleanly with no `MODULE_NOT_FOUND` errors

---

## HEATMAP / ANALYTICS REFACTOR

### Root Cause Investigation
- `diary_logs` table had entries (9 for test user, 3 murajah/7-days matching)
- `heatmap_scores` table was empty — nothing ever wrote to it when diary entries were saved (forgotten second write path)
- `PerformanceAnalyticsView.jsx` was reading `data.logs` but backend returns `{ success, data }` via `responseFormatter` — shape mismatch causing "No history found"
- Both issues were masked by fallback behavior, not surfaced as visible errors

### Fix A — Performance Analytics Response Shape
- `analytics.controller.js` returns `{ success, data }` (standardized `responseFormatter` shape)
- `PerformanceAnalyticsView.jsx` updated to read `data` directly instead of `data.logs`
- All other frontend components checked for same `data.logs` assumption against similarly-shaped endpoints — fixed where found
- Verified: Murajah + 7 Days now shows real entries for test user

### Fix B — Heatmap: Option B Implemented (Compute from `diary_logs`)
**Decision:** Remove dependency on empty `heatmap_scores` table. Compute page/juz scores directly from `diary_logs` (murajah and tasmee entries carry page number, juz, and score).

**Strategy:** Most recent score per page wins (not average). If a page has multiple murajah/tasmee entries, the latest by timestamp is used.

**Consumers found and updated (3 total):**
1. `analytics.controller.js` — Qur'an Map
2. `aqmosAnalysis.service.js` — AQMOS Analysis / scheduler quality calc
3. `tmWizard.controller.js` — Time Management wizard progress analysis

**Implementation:**
- New computed function in `heatmap.repository.js` queries `diary_logs` directly
- Return shape kept identical: `{ juz, page, score }` — no changes needed in calling code
- POST `/analytics/heatmap` endpoint removed/deprecated (nothing on frontend called it)
- `heatmap_scores` table left in DB unused (not dropped — stable confirmation first)

**Verified for test user:**
1. ✅ Qur'an Map shows real page scores
2. ✅ AQMOS Analysis reflects real scores instead of empty
3. ✅ Time Management wizard progress analysis reflects real scores instead of empty

### Field Name Audit (post-refactor)
- All consumers of `aqmosAnalysis.service.js` `analyze()` output checked for old field names `sipara` or `page_number` — none found using stale names; all reference correct fields.

### `baseTimeEstimate` / `finalTimeEstimate` Defaults
- `scheduler.pageAnalysis.repository.js` uses `|| 5` defaults for these fields
- Confirmed: `aqmosAnalysis.service.js` computes `baseTimeEstimate`/`finalTimeEstimate` for EVERY page in its output array with no conditional skips (not dependent on AQMOS profile or score presence for the calculation path used)
- The `|| 5` fallback is unreachable dead code — harmless defensive code, left in place, no change needed

---

## FLASHCARDSPAGE EMPTY-STATE BUG (Fixed)

**Root cause:** The `if` condition around line 336–341 checked `res?.success && res?.data?.length` (truthiness + array length), so a response of `{success: true, data: []}` (valid empty result) would fail the condition and fall through to the fallback-to-all-sets path, logging the spurious "Unknown error" warning.

**Fix:** Fallback now only triggers on actual failure (`res.success === false`, a thrown error, or malformed response). A successful empty array correctly sets `uncategorisedSets` to `[]` with no warning logged.

**Verified:**
- User with zero uncategorised sets → correct empty state, no warning, no fallback triggered ✓
- User with uncategorised sets → sets load correctly ✓
- Temporary full-response logging removed ✓

---

## TIME MANAGEMENT ROUTING BUG

**Bug report:** Clicking "Time Management" or "Open Planner" on the homepage opened the Diary page instead of the Coach wizard.

**Status:** Under investigation at time of summary. Investigation steps:
1. Confirm exact `href`/`onClick` on homepage Time Management card and "Open Planner" button point to `/coach` or `/coach?start=planner`
2. Separate check: does browser URL show `/diary` (wrong link), or shows `/coach` while rendering Diary content (route config bug or import issue in `CoachPage.jsx`)
3. Check `ProtectedRoute.jsx` and `AuthContext.jsx` for any redirect sending users to `/diary` regardless of link clicked
4. Reproduce from fresh page load vs. in-app navigation to isolate

> ⚠️ Not yet confirmed fixed — investigation was ongoing at close of session.

---

## KEY FILES

**Frontend:**
- `src/shared/context/TourContext.jsx` — tour state, `dispatchTourEvent`, `currentStepRef`, `isActiveRef`, `onResultsFound` (backward compat)
- `src/shared/components/ErrorBoundary.jsx` — global error boundary (new)
- `src/components/TourBanner.jsx` — dual mode (manual/action)
- `src/components/TourNavigationHandler.jsx` — `useNavigate` bridge
- `src/components/DailyQuoteCard.jsx` — 15s splash screen
- `src/data/dailyQuotes.js` — 30 quotes
- `src/features/flashcards/FlashcardsPage.jsx` — folders + sets + independent scroll layout
- `src/features/similarity/SimilarityPage.jsx`
- `src/features/diary/DiaryPage.jsx`
- `src/pages/HomePage.jsx` — Quote of Day + Take a Tour in welcome card
- `src/features/coach/CoachPage.jsx` — direct to wizard, side panel gets progress as props
- `src/shared/services/http.js` — centralized API interceptor (new)

**Backend:**
- `backend/src/utils/AppError.js` — custom operational error class (new)
- `backend/src/utils/asyncHandler.js` — async route wrapper (new)
- `backend/src/middleware/errorHandler.js` — global error handler, registered last in server.js
- `backend/src/routes/flashcards.js` — folders + sets CRUD, uncategorised endpoint
- `backend/modules/scheduler/schedule.controller.js` — fixed broken import path
- `backend/modules/scheduler/services/intelligence/timeEstimation.service.js` — correct file (was misreferenced as `.engine`)
- `backend/modules/analytics/analytics.controller.js` — fixed response shape, uses computed heatmap
- `backend/modules/analytics/heatmap.repository.js` — now computes from `diary_logs` directly
- `backend/modules/scheduler/services/aqmosAnalysis.service.js` — updated to computed heatmap
- `backend/modules/scheduler/tmWizard.controller.js` — updated to computed heatmap
- `backend/database.js` — table initialization includes `flashcard_folders`, `flashcard_folder_items`
- `backend/migrate.js` — one-time migration script only (NOT run on server start)

---

## KNOWN REMAINING BUGS / OPEN ITEMS

| # | Issue | Status |
|---|-------|--------|
| 1 | Time Management / "Open Planner" button routing to Diary instead of Coach | 🔴 Under investigation — not yet confirmed fixed |
| 2 | Phase 6 file structure cleanup (scripts/debug, scripts/maintenance relocation, dead files audit) | ⏳ Approved separately — not yet run |
| 3 | `heatmap_scores` table still exists in DB unused | ✅ Intentional — left for stability; drop after confirming computed heatmap stable in prod |
| 4 | `migrate.js` — confirm it is NOT auto-run on server start | ✅ Confirmed manual-only |

---

## REFACTOR PROMPTS REFERENCE (Phases 1–6)

See companion document "Windsurf Prompt Pack — Quran Hifz App" for the full ordered prompt sequence. Phases 1–5 complete. Phase 6 (file structure cleanup) approved but not yet executed.

**Phase 6 scope (when ready):**
- Move `scripts/debug` and `scripts/maintenance` to top-level `/tools` or `/scripts` folder (confirm no server.js imports first)
- Remove `/api/flashcards/debug-tables` route (already done in Phase 5)
- Confirm `migrate.js` is manual-only (confirmed)
- Audit for duplicate/dead `.repository.js` or `.service.js` files with no incoming references
- List recommended deletes vs. relocations for manual approval before any deletions