# Functions

This folder contains custom SQL functions for the database.

## Purpose

Functions encapsulate reusable SQL logic that can be called from queries.

## Naming Convention

Use the format: `function_name.sql`

Where `function_name` describes what the function does.

## Adding New Functions

1. Create a new file with the function definition
2. Use `CREATE OR REPLACE FUNCTION` for safety
3. Test the function locally
4. Update this README

## Example

```sql
CREATE OR REPLACE FUNCTION calculate_streak(last_log_date TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- Calculate streak logic here
    RETURN streak_count;
END;
$$ LANGUAGE plsql;
```

## Notes

- SQLite has limited function support compared to PostgreSQL
- Consider using application logic for complex calculations
- Functions should be simple and performant
