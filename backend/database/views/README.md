# Views

This folder contains SQL views for the database.

## Purpose

Views provide virtual tables based on queries, simplifying complex joins and aggregations.

## Naming Convention

Use the format: `view_name.sql`

Where `view_name` describes what the view shows.

## Adding New Views

1. Create a new file with the view definition
2. Use `CREATE VIEW IF NOT EXISTS` for safety
3. Test the view locally
4. Update this README

## Example

```sql
CREATE VIEW IF NOT EXISTS user_summary AS
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT dl.id) as diary_count
FROM users u
LEFT JOIN diary_logs dl ON u.id = dl.user_id
GROUP BY u.id;
```

## Notes

- Views are read-only
- They don't store data, just query definitions
- Can improve query readability and performance
