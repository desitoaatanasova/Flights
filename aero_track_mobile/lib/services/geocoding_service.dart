import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';

class GeocodingResult {
  final double latitude;
  final double longitude;
  final String displayName;

  GeocodingResult({
    required this.latitude,
    required this.longitude,
    required this.displayName,
  });
}

class GeocodingService {
  final http.Client _client;

  GeocodingService({http.Client? client}) : _client = client ?? http.Client();

  Future<List<GeocodingResult>> search(String query) async {
    final uri = Uri.parse('${Constants.nominatimBaseUrl}/search').replace(
      queryParameters: {
        'q': query,
        'format': 'json',
        'limit': '5',
        'addressdetails': '0',
      },
    );

    final response = await _client.get(
      uri,
      headers: {'User-Agent': 'AeroTrackMobile/1.0'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body) as List<dynamic>;
      return data.map((e) {
        final lat = double.parse(e['lat'] as String);
        final lon = double.parse(e['lon'] as String);
        return GeocodingResult(
          latitude: lat,
          longitude: lon,
          displayName: e['display_name'] as String,
        );
      }).toList();
    }
    return [];
  }

  Future<GeocodingResult?> geocodeLocation(String locationName) async {
    final results = await search('$locationName airport');
    if (results.isNotEmpty) return results.first;
    final fallback = await search(locationName);
    if (fallback.isNotEmpty) return fallback.first;
    return null;
  }

  void dispose() {
    _client.close();
  }
}
