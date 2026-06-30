# Scheduler Feature

## Purpose
AI-powered schedule generation for Quran study and revision planning.

## Pages
- `SchedulerPage.jsx` - Main scheduler interface with events and revision units
- `SchedulerWizard.jsx` - Multi-step wizard for schedule generation

## Components
- `components/EventBuilder.jsx` - Manual event creation
- `components/RevisionUnits.jsx` - Revision unit management
- `components/ScheduleView.jsx` - Schedule display

## Wizard Steps
- `wizard/ProgressAnalysis.jsx` - Progress analysis step
- `wizard/WeeklyCycle.jsx` - Weekly cycle configuration
- `wizard/BuildMyWeek.jsx` - Week building interface
- `wizard/Exceptions.jsx` - Exception handling
- `wizard/Review.jsx` - Schedule review
- `wizard/GeneratedSchedule.jsx` - Generated schedule display
- `wizard/UnitDetails.jsx` - Unit details view
- `wizard/AdjustUnit.jsx` - Unit adjustment

## Services
- `schedulerApi` - API service for scheduler operations

## State
- Uses TourContext for walkthrough integration
- Local state for events, revision units, schedule, wizard steps

## Data Flow
1. User enters wizard to generate schedule
2. Configures weekly cycle and preferences
3. AI generates optimized schedule
4. User reviews and adjusts
5. Schedule saved to backend

## Dependencies
- TourContext for walkthrough
- schedulerApi service
- authFetch for authenticated requests

## How to Extend
- Add new wizard steps
- Add new schedule algorithms
- Add calendar integration
- Add reminder notifications
