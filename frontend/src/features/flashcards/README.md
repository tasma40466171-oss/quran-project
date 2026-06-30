# Flashcards Feature

## Purpose
AI-generated flashcard system for Quran memorization with folder organization.

## Pages
- `FlashcardsPage.jsx` - Main flashcards interface with folder system

## Components
- `components/StudyView.jsx` - Study mode for flashcard review
- `components/TestView.jsx` - Self-testing mode
- `components/SequenceFlowchart.jsx` - Visual sequence display
- `components/CreateFlashcardModal.jsx` - Modal for creating new sets
- `components/FolderGrid.jsx` - Folder organization grid
- `components/AddSetsToFolderModal.jsx` - Modal for adding sets to folders
- `components/QuestionEditor.jsx` - AI question generation interface

## Data
- `data/flashcardsData.jsx` - Built-in flashcard categories

## Services
- `folderApi` - API service for folder operations
- `flashcardsApi` - API service for flashcard operations

## State
- Uses TourContext for walkthrough integration
- Local state for sets, folders, active set, modals

## Data Flow
1. User views built-in categories or creates custom sets
2. Organizes sets into folders
3. Studies cards in sequence or test mode
4. AI generates questions for custom sets

## Dependencies
- TourContext for walkthrough
- Shared folderApi service
- Shared flashcardsApi service
- authFetch for authenticated requests

## How to Extend
- Add new built-in categories to flashcardsData
- Add new study modes
- Extend folder system with subfolders
- Add spaced repetition algorithm
