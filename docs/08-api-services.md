# API Services

All API service modules, their endpoints, methods, authentication, error handling, and usage.

## Overview

The application uses a centralized HTTP client (`authFetch` and `publicFetch`) for API communication. All API services are located in `src/shared/services/` and follow a consistent pattern.

## Base Configuration

### API Base URL

**File**: `src/shared/services/apiConfig.js`

```js
export const API_BASE = 'http://localhost:5000/api';
```

### Auth Header Helper

```js
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
```

## HTTP Client

### File
`src/shared/services/http.js`

### Functions

#### authFetch(url, options, operationName)

**Purpose**: Authenticated API calls with automatic error handling and 401 redirect.

**Parameters**:
- `url` (string): API endpoint path (relative to API_BASE)
- `options` (object): Fetch options (method, body, headers, signal)
- `operationName` (string): Operation name for logging

**Behavior**:
- Adds Authorization header from localStorage token
- Automatically sets Content-Type to 'application/json' for POST/PATCH
- Normalizes error responses
- Redirects to login on 401 status
- Logs errors with operation name

**Usage**:
```js
const res = await authFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
}, 'loginUser');
```

#### publicFetch(url, options, operationName)

**Purpose**: Public API calls without authentication.

**Parameters**: Same as authFetch

**Behavior**: Same as authFetch but without Authorization header

**Usage**:
```js
const res = await publicFetch('/auth/signup', {
  method: 'POST',
  body: JSON.stringify({ username, email, password })
}, 'signupUser');
```

### Error Handling

**Error Response Format**:
```js
{
  success: false,
  message: "Error message"
}
```

**401 Handling**:
```js
if (res.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = '/login';
}
```

---

## API Service Modules

### authApi.js

**File**: `src/shared/services/authApi.js`

**Functions**:

#### signupUser(username, email, password)

**Endpoint**: `POST /auth/signup`

**Purpose**: Register a new user account

**Parameters**:
- `username` (string): Desired username
- `email` (string): User email
- `password` (string): User password

**Returns**: `{ success: boolean, data: { token, username }, message: string }`

**Usage**:
```js
const res = await signupUser(username, email, password);
if (res.success) {
  login(res.data.token, res.data.username);
}
```

---

#### loginUser(username, password)

**Endpoint**: `POST /auth/login`

**Purpose**: Authenticate user and receive JWT token

**Parameters**:
- `username` (string): Username
- `password` (string): Password

**Returns**: `{ success: boolean, data: { token, username }, message: string }`

**Usage**:
```js
const res = await loginUser(username, password);
if (res.success) {
  login(res.data.token, res.data.username);
  navigate('/');
}
```

---

### similarityApi.js

**File**: `src/shared/services/similarityApi.js`

**Functions**:

#### fetchSurahs()

**Endpoint**: `GET /similarity/surahs`

**Purpose**: Fetch list of all surahs

**Returns**: `[{ surah: number, name: string }]`

**Usage**:
```js
const surahs = await fetchSurahs();
```

---

#### fetchAyahs(surah)

**Endpoint**: `GET /similarity/ayahs?surah={surah}`

**Purpose**: Fetch ayahs for a specific surah

**Parameters**:
- `surah` (number): Surah number

**Returns**: `[{ ayah: number }]`

**Usage**:
```js
const ayahs = await fetchAyahs(selectedSurah);
```

---

#### fetchSimilarities(surah, ayah, marhala, juzz)

**Endpoint**: `GET /similarity?surah={surah}&ayah={ayah}&marhala={marhala}&juzz={juzz}`

**Purpose**: Fetch similar verses for a given ayah with optional filters

**Parameters**:
- `surah` (number): Source surah number
- `ayah` (number): Source ayah number
- `marhala` (string, optional): Marhala filter
- `juzz` (string, optional): Comma-separated juz filter

**Returns**: 
```js
{
  success: boolean,
  data: {
    source: { surah, ayah, text, page, name },
    results: [
      {
        target_surah, target_ayah, text, page, name,
        similarity_score, strength_label, highlight_mode,
        juz, marhala, tips
      }
    ]
  }
}
```

**Usage**:
```js
const res = await fetchSimilarities(surah, ayah, marhala, juzz.join(','));
```

---

#### fetchAyahContext(surah, ayah)

