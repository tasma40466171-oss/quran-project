-- Migration: Add has_seen_walkthrough column to users table
-- Run this to update existing databases

ALTER TABLE users ADD COLUMN has_seen_walkthrough INTEGER NOT NULL DEFAULT 0;
