import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../models/flight.dart';
import '../services/api_service.dart';
import '../services/geocoding_service.dart';
import '../utils/constants.dart';
import '../widgets/flight_marker_icon.dart';
import '../widgets/flight_bottom_sheet.dart';
import '../widgets/search_overlay.dart';

class RadarScreen extends StatefulWidget {
  const RadarScreen({super.key});

  @override
  State<RadarScreen> createState() => _RadarScreenState();
}

class _RadarScreenState extends State<RadarScreen> {
  final _mapController = MapController();
  final _apiService = ApiService();
  final _geocodingService = GeocodingService();

  List<Flight> _flights = [];
  bool _loading = true;
  String? _error;
  bool _clusteringEnabled = false;
  double _currentZoom = Constants.initialZoom;
  final Map<String, LatLng> _geocodeCache = {};

  @override
  void initState() {
    super.initState();
    _loadFlights();
  }

  Future<void> _loadFlights() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final flights = await _apiService.getFlights();
      if (mounted) {
        setState(() {
          _flights = flights;
          _loading = false;
        });
        _geocodeMissingCoordinates(flights);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _loading = false;
        });
      }
    }
  }

  Future<void> _geocodeMissingCoordinates(List<Flight> flights) async {
    for (final flight in flights) {
      if (!flight.hasCoordinates) {
        final cacheKey = flight.departureLocation;
        if (!_geocodeCache.containsKey(cacheKey)) {
          final result = await _geocodingService.geocodeLocation(cacheKey);
          if (result != null) {
            _geocodeCache[cacheKey] = LatLng(result.latitude, result.longitude);
          }
        }
      }
    }
    if (mounted) setState(() {});
  }

  LatLng? _flightPosition(Flight flight) {
    if (flight.hasCoordinates) {
      return LatLng(flight.latitude!, flight.longitude!);
    }
    final cached = _geocodeCache[flight.departureLocation];
    if (cached != null) return cached;
    return null;
  }

  List<Marker> _buildMarkers() {
    if (_currentZoom < Constants.zoomHide) return [];

    final visibleFlights = _flights.where((f) => _flightPosition(f) != null).toList();

    if (_clusteringEnabled && _currentZoom < Constants.zoomIcon) {
      return _buildClusters(visibleFlights);
    }

    return visibleFlights.map((flight) {
      final pos = _flightPosition(flight)!;
      final widget = _currentZoom < Constants.zoomDot
          ? const SizedBox.shrink()
          : _currentZoom < Constants.zoomIcon
              ? FlightDotMarker(status: flight.status)
              : _currentZoom < Constants.zoomLabel
                  ? FlightMarkerIcon(
                      status: flight.status,
                      airlineCode: flight.airline?.iataCode,
                      showLabel: false,
                    )
                  : FlightMarkerIcon(
                      status: flight.status,
                      airlineCode: flight.airline?.iataCode,
                      showLabel: true,
                    );

      return Marker(
        point: pos,
        width: 80,
        height: 40,
        alignment: Alignment.center,
        child: GestureDetector(
          onTap: () => _showFlightDetails(flight),
          child: widget,
        ),
      );
    }).toList();
  }

  List<Marker> _buildClusters(List<Flight> flights) {
    const clusterRadius = 1.0;
    final List<Marker> markers = [];

    for (final flight in flights) {
      final pos = _flightPosition(flight)!;
      bool added = false;

      for (int i = 0; i < markers.length; i++) {
        final marker = markers[i];
        if (marker.point.latitude == pos.latitude &&
            marker.point.longitude == pos.longitude) {
          added = true;
          break;
        }
        final dist = const Distance().distance(marker.point, pos);
        if (dist < clusterRadius * 100000) {
          added = true;
          break;
        }
      }

      if (!added) {
        markers.add(
          Marker(
            point: pos,
            width: 60,
            height: 60,
            alignment: Alignment.center,
            child: GestureDetector(
              onTap: () => _showFlightDetails(flight),
              child: FlightMarkerIcon(
                status: flight.status,
                airlineCode: flight.airline?.iataCode,
                showLabel: true,
              ),
            ),
          ),
        );
      }
    }

    return markers;
  }

  void _showFlightDetails(Flight flight) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => FlightBottomSheet(flight: flight),
    );
  }

  void _onSearchResult(double lat, double lng, String name) {
    _mapController.move(LatLng(lat, lng), 10.0);
  }

  @override
  void dispose() {
    _mapController.dispose();
    _apiService.dispose();
    _geocodingService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: LatLng(Constants.initialLatitude, Constants.initialLongitude),
              initialZoom: Constants.initialZoom,
              minZoom: 2,
              maxZoom: 18,
              onPositionChanged: (position, hasGesture) {
                final zoom = position.zoom;
                if (zoom != _currentZoom) {
                  setState(() => _currentZoom = zoom);
                }
              },
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.aerotrack.aero_track_mobile',
              ),
              if (!_loading && _error == null) MarkerLayer(markers: _buildMarkers()),
            ],
          ),
          if (_loading)
            const Center(child: CircularProgressIndicator()),
          if (_error != null)
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
                  const SizedBox(height: 12),
                  Text('Connection error', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text(_error!, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                  const SizedBox(height: 12),
                  FilledButton.tonal(
                    onPressed: _loadFlights,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          if (_currentZoom >= Constants.zoomHide && !_loading)
            Positioned(
              right: 12,
              bottom: 120,
              child: Column(
                children: [
                  _MapButton(
                    icon: Icons.my_location,
                    onTap: () {
                      _mapController.move(
                        LatLng(Constants.initialLatitude, Constants.initialLongitude),
                        Constants.initialZoom,
                      );
                    },
                  ),
                  const SizedBox(height: 8),
                  _MapButton(
                    icon: _clusteringEnabled ? Icons.clear_all : Icons.blur_on,
                    onTap: () => setState(() => _clusteringEnabled = !_clusteringEnabled),
                    active: _clusteringEnabled,
                  ),
                ],
              ),
            ),
          if (_currentZoom >= Constants.zoomHide && !_loading)
            Positioned(
              right: 12,
              bottom: 60,
              child: _LegendWidget(flights: _flights),
            ),
          SearchOverlay(
            geocodingService: _geocodingService,
            onLocationSelected: _onSearchResult,
          ),
        ],
      ),
    );
  }
}

