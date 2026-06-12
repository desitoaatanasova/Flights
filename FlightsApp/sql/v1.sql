-- AirFlightsDB — full fresh schema for Flights_app
USE Flights_app;

DROP TABLE IF EXISTS Flights, Crew, Aircraft, Pilots, Airlines;

-- ── Airlines ──────────────────────────────────────────
CREATE TABLE Airlines (
    airline_id    INT          NOT NULL AUTO_INCREMENT,
    airline_name  VARCHAR(100) NOT NULL,
    iata_code     CHAR(2)      NOT NULL,
    logo_url      VARCHAR(255) DEFAULT NULL,
    country       VARCHAR(50)  NOT NULL,
    fleet_size    INT          NOT NULL DEFAULT 0,
    hub_airport   VARCHAR(100) NOT NULL,
    founded_year  YEAR         NOT NULL,
    description   TEXT         DEFAULT NULL,
    PRIMARY KEY (airline_id),
    UNIQUE KEY uq_airline_iata (iata_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Pilots ────────────────────────────────────────────
CREATE TABLE Pilots (
    pilot_id         INT          NOT NULL AUTO_INCREMENT,
    first_name       VARCHAR(50)  NOT NULL,
    last_name        VARCHAR(50)  NOT NULL,
    age              INT          NOT NULL,
    experience_years INT          NOT NULL,
    nationality      VARCHAR(50)  NOT NULL,
    co_pilot         VARCHAR(100) DEFAULT NULL,
    license_number   VARCHAR(50)  DEFAULT NULL,
    avatar_url       VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (pilot_id),
    UNIQUE KEY uq_pilot_license (license_number),
    KEY idx_pilots_last_name (last_name),
    KEY idx_pilots_nationality (nationality),
    CONSTRAINT chk_pilot_age CHECK (age >= 18),
    CONSTRAINT chk_pilot_experience CHECK (experience_years >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Aircraft ──────────────────────────────────────────
CREATE TABLE Aircraft (
    aircraft_id      INT          NOT NULL AUTO_INCREMENT,
    type             VARCHAR(50)  NOT NULL,
    model            VARCHAR(100) NOT NULL,
    capacity         INT          NOT NULL,
    manufacture_year YEAR         NOT NULL,
    ownership        ENUM('Private', 'Airline Company') NOT NULL,
    registration     VARCHAR(20)  DEFAULT NULL,
    engine_type      VARCHAR(50)  DEFAULT NULL,
    range_km         INT          DEFAULT NULL,
    image_url        VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (aircraft_id),
    UNIQUE KEY uq_aircraft_registration (registration),
    KEY idx_aircraft_type (type),
    CONSTRAINT chk_aircraft_capacity CHECK (capacity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Crew ──────────────────────────────────────────────
CREATE TABLE Crew (
    crew_id         INT          NOT NULL AUTO_INCREMENT,
    crew_count      INT          NOT NULL,
    certification   VARCHAR(50)  DEFAULT NULL,
    language_skills JSON         DEFAULT NULL,
    chief_attendant VARCHAR(100) NOT NULL,
    crew_members    TEXT         NOT NULL,
    PRIMARY KEY (crew_id),
    CONSTRAINT chk_crew_count CHECK (crew_count > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Flights ───────────────────────────────────────────
CREATE TABLE Flights (
    flight_id          INT          NOT NULL AUTO_INCREMENT,
    airline_id         INT          NOT NULL,
    flight_number      VARCHAR(20)  NOT NULL,
    departure_location VARCHAR(100) NOT NULL,
    arrival_location   VARCHAR(100) NOT NULL,
    departure_time     DATETIME     NOT NULL,
    arrival_time       DATETIME     NOT NULL,
    occupancy          INT          NOT NULL DEFAULT 0,
    status             ENUM('scheduled','active','landed','delayed','cancelled') NOT NULL DEFAULT 'scheduled',
    latitude           DECIMAL(10,7) DEFAULT NULL,
    longitude          DECIMAL(10,7) DEFAULT NULL,
    pilot_id           INT          NOT NULL,
    aircraft_id        INT          NOT NULL,
    crew_id            INT          NOT NULL,
    PRIMARY KEY (flight_id),
    UNIQUE KEY uq_flight_number (flight_number),
    KEY idx_flights_departure (departure_location),
    KEY idx_flights_arrival (arrival_location),
    KEY idx_flights_departure_time (departure_time),
    KEY idx_flights_status (status),
    KEY idx_flights_airline_id (airline_id),
    CONSTRAINT fk_flights_airline   FOREIGN KEY (airline_id)   REFERENCES Airlines (airline_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_flights_pilot     FOREIGN KEY (pilot_id)     REFERENCES Pilots   (pilot_id)   ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_flights_aircraft  FOREIGN KEY (aircraft_id)  REFERENCES Aircraft (aircraft_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_flights_crew      FOREIGN KEY (crew_id)      REFERENCES Crew     (crew_id)    ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_occupancy CHECK (occupancy >= 0),
    CONSTRAINT chk_flight_times CHECK (arrival_time > departure_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed data ─────────────────────────────────────────

INSERT INTO Airlines (airline_name, iata_code, logo_url, country, fleet_size, hub_airport, founded_year, description) VALUES
('Lufthansa','LH','https://download.logo.wine/logo/Lufthansa/Lufthansa-Logo.wine.png','Germany',300,'Frankfurt Airport',1953,'Largest German airline, flag carrier of Germany'),
('British Airways','BA','https://mediacentre.britishairways.com/contents/archives/216/86/images/thumb1280x1683_width/britishairways_21686125301575_thumb.jpg','UK',280,'London Heathrow',1974,'Flag carrier of the United Kingdom'),
('Emirates','EK','https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo-1985-1999.png','UAE',260,'Dubai International',1985,'Largest airline in the Middle East, based in Dubai'),
('Qatar Airways','QR','https://logos-world.net/wp-content/uploads/2020/03/Qatar-Airways-Logo.png','Qatar',200,'Hamad International',1993,'Flag carrier of Qatar'),
('Bulgaria Air','FB','https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bulgaria_Air_logo.svg/3840px-Bulgaria_Air_logo.svg.png','Bulgaria',35,'Sofia Airport',2002,'Flag carrier of Bulgaria'),
('Air France','AF','https://www.pixartprinting.it/blog/wp-content/uploads/2020/09/2-2.jpg','France',250,'Paris Charles de Gaulle',1933,'Flag carrier of France'),
('Turkish Airlines','TK','https://cdn.turkishairlines.com/asset/8e28f8dd-7327-41c1-b248-51242c65b3af/THY_0038_RENKLI-c-CIFT-SATIR-YATAY-TIRE.webp','Turkey',370,'Istanbul Airport',1933,'Flag carrier of Turkey'),
('Wizz Air','W6','https://download.logo.wine/logo/Wizz_Air/Wizz_Air-Logo.wine.png','Hungary',180,'Budapest Ferenc Liszt',2003,'Hungarian ultra-low-cost carrier'),
('Delta Air Lines','DL','https://deltamuseum.org/images/site/research/delta-brand/logos/16-9-logos/2000to2004_delta_logo_vector1.webp','USA',900,'Atlanta International',1925,'Major US airline, headquartered in Atlanta'),
('Japan Airlines','JL','https://1000logos.net/wp-content/uploads/2021/04/Japan-Airlines-logo.png','Japan',225,'Tokyo Haneda',1951,'Flag carrier of Japan');

INSERT INTO Pilots (first_name, last_name, age, experience_years, nationality, co_pilot, license_number, avatar_url) VALUES
('Georgi','Petrov',45,21,'Bulgarian','Ivan Dimitrov','ATP-0001','https://ui-avatars.com/api/?name=Georgi+Petrov&background=random&format=png'),
('Maria','Ivanova',38,15,'Bulgarian',NULL,'ATP-0002','https://ui-avatars.com/api/?name=Maria+Ivanova&background=random&format=png'),
('John','Smith',52,28,'British','Sarah Connor','ATP-0003','https://ui-avatars.com/api/?name=John+Smith&background=random&format=png'),
('Lars','Müller',41,18,'German',NULL,'ATP-0004','https://ui-avatars.com/api/?name=Lars+M%C3%BCller&background=random&format=png'),
('Elena','Kuznetsova',36,12,'Russian','Dmitri Volkov','ATP-0005','https://ui-avatars.com/api/?name=Elena+Kuznetsova&background=random&format=png'),
('Ahmed','Al-Rashid',48,22,'Emirati',NULL,'ATP-0006','https://ui-avatars.com/api/?name=Ahmed+Al-Rashid&background=random&format=png'),
('Carlos','Garcia',44,19,'Spanish','Lucia Fernandez','ATP-0007','https://ui-avatars.com/api/?name=Carlos+Garcia&background=random&format=png'),
('Anna','Nowak',33,10,'Polish',NULL,'ATP-0008','https://ui-avatars.com/api/?name=Anna+Nowak&background=random&format=png'),
('Pierre','Dubois',50,25,'French','Marie Lefevre','ATP-0009','https://ui-avatars.com/api/?name=Pierre+Dubois&background=random&format=png'),
('Dimitar','Hristov',39,14,'Bulgarian',NULL,'ATP-0010','https://ui-avatars.com/api/?name=Dimitar+Hristov&background=random&format=png');

INSERT INTO Aircraft (type, model, capacity, manufacture_year, ownership, registration, engine_type, range_km, image_url) VALUES
('Airbus','A320-200',180,2015,'Airline Company','LZ-001','Turbofan',6100,'https://upload.wikimedia.org/wikipedia/commons/c/c1/Airbus_A320-214%2C_Airbus_Industrie_JP7617615.jpg'),
('Airbus','A321neo',220,2020,'Airline Company','LZ-002','Turbofan',7400,'https://www.flightsimlabs.com/wp-content/uploads/2025/06/img-53-1024x563.jpg'),
('Boeing','737-800',189,2017,'Airline Company','LZ-003','Turbofan',5436,'https://upload.wikimedia.org/wikipedia/commons/f/ff/Delta_Boeing_737-800_N371DA_departing_Boston_June_2025.jpg'),
('Boeing','787-9',290,2019,'Airline Company','LZ-004','Turbofan',14140,'https://upload.wikimedia.org/wikipedia/commons/4/4e/Boeing_787_N1015B_ANA_Airlines_%2827611880663%29_%28cropped%29.jpg'),
('Airbus','A380-800',500,2016,'Airline Company','LZ-005','Turbofan',15200,'https://www.singaporeair.com/content/dam/sia/web-assets/images/flying-withus/our-story/our-fleet/airbus-a380-800/airbus-a380-800-nav.jpg'),
('Embraer','E190',100,2018,'Private','LZ-006','Turbojet',4445,'https://upload.wikimedia.org/wikipedia/commons/b/b3/Wider%C3%B8e%2C_LN-WEA%2C_Embraer_E190-E2_%40_HEL.jpg'),
('Boeing','777-300ER',368,2021,'Airline Company','LZ-007','Turbofan',13650,'https://img.static-kl.com/transform/e5e58f73-8daa-4b08-ae6b-a91ca9f62d5d/'),
('Airbus','A220-300',130,2022,'Airline Company','LZ-008','Turbofan',6112,'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Airbus_A220-300.jpg/1280px-Airbus_A220-300.jpg'),
('Bombardier','CRJ900',90,2014,'Private','LZ-009','Turbojet',2871,'https://miro.medium.com/1*ec0DzW4phzkcXUudzbx9RA.jpeg'),
('Airbus','A330-300',277,2018,'Airline Company','LZ-010','Turbofan',11750,'https://images.aircharterservice.com/global/aircraft-guide/group-charter/airbus-a330-300-1.jpg');

INSERT INTO Crew (crew_count, certification, language_skills, chief_attendant, crew_members) VALUES
(5,'Cabin Crew Attestation','["Bulgarian", "English", "Russian"]','Petia Stoyanova','Petia Stoyanova, Ivan Georgiev, Maria Todorova, Krasi Petrov, Elena Borisova'),
(4,'Cabin Crew Attestation','["English", "Irish", "French"]','John O''Brien','John O''Brien, Emma Walsh, Liam Murphy, Aoife Kelly'),
(6,'Cabin Crew Attestation','["German", "English", "Spanish"]','Friedrich Neumann','Klaus Weber, Hanna Schmidt, Fritz Bauer, Greta Klein, Otto Fischer, Lena Hoffmann'),
(3,'Cabin Crew Attestation','["Spanish", "English", "Portuguese"]','Sofia Torres','Sofia Torres, Miguel Santos, Ana Costa'),
(5,'Cabin Crew Attestation','["Russian", "English", "German"]','Elena Popova','Elena Popova, Andrei Smirnov, Olga Ivanova, Nikita Petrov, Tatiana Sokolova'),
(4,'Cabin Crew Attestation','["Arabic", "English", "Hindi"]','Fatima Hassan','Fatima Hassan, Omar Khalid, Layla Mansour, Hassan Ali'),
(5,'Cabin Crew Attestation','["Italian", "English", "French"]','Laura Rossi','Laura Rossi, Marco Bianchi, Giulia Romano, Antonio Ferrari, Sara Colombo'),
(3,'Cabin Crew Attestation','["Polish", "English", "German"]','Marta Krawczyk','Marta Krawczyk, Tomasz Lewandowski, Kamil Wisniewski'),
(4,'Cabin Crew Attestation','["French", "English", "Italian"]','Sophie Martin','Sophie Martin, Jean Dupont, Claire Leroy, Nicolas Petit'),
(5,'Cabin Crew Attestation','["Bulgarian", "English", "Greek"]','Vesela Dimova','Vesela Dimova, Hristo Angelov, Neli Georgieva, Stefan Ivanov, Radostina Koleva');

INSERT INTO Flights (airline_id, flight_number, departure_location, arrival_location, departure_time, arrival_time, occupancy, status, latitude, longitude, pilot_id, aircraft_id, crew_id) VALUES
(1,'LH1001','Frankfurt, Germany','London, United Kingdom','2026-06-15 08:00:00','2026-06-15 09:30:00',162,'scheduled',50.0333000,8.5706000,1,1,1),
(2,'BA2045','London, United Kingdom','Paris, France','2026-06-15 10:15:00','2026-06-15 11:30:00',175,'active',51.4700000,-0.4543000,2,2,2),
(3,'EK3308','Dubai, UAE','Tokyo, Japan','2026-06-15 13:00:00','2026-06-16 02:10:00',301,'active',25.2532000,55.3656000,3,3,3),
(4,'QR4512','Doha, Qatar','New York, USA','2026-06-15 07:30:00','2026-06-15 15:45:00',287,'active',25.2854000,51.5310000,4,4,4),
(5,'FB5876','Sofia, Bulgaria','Rome, Italy','2026-06-15 09:00:00','2026-06-15 10:40:00',108,'scheduled',42.6965000,23.4114000,5,5,5),
(6,'AF6123','Paris, France','Madrid, Spain','2026-06-15 14:20:00','2026-06-15 16:10:00',134,'landed',49.0097000,2.5479000,6,6,6),
(7,'TK7021','Istanbul, Turkey','Berlin, Germany','2026-06-15 12:00:00','2026-06-15 14:20:00',182,'delayed',41.2750000,28.7483000,7,7,7),
(8,'W68124','Budapest, Hungary','Barcelona, Spain','2026-06-15 16:45:00','2026-06-15 19:30:00',170,'scheduled',47.4393000,19.2619000,8,8,8),
(9,'DL9237','Atlanta, USA','Los Angeles, USA','2026-06-15 11:00:00','2026-06-15 13:45:00',356,'active',33.6407000,-84.4277000,9,9,9),
(10,'JL1048','Tokyo, Japan','Singapore','2026-06-15 18:30:00','2026-06-16 00:50:00',272,'cancelled',35.5494000,139.7798000,10,10,10);