**Endpoint**: `GET /similarity/context?surah={surah}&ayah={ayah}`

**Purpose**: Fetch previous, current, and next ayah for context

**Parameters**:
- `surah` (number): Surah number
- `ayah` (number): Ayah number

**Returns**: `{ success: boolean, data: { prev, current, next } }`

**Usage**:
```js
const res = await fetchAyahContext(surah, ayah);
```

---

#### fetchPageDetails(page)

**Endpoint**: `GET /similarity/page/{page}`

**Purpose**: Fetch details for a specific page

**Parameters**:
- `page` (number): Page number

**Returns**: Not assessed

**Usage**:
```js
const res = await fetchPageDetails(page);
```

---

#### fetchJuzPages(juz)

**Endpoint**: `GET /similarity/juz/{juz}/pages`

**Purpose**: Fetch all pages in a juz

**Parameters**:
- `juz` (number): Juz number

**Returns**: Not assessed

**Usage**:
```js
const res = await fetchJuzPages(juz);
```

---

#### fetchPagesInRange(startPage, endPage)

**Endpoint**: `GET /similarity/pages?start={start}&end={end}`

**Purpose**: Fetch pages in a range

**Parameters**:
- `startPage` (number): Start page
- `endPage` (number): End page

**Returns**: Not assessed

**Usage**:
```js
const res = await fetchPagesInRange(startPage, endPage);
```

---

### diaryApi.js

**File**: `src/shared/services/diaryApi.js`

**Functions**:

#### addLog(logData)

**Endpoint**: `POST /diary/logs`

**Purpose**: Add a new diary log entry

**Parameters**:
- `logData` (object): Log data with type, range_from, range_to, score, etc.

**Returns**: `{ success: boolean, message: string }`

**Usage**:
```js
const res = await addLog({
  type: 'murajah',
  range_from: '1:1',
  range_to: '1:5',
  score: 8
});
```

---

#### getLogs(date)

**Endpoint**: `GET /diary/logs?date={date}`

**Purpose**: Fetch diary logs for a specific date

**Parameters**:
- `date` (string): Date in YYYY-MM-DD format

**Returns**: `{ success: boolean, data: [log objects] }`

**Usage**:
```js
const res = await getLogs(activeDate);
```

---

#### deleteLog(id)

**Endpoint**: `DELETE /diary/logs/{id}`

**Purpose**: Delete a diary log entry

**Parameters**:
- `id` (number): Log ID

**Returns**: `{ success: boolean, message: string }`

**Usage**:
```js
const res = await deleteLog(logId);
```

---

#### updateLog(id, updates)

**Endpoint**: `PATCH /diary/logs/{id}`

**Purpose**: Update a diary log entry

**Parameters**:
- `id` (number): Log ID
- `updates` (object): Fields to update

**Returns**: `{ success: boolean, message: string }`

**Usage**:
```js
const res = await updateLog(logId, { score: 9 });
```

---

### flashcardApi.js

**File**: `src/shared/services/flashcardApi.js`

**Functions**:

#### getDueCards()

**Endpoint**: `GET /flashcards/due`

**Purpose**: Fetch flashcards due for review

**Returns**: `{ success: boolean, data: [cards] }`

**Note**: Currently a stub implementation

**Usage**:
```js
const res = await getDueCards();
```

---

#### getCardsByJuz(juz)

**Endpoint**: `GET /flashcards/juz/{juz}`

**Purpose**: Fetch flashcards for a specific juz

**Parameters**:
- `juz` (number): Juz number

**Returns**: `{ success: boolean, data: [cards] }`

**Note**: Currently a stub implementation

**Usage**:
```js
const res = await getCardsByJuz(juz);
```

---

#### submitReview(cardId, rating)

**Endpoint**: `POST /flashcards/review`

**Purpose**: Submit flashcard review result

**Parameters**:
- `cardId` (number): Card ID
- `rating` (number): Review rating

**Returns**: `{ success: boolean, message: string }`

**Note**: Currently a stub implementation

**Usage**:
```js
const res = await submitReview(cardId, rating);
```

---

#### resetCard(cardId)

**Endpoint**: `POST /flashcards/reset`

**Purpose**: Reset flashcard progress

**Parameters**:
- `cardId` (number): Card ID

**Returns**: `{ success: boolean, message: string }`

**Note**: Currently a stub implementation

