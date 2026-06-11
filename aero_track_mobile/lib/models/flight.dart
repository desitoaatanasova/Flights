import 'airline.dart';

class PilotInfo {
  final int pilotId;
  final String firstName;
  final String lastName;
  final String nationality;

  PilotInfo({
    required this.pilotId,
    required this.firstName,
    required this.lastName,
    required this.nationality,
  });

  factory PilotInfo.fromJson(Map<String, dynamic> json) {
    return PilotInfo(
      pilotId: json['pilotId'] as int,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      nationality: json['nationality'] as String,
    );
  }
}

class AircraftInfo {
  final int aircraftId;
  final String type;
  final String model;
  final int capacity;

  AircraftInfo({
    required this.aircraftId,
    required this.type,
    required this.model,
    required this.capacity,
  });

  factory AircraftInfo.fromJson(Map<String, dynamic> json) {
    return AircraftInfo(
      aircraftId: json['aircraftId'] as int,
      type: json['type'] as String,
      model: json['model'] as String,
      capacity: json['capacity'] as int,
    );
  }
}

class Flight {
  final int flightId;
  final String flightNumber;
  final String departureLocation;
  final String arrivalLocation;
  final DateTime departureTime;
  final DateTime arrivalTime;
  final int occupancy;
  final String status;
  final double? latitude;
  final double? longitude;
  final int airlineId;
  final Airline? airline;
  final int pilotId;
  final PilotInfo? pilot;
  final int aircraftId;
  final AircraftInfo? aircraft;

  Flight({
    required this.flightId,
    required this.flightNumber,
    required this.departureLocation,
    required this.arrivalLocation,
    required this.departureTime,
    required this.arrivalTime,
    required this.occupancy,
    required this.status,
    this.latitude,
    this.longitude,
    required this.airlineId,
    this.airline,
    required this.pilotId,
    this.pilot,
    required this.aircraftId,
    this.aircraft,
  });

  factory Flight.fromJson(Map<String, dynamic> json) {
    return Flight(
      flightId: json['flightId'] as int,
      flightNumber: json['flightNumber'] as String,
      departureLocation: json['departureLocation'] as String,
      arrivalLocation: json['arrivalLocation'] as String,
      departureTime: DateTime.parse(json['departureTime'] as String),
      arrivalTime: DateTime.parse(json['arrivalTime'] as String),
      occupancy: json['occupancy'] as int,
      status: json['status'] as String,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      airlineId: json['airlineId'] as int,
      airline: json['airline'] != null
          ? Airline.fromJson(json['airline'] as Map<String, dynamic>)
          : null,
      pilotId: json['pilotId'] as int,
      pilot: json['pilot'] != null
          ? PilotInfo.fromJson(json['pilot'] as Map<String, dynamic>)
          : null,
      aircraftId: json['aircraftId'] as int,
      aircraft: json['aircraft'] != null
          ? AircraftInfo.fromJson(json['aircraft'] as Map<String, dynamic>)
          : null,
    );
  }

  bool get hasCoordinates => latitude != null && longitude != null;
}
