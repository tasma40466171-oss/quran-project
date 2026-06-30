# Master Schema Documentation

## Overview

This document provides a complete overview of the database schema including all tables, relationships, indexes, and constraints.

## Entity Relationship Diagram (Text-Based)

```
users (1) ────────────< (N) diary_logs
users (1) ────────────< (N) tasks
users (1) ────────────< (N) user_themes
users (1) ────────────< (N) chat_sessions
users (1) ────────────< (N) coach_messages
users (1) ────────────< (N) flashcard_sets
users (1) ────────────< (N) flashcard_answers
users (1) ────────────< (N) heatmap_scores
users (1) ────────────< (N) scheduler_events
users (1) ────────────< (N) scheduler_revision_units
users (1) ────────────< (N) scheduler_page_analysis
users (1) ────────────< (N) scheduler_schedules

chat_sessions (1) ────────< (N) chat_messages
flashcard_sets (1) ────────< (N) flashcard_cards
flashcard_sets (1) ────────< (N) flashcard_questions
flashcard_questions (1) ──< (N) flashcard_answers

ayahs (standalone)
similarities (standalone)
```

## Tables

### Core Quran Data

#### ayahs
Stores Quran ayah (verse) data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| surah | INTEGER | NOT NULL | Surah number (1-114) |
| ayah | INTEGER | NOT NULL | Ayah number within surah |
| text | TEXT | NOT NULL | Arabic text of the ayah |
| juz | INTEGER | NOT NULL | Juz number (1-30) |
| marhala | TEXT | NOT NULL | Marhala/level classification |
| name | TEXT | - | Surah name |
| page | INTEGER | - | Page number in standard Mushaf |

**Indexes:**
- `idx_ayahs_juz` on (juz)
- `idx_ayahs_page` on (page)

**Constraints:**
- UNIQUE(surah, ayah)

#### similarities
Stores mutashabihat (similar verses) relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| source_surah | INTEGER | NOT NULL | Source surah number |
| source_ayah | INTEGER | NOT NULL | Source ayah number |
| source_page | INTEGER | - | Source page number |
| target_surah | INTEGER | NOT NULL | Target surah number |
| target_ayah | INTEGER | NOT NULL | Target ayah number |
| target_page | INTEGER | - | Target page number |
| similarity_score | REAL | NOT NULL | Similarity score (0-1) |
| tips | TEXT | DEFAULT '[]' | JSON array of memory tips |

**Indexes:**
- `idx_similarities_source` on (source_surah, source_ayah)
- `idx_similarities_target` on (target_surah, target_ayah)

**Constraints:**
- UNIQUE(source_surah, source_ayah, target_surah, target_ayah)

### User Management

#### users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| username | TEXT | UNIQUE NOT NULL | Username |
| email | TEXT | UNIQUE NOT NULL | Email address |
| password | TEXT | NOT NULL | Hashed password |
| has_seen_walkthrough | INTEGER | NOT NULL DEFAULT 0 | Walkthrough completion flag |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

### Diary & Progress

#### diary_logs
Stores user's memorization diary entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| type | TEXT | NOT NULL CHECK | Entry type (murajah, tasmee, ikhtebar, jadeed, Juz_Hali) |
| range_from | TEXT | NOT NULL | Start of range (e.g., "1:1") |
| range_to | TEXT | NOT NULL DEFAULT '' | End of range |
| score | INTEGER | NOT NULL CHECK | Score (0-10) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Entry timestamp |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Indexes:**
- `idx_diary_user_date` on (user_id, created_at)

#### tasks
Stores user's memorization tasks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| title | TEXT | NOT NULL | Task title |
| category | TEXT | NOT NULL CHECK | Category (murajah, jadeed, Juz_Hali, tasmee, general) |
| status | TEXT | NOT NULL DEFAULT 'pending' CHECK | Status (pending, in_progress, completed) |
| date | TEXT | NOT NULL | Due date |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Indexes:**
- `idx_tasks_user_date` on (user_id, date)

#### user_themes
Stores user theme/streak information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| theme_id | TEXT | NOT NULL | Theme identifier |
| streak | INTEGER | NOT NULL DEFAULT 0 | Current streak |
| max_streak | INTEGER | NOT NULL DEFAULT 0 | Maximum streak achieved |
| frozen_streak | INTEGER | NOT NULL DEFAULT 0 | Frozen streak count |
| last_log_date | TEXT | - | Last activity date |
| is_active | INTEGER | NOT NULL DEFAULT 0 | Active flag |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Constraints:**
- UNIQUE(user_id, theme_id)

