# Database Recovery Guide

This guide provides procedures for recovering the database in various scenarios.

## Scenario 1: Fresh Developer Setup

**Problem:** New developer joining the project needs to set up the database from scratch.

**Solution:**

```bash
# Navigate to backend directory
cd backend

# Run database setup
npm run db:setup

# Verify the setup
npm run db:verify
```

**What happens:**
1. Creates database directory if it doesn't exist
2. Creates the database file
3. Executes schema.sql to create all tables
4. Runs all migrations in order
5. Runs all seed files
6. Verifies all tables, columns, indexes, and foreign keys

**Expected output:**
```
=== Database Setup Started ===
✓ Connected to database
=== Executing Schema ===
✓ Completed: schema.sql
=== Executing Migrations ===
✓ Completed: 001_coach_and_flashcards_tables.sql
✓ Completed: 002_add_walkthrough_flag.sql
✓ Completed: 003_add_flashcard_folders.sql
=== Executing Seeds ===
✓ Completed: 001_arabic_surah_names.sql
=== Verifying Tables ===
✓ All 19 required tables exist
=== Database Setup Complete ===
```

---

## Scenario 2: Database Accidentally Deleted

**Problem:** Database file was deleted or corrupted.

**Solution:**

```bash
# Navigate to backend directory
cd backend

# Rebuild database from scratch
npm run db:setup

# Verify the setup
npm run db:verify
```

**Note:** This will create a fresh database with no user data. All user data will be lost.

**If you have a backup:**

```bash
# Restore from backup (if available)
cp backup/quran_similarity_backup.db database/quran_similarity.db

# Verify the restored database
npm run db:verify
```

---

## Scenario 3: Migration Failure

**Problem:** A migration failed during execution, leaving the database in an inconsistent state.

**Solution:**

```bash
# Navigate to backend directory
cd backend

# Reset the database (WARNING: deletes all data)
npm run db:reset -- --force

# Rebuild from scratch
npm run db:setup

# Verify the setup
npm run db:verify
```

**If you need to preserve data:**

1. Identify which migration failed
2. Check the migration file in `database/migrations/`
3. Fix the SQL in the migration file
4. Manually apply the fix:
   ```bash
   sqlite3 database/quran_similarity.db < database/migrations/XXX_failed_migration.sql
   ```
5. Run verification:
   ```bash
   npm run db:verify
   ```

---

## Scenario 4: Seed Reload

**Problem:** Need to reload seed data without affecting user data.

**Solution:**

```bash
# Navigate to backend directory
cd backend

# Run specific seed file
sqlite3 database/quran_similarity.db < database/seeds/001_arabic_surah_names.sql

# Verify the seed data
sqlite3 database/quran_similarity.db "SELECT COUNT(*) FROM surah_names;"
```

**To reload all seeds:**

```bash
# Run all seed files in order
sqlite3 database/quran_similarity.db < database/seeds/001_arabic_surah_names.sql
# Add more seed files as needed
```

**Note:** Seeds use `INSERT OR IGNORE` to prevent duplicates, so running them multiple times is safe.

---

## Scenario 5: Database Corruption

**Problem:** Database file is corrupted and cannot be opened.

**Solution:**

```bash
# Navigate to backend directory
cd backend

# Try to recover data using SQLite's dump
sqlite3 database/quran_similarity.db ".dump" > backup/recovery_dump.sql

# If dump succeeds, create new database and restore
sqlite3 database/quran_similarity_new.db < backup/recovery_dump.sql

# Replace corrupted database
mv database/quran_similarity.db database/quran_similarity_corrupted.db
mv database/quran_similarity_new.db database/quran_similarity.db

# Verify the restored database
npm run db:verify
```

**If dump fails:**

```bash
# Reset and rebuild from scratch
npm run db:reset -- --force
npm run db:setup
npm run db:verify
```

---

## Scenario 6: Schema Drift

**Problem:** Database schema doesn't match the expected schema (missing tables, columns, or indexes).

**Solution:**

```bash
# Navigate to backend directory
cd backend

# Run verification to identify issues
npm run db:verify

# Review the output for missing tables, columns, or indexes

# If issues are found, reset and rebuild
npm run db:reset -- --force
npm run db:setup
npm run db:verify
```

**To fix specific issues without full reset:**

1. Identify missing items from verification output
2. Create a migration file in `database/migrations/` with the next number
3. Add the missing tables, columns, or indexes
4. Run the migration:
   ```bash
   sqlite3 database/quran_similarity.db < database/migrations/004_fix_schema_drift.sql
   ```
5. Verify:
   ```bash
   npm run db:verify
   ```

---

## Backup Recommendations

### Regular Backups

```bash
# Create a timestamped backup
cp database/quran_similarity.db backup/quran_similarity_$(date +%Y%m%d_%H%M%S).db

# Or use SQLite's backup command
sqlite3 database/quran_similarity.db ".backup backup/quran_similarity_backup.db"
```

### Automated Backup Script

Create `scripts/maintenance/backupDatabase.js`:

```javascript
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '../../database/quran_similarity.db');
const BACKUP_DIR = path.join(__dirname, '../../backup');

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Create timestamped backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = path.join(BACKUP_DIR, `quran_similarity_${timestamp}.db`);

const db = new sqlite3.Database(DB_PATH);
db.backup(backupPath).then(() => {
    console.log(`Backup created: ${backupPath}`);
    db.close();
});
```

Add to package.json:
```json
"scripts": {
  "db:backup": "node scripts/maintenance/backupDatabase.js"
}
```

---

## Recovery Checklist

Before performing any recovery operation:

- [ ] Stop the application server
- [ ] Create a backup of the current database (if possible)
- [ ] Document the current state (tables, row counts)
- [ ] Identify the root cause of the issue
- [ ] Choose the appropriate recovery scenario
- [ ] Execute the recovery procedure
- [ ] Verify the database with `npm run db:verify`
- [ ] Test the application
- [ ] Document the recovery performed

---

## Contact and Support

If you encounter issues not covered in this guide:

1. Check the schema documentation: `database/schema/MASTER_SCHEMA.md`
2. Review migration files in `database/migrations/`
3. Check seed files in `database/seeds/`
4. Verify the database with `npm run db:verify`
5. Review error logs for specific error messages

---

## Important Notes

- **Always backup before performing destructive operations**
- **The reset command requires the `--force` flag for safety**
- **Seeds use `INSERT OR IGNORE` to prevent duplicates**
- **Migrations are idempotent and can be run multiple times**
- **Foreign keys are enabled by default**
- **All user data is lost on reset - use with caution**
