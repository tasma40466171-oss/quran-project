# Similarity Feature

## Purpose
Search and explore similar Quranic verses (Mutashabihat) with AI-generated tips.

## Pages
- `SimilarityPage.jsx` - Main similarity search interface

## Components
- `components/SearchBar.jsx` - Search interface for Surah/Ayah selection
- `components/AyahDisplay.jsx` - Display of selected source Ayah
- `components/SimilaritiesList.jsx` - List of similar verses
- `components/SidePanel.jsx` - AI coach panel with tips

## Services
- `similarityApi` - API service for similarity search
- `coachApi` - API service for AI tips

## State
- Uses AppContext for global similarity state
- Uses TourContext for walkthrough integration
- Local state for auto-search from CoachPage

## Data Flow
1. User searches for source Ayah
2. Fetches similar verses from backend
3. Displays similarity results
4. AI generates tips for each pair
5. Tips saved to database

## Dependencies
- AppContext for global state
- TourContext for walkthrough
- Shared similarityApi service
- Shared coachApi service
- marhalaMapper for Marhala mapping

## How to Extend
- Add new similarity algorithms
- Add advanced search filters
- Add similarity visualization
- Add bulk similarity analysis