**Indexes:**
- `idx_themes_user_active` on (user_id, is_active)

#### heatmap_scores
Stores user's heatmap/progress scores by sipara.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| sipara | INTEGER | NOT NULL | Sipara number (1-30) |
| page_number | INTEGER | NOT NULL | Page number within sipara |
| quran_page | INTEGER | NOT NULL | Actual Quran page number |
| score | REAL | NOT NULL | Progress score |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Constraints:**
- UNIQUE(user_id, sipara, page_number)

**Indexes:**
- `idx_heatmap_user_sipara` on (user_id, sipara)

### Coach Features

#### chat_sessions
Stores coach chat sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| title | TEXT | NOT NULL DEFAULT 'New Session' | Session title |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Indexes:**
- `idx_chat_sessions_user` on (user_id, updated_at)

#### chat_messages
Stores messages within chat sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| session_id | INTEGER | NOT NULL FK | Reference to chat_sessions.id |
| role | TEXT | NOT NULL CHECK | Role (user, assistant) |
| content | TEXT | NOT NULL | Message content |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp |

**Foreign Keys:**
- session_id → chat_sessions(id) ON DELETE CASCADE

**Indexes:**
- `idx_chat_messages_session` on (session_id, created_at)

#### coach_messages
Legacy table for coach messages (compatibility).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Indexes:**
- `idx_coach_messages_user_date` on (user_id, created_at)

### Flashcards

#### flashcard_sets
Stores user-created flashcard sets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| name | TEXT | NOT NULL | Set name |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Indexes:**
- `idx_flashcard_sets_user` on (user_id)

#### flashcard_cards
Stores cards within flashcard sets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| set_id | INTEGER | NOT NULL FK | Reference to flashcard_sets.id |
| front | TEXT | NOT NULL | Front side content |
| back | TEXT | NOT NULL | Back side content |

**Foreign Keys:**
- set_id → flashcard_sets(id) ON DELETE CASCADE

**Indexes:**
- `idx_flashcard_cards_set` on (set_id)

#### flashcard_questions
Stores questions within flashcard sets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| set_id | INTEGER | NOT NULL FK | Reference to flashcard_sets.id |
| text | TEXT | NOT NULL | Question text |
| answer | TEXT | - | Answer text |
| is_fixed | INTEGER | NOT NULL DEFAULT 0 | Fixed question flag |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- set_id → flashcard_sets(id) ON DELETE CASCADE

**Indexes:**
- `idx_flashcard_questions_set` on (set_id)

#### flashcard_answers
Stores user answers to flashcard questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| question_id | INTEGER | NOT NULL FK | Reference to flashcard_questions.id |
| user_answer | TEXT | NOT NULL | User's answer |
| is_correct | INTEGER | - | Correctness flag |
| answered_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Answer timestamp |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE
- question_id → flashcard_questions(id) ON DELETE CASCADE

**Indexes:**
- `idx_flashcard_answers_user_question` on (user_id, question_id)

### Scheduler

#### scheduler_events
Stores scheduled events for time management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier (UUID) |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| title | TEXT | NOT NULL | Event title |
| category | TEXT | NOT NULL | Event category |
| start_time | TEXT | NOT NULL | Start time |
| end_time | TEXT | NOT NULL | End time |
| duration | INTEGER | NOT NULL | Duration in minutes |
| days_of_week | TEXT | NOT NULL | Days of week (JSON array) |
| recurrence | TEXT | NOT NULL DEFAULT 'none' | Recurrence pattern |
| is_fixed | INTEGER | NOT NULL DEFAULT 0 | Fixed event flag |
| priority | TEXT | NOT NULL DEFAULT 'medium' | Priority level |
| location | TEXT | - | Location |
| notes | TEXT | - | Additional notes |
| created_at | INTEGER | NOT NULL | Creation timestamp (Unix) |
| updated_at | INTEGER | NOT NULL | Update timestamp (Unix) |
| is_active | INTEGER | NOT NULL DEFAULT 1 | Active flag |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Indexes:**
- `idx_scheduler_events_user` on (user_id)
- `idx_scheduler_events_active` on (user_id, is_active)

