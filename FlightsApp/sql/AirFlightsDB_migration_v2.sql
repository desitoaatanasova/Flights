-- =============================================================================
-- AirFlightsDB Migration v2 — Airlines table, status, lat/lng, new columns
-- =============================================================================
-- Run this AFTER AirFlightsDB.sql (v1) to add the new schema for AeroTrack.
-- =============================================================================

USE AirFlightsDB;

-- ---------------------------------------------------------------------------
-- 0. Clean up any partial state from previous failed runs
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS Airlines;

-- ---------------------------------------------------------------------------
-- 1. New table: Airlines
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Airlines (
    airline_id   INT          NOT NULL AUTO_INCREMENT,
    airline_name VARCHAR(100) NOT NULL,
    iata_code    CHAR(2)      NOT NULL,
    logo_url     VARCHAR(255) DEFAULT NULL,
    country      VARCHAR(50)  NOT NULL,
    fleet_size   INT          NOT NULL DEFAULT 0,
    hub_airport  VARCHAR(100) NOT NULL,
    founded_year YEAR         NOT NULL,
    description  TEXT         DEFAULT NULL,

    PRIMARY KEY (airline_id),
    CONSTRAINT uq_airline_iata UNIQUE (iata_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 2. Add new columns to Pilots
-- ---------------------------------------------------------------------------
ALTER TABLE Pilots
    ADD COLUMN license_number VARCHAR(50) DEFAULT NULL AFTER co_pilot,
    ADD COLUMN avatar_url     VARCHAR(255) DEFAULT NULL AFTER license_number,
    ADD CONSTRAINT uq_pilot_license UNIQUE (license_number);

-- ---------------------------------------------------------------------------
-- 3. Add new columns to Aircraft
-- ---------------------------------------------------------------------------
ALTER TABLE Aircraft
    ADD COLUMN registration  VARCHAR(20)  DEFAULT NULL AFTER ownership,
    ADD COLUMN engine_type   VARCHAR(50)  DEFAULT NULL AFTER registration,
    ADD COLUMN range_km      INT          DEFAULT NULL AFTER engine_type,
    ADD COLUMN image_url     VARCHAR(255) DEFAULT NULL AFTER range_km,
    ADD CONSTRAINT uq_aircraft_registration UNIQUE (registration);

-- ---------------------------------------------------------------------------
-- 4. Alter Crew — add certification, language_skills; change crew_members to JSON
-- ---------------------------------------------------------------------------
ALTER TABLE Crew
    ADD COLUMN certification   VARCHAR(50) DEFAULT NULL AFTER crew_count,
    ADD COLUMN language_skills JSON        DEFAULT NULL AFTER certification;

-- crew_members is already TEXT; we'll keep it as TEXT for backward compat
-- and read/write as JSON string in the backend

-- ---------------------------------------------------------------------------
-- 5. Alter Flights — add airline_id, status, lat/lng; remove old airline column
-- ---------------------------------------------------------------------------
ALTER TABLE Flights
    ADD COLUMN airline_id INT DEFAULT NULL AFTER flight_id,
    ADD COLUMN status     ENUM('scheduled','active','landed','delayed','cancelled')
                          NOT NULL DEFAULT 'scheduled' AFTER occupancy,
    ADD COLUMN latitude   DECIMAL(10,7) DEFAULT NULL AFTER status,
    ADD COLUMN longitude  DECIMAL(10,7) DEFAULT NULL AFTER latitude,
    ADD INDEX idx_flights_status (status);

-- ---------------------------------------------------------------------------
-- 6. Populate Airlines from existing Flights.airline data
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO Airlines (airline_name, iata_code, country, fleet_size, hub_airport, founded_year)
SELECT DISTINCT
    f.airline,
    CASE f.airline
        WHEN 'Bulgaria Air'        THEN 'FB'
        WHEN 'Wizz Air'            THEN 'W6'
        WHEN 'Lufthansa'           THEN 'LH'
        WHEN 'Emirates'            THEN 'EK'
        WHEN 'Ryanair'             THEN 'FR'
        WHEN 'LOT Polish Airlines' THEN 'LO'
        WHEN 'Air France'          THEN 'AF'
        ELSE 'XX'
    END,
    CASE f.airline
        WHEN 'Bulgaria Air'        THEN 'Bulgaria'
        WHEN 'Wizz Air'            THEN 'Hungary'
        WHEN 'Lufthansa'           THEN 'Germany'
        WHEN 'Emirates'            THEN 'UAE'
        WHEN 'Ryanair'             THEN 'Ireland'
        WHEN 'LOT Polish Airlines' THEN 'Poland'
        WHEN 'Air France'          THEN 'France'
        ELSE 'Unknown'
    END,
    CASE f.airline
        WHEN 'Bulgaria Air'        THEN 35
        WHEN 'Wizz Air'            THEN 180
        WHEN 'Lufthansa'           THEN 300
        WHEN 'Emirates'            THEN 260
        WHEN 'Ryanair'             THEN 300
        WHEN 'LOT Polish Airlines' THEN 80
        WHEN 'Air France'          THEN 250
        ELSE 0
    END,
    CASE f.airline
        WHEN 'Bulgaria Air'        THEN 'Sofia Airport'
        WHEN 'Wizz Air'            THEN 'Budapest Ferenc Liszt'
        WHEN 'Lufthansa'           THEN 'Frankfurt Airport'
        WHEN 'Emirates'            THEN 'Dubai International'
        WHEN 'Ryanair'             THEN 'Dublin Airport'
        WHEN 'LOT Polish Airlines' THEN 'Warsaw Chopin'
        WHEN 'Air France'          THEN 'Paris Charles de Gaulle'
        ELSE 'Unknown'
    END,
    CASE f.airline
        WHEN 'Bulgaria Air'        THEN 2002
        WHEN 'Wizz Air'            THEN 2003
        WHEN 'Lufthansa'           THEN 1953
        WHEN 'Emirates'            THEN 1985
        WHEN 'Ryanair'             THEN 1984
        WHEN 'LOT Polish Airlines' THEN 1929
        WHEN 'Air France'          THEN 1933
        ELSE 2000
    END
FROM Flights f;

-- Update descriptions
UPDATE Airlines SET description = 'Flag carrier of Bulgaria, headquartered at Sofia Airport' WHERE iata_code = 'FB';
UPDATE Airlines SET description = 'Hungarian ultra-low-cost carrier serving mostly Europe and the Middle East' WHERE iata_code = 'W6';
UPDATE Airlines SET description = 'Largest German airline, flag carrier of Germany' WHERE iata_code = 'LH';
UPDATE Airlines SET description = 'Largest airline in the Middle East, based in Dubai' WHERE iata_code = 'EK';
UPDATE Airlines SET description = 'Largest low-cost carrier in Europe, headquartered in Dublin' WHERE iata_code = 'FR';
UPDATE Airlines SET description = 'Flag carrier of Poland, one of the world''s oldest airlines' WHERE iata_code = 'LO';
UPDATE Airlines SET description = 'Flag carrier of France, subsidiary of Air France-KLM Group' WHERE iata_code = 'AF';

-- ---------------------------------------------------------------------------
-- 7. Update Flights.airline_id based on airline name
-- ---------------------------------------------------------------------------
UPDATE Flights f
JOIN Airlines a ON (
    CASE f.airline
        WHEN 'Bulgaria Air'        THEN 'FB'
        WHEN 'Wizz Air'            THEN 'W6'
        WHEN 'Lufthansa'           THEN 'LH'
        WHEN 'Emirates'            THEN 'EK'
        WHEN 'Ryanair'             THEN 'FR'
        WHEN 'LOT Polish Airlines' THEN 'LO'
        WHEN 'Air France'          THEN 'AF'
    END = a.iata_code
)
SET f.airline_id = a.airline_id;

-- ---------------------------------------------------------------------------
-- 8. Make airline_id NOT NULL and add FK, then drop the old airline column
-- ---------------------------------------------------------------------------
ALTER TABLE Flights
    MODIFY COLUMN airline_id INT NOT NULL,
    ADD CONSTRAINT fk_flights_airline
        FOREIGN KEY (airline_id) REFERENCES Airlines (airline_id)
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE Flights
    DROP COLUMN airline;

-- ---------------------------------------------------------------------------
-- 9. Update pilots with license numbers and avatar URLs
-- ---------------------------------------------------------------------------
UPDATE Pilots SET license_number = CONCAT('ATP-', LPAD(pilot_id, 4, '0')) WHERE license_number IS NULL;

-- ---------------------------------------------------------------------------
-- 10. Update aircraft with registration, engine, range
-- ---------------------------------------------------------------------------
UPDATE Aircraft SET
    registration  = CONCAT('LZ-', LPAD(aircraft_id, 3, '0')),
    engine_type   = CASE WHEN type IN ('Airbus','Boeing') THEN 'Turbofan' ELSE 'Turbojet' END,
    range_km      = CASE model
                        WHEN 'A320-200'  THEN 6100
                        WHEN 'A321neo'   THEN 7400
                        WHEN '737-800'   THEN 5436
                        WHEN '787-9'     THEN 14140
                        WHEN 'A380-800'  THEN 15200
                        WHEN 'E190'      THEN 4445
                        WHEN '777-300ER' THEN 13650
                        WHEN 'A220-300'  THEN 6112
                        WHEN 'CRJ900'    THEN 2871
                        WHEN 'A330-300'  THEN 11750
                        ELSE 5000
                    END
WHERE registration IS NULL;

-- ---------------------------------------------------------------------------
-- 11. Update crew with certifications and language skills
-- ---------------------------------------------------------------------------
UPDATE Crew SET
    certification = 'Cabin Crew Attestation'
WHERE certification IS NULL;

UPDATE Crew SET
    language_skills = CASE crew_id
        WHEN 1 THEN JSON_ARRAY('Bulgarian', 'English', 'Russian')
        WHEN 2 THEN JSON_ARRAY('English', 'Irish', 'French')
        WHEN 3 THEN JSON_ARRAY('German', 'English', 'Spanish')
        WHEN 4 THEN JSON_ARRAY('Spanish', 'English', 'Portuguese')
        WHEN 5 THEN JSON_ARRAY('Russian', 'English', 'German')
        WHEN 6 THEN JSON_ARRAY('Arabic', 'English', 'Hindi')
        WHEN 7 THEN JSON_ARRAY('Italian', 'English', 'French')
        WHEN 8 THEN JSON_ARRAY('Polish', 'English', 'German')
        WHEN 9 THEN JSON_ARRAY('French', 'English', 'Italian')
        WHEN 10 THEN JSON_ARRAY('Bulgarian', 'English', 'Greek')
    END
WHERE language_skills IS NULL;

-- ---------------------------------------------------------------------------
-- 12. Update flights with statuses and coordinates
-- ---------------------------------------------------------------------------
UPDATE Flights SET status = 'scheduled' WHERE status IS NULL;

UPDATE Flights SET
    latitude  = CASE departure_location
                    WHEN 'Sofia'          THEN 42.6965
                    WHEN 'London Heathrow' THEN 51.4700
                    WHEN 'Frankfurt'      THEN 50.0333
                    WHEN 'London Luton'   THEN 51.8744
                    WHEN 'New York JFK'   THEN 40.6413
                    WHEN 'Paris CDG'      THEN 49.0097
                    WHEN 'Dubai'          THEN 25.2532
                    WHEN 'Madrid'         THEN 40.4983
                    WHEN 'Rome Fiumicino' THEN 41.8003
                    WHEN 'Warsaw'         THEN 52.1657
                    WHEN 'Vienna'         THEN 48.1103
                    ELSE 42.0000
                END,
    longitude = CASE departure_location
                    WHEN 'Sofia'          THEN 23.4114
                    WHEN 'London Heathrow' THEN -0.4543
                    WHEN 'Frankfurt'      THEN 8.5706
                    WHEN 'London Luton'   THEN -0.3683
                    WHEN 'New York JFK'   THEN -73.7781
                    WHEN 'Paris CDG'      THEN 2.5479
                    WHEN 'Dubai'          THEN 55.3656
                    WHEN 'Madrid'         THEN -3.5670
                    WHEN 'Rome Fiumicino' THEN 12.2389
                    WHEN 'Warsaw'         THEN 20.9671
                    WHEN 'Vienna'         THEN 16.5691
                    ELSE 23.0000
                END;

-- =============================================================================
-- Indexes for new columns
-- =============================================================================
CREATE INDEX idx_flights_airline_id ON Flights (airline_id);
CREATE INDEX idx_pilots_license     ON Pilots (license_number);
CREATE INDEX idx_aircraft_reg       ON Aircraft (registration);

-- =============================================================================
-- Verify the migration
-- =============================================================================
SELECT 'Airlines created' AS status, COUNT(*) AS count FROM Airlines
UNION ALL
SELECT 'Pilots updated', COUNT(*) FROM Pilots WHERE license_number IS NOT NULL
UNION ALL
SELECT 'Aircraft updated', COUNT(*) FROM Aircraft WHERE registration IS NOT NULL
UNION ALL
SELECT 'Crew updated', COUNT(*) FROM Crew WHERE certification IS NOT NULL
UNION ALL
SELECT 'Flights with airline_id', COUNT(*) FROM Flights WHERE airline_id IS NOT NULL
UNION ALL
SELECT 'Flights with status', COUNT(*) FROM Flights WHERE status IS NOT NULL;
