-- =============================================================================
-- AirFlightsDB — Airline Flight Management System
-- =============================================================================
-- This script creates the database, tables, indexes, sample data, and queries.
-- Compatible with MySQL 8.0+. Run in MySQL Workbench, VS Code (MySQL extension),
-- or the mysql CLI.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CREATE DATABASE
-- -----------------------------------------------------------------------------
DROP DATABASE IF EXISTS AirFlightsDB;
CREATE DATABASE AirFlightsDB
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE AirFlightsDB;

-- =============================================================================
-- 2. CREATE TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: Pilots
-- Stores information about each pilot in the airline system.
-- One pilot can be assigned to multiple flights (1:N relationship with Flights).
-- -----------------------------------------------------------------------------
CREATE TABLE Pilots (
    pilot_id         INT          NOT NULL AUTO_INCREMENT,
    first_name       VARCHAR(50)  NOT NULL,
    last_name        VARCHAR(50)  NOT NULL,
    age              INT          NOT NULL,
    experience_years INT          NOT NULL,
    nationality      VARCHAR(50)  NOT NULL,
    co_pilot         VARCHAR(100) DEFAULT NULL COMMENT 'Name of the regular co-pilot partner, if any',

    PRIMARY KEY (pilot_id),

    CONSTRAINT chk_pilot_age CHECK (age >= 18),
    CONSTRAINT chk_pilot_experience CHECK (experience_years >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: Aircraft
-- Stores information about aircraft in the fleet.
-- One aircraft can be assigned to multiple flights (1:N relationship with Flights).
-- -----------------------------------------------------------------------------
CREATE TABLE Aircraft (
    aircraft_id      INT          NOT NULL AUTO_INCREMENT,
    type             VARCHAR(50)  NOT NULL COMMENT 'e.g. Airbus, Boeing, Embraer',
    model            VARCHAR(100) NOT NULL COMMENT 'e.g. A320, 737-800, E190',
    capacity         INT          NOT NULL COMMENT 'Maximum passenger capacity',
    manufacture_year YEAR         NOT NULL,
    ownership        ENUM('Private', 'Airline Company') NOT NULL,

    PRIMARY KEY (aircraft_id),

    CONSTRAINT chk_aircraft_capacity CHECK (capacity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: Crew
-- Stores information about cabin crew teams.
-- One crew team can be assigned to multiple flights (1:N relationship with Flights).
-- -----------------------------------------------------------------------------
CREATE TABLE Crew (
    crew_id          INT          NOT NULL AUTO_INCREMENT,
    crew_count       INT          NOT NULL COMMENT 'Total number of crew members in this team',
    chief_attendant  VARCHAR(100) NOT NULL COMMENT 'Full name of the chief flight attendant',
    crew_members     TEXT         NOT NULL COMMENT 'Comma-separated list of crew member names',

    PRIMARY KEY (crew_id),

    CONSTRAINT chk_crew_count CHECK (crew_count > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: Flights
-- Stores information about each flight.
-- References Pilots, Aircraft, and Crew via foreign keys.
-- -----------------------------------------------------------------------------
CREATE TABLE Flights (
    flight_id          INT          NOT NULL AUTO_INCREMENT,
    flight_number      VARCHAR(20)  NOT NULL COMMENT 'Unique flight number (e.g. FB1234, WZ6789)',
    departure_location VARCHAR(100) NOT NULL,
    arrival_location   VARCHAR(100) NOT NULL,
    departure_time     DATETIME     NOT NULL,
    arrival_time       DATETIME     NOT NULL,
    occupancy          INT          NOT NULL DEFAULT 0 COMMENT 'Number of passengers booked',
    airline            VARCHAR(100) NOT NULL,

    -- Foreign key columns
    pilot_id           INT          NOT NULL,
    aircraft_id        INT          NOT NULL,
    crew_id            INT          NOT NULL,

    PRIMARY KEY (flight_id),

    -- A flight number must be unique across the system
    CONSTRAINT uq_flight_number UNIQUE (flight_number),

    -- Each flight references exactly one pilot
    CONSTRAINT fk_flights_pilot
        FOREIGN KEY (pilot_id) REFERENCES Pilots (pilot_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    -- Each flight references exactly one aircraft
    CONSTRAINT fk_flights_aircraft
        FOREIGN KEY (aircraft_id) REFERENCES Aircraft (aircraft_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    -- Each flight references exactly one crew team
    CONSTRAINT fk_flights_crew
        FOREIGN KEY (crew_id) REFERENCES Crew (crew_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT chk_occupancy CHECK (occupancy >= 0),
    CONSTRAINT chk_flight_times CHECK (arrival_time > departure_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. INDEXES
-- =============================================================================
-- Indexes speed up searches on frequently queried columns.

-- Flights indexes
CREATE INDEX idx_flights_departure      ON Flights (departure_location);
CREATE INDEX idx_flights_arrival        ON Flights (arrival_location);
CREATE INDEX idx_flights_airline        ON Flights (airline);
CREATE INDEX idx_flights_departure_time ON Flights (departure_time);
CREATE INDEX idx_flights_pilot          ON Flights (pilot_id);
CREATE INDEX idx_flights_aircraft       ON Flights (aircraft_id);
CREATE INDEX idx_flights_crew           ON Flights (crew_id);

-- Pilots indexes
CREATE INDEX idx_pilots_last_name    ON Pilots (last_name);
CREATE INDEX idx_pilots_nationality  ON Pilots (nationality);

-- Aircraft indexes
CREATE INDEX idx_aircraft_type ON Aircraft (type);

-- =============================================================================
-- 4. SAMPLE DATA — Pilots (10 rows)
-- =============================================================================
INSERT INTO Pilots (first_name, last_name, age, experience_years, nationality, co_pilot) VALUES
('Georgi',    'Petrov',     45, 20, 'Bulgarian',  'Ivan Dimitrov'),
('Maria',     'Ivanova',    38, 15, 'Bulgarian',  NULL),
('John',      'Smith',      52, 28, 'British',    'Sarah Connor'),
('Lars',      'Müller',     41, 18, 'German',     NULL),
('Elena',     'Kuznetsova', 36, 12, 'Russian',    'Dmitri Volkov'),
('Ahmed',     'Al-Rashid',  48, 22, 'Emirati',    NULL),
('Carlos',    'Garcia',     44, 19, 'Spanish',    'Lucia Fernandez'),
('Anna',      'Nowak',      33, 10, 'Polish',     NULL),
('Pierre',    'Dubois',     50, 25, 'French',     'Marie Lefevre'),
('Dimitar',   'Hristov',    39, 14, 'Bulgarian',  NULL);

-- =============================================================================
-- 5. SAMPLE DATA — Aircraft (10 rows)
-- =============================================================================
INSERT INTO Aircraft (type, model, capacity, manufacture_year, ownership) VALUES
('Airbus',   'A320-200',  180, 2015, 'Airline Company'),
('Airbus',   'A321neo',   220, 2020, 'Airline Company'),
('Boeing',   '737-800',   189, 2017, 'Airline Company'),
('Boeing',   '787-9',     290, 2019, 'Airline Company'),
('Airbus',   'A380-800',  500, 2016, 'Airline Company'),
('Embraer',  'E190',      100, 2018, 'Private'),
('Boeing',   '777-300ER', 368, 2021, 'Airline Company'),
('Airbus',   'A220-300',  130, 2022, 'Airline Company'),
('Bombardier','CRJ900',    90, 2014, 'Private'),
('Airbus',   'A330-300',  277, 2018, 'Airline Company');

-- =============================================================================
-- 6. SAMPLE DATA — Crew (10 rows)
-- =============================================================================
INSERT INTO Crew (crew_count, chief_attendant, crew_members) VALUES
(5, 'Petia Stoyanova', 'Petia Stoyanova, Ivan Georgiev, Maria Todorova, Krasi Petrov, Elena Borisova'),
(4, 'John O''Brien',   'John O''Brien, Emma Walsh, Liam Murphy, Aoife Kelly'),
(6, 'Klaus Weber',     'Klaus Weber, Hanna Schmidt, Fritz Bauer, Greta Klein, Otto Fischer, Lena Hoffmann'),
(3, 'Sofia Torres',    'Sofia Torres, Miguel Santos, Ana Costa'),
(5, 'Elena Popova',    'Elena Popova, Andrei Smirnov, Olga Ivanova, Nikita Petrov, Tatiana Sokolova'),
(4, 'Fatima Hassan',   'Fatima Hassan, Omar Khalid, Layla Mansour, Hassan Ali'),
(5, 'Laura Rossi',     'Laura Rossi, Marco Bianchi, Giulia Romano, Antonio Ferrari, Sara Colombo'),
(3, 'Marta Krawczyk',  'Marta Krawczyk, Tomasz Lewandowski, Kamil Wisniewski'),
(4, 'Sophie Martin',   'Sophie Martin, Jean Dupont, Claire Leroy, Nicolas Petit'),
(5, 'Vesela Dimova',   'Vesela Dimova, Hristo Angelov, Neli Georgieva, Stefan Ivanov, Radostina Koleva');

-- =============================================================================
-- 7. SAMPLE DATA — Flights (10 rows)
-- =============================================================================
INSERT INTO Flights (flight_number, departure_location, arrival_location, departure_time, arrival_time, occupancy, airline, pilot_id, aircraft_id, crew_id) VALUES
('FB1234', 'Sofia',        'London Heathrow', '2026-07-15 08:30:00', '2026-07-15 10:15:00', 156, 'Bulgaria Air',       1,  1,  1),
('FB5678', 'Sofia',        'Frankfurt',       '2026-07-15 14:00:00', '2026-07-15 15:45:00', 132, 'Bulgaria Air',       2,  3,  2),
('WZ3210', 'London Luton', 'Sofia',           '2026-07-16 06:15:00', '2026-07-16 11:30:00', 180, 'Wizz Air',           3,  2,  3),
('LH9876', 'Frankfurt',    'New York JFK',    '2026-07-16 10:00:00', '2026-07-16 13:30:00', 278, 'Lufthansa',          4,  4,  4),
('FB4321', 'Sofia',        'Paris CDG',       '2026-07-17 07:00:00', '2026-07-17 09:00:00', 98,  'Bulgaria Air',       5,  6,  5),
('EK2468', 'Dubai',        'London Heathrow', '2026-07-17 02:30:00', '2026-07-17 06:45:00', 345, 'Emirates',           6,  5,  6),
('FR1357', 'Madrid',       'Rome Fiumicino',  '2026-07-18 11:45:00', '2026-07-18 13:30:00', 175, 'Ryanair',            7,  7,  7),
('LO8642', 'Warsaw',       'Sofia',           '2026-07-18 15:20:00', '2026-07-18 17:10:00', 85,  'LOT Polish Airlines',8,  8,  8),
('AF7531', 'Paris CDG',    'Sofia',           '2026-07-19 18:00:00', '2026-07-19 21:30:00', 110, 'Air France',         9,  9,  9),
('FB2468', 'Sofia',        'Vienna',          '2026-07-20 06:00:00', '2026-07-20 07:15:00', 120, 'Bulgaria Air',       10, 10, 10);

-- =============================================================================
-- 8. SAMPLE QUERIES
-- =============================================================================

-- 8.1. List all flights with pilot names
--       Joins Flights with Pilots to show the pilot's full name for each flight.
SELECT
    f.flight_number,
    f.departure_location,
    f.arrival_location,
    f.departure_time,
    f.arrival_time,
    f.airline,
    CONCAT(p.first_name, ' ', p.last_name) AS pilot_name
FROM Flights f
JOIN Pilots p ON f.pilot_id = p.pilot_id
ORDER BY f.departure_time;

-- 8.2. List flights by airline
--       Shows all flights grouped by airline with count.
SELECT
    airline,
    COUNT(*)          AS total_flights,
    SUM(occupancy)    AS total_passengers,
    AVG(occupancy)    AS avg_occupancy
FROM Flights
GROUP BY airline
ORDER BY total_flights DESC;

-- 8.3. Show aircraft assigned to flights
--       Joins Flights with Aircraft to see which aircraft serves each flight.
SELECT
    f.flight_number,
    a.type,
    a.model,
    a.capacity,
    a.manufacture_year,
    a.ownership
FROM Flights f
JOIN Aircraft a ON f.aircraft_id = a.aircraft_id
ORDER BY f.departure_time;

-- 8.4. Show crew assigned to flights
--       Joins Flights with Crew to see crew details for each flight.
SELECT
    f.flight_number,
    f.airline,
    c.crew_count,
    c.chief_attendant,
    c.crew_members
FROM Flights f
JOIN Crew c ON f.crew_id = c.crew_id
ORDER BY f.departure_time;

-- 8.5. Show flights between two locations (Sofia and London)
--       Filters flights where departure = 'Sofia' and arrival = 'London Heathrow'
--       (or vice versa — searches both directions).
SELECT
    flight_number,
    departure_location,
    arrival_location,
    departure_time,
    arrival_time,
    airline
FROM Flights
WHERE (departure_location = 'Sofia' AND arrival_location = 'London Heathrow')
   OR (departure_location = 'London Heathrow' AND arrival_location = 'Sofia')
ORDER BY departure_time;

-- 8.6. Show flights ordered by departure time
--       Lists all upcoming flights sorted chronologically.
SELECT
    flight_number,
    departure_location,
    arrival_location,
    departure_time,
    arrival_time,
    airline,
    occupancy
FROM Flights
ORDER BY departure_time;

-- 8.7. Additional query — flights with full details (pilot + aircraft + crew)
--       Combines all three joins for a complete flight overview.
SELECT
    f.flight_number,
    f.departure_location,
    f.arrival_location,
    f.departure_time,
    f.arrival_time,
    f.occupancy,
    f.airline,
    CONCAT(p.first_name, ' ', p.last_name) AS pilot_name,
    p.nationality                           AS pilot_nationality,
    CONCAT(a.type, ' ', a.model)           AS aircraft,
    a.capacity,
    c.chief_attendant,
    c.crew_count
FROM Flights f
JOIN Pilots   p ON f.pilot_id    = p.pilot_id
JOIN Aircraft a ON f.aircraft_id = a.aircraft_id
JOIN Crew     c ON f.crew_id     = c.crew_id
ORDER BY f.departure_time;

-- 8.8. Additional query — pilot flight log
--       Shows how many flights each pilot has and total hours flown.
SELECT
    CONCAT(p.first_name, ' ', p.last_name) AS pilot_name,
    p.nationality,
    COUNT(*)                                AS flight_count,
    SEC_TO_TIME(
        SUM(TIMESTAMPDIFF(SECOND, f.departure_time, f.arrival_time))
    )                                       AS total_flight_time
FROM Pilots p
LEFT JOIN Flights f ON p.pilot_id = f.pilot_id
GROUP BY p.pilot_id
ORDER BY flight_count DESC;

-- =============================================================================
-- 9. UPDATE EXAMPLES
-- =============================================================================

-- Update occupancy after a booking is made on flight FB1234
UPDATE Flights
SET occupancy = occupancy + 1
WHERE flight_number = 'FB1234';

-- Update pilot experience after a training milestone
UPDATE Pilots
SET experience_years = experience_years + 1
WHERE pilot_id = 1;

-- Change the chief attendant on crew team 3
UPDATE Crew
SET chief_attendant = 'Friedrich Neumann'
WHERE crew_id = 3;

-- =============================================================================
-- 10. DELETE EXAMPLES
-- =============================================================================

-- Delete a flight that was cancelled (soft delete approach via status column is
-- recommended in production, but here we demonstrate a hard DELETE).
-- NOTE: This will fail if foreign key RESTRICT is violated, but since Flights
--       is the child table, direct deletion is allowed.
DELETE FROM Flights
WHERE flight_number = 'FB2468'
  AND departure_time > NOW();

-- Delete a pilot record (will fail if the pilot still has flights assigned,
-- demonstrating the RESTRICT foreign key constraint).
-- Uncomment to test:
-- DELETE FROM Pilots WHERE pilot_id = 1;

-- =============================================================================
-- END OF SCRIPT
-- =============================================================================
