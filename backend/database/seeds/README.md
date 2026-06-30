# Seeds

This folder contains seed data for the database.

## Purpose

Seed files populate the database with initial static/reference data that is required for the application to function properly.

## Types of Seed Data

- Reference data (surahs, juz mappings, themes)
- Configuration data
- Default values
- Test data (for development)

## Naming Convention

Use the format: `NNN_description.sql`

Where:
- `NNN` is a 3-digit zero-padded number
- `description` describes what data is being seeded

## Execution Order

Seeds are executed after schema and migrations, in numeric order.

## Adding New Seeds

1. Create a new seed file with the next sequential number
2. Write INSERT statements for the data
3. Use `INSERT OR IGNORE` to prevent duplicates
4. Test the seed locally
5. Update this README

## Rules

- Seeds should be idempotent (safe to run multiple times)
- Use `INSERT OR IGNORE` or `INSERT OR REPLACE`
- Never seed user-generated data (only static/reference data)
- Keep seeds focused and small
