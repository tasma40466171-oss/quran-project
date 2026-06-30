// scripts/verification/verifyDatabase.js
"use strict";

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Configuration
const DB_PATH = path.join(__dirname, '../../database/quran_similarity.db');

/**
 * Verify table exists
 */
function verifyTableExists(db, tableName) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            [tableName],
            (err, row) => {
                if (err) reject(err);
                else resolve(!!row);
            }
        );
    });
}

/**
 * Verify column exists in table
 */
function verifyColumnExists(db, tableName, columnName) {
    return new Promise((resolve, reject) => {
        db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
            if (err) reject(err);
            else {
                const exists = rows.some(row => row.name === columnName);
                resolve(exists);
            }
        });
    });
}

/**
 * Verify index exists
 */
function verifyIndexExists(db, indexName) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT name FROM sqlite_master WHERE type='index' AND name=?",
            [indexName],
            (err, row) => {
                if (err) reject(err);
                else resolve(!!row);
            }
        );
    });
}

/**
 * Verify foreign key constraint
 */
function verifyForeignKey(db, tableName, foreignKeyColumn) {
    return new Promise((resolve, reject) => {
        db.all(`PRAGMA foreign_key_list(${tableName})`, (err, rows) => {
            if (err) reject(err);
            else {
                const exists = rows.some(row => row.from === foreignKeyColumn);
                resolve(exists);
            }
        });
    });
}

/**
 * Main verification function
 */
