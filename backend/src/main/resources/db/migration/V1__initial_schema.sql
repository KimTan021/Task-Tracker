CREATE TABLE IF NOT EXISTS `user` (
    user_id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(60) NOT NULL,
    user_email VARCHAR(512) NOT NULL,
    user_password VARCHAR(60) NOT NULL,
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_user_email (user_email)
);

CREATE TABLE IF NOT EXISTS project (
    project_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    project_name VARCHAR(45) NOT NULL,
    PRIMARY KEY (project_id),
    KEY idx_project_user_id (user_id),
    CONSTRAINT fk_project_user
        FOREIGN KEY (user_id)
        REFERENCES `user` (user_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS task (
    task_id INT NOT NULL AUTO_INCREMENT,
    project_id INT NOT NULL,
    task_name VARCHAR(45) NOT NULL,
    task_description VARCHAR(512) NULL,
    task_status BIT(1) NOT NULL,
    task_date_due DATETIME NULL,
    PRIMARY KEY (task_id),
    KEY idx_task_project_id (project_id),
    CONSTRAINT fk_task_project
        FOREIGN KEY (project_id)
        REFERENCES project (project_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
