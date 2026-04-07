CREATE TABLE IF NOT EXISTS project_co_owner (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_pco_project FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE,
    CONSTRAINT fk_pco_user FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE
);
