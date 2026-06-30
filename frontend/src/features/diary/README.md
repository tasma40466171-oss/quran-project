# Diary Feature

## Purpose
Daily logging interface for Quran memorization progress tracking with multiple log types.

## Pages
- `DiaryPage.jsx` - Main diary interface with tabbed forms

## Components
- `components/LogHistory.jsx` - Displays historical log entries
- `components/forms/MurajahForm.jsx` - Revision log form
- `components/forms/TasmeeForm.jsx` - Recitation log form
- `components/forms/IkhtebarForm.jsx` - Test log form
- `components/forms/JadeedForm.jsx` - New memorization log form
- `components/forms/JuzHaliForm.jsx` - Juz completion log form

## Hooks
- `hooks/useMurajahForm` - Murajah form logic
- `hooks/useTasmeeForm` - Tasmee form logic
- `hooks/useIkhtebarForm` - Ikhtebar form logic
- `hooks/useJadeedForm` - Jadeed form logic
- `hooks/useJuzHaliForm` - Juz Hali form logic

## Services
- `diaryApi` - API service for diary operations

## State
- Uses AuthContext for user authentication
- Uses TourContext for walkthrough integration
- Local state for active tab, form data, logs

## Data Flow
1. User selects log type tab
2. Fills form with Quran references
3. Submits to diaryApi
4. Updates log history display
5. Integrates with PerformanceAnalyticsView

## Dependencies
- AuthContext for user data
- TourContext for walkthrough
- Shared diaryApi service
- PerformanceAnalyticsView for analytics

## How to Extend
- Add new log types with corresponding form and hook
- Extend diaryApi for new log types
- Add validation to form hooks
