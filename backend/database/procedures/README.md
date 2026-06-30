# Procedures

This folder contains stored procedures for the database.

## Purpose

Stored procedures encapsulate complex database operations that may involve multiple steps.

## Naming Convention

Use the format: `procedure_name.sql`

Where `procedure_name` describes what the procedure does.

## Adding New Procedures

1. Create a new file with the procedure definition
2. Use appropriate error handling
3. Test the procedure locally
4. Update this README

## Example

```sql
CREATE PROCEDURE cleanup_old_data()
BEGIN
    DELETE FROM diary_logs WHERE created_at < date('now', '-90 days');
END;
```

## Notes

- SQLite has limited stored procedure support
- Consider using application scripts for complex operations
- Procedures should be transactional where appropriate
