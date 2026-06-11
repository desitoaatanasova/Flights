import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/flight.dart';
import '../models/airline.dart';
import '../utils/constants.dart';

class ApiService {
  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  Future<List<Flight>> getFlights() async {
    final uri = Uri.parse('${Constants.apiBaseUrl}/flights');
    final response = await _client.get(uri, headers: _headers);
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body) as List<dynamic>;
      return data.map((e) => Flight.fromJson(e as Map<String, dynamic>)).toList();
    }
    throw ApiException('Failed to load flights: ${response.statusCode}');
  }

  Future<List<Airline>> getAirlines() async {
    final uri = Uri.parse('${Constants.apiBaseUrl}/airlines');
    final response = await _client.get(uri, headers: _headers);
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body) as List<dynamic>;
      return data.map((e) => Airline.fromJson(e as Map<String, dynamic>)).toList();
    }
    throw ApiException('Failed to load airlines: ${response.statusCode}');
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  void dispose() {
    _client.close();
  }
}

class ApiException implements Exception {
  final String message;
  ApiException(this.message);

  @override
  String toString() => message;
}
