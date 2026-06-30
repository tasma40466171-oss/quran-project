# Schema

This folder contains the master database schema definition.

## Files

- `schema.sql` - Complete database schema with all tables, indexes, and constraints

## Purpose

The schema file defines the complete database structure including:
- All tables with columns, types, and constraints
- Foreign key relationships
- Indexes for performance
- Unique constraints
- Check constraints

## Execution Order

1. Run schema.sql first to create all base tables
2. Then run migrations in version order
3. Finally run seeds to populate initial data

## Adding New Tables

1. Add table definition to `schema.sql`
2. Create a migration file in `../migrations/` (e.g., `004_add_new_table.sql`)
3. Update this README if needed
4. Regenerate master schema documentation

## Notes

- Schema uses SQLite syntax
- Foreign keys are enabled with `PRAGMA foreign_keys = ON`
- All tables use `IF NOT EXISTS` for safe re-execution
- Cascading deletes are used for user data cleanup
