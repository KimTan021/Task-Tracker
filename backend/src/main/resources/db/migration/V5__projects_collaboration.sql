-- V5__projects_collaboration.sql
-- Create project_member table for collaboration
CREATE TABLE IF NOT EXISTS project_member (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE,
    CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE
);

-- Update task table to include assignee_id
ALTER TABLE task
ADD COLUMN assignee_id INT NULL,
ADD CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_id) REFERENCES `user` (user_id) ON DELETE SET NULL;

-- Automatically add project owners to their own projects as members
INSERT INTO project_member (project_id, user_id)
SELECT project_id, user_id FROM project;
