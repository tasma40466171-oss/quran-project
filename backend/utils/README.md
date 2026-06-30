# Utils

Shared utility functions and helpers.

## Available Utilities

- `responseFormatter.js` - Standard API response formatting (success/error)
- `AppError.js` - Custom error class for application errors
- `asyncHandler.js` - Async error handling wrapper for Express routes
- `aiErrorHandler.js` - AI API error analysis and handling
- `tokenUsageTracker.js` - Token usage tracking for AI requests
- `aiCache.js` - In-memory cache for AI responses with TTL

## Usage

Import utilities where needed:

```javascript
const { formatSuccess, formatError } = require("../../utils/responseFormatter");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
```

## Principles

- Utilities should be pure functions when possible
- No business logic in utilities
- Reusable across the application
- Well-documented with clear purposes
