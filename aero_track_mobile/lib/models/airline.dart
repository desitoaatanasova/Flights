class Airline {
  final int airlineId;
  final String airlineName;
  final String iataCode;
  final String? logoUrl;
  final String country;
  final int fleetSize;
  final String hubAirport;
  final int foundedYear;
  final String? description;
  final List<dynamic> flights;

  Airline({
    required this.airlineId,
    required this.airlineName,
    required this.iataCode,
    this.logoUrl,
    required this.country,
    required this.fleetSize,
    required this.hubAirport,
    required this.foundedYear,
    this.description,
    this.flights = const [],
  });

  factory Airline.fromJson(Map<String, dynamic> json) {
    return Airline(
      airlineId: json['airlineId'] as int,
      airlineName: json['airlineName'] as String,
      iataCode: json['iataCode'] as String,
      logoUrl: json['logoUrl'] as String?,
      country: json['country'] as String,
      fleetSize: json['fleetSize'] as int,
      hubAirport: json['hubAirport'] as String,
      foundedYear: json['foundedYear'] as int,
      description: json['description'] as String?,
      flights: json['flights'] as List<dynamic>? ?? [],
    );
  }
}
