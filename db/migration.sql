DROP SCHEMA IF EXISTS facilities;
CREATE SCHEMA facilities;

USE facilities;

CREATE TABLE properties (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE job_statuses (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE users (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(100) NOT NULL,
  `lastname` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE jobs (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `summary` VARCHAR(150) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `status_id` INT UNSIGNED NOT NULL,
  `property_id` INT UNSIGNED NOT NULL,
  `raised_by` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`status_id`) REFERENCES job_statuses(`id`),
  FOREIGN KEY (`property_id`) REFERENCES properties(`id`),
  FOREIGN KEY (`raised_by`) REFERENCES users(`id`)
);

CREATE VIEW v_jobs AS
SELECT
  jobs.id,
  jobs.summary AS `summary`,
  jobs.description AS `description`,
  jobs.status_id AS `status_id`,
  job_statuses.name AS `status_name`,
  jobs.property_id,
  properties.name AS `property_name`,
  users.id AS `raised_by_id`,
  users.firstname AS `raised_by_firstname`,
  users.lastname AS `raised_by_lastname`
FROM
  jobs
  INNER JOIN job_statuses ON job_statuses.id = jobs.status_id
  INNER JOIN properties ON properties.id = jobs.property_id
  INNER JOIN users ON users.id = jobs.raised_by
ORDER BY
  jobs.id DESC;

INSERT INTO job_statuses (`name`) VALUES
('Open'),
('In Progress'),
('Completed'),
('Cancelled');

INSERT INTO properties (`name`) VALUES ('Twitter Headquarters');
INSERT INTO properties (`name`) VALUES ('Amazon Headquarters');

INSERT INTO users (`firstname`, `lastname`) VALUES
('Elon', 'Musk'),
('Jeff', 'Bezos');

INSERT INTO jobs (`summary`, `description`, `status_id`, `property_id`, `raised_by`)
VALUES ('Remove unused desks from HQ', 'Due to recent staffing changes, there are a number of desks that need to be removed.', 1, 1, 1);
