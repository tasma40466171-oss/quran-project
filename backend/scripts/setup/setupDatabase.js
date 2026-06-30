// scripts/setup/setupDatabase.js
"use strict";

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Configuration
const DB_PATH = path.join(__dirname, '../../database/quran_similarity.db');
const SCHEMA_DIR = path.join(__dirname, '../../database/schema');
const MIGRATIONS_DIR = path.join(__dirname, '../../database/migrations');
const SEEDS_DIR = path.join(__dirname, '../../database/seeds');

/**
 * Execute SQL file against database
 */
function executeSqlFile(db, filePath) {
    return new Promise((resolve, reject) => {
        console.log(`Executing: ${path.basename(filePath)}`);
        
        const sql = fs.readFileSync(filePath, 'utf8');
        
        db.exec(sql, (err) => {
            if (err) {
                console.error(`Error executing ${path.basename(filePath)}:`, err.message);
                reject(err);
            } else {
                console.log(`✓ Completed: ${path.basename(filePath)}`);
                resolve();
            }
        });
    });
}

/**
 * Get all SQL files from a directory, sorted by name
 */
function getSqlFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return [];
    }
    
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.sql'))
        .sort();
}

/**
 * Verify tables exist
 */
function verifyTables(db) {
    return new Promise((resolve, reject) => {
        console.log('\n=== Verifying Tables ===');
        
        const requiredTables = [
            'ayahs',
            'similarities',
            'users',
            'diary_logs',
            'tasks',
            'user_themes',
            'chat_sessions',
            'chat_messages',
            'coach_messages',
            'flashcard_sets',
            'flashcard_cards',
            'flashcard_questions',
            'flashcard_answers',
            'heatmap_scores',
            'scheduler_events',
            'scheduler_revision_units',
            'scheduler_page_analysis',
            'scheduler_schedules'
        ];
        
        db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            
            const existingTables = rows.map(row => row.name);
            const missingTables = requiredTables.filter(table => !existingTables.includes(table));
            
            if (missingTables.length > 0) {
                console.error('Missing tables:', missingTables);
                reject(new Error('Missing required tables'));
            } else {
                console.log(`✓ All ${requiredTables.length} required tables exist`);
                resolve();
            }
        });
    });
}

/**
 * Main setup function
 */
async function setupDatabase() {
    console.log('=== Database Setup Started ===\n');
    
    // Create database directory if it doesn't exist
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`Created directory: ${dbDir}`);
    }
    
    // Connect to database
    console.log(`Database path: ${DB_PATH}`);
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            process.exit(1);
        }
        console.log('✓ Connected to database\n');
    });
    
    try {
        // Enable foreign keys
        await new Promise((resolve, reject) => {
            db.run("PRAGMA foreign_keys = ON", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('✓ Foreign keys enabled\n');
        
        // Execute schema
        console.log('=== Executing Schema ===');
        const schemaFiles = getSqlFiles(SCHEMA_DIR);
        for (const file of schemaFiles) {
            await executeSqlFile(db, path.join(SCHEMA_DIR, file));
        }
        
        // Execute migrations
        console.log('\n=== Executing Migrations ===');
        const migrationFiles = getSqlFiles(MIGRATIONS_DIR);
        for (const file of migrationFiles) {
            await executeSqlFile(db, path.join(MIGRATIONS_DIR, file));
        }
        
        // Execute seeds
        console.log('\n=== Executing Seeds ===');
        const seedFiles = getSqlFiles(SEEDS_DIR);
        if (seedFiles.length > 0) {
            for (const file of seedFiles) {
                await executeSqlFile(db, path.join(SEEDS_DIR, file));
            }
        } else {
            console.log('No seed files found');
        }
        
        // Verify tables
        await verifyTables(db);
        
        console.log('\n=== Database Setup Complete ===');
        console.log(`Database created at: ${DB_PATH}`);
        
    } catch (error) {
        console.error('\n=== Setup Failed ===');
        console.error(error.message);
        process.exit(1);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('✓ Database connection closed');
            }
        });
    }
}

// Run setup if called directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase };
