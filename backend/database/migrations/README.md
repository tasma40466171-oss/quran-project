# Migrations

This folder contains versioned database migration scripts.

## Purpose

Migrations track incremental changes to the database schema over time. Each migration represents a single logical change.

## Naming Convention

Use the format: `NNN_description.sql`

Where:
- `NNN` is a 3-digit zero-padded number (001, 002, 003, etc.)
- `description` is a short, snake_case description of the change

## Current Migrations

- `001_coach_and_flashcards_tables.sql` - Initial coach and flashcard tables
- `002_add_walkthrough_flag.sql` - Add walkthrough flag to users table
- `003_add_flashcard_folders.sql` - Add flashcard folder support

## Execution Order

Migrations are executed in numeric order (001, 002, 003, etc.) by the setup script.

## Adding New Migrations

1. Create a new file with the next sequential number
2. Write the SQL changes (CREATE TABLE, ALTER TABLE, etc.)
3. Test the migration locally
4. Update this README with the new migration description

## Rules

- Each migration should be idempotent (safe to run multiple times)
- Use `IF NOT EXISTS` for CREATE statements
- Include rollback comments if possible
- Never modify existing migrations - create a new one instead
