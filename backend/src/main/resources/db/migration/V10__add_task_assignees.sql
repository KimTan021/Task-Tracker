CREATE TABLE task_assignee (
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (task_id, user_id),
    CONSTRAINT fk_task_assignee_task FOREIGN KEY (task_id) REFERENCES task (task_id) ON DELETE CASCADE,
    CONSTRAINT fk_task_assignee_user FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE
);

INSERT INTO task_assignee (task_id, user_id)
SELECT task_id, assignee_id
FROM task
WHERE assignee_id IS NOT NULL;

ALTER TABLE task
    MODIFY COLUMN assignee_name VARCHAR(512) NULL;