#### scheduler_revision_units
Stores generated revision units for scheduling.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier (UUID) |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| work_type | TEXT | NOT NULL | Type of work (murajah, jadeed, etc.) |
| sipara | INTEGER | NOT NULL | Sipara number |
| pages | TEXT | NOT NULL | Pages (JSON array) |
| page_range | TEXT | - | Page range description |
| aqmos_quality | TEXT | NOT NULL | AQMOS quality assessment |
| aqmos_score | REAL | NOT NULL | AQMOS score |
| revision_method | TEXT | - | Recommended revision method |
| revision_steps | TEXT | - | Revision steps (JSON) |
| estimated_time | INTEGER | NOT NULL | Estimated time (minutes) |
| min_time | INTEGER | NOT NULL | Minimum time |
| max_time | INTEGER | NOT NULL | Maximum time |
| priority | REAL | NOT NULL | Priority score |
| priority_factors | TEXT | - | Priority factors (JSON) |
| is_splittable | INTEGER | NOT NULL DEFAULT 1 | Can be split flag |
| is_scheduled | INTEGER | NOT NULL DEFAULT 0 | Scheduled flag |
| scheduled_slots | TEXT | - | Scheduled slots (JSON) |
| requires_units | TEXT | - | Required units (JSON) |
| conflicts_with | TEXT | - | Conflicts (JSON) |
| generated_at | INTEGER | NOT NULL | Generation timestamp (Unix) |
| scheduled_at | INTEGER | - | Scheduling timestamp (Unix) |
| completed_at | INTEGER | - | Completion timestamp (Unix) |
| is_active | INTEGER | NOT NULL DEFAULT 1 | Active flag |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Indexes:**
- `idx_revision_units_user` on (user_id)
- `idx_revision_units_work_type` on (user_id, work_type)
- `idx_revision_units_scheduled` on (user_id, is_scheduled)
- `idx_revision_units_priority` on (user_id, priority)

#### scheduler_page_analysis
Stores page-level analysis for scheduling.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier (UUID) |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| sipara | INTEGER | NOT NULL | Sipara number |
| page | INTEGER | NOT NULL | Page number |
| aqmos_quality | TEXT | NOT NULL | AQMOS quality |
| aqmos_score | REAL | NOT NULL | AQMOS score |
| mistake_pattern | TEXT | - | Mistake patterns (JSON) |
| weakness_areas | TEXT | - | Weakness areas (JSON) |
| last_revision_date | INTEGER | - | Last revision timestamp (Unix) |
| days_since_revision | INTEGER | - | Days since last revision |
| revision_count | INTEGER | DEFAULT 0 | Total revision count |
| average_score | REAL | - | Average score |
| score_trend | TEXT | - | Score trend |
| consecutive_weak_pages | INTEGER | DEFAULT 0 | Consecutive weak pages |
| consecutive_good_pages | INTEGER | DEFAULT 0 | Consecutive good pages |
| base_time_estimate | INTEGER | NOT NULL | Base time estimate |
| time_adjustment | INTEGER | DEFAULT 0 | Time adjustment |
| final_time_estimate | INTEGER | NOT NULL | Final time estimate |
| analyzed_at | INTEGER | NOT NULL | Analysis timestamp (Unix) |
| updated_at | INTEGER | NOT NULL | Update timestamp (Unix) |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Constraints:**
- UNIQUE(user_id, sipara, page)

**Indexes:**
- `idx_page_analysis_user` on (user_id)
- `idx_page_analysis_sipara` on (user_id, sipara)

#### scheduler_schedules
Stores generated weekly schedules.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier (UUID) |
| user_id | INTEGER | NOT NULL FK | Reference to users.id |
| week_start | INTEGER | NOT NULL | Week start timestamp (Unix) |
| schedule | TEXT | NOT NULL | Schedule data (JSON) |
| generated_at | INTEGER | NOT NULL | Generation timestamp (Unix) |
| algorithm_version | TEXT | NOT NULL | Algorithm version |
| weekly_workload | TEXT | - | Weekly workload (JSON) |
| conflicts | TEXT | - | Conflicts (JSON) |
| warnings | TEXT | - | Warnings (JSON) |

**Foreign Keys:**
- user_id → users(id) ON DELETE CASCADE

**Indexes:**
- `idx_scheduler_schedules_user_week` on (user_id, week_start)

## Foreign Key Relationships Summary

