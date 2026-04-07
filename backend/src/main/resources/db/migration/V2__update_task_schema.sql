-- V2__update_task_schema.sql
-- Safely convert task_status from BIT to VARCHAR
-- And add priority and tags columns.

-- 1. Add temporary column as VARCHAR
ALTER TABLE task ADD task_status_str VARCHAR(20);

-- 2. Migrate existing data (0 -> 'todo', 1 -> 'completed')
UPDATE task SET task_status_str = 'completed' WHERE task_status = 1;
UPDATE task SET task_status_str = 'todo' WHERE task_status = 0;

-- 3. In case any nulls somehow exist, default them to 'todo'
UPDATE task SET task_status_str = 'todo' WHERE task_status_str IS NULL;

-- 4. Drop old bit column
ALTER TABLE task DROP COLUMN task_status;

-- 5. Rename new column back to task_status
ALTER TABLE task CHANGE task_status_str task_status VARCHAR(20) NOT NULL;

-- 6. Add priority and tags
ALTER TABLE task ADD task_priority VARCHAR(20) DEFAULT 'Medium';
ALTER TABLE task ADD task_tags VARCHAR(255) NULL;
