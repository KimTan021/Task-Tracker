-- V3__add_timelines.sql
-- Expand the task schema to include start dates for Timeline mapping.

ALTER TABLE task ADD task_start_date DATETIME NULL;