async function verifyDatabase() {
    console.log('=== Database Verification Started ===\n');
    
    // Check if database exists
    const fs = require('fs');
    if (!fs.existsSync(DB_PATH)) {
        console.error('ERROR: Database does not exist');
        console.log(`Expected path: ${DB_PATH}`);
        console.log('Run "npm run db:setup" to create the database.');
        process.exit(1);
    }
    
    console.log(`Database path: ${DB_PATH}`);
    
    // Connect to database
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            process.exit(1);
        }
        console.log('✓ Connected to database\n');
    });
    
    try {
        const errors = [];
        const warnings = [];
        
        // Define required tables with their required columns
        const requiredTables = {
            ayahs: ['id', 'surah', 'ayah', 'text', 'juz', 'marhala'],
            similarities: ['id', 'source_surah', 'source_ayah', 'target_surah', 'target_ayah', 'similarity_score'],
            users: ['id', 'username', 'email', 'password'],
            diary_logs: ['id', 'user_id', 'type', 'range_from', 'score'],
            tasks: ['id', 'user_id', 'title', 'category', 'status', 'date'],
            user_themes: ['id', 'user_id', 'theme_id', 'streak'],
            chat_sessions: ['id', 'user_id', 'title'],
            chat_messages: ['id', 'session_id', 'role', 'content'],
            coach_messages: ['id', 'user_id'],
            flashcard_sets: ['id', 'user_id', 'name'],
            flashcard_cards: ['id', 'set_id', 'front', 'back'],
            flashcard_questions: ['id', 'set_id', 'text'],
            flashcard_answers: ['id', 'user_id', 'question_id', 'user_answer'],
            heatmap_scores: ['id', 'user_id', 'sipara', 'page_number', 'score'],
            scheduler_events: ['id', 'user_id', 'title', 'start_time', 'end_time'],
            scheduler_revision_units: ['id', 'user_id', 'work_type', 'sipara'],
            scheduler_page_analysis: ['id', 'user_id', 'sipara', 'page'],
            scheduler_schedules: ['id', 'user_id', 'week_start', 'schedule']
        };
        
        // Define required indexes
        const requiredIndexes = [
            'idx_similarities_source',
            'idx_similarities_target',
            'idx_ayahs_juz',
            'idx_ayahs_page',
            'idx_diary_user_date',
            'idx_tasks_user_date',
            'idx_themes_user_active',
            'idx_heatmap_user_sipara',
            'idx_chat_sessions_user',
            'idx_chat_messages_session',
            'idx_coach_messages_user_date',
            'idx_flashcard_sets_user',
            'idx_flashcard_cards_set',
            'idx_flashcard_questions_set',
            'idx_flashcard_answers_user_question',
            'idx_scheduler_events_user',
            'idx_scheduler_events_active',
            'idx_revision_units_user',
            'idx_revision_units_work_type',
            'idx_revision_units_scheduled',
            'idx_revision_units_priority',
            'idx_page_analysis_user',
            'idx_page_analysis_sipara',
            'idx_scheduler_schedules_user_week'
        ];
        
        // Define required foreign keys
        const requiredForeignKeys = [
            { table: 'diary_logs', column: 'user_id' },
            { table: 'tasks', column: 'user_id' },
            { table: 'user_themes', column: 'user_id' },
            { table: 'chat_sessions', column: 'user_id' },
            { table: 'chat_messages', column: 'session_id' },
            { table: 'flashcard_sets', column: 'user_id' },
            { table: 'flashcard_cards', column: 'set_id' },
            { table: 'flashcard_questions', column: 'set_id' },
            { table: 'flashcard_answers', column: 'user_id' },
            { table: 'flashcard_answers', column: 'question_id' },
            { table: 'heatmap_scores', column: 'user_id' },
            { table: 'scheduler_events', column: 'user_id' },
            { table: 'scheduler_revision_units', column: 'user_id' },
            { table: 'scheduler_page_analysis', column: 'user_id' },
            { table: 'scheduler_schedules', column: 'user_id' }
        ];
        
        // Verify tables
        console.log('=== Verifying Tables ===');
        for (const [tableName, requiredColumns] of Object.entries(requiredTables)) {
            const tableExists = await verifyTableExists(db, tableName);
            if (!tableExists) {
                errors.push(`Missing table: ${tableName}`);
                console.error(`✗ Missing table: ${tableName}`);
            } else {
                console.log(`✓ Table exists: ${tableName}`);
                
                // Verify columns
                for (const column of requiredColumns) {
                    const columnExists = await verifyColumnExists(db, tableName, column);
                    if (!columnExists) {
                        errors.push(`Missing column: ${tableName}.${column}`);
                        console.error(`  ✗ Missing column: ${column}`);
                    } else {
                        console.log(`  ✓ Column exists: ${column}`);
                    }
                }
            }
        }
        
        // Verify indexes
        console.log('\n=== Verifying Indexes ===');
        for (const indexName of requiredIndexes) {
            const indexExists = await verifyIndexExists(db, indexName);
            if (!indexExists) {
                warnings.push(`Missing index: ${indexName}`);
                console.warn(`⚠ Missing index: ${indexName}`);
            } else {
                console.log(`✓ Index exists: ${indexName}`);
            }
        }
        
        // Verify foreign keys
        console.log('\n=== Verifying Foreign Keys ===');
        for (const { table, column } of requiredForeignKeys) {
            const fkExists = await verifyForeignKey(db, table, column);
            if (!fkExists) {
                warnings.push(`Missing foreign key: ${table}.${column}`);
                console.warn(`⚠ Missing foreign key: ${table}.${column}`);
            } else {
                console.log(`✓ Foreign key exists: ${table}.${column}`);
            }
        }
        
        // Print summary
        console.log('\n=== Verification Summary ===');
        console.log(`Tables checked: ${Object.keys(requiredTables).length}`);
        console.log(`Indexes checked: ${requiredIndexes.length}`);
        console.log(`Foreign keys checked: ${requiredForeignKeys.length}`);
        console.log(`Errors: ${errors.length}`);
        console.log(`Warnings: ${warnings.length}`);
        
        if (errors.length > 0) {
            console.log('\n=== Errors ===');
            errors.forEach(err => console.error(`  - ${err}`));
        }
        
        if (warnings.length > 0) {
            console.log('\n=== Warnings ===');
            warnings.forEach(warn => console.warn(`  - ${warn}`));
        }
        
        if (errors.length === 0 && warnings.length === 0) {
            console.log('\n✓ Database verification passed');
        } else if (errors.length === 0) {
            console.log('\n⚠ Database verification passed with warnings');
        } else {
            console.log('\n✗ Database verification failed');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('\n=== Verification Failed ===');
        console.error(error.message);
        process.exit(1);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('\n✓ Database connection closed');
            }
        });
    }
}

// Run verification if called directly
if (require.main === module) {
    verifyDatabase();
}

module.exports = { verifyDatabase };