class _MapButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final bool active;

  const _MapButton({
    required this.icon,
    required this.onTap,
    this.active = false,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 4,
      shape: const CircleBorder(),
      color: active ? Colors.blue : Colors.white,
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: Container(
          width: 44,
          height: 44,
          alignment: Alignment.center,
          child: Icon(icon, color: active ? Colors.white : Colors.grey[700], size: 22),
        ),
      ),
    );
  }
}

class _LegendWidget extends StatelessWidget {
  final List<Flight> flights;

  const _LegendWidget({required this.flights});

  @override
  Widget build(BuildContext context) {
    final statusCounts = <String, int>{};
    for (final f in flights) {
      statusCounts[f.status] = (statusCounts[f.status] ?? 0) + 1;
    }

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 6),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('LEGEND', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey[600])),
          const SizedBox(height: 6),
          ...['active', 'scheduled', 'landed', 'delayed', 'cancelled'].map((s) {
            final count = statusCounts[s] ?? 0;
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 2),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: _legendColor(s),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '$s ($count)',
                    style: TextStyle(fontSize: 11, color: Colors.grey[800]),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Color _legendColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
        return const Color(0xFF22C55E);
      case 'scheduled':
        return const Color(0xFF3B82F6);
      case 'landed':
        return const Color(0xFF6B7280);
      case 'delayed':
        return const Color(0xFFF59E0B);
      case 'cancelled':
        return const Color(0xFFEF4444);
      default:
        return const Color(0xFF6366F1);
    }
  }
}
