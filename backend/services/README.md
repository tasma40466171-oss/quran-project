# Services

This directory contains business logic services that encapsulate application logic separate from controllers and routes.

## Structure

- `coach/` - Coach-related services (conversation, assessment, sequence, time management)
- `scheduler/` - Scheduling and planning services
- `similarity/` - Quran similarity and mutashabihat services
- `flashcard.service.js` - Flashcard management service

## Principles

- Services contain business logic only
- No direct HTTP request/response handling
- Use repositories for data access
- Use shared utilities for common operations
- Services are stateless and testable
