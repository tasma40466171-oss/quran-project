// scripts/maintenance/resetDatabase.js
"use strict";

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Configuration
const DB_PATH = path.join(__dirname, '../../database/quran_similarity.db');

/**
 * Drop all tables safely
 */
function dropAllTables(db) {
    return new Promise((resolve, reject) => {
        console.log('=== Dropping All Tables ===');
        
        // Disable foreign keys temporarily to allow dropping
        db.run("PRAGMA foreign_keys = OFF", (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            // Get all tables
            db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const dropPromises = rows.map(row => {
                    return new Promise((resolveDrop, rejectDrop) => {
                        const dropSql = `DROP TABLE IF EXISTS ${row.name}`;
                        db.run(dropSql, (err) => {
                            if (err) {
                                console.error(`Error dropping ${row.name}:`, err.message);
                                rejectDrop(err);
                            } else {
                                console.log(`✓ Dropped: ${row.name}`);
                                resolveDrop();
                            }
                        });
                    });
                });
                
                Promise.all(dropPromises)
                    .then(() => {
                        // Re-enable foreign keys
                        db.run("PRAGMA foreign_keys = ON", (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    })
                    .catch(reject);
            });
        });
    });
}

/**
 * Reset database
 */
async function resetDatabase(force = false) {
    console.log('=== Database Reset Started ===\n');
    
    // Check force flag
    if (!force) {
        console.log('ERROR: Reset requires --force flag');
        console.log('Usage: npm run db:reset -- --force');
        console.log('\nThis will delete ALL data. Use with caution.');
        process.exit(1);
    }
    
    console.log('WARNING: This will delete ALL data in the database!');
    console.log('Database path:', DB_PATH);
    console.log('');
    
    // Check if database exists
    if (!fs.existsSync(DB_PATH)) {
        console.log('Database does not exist. Nothing to reset.');
        console.log('Run "npm run db:setup" to create the database.');
        process.exit(0);
    }
    
    // Connect to database
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            process.exit(1);
        }
        console.log('✓ Connected to database\n');
    });
    
    try {
        // Drop all tables
        await dropAllTables(db);
        
        console.log('\n=== All Tables Dropped ===');
        
        // Close connection
        await new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        console.log('✓ Database connection closed');
        
        // Delete database file
        fs.unlinkSync(DB_PATH);
        console.log('✓ Database file deleted');
        
        console.log('\n=== Database Reset Complete ===');
        console.log('Run "npm run db:setup" to recreate the database.');
        
    } catch (error) {
        console.error('\n=== Reset Failed ===');
        console.error(error.message);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const forceFlag = args.includes('--force');

// Run reset if called directly
if (require.main === module) {
    resetDatabase(forceFlag);
}

module.exports = { resetDatabase };
