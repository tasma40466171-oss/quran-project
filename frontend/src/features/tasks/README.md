# Tasks Feature

## Purpose
Daily task management for Quran study goals.

## Components
- `components/DailyTask.jsx` - Daily task list with CRUD operations

## Services
- `taskApi` - API service for task operations

## State
- Uses TourContext for walkthrough integration
- Local state for tasks, loading, error

## Data Flow
1. Fetches tasks for active date
2. Displays task list
3. User can add, update, delete tasks
4. Integrates with DiaryPage for display

## Dependencies
- TourContext for walkthrough
- Shared taskApi service
- DiaryPage for integration

## How to Extend
- Add task categories
- Add task priorities
- Add recurring tasks
- Add task reminders
