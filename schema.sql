CREATE DATABASE IF NOT EXISTS local_rock_events;
USE local_rock_events;

CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  location VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS bands (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  founded_year INT
);

CREATE TABLE IF NOT EXISTS people (
  id VARCHAR(10) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  id_number VARCHAR(20) NOT NULL UNIQUE,
  age INT NULL,
  age_type VARCHAR(20) NOT NULL DEFAULT 'unknown'
);

CREATE TABLE IF NOT EXISTS event_bands (
  event_id VARCHAR(10) NOT NULL,
  band_id VARCHAR(10) NOT NULL,
  PRIMARY KEY (event_id, band_id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (band_id) REFERENCES bands(id)
);

CREATE TABLE IF NOT EXISTS attendances (
  id VARCHAR(10) PRIMARY KEY,
  person_id VARCHAR(10) NOT NULL,
  event_id VARCHAR(10) NOT NULL,
  FOREIGN KEY (person_id) REFERENCES people(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