**Usage**:
```js
const res = await resetCard(cardId);
```

---

### analyticsApi.js

**File**: `src/shared/services/analyticsApi.js`

**Functions**:

#### getTrend(days)

**Endpoint**: `GET /analytics/trend?days={days}`

**Purpose**: Fetch performance trend data

**Parameters**:
- `days` (number): Number of days to include

**Returns**: `{ success: boolean, data: [trend data] }`

**Usage**:
```js
const res = await getTrend(30);
```

---

#### getDeepDive()

**Endpoint**: `GET /analytics/deep-dive`

**Purpose**: Fetch deep-dive analysis data

**Returns**: `{ success: boolean, data: { analysis } }`

**Usage**:
```js
const res = await getDeepDive();
```

---

#### getHeatmapData()

**Endpoint**: `GET /analytics/heatmap`

**Purpose**: Fetch heatmap data for Quran Map visualization

**Returns**: 
```js
{
  success: boolean,
  data: [
    { juz, page, score, marhala }
  ]
}
```

**Usage**:
```js
const res = await getHeatmapData();
```

---

### coachApi.js

**File**: `src/shared/services/coachApi.js`

**Functions**:

#### getRemainingQuota()

**Endpoint**: `GET /coach/quota`

**Purpose**: Fetch remaining AI quota for current user

**Returns**: `{ success: boolean, data: { remaining: number } }`

**Usage**:
```js
const res = await getRemainingQuota();
```

---

#### sendChat(messages, system)

**Endpoint**: `POST /coach/chat`

**Purpose**: Send chat message to AI coach

**Parameters**:
- `messages` (array): Array of message objects with role and content
- `system` (string, optional): System prompt override

**Returns**: 
```js
{
  success: boolean,
  content: [{ role, text }],
  quota_used: number
}
```

**Usage**:
```js
const res = await sendChat([
  { role: 'user', content: 'Help me with my revision' }
]);
```

---

### taskApi.js

**File**: `src/shared/services/taskApi.js`

**Functions**:

#### getStreak()

**Endpoint**: `GET /tasks/streak`

**Purpose**: Fetch current user streak

**Returns**: 
```js
{
  success: boolean,
  data: { streak: number, tier: string }
}
```

**Usage**:
```js
const res = await getStreak();
```

---

#### getTasks(date)

**Endpoint**: `GET /tasks?date={date}`

**Purpose**: Fetch tasks for a specific date

**Parameters**:
- `date` (string): Date in YYYY-MM-DD format

**Returns**: `{ success: boolean, data: [tasks] }`

**Usage**:
```js
const res = await getTasks(activeDate);
```

---

#### addTask(taskData)

**Endpoint**: `POST /tasks`

**Purpose**: Add a new task

**Parameters**:
- `taskData` (object): Task data with title, category

**Returns**: `{ success: boolean, message: string }`

**Usage**:
```js
const res = await addTask({ title: 'Revise Juz 10', category: 'murajah' });
```

---

#### updateTask(id, status)

**Endpoint**: `PATCH /tasks/{id}`

**Purpose**: Update task status

**Parameters**:
- `id` (number): Task ID
- `status` (string): New status (pending, in_progress, completed)

**Returns**: `{ success: boolean, message: string }`

**Usage**:
```js
const res = await updateTask(taskId, 'completed');
```

---

#### editTaskTitle(id, title)

**Endpoint**: `PATCH /tasks/{id}/title`

**Purpose**: Edit task title

**Parameters**:
- `id` (number): Task ID
- `title` (string): New title

**Returns**: `{ success: boolean, message: string }`

**Usage**:
```js
const res = await editTaskTitle(taskId, 'New title');
```

---

#### deleteTask(id)

**Endpoint**: `DELETE /tasks/{id}`

**Purpose**: Delete a task

**Parameters**:
- `id` (number): Task ID

**Returns**: `{ success: boolean, message: string }`

**Usage**:
```js
const res = await deleteTask(taskId);
```

---

### themeApi.js

**File**: `src/shared/services/themeApi.js`

**Functions**:

#### getCurrentTheme()

**Endpoint**: `GET /theme/current`

**Purpose**: Fetch current user theme

**Returns**: `{ success: boolean, data: { theme } }`

**Usage**:
```js
const res = await getCurrentTheme();
```

---

#### getAllThemes()

