# Coach Services

Services for the Quran memorization coach functionality.

## Services

- `conversation.service.js` - Chat conversation handling with daily limits and Groq API integration
- `assessment.service.js` - AQMOS learning style assessment and profile management
- `sequence.service.js` - Quran sequence traversal (surah, page, juz sequences)
- `timeManagement.service.js` - Time management and scheduling for memorization
- `groqClient.js` - Groq API client with retry logic and rate limit handling
- `promptBuilder.js` - Dynamic prompt building based on conversation state

## Usage

Services are imported by controllers and called to handle business logic:

```javascript
const conversationService = require("../../services/coach/conversation.service");
const result = await conversationService.processChat(userId, messages, system, state);
```
