CREATE TABLE IF NOT EXISTS project_invitation (
    project_invitation_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    invited_user_id INT NOT NULL,
    invited_by_user_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_invitation_project FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_invitation_invited_user FOREIGN KEY (invited_user_id) REFERENCES `user`(user_id),
    CONSTRAINT fk_project_invitation_invited_by_user FOREIGN KEY (invited_by_user_id) REFERENCES `user`(user_id),
    CONSTRAINT uk_project_invitation_project_user UNIQUE (project_id, invited_user_id)
);

CREATE INDEX idx_project_invitation_invited_user_status
    ON project_invitation (invited_user_id, status);

CREATE INDEX idx_project_invitation_project_status
    ON project_invitation (project_id, status);