**Endpoint**: `GET /theme/all`

**Purpose**: Fetch all available themes

**Returns**: `{ success: boolean, data: [themes] }`

**Usage**:
```js
const res = await getAllThemes();
```

---

#### selectTheme(themeId)

**Endpoint**: `POST /theme/select`

**Purpose**: Select a theme for current user

**Parameters**:
- `themeId` (string): Theme ID

**Returns**: `{ success: boolean, message: string }`

**Usage**:
```js
const res = await selectTheme(themeId);
```

---

#### checkPreview(themeId)

**Endpoint**: `GET /theme/preview/{themeId}`

**Purpose**: Preview a theme

**Parameters**:
- `themeId` (string): Theme ID

**Returns**: `{ success: boolean, data: { theme } }`

**Usage**:
```js
const res = await checkPreview(themeId);
```

---

### folderApi.js

**File**: `src/shared/services/folderApi.js`

**Functions**:

#### getFolders()

**Endpoint**: `GET /flashcards/folders`

**Purpose**: Fetch all folders for current user

**Returns**: `{ success: boolean, data: [folders] }`

**Usage**:
```js
const folders = await getFolders();
```

---

#### getFolderSets(folderId)

**Endpoint**: `GET /flashcards/folders/{folderId}/sets`

**Purpose**: Fetch sets in a specific folder

**Parameters**:
- `folderId` (number): Folder ID

**Returns**: `{ success: boolean, data: [sets] }`

**Usage**:
```js
const sets = await getFolderSets(folderId);
```

---

#### getUncategorisedSets()

**Endpoint**: `GET /flashcards/user-sets/uncategorised`

**Purpose**: Fetch flashcard sets not in any folder

**Returns**: `{ success: boolean, data: [sets] }`

**Usage**:
```js
const sets = await getUncategorisedSets();
```

---

#### createFolder(name, color)

**Endpoint**: `POST /flashcards/folders`

**Purpose**: Create a new folder

**Parameters**:
- `name` (string): Folder name
- `color` (string): Folder color (hex)

**Returns**: `{ success: boolean, data: { id, name, color } }`

**Usage**:
```js
const folder = await createFolder('Revision', '#C9A84C');
```

---

#### renameFolder(folderId, name)

**Endpoint**: `PATCH /flashcards/folders/{folderId}`

**Purpose**: Rename a folder

**Parameters**:
- `folderId` (number): Folder ID
- `name` (string): New folder name

**Returns**: `{ success: boolean }`

**Usage**:
```js
const success = await renameFolder(folderId, 'New Name');
```

---

#### deleteFolder(folderId)

**Endpoint**: `DELETE /flashcards/folders/{folderId}`

**Purpose**: Delete a folder (also deletes all sets inside)

**Parameters**:
- `folderId` (number): Folder ID

**Returns**: `{ success: boolean }`

**Usage**:
```js
const success = await deleteFolder(folderId);
```

---

#### addItemToFolder(folderId, setId, setType)

**Endpoint**: `POST /flashcards/folders/{folderId}/items`

**Purpose**: Add a flashcard set to a folder

**Parameters**:
- `folderId` (number): Folder ID
- `setId` (string): Flashcard set ID
- `setType` (string): Flashcard set type

**Returns**: `{ success: boolean }`

**Usage**:
```js
const success = await addItemToFolder(folderId, setId, setType);
```

---

#### addItemsToFolder(folderId, items)

**Endpoint**: `POST /flashcards/folders/{folderId}/items/batch`

**Purpose**: Add multiple flashcard sets to a folder

**Parameters**:
- `folderId` (number): Folder ID
- `items` (array): Array of { set_id, set_type }

**Returns**: `{ success: boolean }`

**Usage**:
```js
const success = await addItemsToFolder(folderId, [
  { set_id: '123', set_type: 'user' },
  { set_id: '456', set_type: 'user' }
]);
```

---

#### removeItemFromFolder(folderId, setId)

**Endpoint**: `DELETE /flashcards/folders/{folderId}/items/{setId}`

**Purpose**: Remove a flashcard set from a folder

**Parameters**:
- `folderId` (number): Folder ID
- `setId` (string): Flashcard set ID

**Returns**: `{ success: boolean }`

**Usage**:
```js
const success = await removeItemFromFolder(folderId, setId);
```

---

## Direct API Calls

