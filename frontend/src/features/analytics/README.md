# Analytics Feature

## Purpose
Provides performance analytics and visualization for Quran memorization progress.

## Pages
- `PerformanceAnalyticsView.jsx` - Main analytics dashboard with trend charts and deep dive data
- `components/QuranMapView.jsx` - Heatmap visualization of Quran page scores

## Components
- `PerformanceAnalyticsView` - Main analytics dashboard
- `QuranMapView` - Interactive heatmap showing page-by-page performance

## Services
- `analyticsApi` - API service for fetching analytics data

## State
- Uses shared AppContext for global state
- Local state for chart data and loading states

## Data Flow
1. Fetches trend data from backend
2. Fetches heatmap data from backend
3. Displays charts and visualizations
4. No local state persistence

## Dependencies
- Recharts for charting
- Shared analyticsApi service
- Shared scoreColors utility

## How to Extend
- Add new chart types to PerformanceAnalyticsView
- Add new visualization components to components/
- Extend analyticsApi for new data endpoints
