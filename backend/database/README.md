# Database

This folder contains all database-related files including schema, migrations, seeds, views, functions, and procedures.

## Structure

```
database/
├── schema/          # Master schema definitions
├── migrations/      # Versioned database changes
├── seeds/           # Initial/reference data
├── views/           # SQL views
├── functions/       # Custom SQL functions
├── procedures/      # Stored procedures
└── *.model.js       # Legacy model files (deprecated)
```

## Setup

To set up the database from scratch:

```bash
npm run db:setup
```

This will:
1. Create the database if it doesn't exist
2. Execute the schema
3. Run all migrations
4. Run all seeds
5. Verify the setup

## Reset

To reset the database (drop and rebuild):

```bash
npm run db:reset -- --force
```

**Warning:** This will delete all data. Use with caution.

## Verify

To verify the database structure:

```bash
npm run db:verify
```

## Migration Workflow

When making schema changes:

1. Create a new migration in `migrations/` with the next number
2. Test the migration locally
3. Run `npm run db:setup` to apply
4. Update documentation

## Seed Data

Seed files contain static/reference data only. User-generated data is never seeded.

## Recovery

See `docs/database-recovery.md` for recovery scenarios and procedures.