Some components use `authFetch` directly instead of service modules:

### FlashcardsPage
- `GET /flashcards/user-sets` - Fetch user flashcard sets
- `POST /flashcards/user-sets` - Create flashcard set
- `DELETE /flashcards/user-sets/{id}` - Delete flashcard set
- `PATCH /flashcards/user-sets/{id}` - Update flashcard set

### CreateFlashcardModal
- `POST /coach/wizard/sequence/surah` - Generate surah sequence
- `POST /coach/wizard/sequence/page` - Generate page sequence
- `POST /coach/wizard/sequence/juz-pages` - Generate juz pages sequence
- `POST /coach/wizard/sequence/juz-surahs` - Generate juz surahs sequence

### SequenceFlowchart
- `GET /ayah/{surah}/full` - Fetch full surah data
- `GET /ayah/page/{page}/full` - Fetch full page data
- `GET /ayah/juz/{juz}/full` - Fetch full juz data
- `POST /coach/wizard/sequence/juz-pages` - Generate juz pages sequence
- `POST /coach/wizard/sequence/juz-surahs` - Generate juz surahs sequence
- `POST /coach/chat` - Generate AI mnemonic story

### SidePanel
- `GET /similarity/by-pair/tips?ss={ss}&sa={sa}&ts={ts}&ta={ta}` - Fetch tips for pair
- `PATCH /similarity/by-pair/tips?ss={ss}&sa={sa}&ts={ts}&ta={ta}` - Save tips for pair
- `POST /coach/chat` - Generate AI tip

### StudyView
- `GET /ayah/{surah}/{ayah}` - Fetch ayah text

---

## API Service Summary

| Service Module | Functions | Status |
|----------------|-----------|--------|
| authApi.js | 2 (signupUser, loginUser) | Complete |
| similarityApi.js | 7 (fetchSurahs, fetchAyahs, fetchSimilarities, fetchAyahContext, fetchPageDetails, fetchJuzPages, fetchPagesInRange) | Complete |
| diaryApi.js | 4 (addLog, getLogs, deleteLog, updateLog) | Complete |
| flashcardApi.js | 4 (getDueCards, getCardsByJuz, submitReview, resetCard) | Stubs |
| analyticsApi.js | 3 (getTrend, getDeepDive, getHeatmapData) | Complete |
| coachApi.js | 2 (getRemainingQuota, sendChat) | Complete |
| taskApi.js | 5 (getStreak, getTasks, addTask, updateTask, editTaskTitle, deleteTask) | Complete |
| themeApi.js | 4 (getCurrentTheme, getAllThemes, selectTheme, checkPreview) | Complete |
| folderApi.js | 8 (getFolders, getFolderSets, getUncategorisedSets, createFolder, renameFolder, deleteFolder, addItemToFolder, addItemsToFolder, removeItemFromFolder) | Complete |

**Total Functions**: 39

**Stubs**: flashcardApi.js functions appear to be stub implementations and may need completion.

---

## Authentication Flow

### Login Flow
```
LoginPage → authApi.loginUser()
           ↓
    POST /auth/login
           ↓
    { success: true, data: { token, username } }
           ↓
    AuthContext.login(token, username)
           ↓
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
           ↓
    ProtectedRoute allows access
```

### Authenticated Request Flow
```
Component → authFetch(url, options)
           ↓
    Add Authorization header from localStorage
           ↓
    Fetch with headers
           ↓
    If 401 → Clear localStorage, redirect to /login
           ↓
    Return normalized response
```

---

## Error Handling Pattern

All API calls follow this pattern:

```js
try {
  const res = await authFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }, 'operationName');
  
  if (res.success) {
    // Handle success
  } else {
    // Handle error (res.message)
  }
} catch (err) {
  // Handle network error
}
```

---

## API Service Index

**File**: `src/shared/services/index.js`

Purpose: Barrel file for simplified imports

```js
export * from './authApi';
export * from './similarityApi';
export * from './diaryApi';
export * from './flashcardApi';
export * from './analyticsApi';
export * from './coachApi';
export * from './taskApi';
export * from './themeApi';
export * from './folderApi';
export { API_BASE, getAuthHeader } from './apiConfig';
export { authFetch, publicFetch } from './http';
```

**Usage**:
```js
import { loginUser, fetchSimilarities, authFetch } from '../shared/services';
```