| Child Table | Foreign Key | Parent Table | On Delete |
|-------------|-------------|--------------|-----------|
| diary_logs | user_id | users | CASCADE |
| tasks | user_id | users | CASCADE |
| user_themes | user_id | users | CASCADE |
| chat_sessions | user_id | users | CASCADE |
| coach_messages | user_id | users | CASCADE |
| flashcard_sets | user_id | users | CASCADE |
| flashcard_answers | user_id | users | CASCADE |
| heatmap_scores | user_id | users | CASCADE |
| scheduler_events | user_id | users | CASCADE |
| scheduler_revision_units | user_id | users | CASCADE |
| scheduler_page_analysis | user_id | users | CASCADE |
| scheduler_schedules | user_id | users | CASCADE |
| chat_messages | session_id | chat_sessions | CASCADE |
| flashcard_cards | set_id | flashcard_sets | CASCADE |
| flashcard_questions | set_id | flashcard_sets | CASCADE |
| flashcard_answers | question_id | flashcard_questions | CASCADE |

## Index Summary

### Performance Indexes

- `idx_similarities_source` - Fast lookup of similarities by source ayah
- `idx_similarities_target` - Fast lookup of similarities by target ayah
- `idx_ayahs_juz` - Fast lookup of ayahs by juz
- `idx_ayahs_page` - Fast lookup of ayahs by page
- `idx_diary_user_date` - Fast diary queries by user and date
- `idx_tasks_user_date` - Fast task queries by user and date
- `idx_themes_user_active` - Fast active theme lookup
- `idx_heatmap_user_sipara` - Fast heatmap queries by user and sipara
- `idx_chat_sessions_user` - Fast session lookup by user
- `idx_chat_messages_session` - Fast message lookup by session
- `idx_coach_messages_user_date` - Fast coach message lookup
- `idx_flashcard_sets_user` - Fast flashcard set lookup by user
- `idx_flashcard_cards_set` - Fast card lookup by set
- `idx_flashcard_questions_set` - Fast question lookup by set
- `idx_flashcard_answers_user_question` - Fast answer lookup
- `idx_scheduler_events_user` - Fast event lookup by user
- `idx_scheduler_events_active` - Fast active event lookup
- `idx_revision_units_user` - Fast revision unit lookup by user
- `idx_revision_units_work_type` - Fast revision unit lookup by type
- `idx_revision_units_scheduled` - Fast scheduled unit lookup
- `idx_revision_units_priority` - Fast priority-based lookup
- `idx_page_analysis_user` - Fast page analysis lookup by user
- `idx_page_analysis_sipara` - Fast page analysis lookup by sipara
- `idx_scheduler_schedules_user_week` - Fast schedule lookup by user and week

## Unique Constraints

| Table | Columns | Purpose |
|-------|---------|---------|
| ayahs | (surah, ayah) | Prevent duplicate ayah entries |
| similarities | (source_surah, source_ayah, target_surah, target_ayah) | Prevent duplicate similarity pairs |
| users | username | Unique usernames |
| users | email | Unique email addresses |
| user_themes | (user_id, theme_id) | One theme per user per theme_id |
| heatmap_scores | (user_id, sipara, page_number) | One score per user per sipara page |
| scheduler_page_analysis | (user_id, sipara, page) | One analysis per user per page |

## Check Constraints

| Table | Column | Constraint |
|-------|--------|-------------|
| diary_logs | type | CHECK(type IN ('murajah','tasmee','ikhtebar','jadeed','Juz_Hali')) |
| diary_logs | score | CHECK(score >= 0 AND score <= 10) |
| tasks | category | CHECK(category IN ('murajah','jadeed','Juz_Hali','tasmee','general')) |
| tasks | status | CHECK(status IN ('pending','in_progress','completed')) |
| chat_messages | role | CHECK(role IN ('user', 'assistant')) |

## Data Types Used

- **INTEGER** - Primary keys, foreign keys, numeric data
- **TEXT** - Strings, JSON data, large text fields
- **REAL** - Floating point numbers (scores, similarity scores)
- **DATETIME** - Timestamps (SQLite stores as TEXT/INTEGER)
- **BOOLEAN** - Stored as INTEGER (0/1)

## Notes

- All user-related tables use CASCADE delete for automatic cleanup
- Timestamps use SQLite's CURRENT_TIMESTAMP or Unix timestamps
- JSON data is stored as TEXT fields
- Foreign keys are enabled with `PRAGMA foreign_keys = ON`
- All tables use `IF NOT EXISTS` for safe re-execution
