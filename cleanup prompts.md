# Windsurf Prompt Pack — Quran Hifz App: Organize, Refactor, Error Handling

## How to use this
Run these **in order, one at a time**. After each phase:
1. Read Windsurf's report/diff before accepting.
2. `git add -A && git commit -m "phase X"` so you always have a rollback point.
3. Manually test the affected feature (especially the Tour — it's fragile, 32 steps, stale-closure-prone) before moving to the next phase.

Do **not** paste all phases into one prompt. Big-bang refactors in a codebase this size are how working features silently break (e.g. the tour's `currentStepRef`/`isActiveRef` pattern, the folder auto-move logic, the streak-freeze logic).

---

## PHASE 0 — Safety net (do this yourself first)
```
git checkout -b refactor/cleanup
git add -A && git commit -m "checkpoint before refactor pass"
```

---

## PHASE 1 — Backend Audit (READ-ONLY, no code changes)
```
Audit the entire backend (backend/src and backend/*.js). Do NOT change any code yet — only report.

Produce a report covering:
1. Every route/controller that does NOT have a try/catch or error-handling wrapper around async logic.
2. Every place response shapes are inconsistent (some routes use responseFormatter.js, some don't, some return raw objects/strings).
3. Every "temporary" or "debug" file/route currently wired into production code (e.g. /api/flashcards/debug-tables, migrate.js, anything in scripts/debug or scripts/maintenance that's imported elsewhere).
4. Any route handler missing input validation (no checks on req.body/req.params before DB queries).
5. Any place raw SQL/db errors could leak to the client (stack traces, SQLite error messages) instead of a clean error message.
6. Duplicate logic across the diary sub-modules (juzzHali, murajah, tasmee, ikhtebar, jadeed) — are their controllers/services/routes structured identically or have they drifted?

Output this as a markdown table: File | Issue | Severity (high/med/low). Do not fix anything yet.
```

---

## PHASE 2 — Frontend Audit (READ-ONLY, no code changes)
```
Audit the entire frontend src/ folder. Do NOT change any code yet — only report.

Produce a report covering:
1. Every component that calls an API (via src/shared/services/*.js) without a loading state, error state, or try/catch.
2. Whether src/shared/services/http.js has a centralized response/error interceptor, or whether each service file (folderApi.js, diaryApi.js, themeApi.js, flashcardApi.js, etc.) duplicates its own error handling.
3. Whether there's a global Error Boundary component anywhere in the app (App.jsx or index.js) — if not, confirm it's missing.
4. Any place a failed API call would currently show a blank screen / silent failure / unhandled promise rejection instead of user-facing feedback.
5. Inconsistent loading/error UI patterns across pages (e.g. does FlashcardsPage handle errors differently from DiaryPage or CoachPage?).

Output this as a markdown table: File | Issue | Severity (high/med/low). Do not fix anything yet.
```

---

## PHASE 3 — Centralized Backend Error Handling
```
Implement centralized error handling for the backend, based on the audit findings. Specifically:

1. Create a custom `AppError` class (backend/src/utils/AppError.js) with `statusCode` and `message`, for expected/operational errors (e.g. "not found", "validation failed", "unauthorized").
2. Create an `asyncHandler` wrapper (backend/src/utils/asyncHandler.js) that wraps async route handlers so thrown/rejected errors are passed to next(err) automatically, instead of needing try/catch in every controller.
3. Update backend/src/middleware/errorHandler.js to be the single global error-handling middleware:
   - If error is an AppError → return its statusCode + message via responseFormatter.js in a consistent shape.
   - If error is unexpected → log the full error server-side, but return a generic 500 message to the client (never leak SQLite/stack trace details).
   - Make sure this middleware is registered LAST in server.js, after all routes.
4. Go through backend/src/routes/*.js and backend/src/**/*.controller.js and wrap async handlers with asyncHandler instead of repeating try/catch.
5. Do NOT change any business logic, only error-handling plumbing. Show me a diff summary per file before finalizing.
```

---

## PHASE 4 — Centralized Frontend Error Handling
```
Implement centralized error handling for the frontend, based on the audit findings. Specifically:

1. In src/shared/services/http.js, add a single response/error interceptor so every API call gets:
   - Consistent error object shape (e.g. { message, statusCode })
   - Automatic redirect to /login on 401 (token expired)
   - A console.error with context for debugging, without breaking the UI
2. Create a reusable ErrorBoundary component (src/shared/components/ErrorBoundary.jsx) and wrap it around the main app routes in App.jsx, so unexpected render errors show a friendly fallback instead of a blank white screen.
3. Audit FlashcardsPage.jsx, DiaryPage.jsx, CoachPage.jsx, SimilarityPage.jsx — ensure each has: a loading state, an error state, and a retry option for failed fetches (the Mutashabihat 429 retry button already does this well — use it as the reference pattern).
4. Do NOT touch the Tour system's event dispatch logic (dispatchTourEvent, currentStepRef, isActiveRef) — only wrap around it, don't refactor it, since it's stale-closure-sensitive and already has a documented workaround.
5. Show me a diff summary per file before finalizing.
```

---

## PHASE 5 — Fix the 4 Known Bugs
```
Fix these specific known bugs. Do them one at a time, and confirm each fix before moving to the next:

1. Review.jsx: free time shows negative when overlapping events aren't fully deduplicated (e.g. "college" and "School" both subtracted). Fix: deduplicate events by id/time-range AND check for time overlap before subtracting from free time. Show me the before/after logic.

2. GeneratedSchedule: the `schedule` prop is sometimes undefined. Fix: when the prop is missing, derive the schedule from the current weeklyCycle state instead of crashing/rendering blank. Add a clear fallback UI if neither is available.

3. /api/flashcards/user-sets/uncategorised: confirm via the existing /api/flashcards/debug-tables route what the correct table name actually is, fix the endpoint to query the correct table, then DELETE the debug-tables route entirely since it shouldn't exist in production.

4. Tour steps 26-30 (coach:continue trigger): confirm whether stale closures still occur. Ensure every place currentStep or isActive is read inside an event handler or setTimeout uses currentStepRef.current / isActiveRef.current, not the captured state variable directly. Search the whole TourContext.jsx and CoachPage wizard Continue handler for any remaining direct reads of `currentStep` or `isActive` inside callbacks.
```

---

## PHASE 6 — File Structure Cleanup
```
Clean up project structure without changing behavior. Specifically:

1. Move all scripts under scripts/debug and scripts/maintenance into a clearly separated top-level folder (e.g. /tools or /scripts), and confirm NONE of them are imported by server.js or any route file. If any are, flag it — don't move it until we decide what to do with it.
2. Remove the /api/flashcards/debug-tables route (after Phase 5 confirms the table name).
3. Confirm migrate.js and backend/migrate.js are not run automatically on server start — if they are, make them a manual one-off script only.
4. Check for any duplicate/dead files (e.g. unused .repository.js or .service.js files with no incoming references in the dependency graph).
5. Give me a list of files you recommend deleting vs. relocating, with reasoning. Do not delete anything without me confirming first.
```

---

## Notes for you (not for Windsurf)
- Run Phase 1 and 2 first regardless of order preference — they cost nothing (read-only) and will tell us if the scope of Phase 3-6 needs adjusting.
- After Phase 5, fix #4 specifically — re-run your tour manually end-to-end once, since it's the most fragile feature you have (32 steps, two trigger modes, ref-based state).
- If Windsurf's diff for any phase touches more files than expected, stop and ask it to scope down — that's usually a sign it's refactoring beyond what was asked.