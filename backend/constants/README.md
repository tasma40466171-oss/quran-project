# Constants

Application-wide constants to avoid magic strings and numbers.

## Available Constants

- `aiConstants.js` - AI-related constants (Groq model, endpoint, retry settings)

## Usage

Import constants where needed:

```javascript
const { GROQ_MODEL, DEFAULT_MAX_TOKENS } = require("../../constants/aiConstants");
```

## Benefits

- Single source of truth for configuration values
- Easy to update across the application
- Type safety and IDE autocomplete support
- Reduced risk of typos
