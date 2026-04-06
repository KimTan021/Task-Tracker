-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema trackerdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema trackerdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `trackerdb` DEFAULT CHARACTER SET utf8 ;
USE `trackerdb` ;

-- -----------------------------------------------------
-- Table `trackerdb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trackerdb`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(60) NOT NULL,
  `user_email` VARCHAR(512) NOT NULL,
  `user_password` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trackerdb`.`project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trackerdb`.`project` (
  `project_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `project_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`project_id`),
  INDEX `upfk_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `upfk`
    FOREIGN KEY (`user_id`)
    REFERENCES `trackerdb`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trackerdb`.`task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trackerdb`.`task` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `task_name` VARCHAR(45) NOT NULL,
  `task_description` VARCHAR(512) NULL,
  `task_status` BIT(1) NOT NULL,
  `task_date_due` DATETIME NULL,
  PRIMARY KEY (`task_id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


ALTER TABLE `trackerdb`.`task` 
ADD INDEX `tpfk_idx` (`project_id` ASC) VISIBLE;
;
ALTER TABLE `trackerdb`.`task` 
ADD CONSTRAINT `tpfk`
  FOREIGN KEY (`project_id`)
  REFERENCES `trackerdb`.`project` (`project_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


-- =====================================================
-- SEED DATA FOR trackerdb
-- =====================================================

USE `trackerdb`;

-- -----------------------------------------------------
-- Users (3)
-- -----------------------------------------------------
INSERT INTO `user` (`user_id`, `user_name`, `user_email`, `user_password`) VALUES
(1, 'Alice Reyes',   'alice@example.com', 'hashed_pw_alice'),
(2, 'Bruno Santos',  'bruno@example.com', 'hashed_pw_bruno'),
(3, 'Clara Mendoza', 'clara@example.com', 'hashed_pw_clara');


-- -----------------------------------------------------
-- Projects (1 for Alice, 2 for Bruno, 2 for Clara)
-- -----------------------------------------------------
INSERT INTO `project` (`project_id`, `user_id`, `project_name`) VALUES
(1, 1, 'Personal Portfolio'),
(2, 2, 'E-Commerce Platform'),
(3, 2, 'Internal CRM Tool'),
(4, 3, 'Mobile Wellness App'),
(5, 3, 'Company Blog Redesign');


-- -----------------------------------------------------
-- Tasks
-- -----------------------------------------------------
INSERT INTO `task` (`task_id`, `project_id`, `task_name`, `task_description`, `task_status`, `task_date_due`) VALUES

-- Alice > Personal Portfolio (project_id = 1)
(1,  1, 'Design Wireframes',       'Sketch out all page layouts',              b'0', '2026-04-15 17:00:00'),
(2,  1, 'Set Up Hosting',          'Configure domain and server environment',  b'1', '2026-04-10 12:00:00'),
(3,  1, 'Write About Me Section',  'Draft bio and professional summary',       b'0', '2026-04-20 17:00:00'),

-- Bruno > E-Commerce Platform (project_id = 2)
(4,  2, 'Define Product Schema',   'Model products, variants, and inventory',  b'1', '2026-03-28 10:00:00'),
(5,  2, 'Integrate Payment API',   'Set up Stripe checkout flow',              b'0', '2026-04-25 17:00:00'),
(6,  2, 'Build Cart UI',           'Implement add-to-cart and summary page',   b'0', '2026-04-30 17:00:00'),

-- Bruno > Internal CRM Tool (project_id = 3)
(7,  3, 'Map Out User Roles',      'Define admin, manager, and rep roles',     b'1', '2026-04-05 09:00:00'),
(8,  3, 'Create Lead Pipeline',    'Build lead stages and drag-drop board',    b'0', '2026-05-01 17:00:00'),
(9,  3, 'Export to CSV Feature',   'Allow data export from contact views',     b'0', '2026-05-10 17:00:00'),

-- Clara > Mobile Wellness App (project_id = 4)
(10, 4, 'Set Up React Native',     'Initialize project and configure deps',    b'1', '2026-03-20 10:00:00'),
(11, 4, 'Build Habit Tracker UI',  'Daily habit checklist with streak count',  b'0', '2026-04-22 17:00:00'),
(12, 4, 'Integrate Push Notifs',   'Schedule daily reminder notifications',    b'0', '2026-05-05 17:00:00'),

-- Clara > Company Blog Redesign (project_id = 5)
(13, 5, 'Audit Existing Content',  'Review and categorize all current posts',  b'1', '2026-04-01 12:00:00'),
(14, 5, 'Design New Layout',       'Create responsive blog template',          b'0', '2026-04-18 17:00:00'),
(15, 5, 'Migrate Old Posts',       'Port content to new CMS structure',        b'0', '2026-05-15 17:00:00');

INSERT INTO `user` (`user_id`, `user_name`, `user_email`, `user_password`) VALUES
(1, 'Alice Reyes',   'alice@example.com', '$2b$12$/YqfXCr.VSu5ArAU0ccs8.ltyBdya9QJnEH.C94trK5Avz8xPV6dy'),
(2, 'Bruno Santos',  'bruno@example.com', '$2b$12$yO1y9ItPbmHjto2YCxH1jutNr.9dgwmcYjPNUYub/r875E99A/lnC'),
(3, 'Clara Mendoza', 'clara@example.com', '$2b$12$mt1OhJhgAHRdZRaYY.9A6OWsGJuiGFau1B1v4aMB.b98gNHConnOu')
AS new_values
ON DUPLICATE KEY UPDATE
    `user_password` = new_values.`user_password`;