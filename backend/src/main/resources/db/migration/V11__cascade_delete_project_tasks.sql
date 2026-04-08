ALTER TABLE task
DROP FOREIGN KEY fk_task_project;

ALTER TABLE task
ADD CONSTRAINT fk_task_project
    FOREIGN KEY (project_id)
    REFERENCES project (project_id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;
