# Prompts

AI prompts for Groq API integration.

## Structure

- `coach/` - Coach-specific prompts
  - `core.prompt.js` - Core system prompt with Quran data rules and behavior guidelines
  - `home.prompt.js` - Home menu prompt
  - `sequence.prompt.js` - Sequence traversal prompt
  - `mutashabihat.prompt.js` - Mutashabihat tips prompt
  - `mutashabihatTips.prompt.js` - Detailed mutashabihat tips generation prompt
  - `bestMethod.prompt.js` - AQMOS assessment prompt
  - `scheduling.prompt.js` - Time management scheduling prompt
- `shared/` - Shared prompt sections (loaded by core prompts)
  - `aqmosProfiles.txt` - AQMOS learning style profiles
  - `quranDataRules.txt` - Quran text handling rules
  - `behaviorRules.txt` - Behavior and interaction rules
  - `memorizationMethods.txt` - Memorization techniques
  - `schedulingPrinciples.txt` - Scheduling principles
  - `mutashabihatTechniques.txt` - Mutashabihat techniques

## Usage

Prompts are loaded dynamically in services:

```javascript
const CORE_PROMPT = require("../../prompts/coach/core.prompt");
```

Shared sections are loaded using fs in core.prompt.js to avoid duplication.
